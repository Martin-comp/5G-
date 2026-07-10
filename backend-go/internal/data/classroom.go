package data

import (
	"fmt"
	"sort"
	"strings"
	"sync"
	"sync/atomic"
	"time"
)

const defaultClassroomNodeID = "P4T2-N04"
const defaultClassroomID = "通信2301班"

var classroomSequence int64

type ClassroomSessionState struct {
	ClassID        string `json:"classId"`
	NodeID         string `json:"nodeId"`
	SlideID        string `json:"slideId"`
	Synced         bool   `json:"synced"`
	PracticePushed bool   `json:"practicePushed"`
	ReviewMode     bool   `json:"reviewMode"`
	UpdatedAt      int64  `json:"updatedAt"`
	UpdatedBy      string `json:"updatedBy"`
}

type ClassroomSessionUpdateRequest struct {
	ClassID        string `json:"classId"`
	NodeID         string `json:"nodeId"`
	SlideID        string `json:"slideId"`
	Synced         bool   `json:"synced"`
	PracticePushed bool   `json:"practicePushed"`
	ReviewMode     bool   `json:"reviewMode"`
	UpdatedBy      string `json:"updatedBy"`
}

type ClassroomToolState struct {
	ClassID        string   `json:"classId"`
	NodeID         string   `json:"nodeId"`
	ActiveTool     string   `json:"activeTool"`
	PollOpen       bool     `json:"pollOpen"`
	DiscussionOpen bool     `json:"discussionOpen"`
	GroupTaskOpen  bool     `json:"groupTaskOpen"`
	TimerRunning   bool     `json:"timerRunning"`
	TimerSeconds   int      `json:"timerSeconds"`
	Prompt         string   `json:"prompt"`
	PollOptions    []string `json:"pollOptions"`
	UpdatedAt      int64    `json:"updatedAt"`
}

type ClassroomPollResponseRequest struct {
	ClassID     string `json:"classId"`
	NodeID      string `json:"nodeId"`
	StudentID   string `json:"studentId"`
	StudentName string `json:"studentName"`
	Option      string `json:"option"`
}

type ClassroomPollResponse struct {
	ClassID     string `json:"classId"`
	ID          string `json:"id"`
	NodeID      string `json:"nodeId"`
	StudentID   string `json:"studentId"`
	StudentName string `json:"studentName"`
	Option      string `json:"option"`
	CreatedAt   int64  `json:"createdAt"`
}

type ClassroomPollOption struct {
	Label string `json:"label"`
	Count int    `json:"count"`
}

type ClassroomPollResults struct {
	ClassID     string                  `json:"classId"`
	NodeID      string                  `json:"nodeId"`
	Prompt      string                  `json:"prompt"`
	Options     []ClassroomPollOption   `json:"options"`
	Submitted   int                     `json:"submitted"`
	TotalPeople int                     `json:"totalPeople"`
	Responses   []ClassroomPollResponse `json:"responses"`
	UpdatedAt   int64                   `json:"updatedAt"`
}

type ClassroomDiscussionMessageRequest struct {
	ClassID     string `json:"classId"`
	NodeID      string `json:"nodeId"`
	StudentID   string `json:"studentId"`
	StudentName string `json:"studentName"`
	Content     string `json:"content"`
}

type ClassroomDiscussionMessage struct {
	ClassID     string `json:"classId"`
	ID          string `json:"id"`
	NodeID      string `json:"nodeId"`
	StudentID   string `json:"studentId"`
	StudentName string `json:"studentName"`
	Content     string `json:"content"`
	CreatedAt   int64  `json:"createdAt"`
}

type ClassroomGroupResponseRequest struct {
	ClassID     string   `json:"classId"`
	NodeID      string   `json:"nodeId"`
	StudentID   string   `json:"studentId"`
	StudentName string   `json:"studentName"`
	Evidence    []string `json:"evidence"`
	Conclusion  string   `json:"conclusion"`
}

type ClassroomGroupResponse struct {
	ClassID     string   `json:"classId"`
	ID          string   `json:"id"`
	NodeID      string   `json:"nodeId"`
	StudentID   string   `json:"studentId"`
	StudentName string   `json:"studentName"`
	Evidence    []string `json:"evidence"`
	Conclusion  string   `json:"conclusion"`
	CreatedAt   int64    `json:"createdAt"`
}

