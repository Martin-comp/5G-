package data

import (
	"context"
	"errors"
	"log"
	"sort"
	"strings"
	"sync"
	"time"
)

type ResourceGovernanceRecord struct {
	ID            string `json:"id"`
	ProjectID     string `json:"projectId"`
	NodeID        string `json:"nodeId"`
	Title         string `json:"title"`
	Type          string `json:"type"`
	Source        string `json:"source"`
	Rights        string `json:"rights"`
	Usage         string `json:"usage"`
	LinkedSection string `json:"linkedSection"`
	Required      bool   `json:"required"`
	Completeness  string `json:"completeness"`
	Availability  string `json:"availability"`
	VisualStatus  string `json:"visualStatus"`
	UpdatedAt     int64  `json:"updatedAt"`
	UpdatedBy     string `json:"updatedBy"`
}

type ResourceGovernanceUpdateRequest struct {
	ID            string `json:"id"`
	Usage         string `json:"usage"`
	LinkedSection string `json:"linkedSection"`
	Required      *bool  `json:"required"`
	Completeness  string `json:"completeness"`
	Availability  string `json:"availability"`
	VisualStatus  string `json:"visualStatus"`
	UpdatedBy     string `json:"updatedBy"`
}

var resourceGovernanceState = struct {
	sync.RWMutex
	items map[string]ResourceGovernanceRecord
}{items: map[string]ResourceGovernanceRecord{}}

var defaultResourceGovernance = []ResourceGovernanceRecord{
	{ID: "P1-R01", ProjectID: "P1", NodeID: "P1T1-N01", Title: "室内资源边界示意图", Type: "图像", Source: "课程标准 + 脱敏现场工单", Rights: "内部授权 / 已脱敏", Usage: "识别站址、楼层、设备区域和采集边界。", LinkedSection: "visual", Required: true, Completeness: "通过", Availability: "可用", VisualStatus: "通过"},
	{ID: "P1-R02", ProjectID: "P1", NodeID: "P1T1-N02", Title: "AAU/BBU/RRU设备拓扑", Type: "图文", Source: "设备手册 + 教学重绘", Rights: "教学使用授权", Usage: "核对主设备、连接关系和配套对象。", LinkedSection: "visual", Required: true, Completeness: "通过", Availability: "可用", VisualStatus: "通过"},
	{ID: "P1-R03", ProjectID: "P1", NodeID: "P1T1-N03", Title: "运行条件检查清单", Type: "表格", Source: "运维规范 + 脱敏案例", Rights: "内部授权 / 已脱敏", Usage: "按供电、传输和环境条件完成逐项核验。", LinkedSection: "steps", Required: true, Completeness: "通过", Availability: "可用", VisualStatus: "待复核"},
	{ID: "P1-R04", ProjectID: "P1", NodeID: "P1T1-N04", Title: "现场证据归档模板", Type: "模板", Source: "课程团队自建", Rights: "项目自有", Usage: "形成照片、坐标、时间和日志可复核记录。", LinkedSection: "output", Required: true, Completeness: "待补充", Availability: "可用", VisualStatus: "待复核"},
	{ID: "P2-R01", ProjectID: "P2", NodeID: "P2T1-N01", Title: "室外覆盖边界图", Type: "图像", Source: "脱敏测试路线 + 教学重绘", Rights: "内部授权 / 已脱敏", Usage: "识别目标区域、投诉点位和路线边界。", LinkedSection: "visual", Required: true, Completeness: "通过", Availability: "可用", VisualStatus: "通过"},
	{ID: "P2-R02", ProjectID: "P2", NodeID: "P2T1-N02", Title: "天线姿态参数表", Type: "表格", Source: "设备手册 + 脱敏工参", Rights: "教学使用授权", Usage: "对照方位角、下倾角和挂高朝向。", LinkedSection: "steps", Required: true, Completeness: "通过", Availability: "可用", VisualStatus: "通过"},
	{ID: "P2-R03", ProjectID: "P2", NodeID: "P2T1-N03", Title: "场景遮挡标注图", Type: "图像", Source: "脱敏路测素材 + 教学标注", Rights: "内部授权 / 已脱敏", Usage: "将遮挡对象、轨迹位置和信号变化对应起来。", LinkedSection: "correction", Required: true, Completeness: "通过", Availability: "可用", VisualStatus: "待复核"},
	{ID: "P2-R04", ProjectID: "P2", NodeID: "P2T1-N04", Title: "风险路线测试单", Type: "模板", Source: "课程团队自建", Rights: "项目自有", Usage: "记录风险点、路线顺序和复测条件。", LinkedSection: "output", Required: true, Completeness: "待补充", Availability: "可用", VisualStatus: "待复核"},
}

