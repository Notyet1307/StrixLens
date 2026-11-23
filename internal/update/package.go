package update

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"context"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

const (
	maxPackageExtractBytes int64 = 512 << 20 // 512 MiB unpacked safety limit
	maxPackageFiles              = 20000
)

// ApplyPackage installs an uploaded .zip, .tar.gz, or .tgz update package into opts.Root
// while preserving operator-owned protected files (roles/, skills/, tools/, data/, config.yaml).
// Cross-filesystem binary swaps stage a temporary binary next to the destination first so
// installBinary can perform an atomic rename swap with .prev backup.
func ApplyPackage(ctx context.Context, opts Options, packagePath, packageName string, onStep func(Step)) (*Result, error) {
	release, err := LockInstall(opts)
	if err != nil {
		return nil, err
	}
	defer release()

	if onStep == nil {
		onStep = func(Step) {}
	}
	step := func(phase, msg string) {
		onStep(Step{Phase: phase, Message: msg, At: time.Now().Format(time.RFC3339)})
	}

	root, err := opts.installRoot()
	if err != nil {
		return nil, err
	}
	start := time.Now()
	displayName := strings.TrimSpace(packageName)
	if displayName == "" {
		displayName = filepath.Base(packagePath)
	}
	step("validate", fmt.Sprintf("校验更新包 %s", displayName))

	ext, ok := PackageArchiveExt(displayName)
	if !ok {
		return nil, &Error{
			Reason:  "invalid_package",
			Message: "仅支持 .zip、.tar.gz 或 .tgz 格式的离线安装包",
		}
	}

	extractDir, err := os.MkdirTemp("", "strixlens-pkg-*")
	if err != nil {
		return nil, err
	}
	defer os.RemoveAll(extractDir)

	step("extract", fmt.Sprintf("正在安全解压安装包 %s", displayName))
	if ext == ".zip" {
		err = extractZipSafe(packagePath, extractDir)
	} else {
		err = extractTarGzSafe(packagePath, extractDir)
	}
	if err != nil {
		return nil, err
	}

	binName := opts.binaryName()
	wantBinarySwap := opts.BinaryName != "none"
	payloadRoot, err := resolvePackageRoot(extractDir, binName, wantBinarySwap)
	if err != nil {
		return nil, err
	}

	hasSource := isRegularFile(filepath.Join(payloadRoot, "go.mod")) && isDir(filepath.Join(payloadRoot, "cmd", "server"))
	if !isInstallPayloadRoot(payloadRoot, binName, wantBinarySwap) {
		return nil, &Error{
			Reason:  "invalid_package",
			Message: fmt.Sprintf("安装包结构无效：未包含 %s 可执行文件、web/ 资源或 Go 源码", binName),
		}
	}

	var productFiles []string
	var keptContent []string
	stagedBinSrc := ""

	err = filepath.WalkDir(payloadRoot, func(curr string, d os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if curr == payloadRoot {
			return nil
		}
		relFS, err := filepath.Rel(payloadRoot, curr)
		if err != nil {
			return err
		}
		rel := filepath.ToSlash(relFS)
		if isPackageIgnoredRel(rel) {
			if d.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if d.Type()&os.ModeSymlink != 0 {
			return &Error{Reason: "invalid_package", Message: "安装包包含不允许的符号链接：" + rel}
		}
		if Protected(rel) {
			if !d.IsDir() {
				keptContent = append(keptContent, rel)
			}
			return nil
		}
		if d.IsDir() {
			return nil
		}
		if wantBinarySwap && rel == binName {
			stagedBinSrc = curr
			return nil
		}
		productFiles = append(productFiles, rel)
		return nil
	})
	if err != nil {
		return nil, err
	}

	sort.Strings(productFiles)
	sort.Strings(keptContent)

	backupDir, err := newBackupDir(root, "pkg-")
	if err != nil {
		return nil, fmt.Errorf("创建备份目录失败：%w", err)
	}
	backedUp := 0
	for _, rel := range productFiles {
		existing := filepath.Join(root, filepath.FromSlash(rel))
		info, statErr := os.Lstat(existing)
		if statErr == nil && info.Mode().IsRegular() {
			dstBackup := filepath.Join(backupDir, "overwritten", filepath.FromSlash(rel))
			if copyErr := copyFile(existing, dstBackup, info.Mode()); copyErr != nil {
				return nil, fmt.Errorf("备份原文件 %s 失败：%w", rel, copyErr)
			}
			backedUp++
		}
	}
	step("backup", fmt.Sprintf("已备份 %d 个待替换文件至 %s", backedUp, filepath.Base(backupDir)))

	step("apply", fmt.Sprintf("正在写入 %d 个更新文件", len(productFiles)))
	for _, rel := range productFiles {
		src := filepath.Join(payloadRoot, filepath.FromSlash(rel))
		dst := filepath.Join(root, filepath.FromSlash(rel))
		info, statErr := os.Stat(src)
		if statErr != nil {
			return nil, statErr
		}
		if err := copyFile(src, dst, info.Mode()); err != nil {
			return nil, fmt.Errorf("写入 %s 失败：%w", rel, err)
		}
	}

	dstBin := filepath.Join(root, binName)
	binaryBuilt := false
	prevBinary := ""

	if stagedBinSrc != "" {
		step("swap", fmt.Sprintf("正在换入安装包内置二进制 %s", binName))
		localStage := dstBin + ".new"
		if err := copyFile(stagedBinSrc, localStage, 0o755); err != nil {
			return nil, fmt.Errorf("暂存新二进制失败：%w", err)
		}
		prev, swapErr := installBinary(localStage, dstBin)
		if swapErr != nil {
			_ = os.Remove(localStage)
			return nil, swapErr
		}
		binaryBuilt = true
		prevBinary = prev
	} else if wantBinarySwap && hasSource {
		if _, ok := toolchain(ctx, root); ok {
			step("build", "安装包仅含源码，正在本机重新编译二进制")
			localStage := dstBin + ".new"
			if buildErr := build(ctx, root, localStage); buildErr != nil {
				_ = os.Remove(localStage)
				return nil, fmt.Errorf("安装包源码编译失败：%w", buildErr)
			}
			prev, swapErr := installBinary(localStage, dstBin)
			if swapErr != nil {
				_ = os.Remove(localStage)
				return nil, swapErr
			}
			binaryBuilt = true
			prevBinary = prev
		}
	}

	filesTouched := len(productFiles)
	if binaryBuilt {
		filesTouched++
	}
	step("done", fmt.Sprintf("离线更新包安装完成（共更新 %d 个文件）", filesTouched))

	return &Result{
		FilesTouched: filesTouched,
		KeptContent:  keptContent,
		BinaryPath:   dstBin,
		BinaryBuilt:  binaryBuilt,
		PrevBinary:   prevBinary,
		BackupDir:    backupDir,
		NeedsRestart: binaryBuilt,
		Duration:     time.Since(start).Round(time.Millisecond).String(),
	}, nil
}

// PackageArchiveExt checks whether filename carries a supported archive suffix.
func PackageArchiveExt(filename string) (string, bool) {
	lower := strings.ToLower(strings.TrimSpace(filename))
	switch {
	case strings.HasSuffix(lower, ".tar.gz"):
		return ".tar.gz", true
	case strings.HasSuffix(lower, ".tgz"):
		return ".tgz", true
	case strings.HasSuffix(lower, ".zip"):
		return ".zip", true
	default:
		return "", false
	}
}

func isPackageIgnoredRel(rel string) bool {
	return rel == ".git" || strings.HasPrefix(rel, ".git/") ||
		rel == ".update-lock" || rel == ".update-state.json" ||
		rel == ".update-build-pending" ||
		rel == ".update-backup" || strings.HasPrefix(rel, ".update-backup/")
}

func isRegularFile(p string) bool {
	info, err := os.Stat(p)
	return err == nil && info.Mode().IsRegular()
}

func isDir(p string) bool {
	info, err := os.Stat(p)
	return err == nil && info.IsDir()
}

func cleanArchiveRelPath(raw string) (string, error) {
	norm := strings.ReplaceAll(raw, "\\", "/")
	if strings.ContainsRune(norm, 0) {
		return "", &Error{Reason: "invalid_package", Message: "安装包包含非法空字节路径"}
	}
	norm = strings.TrimPrefix(norm, "./")
	norm = strings.TrimSuffix(norm, "/")
	if norm == "" || norm == "." {
		return "", nil
	}
	if strings.HasPrefix(norm, "/") || (len(norm) >= 2 && norm[1] == ':') {
		return "", &Error{Reason: "invalid_package", Message: "安装包禁止包含绝对路径：" + raw}
	}
	cleaned := path.Clean(norm)
	if cleaned == "." {
		return "", nil
	}
	if cleaned == ".." || strings.HasPrefix(cleaned, "../") {
		return "", &Error{Reason: "invalid_package", Message: "安装包包含越界路径：" + raw}
	}
	return cleaned, nil
}

func isInstallPayloadRoot(dir, binName string, wantBinarySwap bool) bool {
	hasPrebuiltBin := wantBinarySwap && isRegularFile(filepath.Join(dir, binName))
	hasWeb := isDir(filepath.Join(dir, "web"))
	hasSource := isRegularFile(filepath.Join(dir, "go.mod")) && isDir(filepath.Join(dir, "cmd", "server"))
	return hasPrebuiltBin || hasWeb || hasSource
}

func resolvePackageRoot(extractDir, binName string, wantBinarySwap bool) (string, error) {
	if isInstallPayloadRoot(extractDir, binName, wantBinarySwap) {
		return extractDir, nil
	}
	entries, err := os.ReadDir(extractDir)
	if err != nil {
		return "", err
	}
	var dirs []os.DirEntry
	for _, entry := range entries {
		name := entry.Name()
		if name == "__MACOSX" || name == ".DS_Store" {
			continue
		}
		if !entry.IsDir() {
			return extractDir, nil
		}
		dirs = append(dirs, entry)
	}
	if len(dirs) == 1 {
		return filepath.Join(extractDir, dirs[0].Name()), nil
	}
	if len(dirs) == 0 {
		return "", &Error{Reason: "invalid_package", Message: "安装包为空，未包含可更新内容"}
	}
	return extractDir, nil
}

func extractZipSafe(srcZip, dstDir string) error {
	zr, err := zip.OpenReader(srcZip)
	if err != nil {
		return &Error{Reason: "invalid_package", Message: "无法读取 ZIP 安装包：" + err.Error()}
	}
	defer zr.Close()

	if len(zr.File) > maxPackageFiles {
		return &Error{Reason: "invalid_package", Message: "安装包内文件数量超过安全上限"}
	}

	var total int64
	for _, f := range zr.File {
		rel, err := cleanArchiveRelPath(f.Name)
		if err != nil {
			return err
		}
		if rel == "" {
			continue
		}
		if f.Mode()&os.ModeSymlink != 0 {
			return &Error{Reason: "invalid_package", Message: "安装包包含不允许的符号链接：" + rel}
		}
		target := filepath.Join(dstDir, filepath.FromSlash(rel))
		if f.FileInfo().IsDir() {
			if err := os.MkdirAll(target, 0o755); err != nil {
				return err
			}
			continue
		}
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return err
		}
		rc, err := f.Open()
		if err != nil {
			return &Error{Reason: "invalid_package", Message: "解压文件失败：" + rel}
		}
		mode := f.Mode().Perm()
		if mode == 0 {
			mode = 0o644
		}
		n, writeErr := writeLimitedFile(target, rc, mode, maxPackageExtractBytes-total)
		_ = rc.Close()
		if writeErr != nil {
			return writeErr
		}
		total += n
	}
	return nil
}

