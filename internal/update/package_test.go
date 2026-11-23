package update

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"context"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"
)

func buildTestZip(t *testing.T, dest string, files map[string]string) {
	t.Helper()
	f, err := os.Create(dest)
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()
	zw := zip.NewWriter(f)
	for name, content := range files {
		w, err := zw.Create(name)
		if err != nil {
			t.Fatal(err)
		}
		if _, err := w.Write([]byte(content)); err != nil {
			t.Fatal(err)
		}
	}
	if err := zw.Close(); err != nil {
		t.Fatal(err)
	}
}

func buildTestTarGz(t *testing.T, dest string, files map[string]string) {
	t.Helper()
	f, err := os.Create(dest)
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()
	gw := gzip.NewWriter(f)
	tw := tar.NewWriter(gw)
	for name, content := range files {
		hdr := &tar.Header{
			Name: name,
			Mode: 0o644,
			Size: int64(len(content)),
		}
		if err := tw.WriteHeader(hdr); err != nil {
			t.Fatal(err)
		}
		if _, err := tw.Write([]byte(content)); err != nil {
			t.Fatal(err)
		}
	}
	if err := tw.Close(); err != nil {
		t.Fatal(err)
	}
	if err := gw.Close(); err != nil {
		t.Fatal(err)
	}
}

func TestApplyPackageZipPreservesProtectedAndSwapsBinary(t *testing.T) {
	root := t.TempDir()
	// Seed existing files: a protected role + config.yaml + product file + old binary
	if err := os.MkdirAll(filepath.Join(root, "roles"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Join(root, "web", "static"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, "roles", "custom.yaml"), []byte("name: mine\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, "config.yaml"), []byte("server:\n  port: 8080\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, "web", "static", "app.js"), []byte("v1"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(root, Binary), []byte("old-bin"), 0o755); err != nil {
		t.Fatal(err)
	}

	pkgPath := filepath.Join(t.TempDir(), "release-v2.zip")
	buildTestZip(t, pkgPath, map[string]string{
		"release-root/web/static/app.js": "v2",
		"release-root/roles/custom.yaml": "overwritten-attempt",
		"release-root/config.yaml":       "overwritten-config",
		"release-root/" + Binary:         "new-bin",
	})

	var phases []string
	res, err := ApplyPackage(context.Background(), Options{Root: root}, pkgPath, "release-v2.zip", func(s Step) {
		phases = append(phases, s.Phase)
	})
	if err != nil {
		t.Fatalf("ApplyPackage failed: %v", err)
	}
	if !res.BinaryBuilt || !res.NeedsRestart {
		t.Fatalf("expected binary swap & NeedsRestart=true, got %+v", res)
	}

	gotJS, _ := os.ReadFile(filepath.Join(root, "web", "static", "app.js"))
	if string(gotJS) != "v2" {
		t.Fatalf("web/static/app.js = %q, want v2", gotJS)
	}
	gotCfg, _ := os.ReadFile(filepath.Join(root, "config.yaml"))
	if !strings.Contains(string(gotCfg), "port: 8080") {
		t.Fatalf("config.yaml was overwritten: %q", gotCfg)
	}
	gotRole, _ := os.ReadFile(filepath.Join(root, "roles", "custom.yaml"))
	if string(gotRole) != "name: mine\n" {
		t.Fatalf("roles/custom.yaml was overwritten: %q", gotRole)
	}
	gotBin, _ := os.ReadFile(filepath.Join(root, Binary))
	if string(gotBin) != "new-bin" {
		t.Fatalf("binary = %q, want new-bin", gotBin)
	}
	prevBin, _ := os.ReadFile(filepath.Join(root, Binary+".prev"))
	if string(prevBin) != "old-bin" {
		t.Fatalf(".prev binary = %q, want old-bin", prevBin)
	}
	if !slices.Contains(res.KeptContent, "config.yaml") || !slices.Contains(res.KeptContent, "roles/custom.yaml") {
		t.Fatalf("KeptContent = %v, want config.yaml and roles/custom.yaml", res.KeptContent)
	}
	if len(phases) == 0 || phases[len(phases)-1] != "done" {
		t.Fatalf("expected done phase, got %v", phases)
	}
}

func TestApplyPackageTarGzUnwrapsAndRejectsZipSlip(t *testing.T) {
	root := t.TempDir()
	tgz := filepath.Join(t.TempDir(), "patch.tar.gz")
	buildTestTarGz(t, tgz, map[string]string{
		"bundle/web/templates/index.html": "<html>v2</html>",
	})
	res, err := ApplyPackage(context.Background(), Options{Root: root, BinaryName: "none"}, tgz, "patch.tar.gz", nil)
	if err != nil {
		t.Fatalf("tar.gz ApplyPackage failed: %v", err)
	}
	if res.FilesTouched != 1 {
		t.Fatalf("FilesTouched = %d, want 1", res.FilesTouched)
	}
	got, _ := os.ReadFile(filepath.Join(root, "web", "templates", "index.html"))
	if string(got) != "<html>v2</html>" {
		t.Fatalf("got %q, want <html>v2</html>", got)
	}

	badZip := filepath.Join(t.TempDir(), "evil.zip")
	buildTestZip(t, badZip, map[string]string{
		"../escape.txt": "pwned",
	})
	_, err = ApplyPackage(context.Background(), Options{Root: root}, badZip, "evil.zip", nil)
	ue, ok := err.(*Error)
	if !ok || ue.Reason != "invalid_package" {
		t.Fatalf("expected invalid_package error for path traversal, got %v", err)
	}

	emptyZip := filepath.Join(t.TempDir(), "invalid.zip")
	buildTestZip(t, emptyZip, map[string]string{
		"random.txt": "hello",
	})
	_, err = ApplyPackage(context.Background(), Options{Root: root}, emptyZip, "invalid.zip", nil)
	ue2, ok2 := err.(*Error)
	if !ok2 || ue2.Reason != "invalid_package" {
		t.Fatalf("expected invalid_package error for unrecognized payload, got %v", err)
	}
}

func TestApplyPackageKeepsFlatTopLevelWebDirWithoutUnwrapping(t *testing.T) {
	root := t.TempDir()
	flatZip := filepath.Join(t.TempDir(), "web-only.zip")
	buildTestZip(t, flatZip, map[string]string{
		"web/static/test-pack.txt": "flat-web",
	})
	res, err := ApplyPackage(context.Background(), Options{Root: root, BinaryName: "none"}, flatZip, "web-only.zip", nil)
	if err != nil {
		t.Fatalf("flat web zip ApplyPackage failed: %v", err)
	}
	if res.FilesTouched != 1 {
		t.Fatalf("FilesTouched = %d, want 1", res.FilesTouched)
	}
	got, err := os.ReadFile(filepath.Join(root, "web", "static", "test-pack.txt"))
	if err != nil {
		t.Fatalf("missing extracted file under web/static/: %v", err)
	}
	if string(got) != "flat-web" {
		t.Fatalf("got %q, want flat-web", got)
	}
}