func ResourceGovernanceData(projectID string) []ResourceGovernanceRecord {
	projectID = strings.ToUpper(strings.TrimSpace(projectID))
	if projectID == "" {
		projectID = "P1"
	}
	itemsByID := map[string]ResourceGovernanceRecord{}
	for _, item := range defaultResourceGovernance {
		if item.ProjectID == projectID {
			itemsByID[item.ID] = item
		}
	}
	if store := currentPostgres(); store != nil {
		if persisted, err := store.resourceGovernanceForProject(context.Background(), projectID); err != nil {
			log.Printf("load resource governance from postgres: %v", err)
		} else {
			for _, item := range persisted {
				itemsByID[item.ID] = item
			}
		}
	}
	resourceGovernanceState.RLock()
	for id, item := range resourceGovernanceState.items {
		if item.ProjectID == projectID {
			itemsByID[id] = item
		}
	}
	resourceGovernanceState.RUnlock()
	items := make([]ResourceGovernanceRecord, 0, len(itemsByID))
	for _, item := range itemsByID {
		items = append(items, item)
	}
	sort.Slice(items, func(i, j int) bool {
		if items[i].NodeID != items[j].NodeID {
			return items[i].NodeID < items[j].NodeID
		}
		return items[i].ID < items[j].ID
	})
	return items
}

func UpdateResourceGovernance(request ResourceGovernanceUpdateRequest) (ResourceGovernanceRecord, error) {
	id := strings.ToUpper(strings.TrimSpace(request.ID))
	var current ResourceGovernanceRecord
	found := false
	for _, item := range defaultResourceGovernance {
		if item.ID == id {
			current, found = item, true
			break
		}
	}
	if !found {
		return ResourceGovernanceRecord{}, errors.New("resource not found")
	}
	resourceGovernanceState.RLock()
	if item, ok := resourceGovernanceState.items[id]; ok {
		current = item
	}
	resourceGovernanceState.RUnlock()
	completeness, ok := normalizeGovernanceStatus(request.Completeness, []string{"待补充", "通过"})
	if !ok {
		return ResourceGovernanceRecord{}, errors.New("invalid completeness")
	}
	availability, ok := normalizeGovernanceStatus(request.Availability, []string{"不可用", "可用"})
	if !ok {
		return ResourceGovernanceRecord{}, errors.New("invalid availability")
	}
	visual, ok := normalizeGovernanceStatus(request.VisualStatus, []string{"待复核", "通过"})
	if !ok {
		return ResourceGovernanceRecord{}, errors.New("invalid visualStatus")
	}
	linkedSection := strings.TrimSpace(request.LinkedSection)
	if linkedSection == "" {
		linkedSection = current.LinkedSection
	}
	if _, ok := normalizeGovernanceStatus(linkedSection, []string{"problem", "visual", "steps", "correction", "exercise", "output", "classroom"}); !ok {
		return ResourceGovernanceRecord{}, errors.New("invalid linkedSection")
	}
	usage := strings.TrimSpace(request.Usage)
	if usage == "" {
		usage = current.Usage
	}
	if usage == "" {
		return ResourceGovernanceRecord{}, errors.New("usage is required")
	}
	current.Completeness = completeness
	current.Availability = availability
	current.VisualStatus = visual
	current.Usage = usage
	current.LinkedSection = linkedSection
	if request.Required != nil {
		current.Required = *request.Required
	}
	current.UpdatedAt = time.Now().UnixMilli()
	current.UpdatedBy = strings.TrimSpace(request.UpdatedBy)
	if current.UpdatedBy == "" {
		current.UpdatedBy = "teacher"
	}
	if store := currentPostgres(); store != nil {
		if err := store.saveResourceGovernance(context.Background(), current); err != nil {
			return ResourceGovernanceRecord{}, err
		}
	}
	resourceGovernanceState.Lock()
	resourceGovernanceState.items[id] = current
	resourceGovernanceState.Unlock()
	return current, nil
}

func normalizeGovernanceStatus(value string, allowed []string) (string, bool) {
	value = strings.TrimSpace(value)
	for _, candidate := range allowed {
		if value == candidate {
			return value, true
		}
	}
	return "", false
}