func extractTarGzSafe(srcTgz, dstDir string) error {
	f, err := os.Open(srcTgz)
	if err != nil {
		return &Error{Reason: "invalid_package", Message: "无法打开安装包：" + err.Error()}
	}
	defer f.Close()

	gzr, err := gzip.NewReader(f)
	if err != nil {
		return &Error{Reason: "invalid_package", Message: "无法解压 gzip 安装包：" + err.Error()}
	}
	defer gzr.Close()

	tr := tar.NewReader(gzr)
	var total int64
	files := 0
	for {
		hdr, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return &Error{Reason: "invalid_package", Message: "解析 tar 归档失败：" + err.Error()}
		}
		files++
		if files > maxPackageFiles {
			return &Error{Reason: "invalid_package", Message: "安装包内文件数量超过安全上限"}
		}
		if hdr.Typeflag == tar.TypeXHeader || hdr.Typeflag == tar.TypeXGlobalHeader || hdr.Typeflag == tar.TypeGNULongName || hdr.Typeflag == tar.TypeGNULongLink {
			continue
		}
		rel, err := cleanArchiveRelPath(hdr.Name)
		if err != nil {
			return err
		}
		if rel == "" {
			continue
		}
		target := filepath.Join(dstDir, filepath.FromSlash(rel))
		switch hdr.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(target, 0o755); err != nil {
				return err
			}
		case tar.TypeReg, tar.TypeRegA:
			if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
				return err
			}
			mode := os.FileMode(hdr.Mode).Perm()
			if mode == 0 {
				mode = 0o644
			}
			n, writeErr := writeLimitedFile(target, tr, mode, maxPackageExtractBytes-total)
			if writeErr != nil {
				return writeErr
			}
			total += n
		case tar.TypeSymlink, tar.TypeLink:
			return &Error{Reason: "invalid_package", Message: "安装包包含不允许的链接文件：" + rel}
		default:
			return &Error{Reason: "invalid_package", Message: "安装包包含不支持的特殊文件类型：" + rel}
		}
	}
	return nil
}

func writeLimitedFile(dst string, r io.Reader, mode os.FileMode, remaining int64) (int64, error) {
	if remaining < 0 {
		remaining = 0
	}
	out, err := os.OpenFile(dst, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, mode)
	if err != nil {
		return 0, err
	}
	defer out.Close()

	lr := io.LimitReader(r, remaining+1)
	n, err := io.Copy(out, lr)
	if err != nil {
		return n, err
	}
	if n > remaining {
		return n, &Error{Reason: "invalid_package", Message: "安装包解压总大小超过 512 MiB 安全上限"}
	}
	return n, nil
}
