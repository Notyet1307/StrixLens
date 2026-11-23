package easmdrp

import (
	"fmt"
	"net/url"
	"strings"
)

// SourceCatalog is a capability directory, not a claim that a feed is connected.
type MonitorSource struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	ChannelGroup string   `json:"channel_group"`
	Domains      []string `json:"domains,omitempty"`
	AccessMode   string   `json:"access_mode"`
}

func SourceCatalog() []MonitorSource {
	return []MonitorSource{
		{"github", "GitHub", ChannelCodeRepo, []string{"github.com"}, "api_or_gateway"},
		{"gitlab", "GitLab", ChannelCodeRepo, []string{"gitlab.com"}, "authorized_gateway"},
		{"gitee", "Gitee", ChannelCodeRepo, []string{"gitee.com"}, "authorized_gateway"},
		{"local_repo", "本地授权仓库", ChannelCodeRepo, nil, "local"},
		{"aliyun", "阿里云盘", ChannelCloudDrive, []string{"aliyundrive.com", "alipan.com"}, "public_index"},
		{"mobile_drive", "移动云盘", ChannelCloudDrive, []string{"yun.139.com"}, "public_index"},
		{"lanzou", "蓝奏云盘", ChannelCloudDrive, []string{"lanzou.com"}, "public_index"},
		{"tencent_disk", "腾讯微盘", ChannelCloudDrive, []string{"drive.weixin.qq.com"}, "public_index"},
		{"weiyun", "腾讯微云", ChannelCloudDrive, []string{"weiyun.com"}, "public_index"},
		{"quark", "夸克网盘", ChannelCloudDrive, []string{"pan.quark.cn"}, "public_index"},
		{"115", "115网盘", ChannelCloudDrive, []string{"115.com"}, "public_index"},
		{"baidu_drive", "百度网盘", ChannelCloudDrive, []string{"pan.baidu.com"}, "public_index"},
		{"tianyi", "天翼云盘", ChannelCloudDrive, []string{"cloud.189.cn"}, "public_index"},
		{"xunlei", "迅雷云盘", ChannelCloudDrive, []string{"pan.xunlei.com"}, "public_index"},
		{"ctfile", "城通网盘", ChannelCloudDrive, []string{"ctfile.com"}, "public_index"},
		{"yuque", "语雀文档", ChannelDocLibrary, []string{"yuque.com"}, "public_index"},
		{"docin", "豆丁文库", ChannelDocLibrary, []string{"docin.com"}, "public_index"},
		{"book118", "原创力文档", ChannelDocLibrary, []string{"book118.com"}, "public_index"},
		{"doc88", "道客巴巴", ChannelDocLibrary, []string{"doc88.com"}, "public_index"},
		{"baidu_wenku", "百度文库", ChannelDocLibrary, []string{"wenku.baidu.com"}, "public_index"},
		{"sina_doc", "新浪文库", ChannelDocLibrary, []string{"ishare.iask.sina.com.cn", "wenku.sina.com"}, "public_index"},
		{"csdn", "CSDN", ChannelDocLibrary, []string{"csdn.net"}, "public_index"},
		{"chamagudao", "茶马古道", ChannelDarkwebCTI, nil, "licensed_intelligence"},
		{"breachedforums", "BreachedForums", ChannelDarkwebCTI, nil, "licensed_intelligence"},
		{"changan", "长安不夜城", ChannelDarkwebCTI, nil, "licensed_intelligence"},
		{"darkweb_cn", "暗网中文论坛", ChannelDarkwebCTI, nil, "licensed_intelligence"},
		{"stolen_data", "失窃数据预警", ChannelStealerCTI, nil, "licensed_intelligence"},
		{"stealer_logs", "失窃凭据摘要", ChannelStealerCTI, nil, "licensed_intelligence"},
		{"new_media", "新媒体", ChannelPlatformEmail, []string{"mp.weixin.qq.com", "weibo.com", "douyin.com"}, "public_index"},
		{"wechat", "微信公众号", ChannelPlatformEmail, []string{"mp.weixin.qq.com"}, "public_index"},
		{"weibo", "微博", ChannelPlatformEmail, []string{"weibo.com"}, "public_index"},
		{"douyin", "抖音", ChannelPlatformEmail, []string{"douyin.com"}, "public_index"},
		{"mobile_app", "移动应用", ChannelPlatformEmail, []string{"sj.qq.com", "appgallery.huawei.com", "apps.apple.com"}, "public_index"},
		{"tencent_myapp", "应用宝", ChannelPlatformEmail, []string{"sj.qq.com"}, "public_index"},
		{"huawei_app", "华为应用市场", ChannelPlatformEmail, []string{"appgallery.huawei.com"}, "public_index"},
		{"apple_app", "App Store", ChannelPlatformEmail, []string{"apps.apple.com"}, "public_index"},
		{"corp_email", "企业邮箱", ChannelPlatformEmail, nil, "hibp_or_gateway"},
	}
}

