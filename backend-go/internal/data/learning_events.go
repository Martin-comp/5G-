package data

import (
	"context"
	"fmt"
	"log"
	"sort"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

type LearningEventRequest struct {
	ClassID         string `json:"classId"`
	NodeID          string `json:"nodeId"`
	StudentID       string `json:"studentId"`
	StudentName     string `json:"studentName"`
	EventType       string `json:"eventType"`
	SectionID       string `json:"sectionId"`
	Value           string `json:"value"`
	DurationSeconds int    `json:"durationSeconds"`
}

type LearningEvent struct {
	ClassID         string `json:"classId"`
	ID              string `json:"id"`
	NodeID          string `json:"nodeId"`
	StudentID       string `json:"studentId"`
	StudentName     string `json:"studentName"`
	EventType       string `json:"eventType"`
	SectionID       string `json:"sectionId"`
	Value           string `json:"value"`
	DurationSeconds int    `json:"durationSeconds"`
	CreatedAt       int64  `json:"createdAt"`
}

type LearningEngagement struct {
	TotalEvents             int                       `json:"totalEvents"`
	ActiveStudents          int                       `json:"activeStudents"`
	AverageEventsPerStudent int                       `json:"averageEventsPerStudent"`
	StalledStudents         int                       `json:"stalledStudents"`
	SectionActivity         []ClassroomAnalyticsItem  `json:"sectionActivity"`
	SectionRisks            []LearningSectionRisk     `json:"sectionRisks"`
	PriorityStudents        []LearningPriorityStudent `json:"priorityStudents"`
	ResourceOutcomes        []ResourceLearningOutcome `json:"resourceOutcomes"`
	SuggestedFocus          []string                  `json:"suggestedFocus"`
	RecentEvents            []LearningEvent           `json:"recentEvents"`
	LastActivityAt          int64                     `json:"lastActivityAt"`
}

type LearningSectionRisk struct {
	SectionID       string `json:"sectionId"`
	Views           int    `json:"views"`
	Completions     int    `json:"completions"`
	Errors          int    `json:"errors"`
	CompletionRate  int    `json:"completionRate"`
	RiskLevel       string `json:"riskLevel"`
	SuggestedAction string `json:"suggestedAction"`
}

type LearningPriorityStudent struct {
	StudentID       string   `json:"studentId"`
	StudentName     string   `json:"studentName"`
	RiskScore       int      `json:"riskScore"`
	RiskLevel       string   `json:"riskLevel"`
	LatestSection   string   `json:"latestSection"`
	Reasons         []string `json:"reasons"`
	SuggestedAction string   `json:"suggestedAction"`
}

type ResourceLearningOutcome struct {
	ResourceID      string `json:"resourceId"`
	Title           string `json:"title"`
	SectionID       string `json:"sectionId"`
	Required        bool   `json:"required"`
	ExposureCount   int    `json:"exposureCount"`
	CompletionCount int    `json:"completionCount"`
	ErrorCount      int    `json:"errorCount"`
	CompletionRate  int    `json:"completionRate"`
	Signal          string `json:"signal"`
}

var learningEventState = struct {
	sync.RWMutex
	items []LearningEvent
}{items: []LearningEvent{}}

var allowedLearningEvents = map[string]struct{}{
	"session-start":    {},
	"section-view":     {},
	"section-complete": {},
	"exercise-pass":    {},
	"exercise-error":   {},
	"test-submit":      {},
	"output-submit":    {},
}

func CreateLearningEvent(request LearningEventRequest) (LearningEvent, error) {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	studentID := strings.TrimSpace(request.StudentID)
	eventType := strings.TrimSpace(request.EventType)
	if studentID == "" {
		return LearningEvent{}, fmt.Errorf("studentId is required")
	}
	if _, ok := allowedLearningEvents[eventType]; !ok {
		return LearningEvent{}, fmt.Errorf("invalid eventType")
	}
	sectionID := strings.TrimSpace(request.SectionID)
	if sectionID != "" {
		if _, ok := normalizeGovernanceStatus(sectionID, []string{"problem", "visual", "steps", "correction", "exercise", "output"}); !ok {
			return LearningEvent{}, fmt.Errorf("invalid sectionId")
		}
	}
	duration := request.DurationSeconds
	if duration < 0 {
		duration = 0
	}
	if duration > 24*60*60 {
		duration = 24 * 60 * 60
	}
	createdAt := time.Now().UnixMilli()
	event := LearningEvent{
		ClassID: classID, ID: fmt.Sprintf("learning-%d", atomic.AddInt64(&classroomSequence, 1)), NodeID: nodeID,
		StudentID: studentID, StudentName: displayStudentName(request.StudentName),
		EventType: eventType, SectionID: sectionID, Value: strings.TrimSpace(request.Value),
		DurationSeconds: duration, CreatedAt: createdAt,
	}
	if store := currentPostgres(); store != nil {
		if err := store.saveLearningEvent(context.Background(), event); err != nil {
			return LearningEvent{}, fmt.Errorf("save learning event: %w", err)
		}
	}
	learningEventState.Lock()
	learningEventState.items = append(learningEventState.items, event)
	if len(learningEventState.items) > 5000 {
		learningEventState.items = learningEventState.items[len(learningEventState.items)-5000:]
	}
	learningEventState.Unlock()
	return event, nil
}

func LearningEventsData(classID, nodeID string) []LearningEvent {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	if store := currentPostgres(); store != nil {
		items, err := store.learningEventsForNode(context.Background(), classID, nodeID)
		if err == nil {
			return items
		}
		log.Printf("load learning events from postgres: %v", err)
	}
	learningEventState.RLock()
	defer learningEventState.RUnlock()
	items := make([]LearningEvent, 0)
	for _, item := range learningEventState.items {
		if item.ClassID == classID && item.NodeID == nodeID {
			items = append(items, item)
		}
	}
	sort.Slice(items, func(i, j int) bool { return items[i].CreatedAt > items[j].CreatedAt })
	if len(items) > 200 {
		items = items[:200]
	}
	return items
}

func LearningEngagementData(classID, nodeID string) LearningEngagement {
	items := LearningEventsData(classID, nodeID)
	return learningEngagementFromData(nodeID, items, nil)
}

func LearningEngagementWithProgress(classID, nodeID string, cards []SelfStudyProgress) LearningEngagement {
	items := LearningEventsData(classID, nodeID)
	return learningEngagementFromData(nodeID, items, cards)
}

func learningEngagementFromData(nodeID string, items []LearningEvent, cards []SelfStudyProgress) LearningEngagement {
	students := map[string]struct{}{}
	sectionCounts := map[string]int{}
	latestByStudent := map[string]LearningEvent{}
	sectionSignals := map[string]*LearningSectionRisk{}
	for _, item := range items {
		students[item.StudentID] = struct{}{}
		if item.SectionID != "" {
			sectionCounts[item.SectionID]++
			signal := sectionSignals[item.SectionID]
			if signal == nil {
				signal = &LearningSectionRisk{SectionID: item.SectionID}
				sectionSignals[item.SectionID] = signal
			}
			switch item.EventType {
			case "section-view", "session-start":
				signal.Views++
			case "section-complete":
				signal.Completions++
			case "exercise-error":
				signal.Errors++
			}
		}
		if current, ok := latestByStudent[item.StudentID]; !ok || item.CreatedAt > current.CreatedAt {
			latestByStudent[item.StudentID] = item
		}
	}
	stalled := 0
	for _, latest := range latestByStudent {
		if latest.EventType == "section-view" || latest.EventType == "exercise-error" {
			stalled++
		}
	}
	average := 0
	if len(students) > 0 {
		average = len(items) / len(students)
	}
	recent := items
	if len(recent) > 8 {
		recent = recent[:8]
	}
	lastActivityAt := int64(0)
	if len(items) > 0 {
		lastActivityAt = items[0].CreatedAt
	}
	sectionRisks := learningSectionRisks(sectionSignals)
	priorityStudents := learningPriorityStudents(cards, latestByStudent)
	resourceOutcomes := learningResourceOutcomes(nodeID, sectionSignals)
	return LearningEngagement{
		TotalEvents: len(items), ActiveStudents: len(students), AverageEventsPerStudent: average,
		StalledStudents: stalled, SectionActivity: analyticsItemsFromCounts(sectionCounts),
		SectionRisks: sectionRisks, PriorityStudents: priorityStudents,
		ResourceOutcomes: resourceOutcomes,
		SuggestedFocus:   learningSuggestedFocus(sectionRisks, priorityStudents, resourceOutcomes),
		RecentEvents:     recent, LastActivityAt: lastActivityAt,
	}
}

func learningSectionRisks(signals map[string]*LearningSectionRisk) []LearningSectionRisk {
	order := map[string]int{"problem": 0, "visual": 1, "steps": 2, "correction": 3, "exercise": 4, "output": 5}
	items := make([]LearningSectionRisk, 0, len(signals))
	for _, signal := range signals {
		if signal.Views > 0 {
			signal.CompletionRate = minInt(100, signal.Completions*100/signal.Views)
		}
		switch {
		case signal.Errors >= 2 || (signal.Views >= 2 && signal.CompletionRate < 40):
			signal.RiskLevel = "高"
			signal.SuggestedAction = "回看该阶段示例，集中讲解判断依据后再练习。"
		case signal.Errors > 0 || signal.Completions < signal.Views:
			signal.RiskLevel = "中"
			signal.SuggestedAction = "补充一次关键提问，确认学生能够完成阶段任务。"
		default:
			signal.RiskLevel = "低"
			signal.SuggestedAction = "保持当前节奏，并通过抽查确认迁移应用。"
		}
		items = append(items, *signal)
	}
	sort.Slice(items, func(i, j int) bool {
		left, right := learningRiskWeight(items[i].RiskLevel), learningRiskWeight(items[j].RiskLevel)
		if left != right {
			return left > right
		}
		return order[items[i].SectionID] < order[items[j].SectionID]
	})
	return items
}

func learningPriorityStudents(cards []SelfStudyProgress, latestByStudent map[string]LearningEvent) []LearningPriorityStudent {
	items := make([]LearningPriorityStudent, 0, len(cards))
	for _, card := range cards {
		risk := 0
		reasons := make([]string, 0, 4)
		action := "完成尚未点亮的阶段，并保留一次课堂抽查。"
		if card.AbilityScore < 60 {
			risk += 35
			reasons = append(reasons, fmt.Sprintf("能力数%d", card.AbilityScore))
			action = "先回到最低能力维度对应阶段，完成一次针对性纠偏。"
		}
		if card.FormalTestAttempts > 0 && card.BestScore < 60 {
			risk += 25
			reasons = append(reasons, fmt.Sprintf("正式测试最高%d分", card.BestScore))
			action = "讲清错误知识点后安排一次限时重测。"
		}
		if card.ReviewStatus == "需修改" {
			risk += 25
			reasons = append(reasons, "学习产出需修改")
			action = "对照教师审核意见修改学习产出，再提交复核。"
		}
		if len(card.CompletedSteps) < 6 {
			risk += minInt(20, (6-len(card.CompletedSteps))*4)
			reasons = append(reasons, fmt.Sprintf("仅完成%d/6阶段", len(card.CompletedSteps)))
		}
		latestSection := ""
		if latest, ok := latestByStudent[card.StudentID]; ok {
			latestSection = latest.SectionID
			if latest.EventType == "exercise-error" || latest.EventType == "section-view" {
				risk += 10
				reasons = append(reasons, "最近行为显示可能停滞")
			}
		}
		if risk < 20 {
			continue
		}
		if len(reasons) > 3 {
			reasons = reasons[:3]
		}
		items = append(items, LearningPriorityStudent{
			StudentID: card.StudentID, StudentName: card.StudentName, RiskScore: minInt(100, risk),
			RiskLevel: learningRiskLevel(risk), LatestSection: latestSection,
			Reasons: reasons, SuggestedAction: action,
		})
	}
	sort.Slice(items, func(i, j int) bool {
		if items[i].RiskScore != items[j].RiskScore {
			return items[i].RiskScore > items[j].RiskScore
		}
		return items[i].StudentName < items[j].StudentName
	})
	if len(items) > 5 {
		items = items[:5]
	}
	return items
}

func learningResourceOutcomes(nodeID string, signals map[string]*LearningSectionRisk) []ResourceLearningOutcome {
	projectID := ""
	if len(nodeID) >= 2 && strings.HasPrefix(nodeID, "P") {
		projectID = nodeID[:2]
	}
	resources := ResourceGovernanceData(projectID)
	items := make([]ResourceLearningOutcome, 0)
	for _, resource := range resources {
		if resource.NodeID != nodeID {
			continue
		}
		outcome := ResourceLearningOutcome{
			ResourceID: resource.ID, Title: resource.Title, SectionID: resource.LinkedSection, Required: resource.Required,
		}
		if signal := signals[resource.LinkedSection]; signal != nil {
			outcome.ExposureCount = signal.Views
			outcome.CompletionCount = signal.Completions
			outcome.ErrorCount = signal.Errors
			outcome.CompletionRate = signal.CompletionRate
		}
		switch {
		case outcome.ExposureCount == 0:
			outcome.Signal = "尚无学生使用证据"
		case outcome.CompletionRate >= 70 && outcome.ErrorCount == 0:
			outcome.Signal = "资源使用后阶段完成稳定"
		case outcome.ErrorCount > 0:
			outcome.Signal = "资源已使用，但仍出现错误"
		default:
			outcome.Signal = "资源已触达，阶段完成仍需提升"
		}
		items = append(items, outcome)
	}
	return items
}

func learningSuggestedFocus(sectionRisks []LearningSectionRisk, students []LearningPriorityStudent, resources []ResourceLearningOutcome) []string {
	items := make([]string, 0, 3)
	hasResourceEvidence := false
	if len(students) > 0 {
		items = append(items, fmt.Sprintf("优先支持%s：%s", students[0].StudentName, students[0].SuggestedAction))
	}
	for _, section := range sectionRisks {
		if section.RiskLevel == "高" || section.RiskLevel == "中" {
			items = append(items, fmt.Sprintf("重点讲评%s阶段：%s", section.SectionID, section.SuggestedAction))
			break
		}
	}
	for _, resource := range resources {
		if resource.ExposureCount > 0 {
			hasResourceEvidence = true
		}
		if resource.ExposureCount > 0 && (resource.CompletionRate < 70 || resource.ErrorCount > 0) {
			items = append(items, fmt.Sprintf("复核资源“%s”：%s", resource.Title, resource.Signal))
			break
		}
	}
	if len(items) == 0 {
		if len(resources) > 0 && !hasResourceEvidence {
			items = append(items, "等待学生使用关联资源后，再判断资源成效与讲评顺序。")
		} else {
			items = append(items, "当前学习过程较稳定，可通过迁移任务验证知识应用。")
		}
	}
	if len(items) > 3 {
		items = items[:3]
	}
	return items
}

func learningRiskLevel(score int) string {
	switch {
	case score >= 60:
		return "高"
	case score >= 30:
		return "中"
	default:
		return "低"
	}
}

func learningRiskWeight(level string) int {
	switch level {
	case "高":
		return 3
	case "中":
		return 2
	default:
		return 1
	}
}

func minInt(left, right int) int {
	if left < right {
		return left
	}
	return right
}