type ClassroomToolUpdateRequest struct {
	ClassID        string   `json:"classId"`
	NodeID         string   `json:"nodeId"`
	ActiveTool     string   `json:"activeTool"`
	PollOpen       bool     `json:"pollOpen"`
	DiscussionOpen bool     `json:"discussionOpen"`
	GroupTaskOpen  bool     `json:"groupTaskOpen"`
	TimerRunning   bool     `json:"timerRunning"`
	TimerSeconds   int      `json:"timerSeconds"`
	Prompt         string   `json:"prompt"`
	PollOptions    []string `json:"pollOptions"`
}

type ClassroomSubmissionRequest struct {
	ClassID          string   `json:"classId"`
	NodeID           string   `json:"nodeId"`
	TaskID           string   `json:"taskId"`
	StudentID        string   `json:"studentId"`
	StudentName      string   `json:"studentName"`
	Answer           string   `json:"answer"`
	Evidence         []string `json:"evidence"`
	Conclusion       string   `json:"conclusion"`
	Score            int      `json:"score"`
	SelectedEvidence []string `json:"selectedEvidence"`
}

type ClassroomSubmission struct {
	ClassID          string   `json:"classId"`
	ID               string   `json:"id"`
	NodeID           string   `json:"nodeId"`
	TaskID           string   `json:"taskId"`
	StudentID        string   `json:"studentId"`
	StudentName      string   `json:"studentName"`
	Answer           string   `json:"answer"`
	Evidence         []string `json:"evidence"`
	Conclusion       string   `json:"conclusion"`
	Score            int      `json:"score"`
	SelectedEvidence []string `json:"selectedEvidence"`
	Tags             []string `json:"tags"`
	CreatedAt        int64    `json:"createdAt"`
}

type ClassroomAnalyticsItem struct {
	Label string `json:"label"`
	Count int    `json:"count"`
	Level string `json:"level"`
}

type ClassroomAnalytics struct {
	ClassID        string                   `json:"classId"`
	NodeID         string                   `json:"nodeId"`
	TotalStudents  int                      `json:"totalStudents"`
	Submitted      int                      `json:"submitted"`
	SubmitRate     string                   `json:"submitRate"`
	AverageScore   int                      `json:"averageScore"`
	NeedsReview    int                      `json:"needsReview"`
	CommonMistakes []ClassroomAnalyticsItem `json:"commonMistakes"`
	PriorityItems  []ClassroomAnalyticsItem `json:"priorityItems"`
	SuggestedFocus []string                 `json:"suggestedFocus"`
	UpdatedAt      int64                    `json:"updatedAt"`
}

// ClassroomNodePortfolio keeps the classroom record at a capability-node level.
type ClassroomNodePortfolio struct {
	NodeID          string `json:"nodeId"`
	Submitted       int    `json:"submitted"`
	AverageScore    int    `json:"averageScore"`
	NeedsReview     int    `json:"needsReview"`
	LastSubmittedAt int64  `json:"lastSubmittedAt"`
}

// ClassroomLearningPortfolio is the cross-node view used by the teacher dashboard.
type ClassroomLearningPortfolio struct {
	ClassID          string                   `json:"classId"`
	TotalSubmissions int                      `json:"totalSubmissions"`
	UniqueStudents   int                      `json:"uniqueStudents"`
	ActiveNodes      int                      `json:"activeNodes"`
	AverageScore     int                      `json:"averageScore"`
	Nodes            []ClassroomNodePortfolio `json:"nodes"`
	Recent           []ClassroomSubmission    `json:"recent"`
	UpdatedAt        int64                    `json:"updatedAt"`
}

var classroomMemory = struct {
	sync.Mutex
	sessions    map[string]ClassroomSessionState
	tools       map[string]ClassroomToolState
	submissions map[string][]ClassroomSubmission
	polls       map[string]map[string]ClassroomPollResponse
	messages    map[string][]ClassroomDiscussionMessage
	groups      map[string]map[string]ClassroomGroupResponse
	activeNodes map[string]string
}{
	sessions:    map[string]ClassroomSessionState{},
	tools:       map[string]ClassroomToolState{},
	submissions: map[string][]ClassroomSubmission{},
	polls:       map[string]map[string]ClassroomPollResponse{},
	messages:    map[string][]ClassroomDiscussionMessage{},
	groups:      map[string]map[string]ClassroomGroupResponse{},
	activeNodes: map[string]string{},
}