func SelectedSources(channel string, ids []string) []MonitorSource {
	all := len(ids) == 0
	for _, id := range ids {
		if id == channel {
			all = true
		}
	}
	out := []MonitorSource{}
	for _, s := range SourceCatalog() {
		if s.ChannelGroup != channel {
			continue
		}
		if all {
			out = append(out, s)
			continue
		}
		for _, id := range ids {
			if id == s.ID {
				out = append(out, s)
				break
			}
		}
	}
	return out
}

func ValidateMonitorRule(channel string, sources, keywords []string) error {
	if len(SelectedSources(channel, nil)) == 0 {
		return fmt.Errorf("未知监测渠道")
	}
	if len(keywords) == 0 || len(keywords) > 20 {
		return fmt.Errorf("监测关键词须为 1–20 项")
	}
	for _, k := range keywords {
		if strings.TrimSpace(k) == "" || len(k) > 256 {
			return fmt.Errorf("关键词不能为空或超过 256 字节")
		}
	}
	for _, id := range sources {
		if id != channel && len(SelectedSources(channel, []string{id})) == 0 {
			return fmt.Errorf("平台 %q 不属于所选渠道", id)
		}
	}
	return nil
}

func MatchMonitorSource(f RawLeakFinding, sources []MonitorSource) (MonitorSource, bool) {
	u, _ := url.Parse(f.SourceRef)
	host := ""
	if u != nil {
		host = strings.ToLower(u.Hostname())
	}
	for _, s := range sources {
		if strings.EqualFold(f.SourcePlatform, s.ID) || strings.EqualFold(f.SourcePlatform, s.Name) {
			return s, true
		}
		for _, d := range s.Domains {
			if host == d || strings.HasSuffix(host, "."+d) {
				return s, true
			}
		}
		if s.ID == "corp_email" && f.SourcePlatform == "Have I Been Pwned" {
			return s, true
		}
	}
	return MonitorSource{}, false
}

func FilterSourceFindings(findings []RawLeakFinding, channel string, ids []string) []RawLeakFinding {
	sources := SelectedSources(channel, ids)
	legacy := len(ids) == 0
	for _, id := range ids {
		if id == channel {
			legacy = true
		}
	}
	out := []RawLeakFinding{}
	for _, f := range findings {
		if s, ok := MatchMonitorSource(f, sources); ok {
			f.SourcePlatform = s.Name
			out = append(out, f)
		} else if legacy {
			out = append(out, f)
		}
	}
	return out
}

func SourceSearchExpression(channel string, ids []string) string {
	terms := []string{}
	for _, s := range SelectedSources(channel, ids) {
		for _, d := range s.Domains {
			terms = append(terms, "site:"+d)
		}
		if len(s.Domains) == 0 {
			terms = append(terms, "\""+s.Name+"\"")
		}
	}
	return "(" + strings.Join(terms, " OR ") + ")"
}