func ClassroomSession(classID, nodeID string) ClassroomSessionState {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	return classroomSessionLocked(classID, nodeID)
}

func UpdateClassroomSession(request ClassroomSessionUpdateRequest) ClassroomSessionState {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()

	state := classroomSessionLocked(classID, nodeID)
	if strings.TrimSpace(request.SlideID) != "" {
		state.SlideID = strings.TrimSpace(request.SlideID)
	}
	state.Synced = request.Synced
	state.PracticePushed = request.PracticePushed
	state.ReviewMode = request.ReviewMode
	state.UpdatedBy = strings.TrimSpace(request.UpdatedBy)
	if state.UpdatedBy == "" {
		state.UpdatedBy = "teacher"
	}
	state.UpdatedAt = time.Now().UnixMilli()
	state.ClassID = classID
	classroomMemory.sessions[classroomKey(classID, nodeID)] = state
	if state.Synced {
		classroomMemory.activeNodes[classID] = nodeID
	} else if classroomMemory.activeNodes[classID] == nodeID {
		delete(classroomMemory.activeNodes, classID)
	}
	return state
}

func ActiveClassroomSession(classID string) ClassroomSessionState {
	classID = normalizeClassroomID(classID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	nodeID := classroomMemory.activeNodes[classID]
	if nodeID == "" {
		return ClassroomSessionState{ClassID: classID, NodeID: "", UpdatedBy: "system"}
	}
	return classroomSessionLocked(classID, nodeID)
}

func ClassroomTools(classID, nodeID string) ClassroomToolState {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	return classroomToolsLocked(classID, nodeID)
}

func UpdateClassroomTools(request ClassroomToolUpdateRequest) ClassroomToolState {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()

	state := classroomToolsLocked(classID, nodeID)
	state.ActiveTool = strings.TrimSpace(request.ActiveTool)
	state.PollOpen = request.PollOpen
	state.DiscussionOpen = request.DiscussionOpen
	state.GroupTaskOpen = request.GroupTaskOpen
	state.TimerRunning = request.TimerRunning
	state.TimerSeconds = request.TimerSeconds
	state.Prompt = strings.TrimSpace(request.Prompt)
	if options := cleanStrings(request.PollOptions); len(options) > 0 {
		state.PollOptions = options
	}
	state.UpdatedAt = time.Now().UnixMilli()
	state.ClassID = classID
	classroomMemory.tools[classroomKey(classID, nodeID)] = state
	return state
}

func CreateClassroomSubmission(request ClassroomSubmissionRequest) ClassroomSubmission {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	studentID := strings.TrimSpace(request.StudentID)
	if studentID == "" {
		studentID = fmt.Sprintf("student-%d", time.Now().UnixMilli())
	}
	studentName := strings.TrimSpace(request.StudentName)
	if studentName == "" {
		studentName = "学生"
	}
	score := request.Score
	if score < 0 {
		score = 0
	}
	if score > 100 {
		score = 100
	}

	submission := ClassroomSubmission{
		ClassID:          classID,
		ID:               nextClassroomRecordID("CLS"),
		NodeID:           nodeID,
		TaskID:           strings.TrimSpace(request.TaskID),
		StudentID:        studentID,
		StudentName:      studentName,
		Answer:           strings.TrimSpace(request.Answer),
		Evidence:         cleanStrings(request.Evidence),
		Conclusion:       strings.TrimSpace(request.Conclusion),
		Score:            score,
		SelectedEvidence: cleanStrings(request.SelectedEvidence),
		CreatedAt:        time.Now().UnixMilli(),
	}
	submission.Tags = submissionTags(submission)

	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	key := classroomKey(classID, nodeID)
	classroomMemory.submissions[key] = append(classroomMemory.submissions[key], submission)
	return submission
}

func ClassroomSubmissions(classID, nodeID string) []ClassroomSubmission {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	items := make([]ClassroomSubmission, len(classroomMemory.submissions[classroomKey(classID, nodeID)]))
	copy(items, classroomMemory.submissions[classroomKey(classID, nodeID)])
	sort.Slice(items, func(i, j int) bool { return items[i].CreatedAt > items[j].CreatedAt })
	return items
}

func CreateClassroomPollResponse(request ClassroomPollResponseRequest) (ClassroomPollResponse, error) {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	studentID := strings.TrimSpace(request.StudentID)
	option := strings.TrimSpace(request.Option)
	if studentID == "" || option == "" {
		return ClassroomPollResponse{}, fmt.Errorf("studentId and option are required")
	}

	response := ClassroomPollResponse{
		ClassID:     classID,
		ID:          nextClassroomRecordID("POLL"),
		NodeID:      nodeID,
		StudentID:   studentID,
		StudentName: displayStudentName(request.StudentName),
		Option:      option,
		CreatedAt:   time.Now().UnixMilli(),
	}

	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	key := classroomKey(classID, nodeID)
	if classroomMemory.polls[key] == nil {
		classroomMemory.polls[key] = map[string]ClassroomPollResponse{}
	}
	classroomMemory.polls[key][studentID] = response
	return response, nil
}

func ClassroomPollData(classID, nodeID string) ClassroomPollResults {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()

	responsesByStudent := classroomMemory.polls[classroomKey(classID, nodeID)]
	responses := make([]ClassroomPollResponse, 0, len(responsesByStudent))
	counts := map[string]int{}
	for _, response := range responsesByStudent {
		responses = append(responses, response)
		counts[response.Option]++
	}
	sort.Slice(responses, func(i, j int) bool { return responses[i].CreatedAt > responses[j].CreatedAt })
	state := classroomToolsLocked(classID, nodeID)
	optionLabels := state.PollOptions
	if len(optionLabels) == 0 {
		optionLabels = []string{"静止点覆盖不足", "移动路径切换过程", "终端单点故障"}
	}
	options := make([]ClassroomPollOption, 0, len(optionLabels))
	for _, label := range optionLabels {
		options = append(options, ClassroomPollOption{Label: label, Count: counts[label]})
	}
	return ClassroomPollResults{
		ClassID:     classID,
		NodeID:      nodeID,
		Prompt:      state.Prompt,
		Options:     options,
		Submitted:   len(responses),
		TotalPeople: 42,
		Responses:   responses,
		UpdatedAt:   time.Now().UnixMilli(),
	}
}

func CreateClassroomDiscussionMessage(request ClassroomDiscussionMessageRequest) (ClassroomDiscussionMessage, error) {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	content := strings.TrimSpace(request.Content)
	if content == "" {
		return ClassroomDiscussionMessage{}, fmt.Errorf("content is required")
	}

	message := ClassroomDiscussionMessage{
		ClassID:     classID,
		ID:          nextClassroomRecordID("MSG"),
		NodeID:      nodeID,
		StudentID:   strings.TrimSpace(request.StudentID),
		StudentName: displayStudentName(request.StudentName),
		Content:     content,
		CreatedAt:   time.Now().UnixMilli(),
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	key := classroomKey(classID, nodeID)
	classroomMemory.messages[key] = append(classroomMemory.messages[key], message)
	return message, nil
}

func ClassroomDiscussionMessages(classID, nodeID string) []ClassroomDiscussionMessage {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	items := make([]ClassroomDiscussionMessage, len(classroomMemory.messages[classroomKey(classID, nodeID)]))
	copy(items, classroomMemory.messages[classroomKey(classID, nodeID)])
	sort.Slice(items, func(i, j int) bool { return items[i].CreatedAt > items[j].CreatedAt })
	if len(items) > 30 {
		items = items[:30]
	}
	return items
}

func CreateClassroomGroupResponse(request ClassroomGroupResponseRequest) (ClassroomGroupResponse, error) {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	studentID := strings.TrimSpace(request.StudentID)
	evidence := cleanStrings(request.Evidence)
	conclusion := strings.TrimSpace(request.Conclusion)
	if studentID == "" || (len(evidence) == 0 && conclusion == "") {
		return ClassroomGroupResponse{}, fmt.Errorf("studentId and evidence or conclusion are required")
	}

	response := ClassroomGroupResponse{
		ClassID:     classID,
		ID:          nextClassroomRecordID("GROUP"),
		NodeID:      nodeID,
		StudentID:   studentID,
		StudentName: displayStudentName(request.StudentName),
		Evidence:    evidence,
		Conclusion:  conclusion,
		CreatedAt:   time.Now().UnixMilli(),
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	key := classroomKey(classID, nodeID)
	if classroomMemory.groups[key] == nil {
		classroomMemory.groups[key] = map[string]ClassroomGroupResponse{}
	}
	classroomMemory.groups[key][studentID] = response
	return response, nil
}

func ClassroomGroupResponses(classID, nodeID string) []ClassroomGroupResponse {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	byStudent := classroomMemory.groups[classroomKey(classID, nodeID)]
	items := make([]ClassroomGroupResponse, 0, len(byStudent))
	for _, item := range byStudent {
		items = append(items, item)
	}
	sort.Slice(items, func(i, j int) bool { return items[i].CreatedAt > items[j].CreatedAt })
	return items
}

func ClassroomAnalyticsData(classID, nodeID string) ClassroomAnalytics {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	items := ClassroomSubmissions(classID, nodeID)
	if len(items) == 0 {
		return demoClassroomAnalytics(classID, nodeID)
	}

	totalStudents := 42
	submitted := len(items)
	scoreSum := 0
	needsReview := 0
	mistakeCounts := map[string]int{}
	for _, item := range items {
		scoreSum += item.Score
		if item.Score < 80 {
			needsReview++
		}
		for _, tag := range item.Tags {
			mistakeCounts[tag]++
		}
	}

	common := analyticsItemsFromCounts(mistakeCounts)
	priority := common
	if len(common) == 0 {
		common = []ClassroomAnalyticsItem{{Label: "暂无集中错误", Count: 0, Level: "低"}}
		priority = []ClassroomAnalyticsItem{{Label: "保持证据链完整表达", Count: submitted, Level: "低"}}
	}

	average := 0
	if submitted > 0 {
		average = scoreSum / submitted
	}
	return ClassroomAnalytics{
		ClassID:        classID,
		NodeID:         nodeID,
		TotalStudents:  totalStudents,
		Submitted:      submitted,
		SubmitRate:     fmt.Sprintf("%.1f%%", float64(submitted)/float64(totalStudents)*100),
		AverageScore:   average,
		NeedsReview:    needsReview,
		CommonMistakes: common,
		PriorityItems:  priority,
		SuggestedFocus: []string{"先看移动路径，再看切换成功率、重建次数和短掉线日志。", "讲评时提醒学生：覆盖改善不等于体验闭环。"},
		UpdatedAt:      time.Now().UnixMilli(),
	}
}

func ClassroomLearningPortfolioData(classID string) ClassroomLearningPortfolio {
	classID = normalizeClassroomID(classID)
	classroomMemory.Lock()
	defer classroomMemory.Unlock()

	prefix := classID + "::"
	nodes := map[string]*ClassroomNodePortfolio{}
	students := map[string]struct{}{}
	recent := make([]ClassroomSubmission, 0)
	scoreSum := 0
	total := 0

	for key, submissions := range classroomMemory.submissions {
		if !strings.HasPrefix(key, prefix) {
			continue
		}
		for _, item := range submissions {
			total++
			scoreSum += item.Score
			students[item.StudentID] = struct{}{}
			recent = append(recent, item)
			node := nodes[item.NodeID]
			if node == nil {
				node = &ClassroomNodePortfolio{NodeID: item.NodeID}
				nodes[item.NodeID] = node
			}
			node.Submitted++
			node.AverageScore += item.Score
			if item.Score < 80 {
				node.NeedsReview++
			}
			if item.CreatedAt > node.LastSubmittedAt {
				node.LastSubmittedAt = item.CreatedAt
			}
		}
	}

	items := make([]ClassroomNodePortfolio, 0, len(nodes))
	for _, node := range nodes {
		if node.Submitted > 0 {
			node.AverageScore /= node.Submitted
		}
		items = append(items, *node)
	}
	sort.Slice(items, func(i, j int) bool { return items[i].LastSubmittedAt > items[j].LastSubmittedAt })
	sort.Slice(recent, func(i, j int) bool { return recent[i].CreatedAt > recent[j].CreatedAt })
	if len(recent) > 5 {
		recent = recent[:5]
	}

	average := 0
	if total > 0 {
		average = scoreSum / total
	}
	return ClassroomLearningPortfolio{
		ClassID:          classID,
		TotalSubmissions: total,
		UniqueStudents:   len(students),
		ActiveNodes:      len(items),
		AverageScore:     average,
		Nodes:            items,
		Recent:           recent,
		UpdatedAt:        time.Now().UnixMilli(),
	}
}

func classroomSessionLocked(classID, nodeID string) ClassroomSessionState {
	if state, ok := classroomMemory.sessions[classroomKey(classID, nodeID)]; ok {
		return state
	}
	return ClassroomSessionState{
		ClassID:        classID,
		NodeID:         nodeID,
		SlideID:        "3",
		Synced:         false,
		PracticePushed: false,
		ReviewMode:     false,
		UpdatedAt:      0,
		UpdatedBy:      "system",
	}
}

func classroomToolsLocked(classID, nodeID string) ClassroomToolState {
	if state, ok := classroomMemory.tools[classroomKey(classID, nodeID)]; ok {
		return state
	}
	return ClassroomToolState{
		ClassID:      classID,
		NodeID:       nodeID,
		ActiveTool:   "",
		TimerSeconds: 300,
		Prompt:       "请围绕移动路径、指标证据和验收结论完成讨论。",
		PollOptions:  []string{"静止点覆盖不足", "移动路径切换过程", "终端单点故障"},
		UpdatedAt:    0,
	}
}

func demoClassroomAnalytics(classID, nodeID string) ClassroomAnalytics {
	return ClassroomAnalytics{
		ClassID:       classID,
		NodeID:        nodeID,
		TotalStudents: 42,
		Submitted:     36,
		SubmitRate:    "85.7%",
		AverageScore:  76,
		NeedsReview:   6,
		CommonMistakes: []ClassroomAnalyticsItem{
			{Label: "把覆盖达标当成体验闭环", Count: 18, Level: "高"},
			{Label: "忽略切换失败集中区", Count: 14, Level: "中"},
			{Label: "未关联短掉线日志", Count: 10, Level: "低"},
		},
		PriorityItems: []ClassroomAnalyticsItem{
			{Label: "切换成功率未达标原因", Count: 18, Level: "高"},
			{Label: "重建次数异常", Count: 14, Level: "中"},
			{Label: "短掉线日志判读", Count: 10, Level: "低"},
		},
		SuggestedFocus: []string{"先讲覆盖改善与体验闭环的差别。", "再定位 A-B 边界和食堂入口的移动性证据。"},
		UpdatedAt:      time.Now().UnixMilli(),
	}
}

func normalizeClassroomNodeID(nodeID string) string {
	nodeID = strings.ToUpper(strings.TrimSpace(nodeID))
	if nodeID == "" {
		return defaultClassroomNodeID
	}
	return nodeID
}

func normalizeClassroomID(classID string) string {
	classID = strings.TrimSpace(classID)
	if classID == "" {
		return defaultClassroomID
	}
	return classID
}

func classroomKey(classID, nodeID string) string {
	return classID + "::" + nodeID
}

func nextClassroomRecordID(prefix string) string {
	return fmt.Sprintf("%s-%d-%d", prefix, time.Now().UnixMilli(), atomic.AddInt64(&classroomSequence, 1))
}

func cleanStrings(values []string) []string {
	cleaned := make([]string, 0, len(values))
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value != "" {
			cleaned = append(cleaned, value)
		}
	}
	return cleaned
}

func displayStudentName(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return "学生"
	}
	return value
}

func submissionTags(item ClassroomSubmission) []string {
	text := item.Answer + item.Conclusion + strings.Join(item.Evidence, " ") + strings.Join(item.SelectedEvidence, " ")
	tags := []string{}
	if strings.Contains(text, "覆盖") && !strings.Contains(text, "切换") && !strings.Contains(text, "重建") && !strings.Contains(text, "掉线") {
		tags = append(tags, "把覆盖达标当成体验闭环")
	}
	if !strings.Contains(text, "切换") {
		tags = append(tags, "忽略切换失败集中区")
	}
	if !strings.Contains(text, "日志") && !strings.Contains(text, "掉线") {
		tags = append(tags, "未关联短掉线日志")
	}
	if len(tags) == 0 && item.Score < 80 {
		tags = append(tags, "表达缺少证据链")
	}
	return tags
}

func analyticsItemsFromCounts(counts map[string]int) []ClassroomAnalyticsItem {
	items := make([]ClassroomAnalyticsItem, 0, len(counts))
	for label, count := range counts {
		level := "低"
		if count >= 12 {
			level = "高"
		} else if count >= 6 {
			level = "中"
		}
		items = append(items, ClassroomAnalyticsItem{Label: label, Count: count, Level: level})
	}
	sort.Slice(items, func(i, j int) bool { return items[i].Count > items[j].Count })
	return items
}
