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

type ClassroomExitRequest struct {
	ClassID     string `json:"classId"`
	NodeID      string `json:"nodeId"`
	StudentID   string `json:"studentId"`
	StudentName string `json:"studentName"`
}

type ClassroomExit struct {
	ClassID     string `json:"classId"`
	ID          string `json:"id"`
	NodeID      string `json:"nodeId"`
	StudentID   string `json:"studentId"`
	StudentName string `json:"studentName"`
	CreatedAt   int64  `json:"createdAt"`
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

type SelfStudyAbility struct {
	Label  string `json:"label"`
	Score  int    `json:"score"`
	Status string `json:"status"`
}

type SelfStudyOutputVersion struct {
	Version       int    `json:"version"`
	StudentOutput string `json:"studentOutput"`
	SubmittedAt   int64  `json:"submittedAt"`
	ReviewStatus  string `json:"reviewStatus"`
	ReviewComment string `json:"reviewComment"`
	ReviewedAt    int64  `json:"reviewedAt"`
}

type SelfStudyTestAttempt struct {
	Attempt              int                `json:"attempt"`
	VersionID            string             `json:"versionId"`
	SubmittedAt          int64              `json:"submittedAt"`
	ElapsedSeconds       int                `json:"elapsedSeconds"`
	Score                int                `json:"score"`
	SingleAnswer         string             `json:"singleAnswer"`
	Sequence             []string           `json:"sequence"`
	Evidence             []string           `json:"evidence"`
	Conclusion           []string           `json:"conclusion"`
	WrongKnowledgePoints []string           `json:"wrongKnowledgePoints"`
	Diagnosis            []SelfStudyAbility `json:"diagnosis"`
}

type SelfStudyProgressUpdateRequest struct {
	ClassID              string                `json:"classId"`
	NodeID               string                `json:"nodeId"`
	StudentID            string                `json:"studentId"`
	StudentName          string                `json:"studentName"`
	CompletedSteps       []string              `json:"completedSteps"`
	StartedAt            int64                 `json:"startedAt"`
	TimeSpentSeconds     int                   `json:"timeSpentSeconds"`
	PracticeAttempts     int                   `json:"practiceAttempts"`
	PracticeScore        int                   `json:"practiceScore"`
	WrongKnowledgePoints []string              `json:"wrongKnowledgePoints"`
	ReviewStatus         string                `json:"reviewStatus"`
	FormalTestAttempts   int                   `json:"formalTestAttempts"`
	FirstScore           int                   `json:"firstScore"`
	BestScore            int                   `json:"bestScore"`
	LatestScore          int                   `json:"latestScore"`
	TestCompletedAt      int64                 `json:"testCompletedAt"`
	StudentOutput        string                `json:"studentOutput"`
	OutputSubmittedAt    int64                 `json:"outputSubmittedAt"`
	ReviewComment        string                `json:"reviewComment"`
	FormalTestSubmission *SelfStudyTestAttempt `json:"formalTestSubmission,omitempty"`
}

type SelfStudyReviewRequest struct {
	ClassID   string `json:"classId"`
	NodeID    string `json:"nodeId"`
	StudentID string `json:"studentId"`
	Status    string `json:"status"`
	Comment   string `json:"comment"`
}

type DemoResetSummary struct {
	ClassID          string `json:"classId"`
	ResetStudents    int    `json:"resetStudents"`
	SeededRecords    int    `json:"seededRecords"`
	CompletedRecords int    `json:"completedRecords"`
	UpdatedAt        int64  `json:"updatedAt"`
}

type SelfStudyProgress struct {
	ClassID              string                   `json:"classId"`
	NodeID               string                   `json:"nodeId"`
	StudentID            string                   `json:"studentId"`
	StudentName          string                   `json:"studentName"`
	CompletedSteps       []string                 `json:"completedSteps"`
	AbilityScore         int                      `json:"abilityScore"`
	Abilities            []SelfStudyAbility       `json:"abilities"`
	StartedAt            int64                    `json:"startedAt"`
	TimeSpentSeconds     int                      `json:"timeSpentSeconds"`
	PracticeAttempts     int                      `json:"practiceAttempts"`
	PracticeScore        int                      `json:"practiceScore"`
	WrongKnowledgePoints []string                 `json:"wrongKnowledgePoints"`
	ReviewStatus         string                   `json:"reviewStatus"`
	FormalTestAttempts   int                      `json:"formalTestAttempts"`
	FirstScore           int                      `json:"firstScore"`
	BestScore            int                      `json:"bestScore"`
	LatestScore          int                      `json:"latestScore"`
	TestCompletedAt      int64                    `json:"testCompletedAt"`
	StudentOutput        string                   `json:"studentOutput"`
	OutputSubmittedAt    int64                    `json:"outputSubmittedAt"`
	ReviewComment        string                   `json:"reviewComment"`
	CertifiedAt          int64                    `json:"certifiedAt"`
	OutputVersions       []SelfStudyOutputVersion `json:"outputVersions"`
	FormalTestVersions   []SelfStudyTestAttempt   `json:"formalTestVersions"`
	UpdatedAt            int64                    `json:"updatedAt"`
}

type SelfStudyAnalytics struct {
	ClassID                string                   `json:"classId"`
	NodeID                 string                   `json:"nodeId"`
	Students               int                      `json:"students"`
	Completed              int                      `json:"completed"`
	AverageAbility         int                      `json:"averageAbility"`
	AverageAccuracy        int                      `json:"averageAccuracy"`
	AverageDurationSeconds int                      `json:"averageDurationSeconds"`
	TotalRetries           int                      `json:"totalRetries"`
	NeedsSupport           int                      `json:"needsSupport"`
	TypicalErrors          []ClassroomAnalyticsItem `json:"typicalErrors"`
	WeakAbilities          []ClassroomAnalyticsItem `json:"weakAbilities"`
	Engagement             LearningEngagement       `json:"engagement"`
	Cards                  []SelfStudyProgress      `json:"cards"`
	UpdatedAt              int64                    `json:"updatedAt"`
}

var classroomMemory = struct {
	sync.Mutex
	sessions    map[string]ClassroomSessionState
	tools       map[string]ClassroomToolState
	submissions map[string][]ClassroomSubmission
	polls       map[string]map[string]ClassroomPollResponse
	messages    map[string][]ClassroomDiscussionMessage
	groups      map[string]map[string]ClassroomGroupResponse
	exits       map[string][]ClassroomExit
	activeNodes map[string]string
	selfStudy   map[string]SelfStudyProgress
}{
	sessions:    map[string]ClassroomSessionState{},
	tools:       map[string]ClassroomToolState{},
	submissions: map[string][]ClassroomSubmission{},
	polls:       map[string]map[string]ClassroomPollResponse{},
	messages:    map[string][]ClassroomDiscussionMessage{},
	groups:      map[string]map[string]ClassroomGroupResponse{},
	exits:       map[string][]ClassroomExit{},
	activeNodes: map[string]string{},
	selfStudy:   map[string]SelfStudyProgress{},
}

func ClassroomSession(classID, nodeID string) ClassroomSessionState {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	if store := currentPostgres(); store != nil {
		state, found, err := store.session(context.Background(), classID, nodeID)
		if err == nil && found {
			return state
		}
		if err != nil {
			log.Printf("load classroom session from postgres: %v", err)
		}
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	return classroomSessionLocked(classID, nodeID)
}

func UpdateClassroomSession(request ClassroomSessionUpdateRequest) (ClassroomSessionState, error) {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	state := ClassroomSession(classID, nodeID)
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
	if store := currentPostgres(); store != nil {
		if err := store.saveSession(context.Background(), state); err != nil {
			return ClassroomSessionState{}, fmt.Errorf("save classroom session: %w", err)
		}
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	classroomMemory.sessions[classroomKey(classID, nodeID)] = state
	if state.Synced {
		classroomMemory.activeNodes[classID] = nodeID
	} else if classroomMemory.activeNodes[classID] == nodeID {
		delete(classroomMemory.activeNodes, classID)
	}
	return state, nil
}

func ActiveClassroomSession(classID string) ClassroomSessionState {
	classID = normalizeClassroomID(classID)
	if store := currentPostgres(); store != nil {
		state, found, err := store.activeSession(context.Background(), classID)
		if err == nil && found {
			return state
		}
		if err != nil {
			log.Printf("load active classroom session from postgres: %v", err)
		}
	}
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
	if store := currentPostgres(); store != nil {
		state, found, err := store.tools(context.Background(), classID, nodeID)
		if err == nil && found {
			return state
		}
		if err != nil {
			log.Printf("load classroom tools from postgres: %v", err)
		}
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	return classroomToolsLocked(classID, nodeID)
}

func UpdateClassroomTools(request ClassroomToolUpdateRequest) (ClassroomToolState, error) {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	state := ClassroomTools(classID, nodeID)
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
	if store := currentPostgres(); store != nil {
		if err := store.saveTools(context.Background(), state); err != nil {
			return ClassroomToolState{}, fmt.Errorf("save classroom tools: %w", err)
		}
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	classroomMemory.tools[classroomKey(classID, nodeID)] = state
	return state, nil
}

func CreateClassroomSubmission(request ClassroomSubmissionRequest) (ClassroomSubmission, error) {
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

	if store := currentPostgres(); store != nil {
		if err := store.saveSubmission(context.Background(), submission); err != nil {
			return ClassroomSubmission{}, fmt.Errorf("save classroom submission: %w", err)
		}
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	key := classroomKey(classID, nodeID)
	classroomMemory.submissions[key] = append(classroomMemory.submissions[key], submission)
	return submission, nil
}

func ClassroomSubmissions(classID, nodeID string) []ClassroomSubmission {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	if store := currentPostgres(); store != nil {
		items, err := store.submissions(context.Background(), classID, nodeID)
		if err == nil {
			return items
		}
		log.Printf("load classroom submissions from postgres: %v", err)
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	items := make([]ClassroomSubmission, len(classroomMemory.submissions[classroomKey(classID, nodeID)]))
	copy(items, classroomMemory.submissions[classroomKey(classID, nodeID)])
	sort.Slice(items, func(i, j int) bool { return items[i].CreatedAt > items[j].CreatedAt })
	return items
}

func CreateClassroomExit(request ClassroomExitRequest) (ClassroomExit, error) {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	studentID := strings.TrimSpace(request.StudentID)
	if studentID == "" {
		return ClassroomExit{}, fmt.Errorf("studentId is required")
	}
	exit := ClassroomExit{
		ClassID:     classID,
		ID:          nextClassroomRecordID("EXIT"),
		NodeID:      nodeID,
		StudentID:   studentID,
		StudentName: displayStudentName(request.StudentName),
		CreatedAt:   time.Now().UnixMilli(),
	}
	if store := currentPostgres(); store != nil {
		if err := store.saveExit(context.Background(), exit); err != nil {
			return ClassroomExit{}, fmt.Errorf("save classroom exit: %w", err)
		}
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	key := classroomKey(classID, nodeID)
	classroomMemory.exits[key] = append(classroomMemory.exits[key], exit)
	return exit, nil
}

func ClassroomExits(classID, nodeID string) []ClassroomExit {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	if store := currentPostgres(); store != nil {
		items, err := store.exits(context.Background(), classID, nodeID)
		if err == nil {
			return items
		}
		log.Printf("load classroom exits from postgres: %v", err)
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	items := make([]ClassroomExit, len(classroomMemory.exits[classroomKey(classID, nodeID)]))
	copy(items, classroomMemory.exits[classroomKey(classID, nodeID)])
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
		return ClassroomAnalytics{
			ClassID:        classID,
			NodeID:         nodeID,
			TotalStudents:  0,
			Submitted:      0,
			SubmitRate:     "0.0%",
			AverageScore:   0,
			NeedsReview:    0,
			CommonMistakes: []ClassroomAnalyticsItem{},
			PriorityItems:  []ClassroomAnalyticsItem{},
			SuggestedFocus: []string{},
			UpdatedAt:      time.Now().UnixMilli(),
		}
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
	allSubmissions := make([]ClassroomSubmission, 0)
	if store := currentPostgres(); store != nil {
		items, err := store.submissionsForClass(context.Background(), classID)
		if err == nil {
			allSubmissions = items
		} else {
			log.Printf("load classroom portfolio from postgres: %v", err)
		}
	} else {
		classroomMemory.Lock()
		prefix := classID + "::"
		for key, submissions := range classroomMemory.submissions {
			if strings.HasPrefix(key, prefix) {
				allSubmissions = append(allSubmissions, submissions...)
			}
		}
		classroomMemory.Unlock()
	}
	nodes := map[string]*ClassroomNodePortfolio{}
	students := map[string]struct{}{}
	recent := make([]ClassroomSubmission, 0)
	scoreSum := 0
	total := 0

	for _, item := range allSubmissions {
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

func SelfStudyProgressData(classID, nodeID, studentID string) SelfStudyProgress {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	studentID = strings.TrimSpace(studentID)
	if store := currentPostgres(); store != nil {
		progress, found, err := store.selfStudy(context.Background(), classID, nodeID, studentID)
		if err == nil && found {
			return progress
		}
		if err != nil {
			log.Printf("load self-study progress from postgres: %v", err)
		}
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	return classroomMemory.selfStudy[selfStudyKey(classID, nodeID, studentID)]
}

func UpdateSelfStudyProgress(request SelfStudyProgressUpdateRequest) (SelfStudyProgress, error) {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	studentID := strings.TrimSpace(request.StudentID)
	if studentID == "" {
		return SelfStudyProgress{}, fmt.Errorf("studentId is required")
	}
	completedSteps := cleanSelfStudySteps(request.CompletedSteps)
	abilities := selfStudyAbilities(completedSteps)
	score := 0
	for _, ability := range abilities {
		score += ability.Score
	}
	if len(abilities) > 0 {
		score /= len(abilities)
	}
	existing := SelfStudyProgressData(classID, nodeID, studentID)
	startedAt := request.StartedAt
	if startedAt <= 0 {
		startedAt = existing.StartedAt
	}
	if startedAt <= 0 {
		startedAt = time.Now().UnixMilli()
	}
	timeSpentSeconds := request.TimeSpentSeconds
	if timeSpentSeconds < existing.TimeSpentSeconds {
		timeSpentSeconds = existing.TimeSpentSeconds
	}
	practiceAttempts := request.PracticeAttempts
	if practiceAttempts < existing.PracticeAttempts {
		practiceAttempts = existing.PracticeAttempts
	}
	practiceScore := request.PracticeScore
	if practiceScore < existing.PracticeScore {
		practiceScore = existing.PracticeScore
	}
	wrongKnowledgePoints := mergeUniqueStrings(existing.WrongKnowledgePoints, request.WrongKnowledgePoints)
	formalTestAttempts := request.FormalTestAttempts
	if formalTestAttempts < existing.FormalTestAttempts {
		formalTestAttempts = existing.FormalTestAttempts
	}
	firstScore := existing.FirstScore
	if existing.FormalTestAttempts == 0 && request.FormalTestAttempts > 0 {
		firstScore = request.FirstScore
	}
	bestScore := request.BestScore
	if bestScore < existing.BestScore {
		bestScore = existing.BestScore
	}
	latestScore := existing.LatestScore
	if request.FormalTestAttempts >= existing.FormalTestAttempts && request.FormalTestAttempts > 0 {
		latestScore = request.LatestScore
	}
	formalTestVersions := append([]SelfStudyTestAttempt(nil), existing.FormalTestVersions...)
	if request.FormalTestSubmission != nil && request.FormalTestAttempts > existing.FormalTestAttempts {
		submission := *request.FormalTestSubmission
		if strings.TrimSpace(submission.VersionID) == "" {
			return SelfStudyProgress{}, fmt.Errorf("formal test versionId is required")
		}
		if submission.Score < 0 || submission.Score > 100 {
			return SelfStudyProgress{}, fmt.Errorf("formal test score must be between 0 and 100")
		}
		submission.Attempt = len(formalTestVersions) + 1
		if submission.SubmittedAt <= 0 {
			submission.SubmittedAt = time.Now().UnixMilli()
		}
		if submission.ElapsedSeconds < 0 {
			submission.ElapsedSeconds = 0
		}
		submission.VersionID = strings.TrimSpace(submission.VersionID)
		submission.SingleAnswer = strings.TrimSpace(submission.SingleAnswer)
		submission.Sequence = cleanStringList(submission.Sequence)
		submission.Evidence = cleanStringList(submission.Evidence)
		submission.Conclusion = cleanStringList(submission.Conclusion)
		submission.WrongKnowledgePoints = cleanStringList(submission.WrongKnowledgePoints)
		formalTestVersions = append(formalTestVersions, submission)
	}
	testCompletedAt := request.TestCompletedAt
	if testCompletedAt < existing.TestCompletedAt {
		testCompletedAt = existing.TestCompletedAt
	}
	studentOutput := strings.TrimSpace(request.StudentOutput)
	if studentOutput == "" {
		studentOutput = existing.StudentOutput
	}
	outputSubmittedAt := request.OutputSubmittedAt
	if outputSubmittedAt < existing.OutputSubmittedAt {
		outputSubmittedAt = existing.OutputSubmittedAt
	}
	reviewStatus := strings.TrimSpace(request.ReviewStatus)
	if reviewStatus == "" {
		reviewStatus = existing.ReviewStatus
	}
	if reviewStatus == "" && len(completedSteps) >= 6 && practiceScore >= 100 && formalTestAttempts > 0 && outputSubmittedAt > 0 {
		reviewStatus = "待审核"
	}
	isResubmission := existing.ReviewStatus == "需修改" &&
		reviewStatus == "待审核" &&
		request.OutputSubmittedAt > existing.OutputSubmittedAt
	outputVersions := append([]SelfStudyOutputVersion(nil), existing.OutputVersions...)
	if request.OutputSubmittedAt > existing.OutputSubmittedAt && studentOutput != "" {
		outputVersions = append(outputVersions, SelfStudyOutputVersion{
			Version:       len(outputVersions) + 1,
			StudentOutput: studentOutput,
			SubmittedAt:   request.OutputSubmittedAt,
			ReviewStatus:  reviewStatus,
		})
	}
	reviewComment := strings.TrimSpace(request.ReviewComment)
	if isResubmission {
		reviewComment = ""
	} else if reviewComment == "" {
		reviewComment = existing.ReviewComment
	}
	certifiedAt := existing.CertifiedAt
	if isResubmission {
		certifiedAt = 0
	}
	progress := SelfStudyProgress{
		ClassID: classID, NodeID: nodeID, StudentID: studentID,
		StudentName: displayStudentName(request.StudentName), CompletedSteps: completedSteps,
		AbilityScore: score, Abilities: abilities, StartedAt: startedAt,
		TimeSpentSeconds: timeSpentSeconds, PracticeAttempts: practiceAttempts,
		PracticeScore: practiceScore, WrongKnowledgePoints: wrongKnowledgePoints,
		ReviewStatus: reviewStatus, FormalTestAttempts: formalTestAttempts,
		FirstScore: firstScore, BestScore: bestScore, LatestScore: latestScore,
		TestCompletedAt: testCompletedAt, StudentOutput: studentOutput,
		OutputSubmittedAt: outputSubmittedAt, ReviewComment: reviewComment,
		CertifiedAt: certifiedAt, OutputVersions: outputVersions,
		FormalTestVersions: formalTestVersions, UpdatedAt: time.Now().UnixMilli(),
	}
	if store := currentPostgres(); store != nil {
		if err := store.saveSelfStudy(context.Background(), progress); err != nil {
			return SelfStudyProgress{}, fmt.Errorf("save self-study progress: %w", err)
		}
	}
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	classroomMemory.selfStudy[selfStudyKey(classID, nodeID, studentID)] = progress
	return progress, nil
}

func ReviewSelfStudyProgress(request SelfStudyReviewRequest) (SelfStudyProgress, error) {
	classID := normalizeClassroomID(request.ClassID)
	nodeID := normalizeClassroomNodeID(request.NodeID)
	studentID := strings.TrimSpace(request.StudentID)
	if studentID == "" {
		return SelfStudyProgress{}, fmt.Errorf("studentId is required")
	}
	status := strings.TrimSpace(request.Status)
	if status != "需修改" && status != "已认证" {
		return SelfStudyProgress{}, fmt.Errorf("status must be 需修改 or 已认证")
	}
	progress := SelfStudyProgressData(classID, nodeID, studentID)
	if progress.StudentID == "" {
		return SelfStudyProgress{}, fmt.Errorf("self-study progress not found")
	}
	if progress.OutputSubmittedAt <= 0 || strings.TrimSpace(progress.StudentOutput) == "" {
		return SelfStudyProgress{}, fmt.Errorf("student output has not been submitted")
	}
	progress.ReviewStatus = status
	progress.ReviewComment = strings.TrimSpace(request.Comment)
	progress.CertifiedAt = 0
	reviewedAt := time.Now().UnixMilli()
	if status == "已认证" {
		progress.CertifiedAt = reviewedAt
	}
	if len(progress.OutputVersions) > 0 {
		latest := len(progress.OutputVersions) - 1
		progress.OutputVersions[latest].ReviewStatus = status
		progress.OutputVersions[latest].ReviewComment = progress.ReviewComment
		progress.OutputVersions[latest].ReviewedAt = reviewedAt
	}
	progress.UpdatedAt = reviewedAt
	if store := currentPostgres(); store != nil {
		if err := store.saveSelfStudy(context.Background(), progress); err != nil {
			return SelfStudyProgress{}, fmt.Errorf("save self-study review: %w", err)
		}
	}
	classroomMemory.Lock()
	classroomMemory.selfStudy[selfStudyKey(classID, nodeID, studentID)] = progress
	classroomMemory.Unlock()
	return progress, nil
}

func ResetDemoStudents(classID string) (DemoResetSummary, error) {
	classID = normalizeClassroomID(classID)
	demoStudents := map[string]struct{}{"student01": {}, "student02": {}, "student03": {}}
	if store := currentPostgres(); store != nil {
		if err := store.deleteDemoStudentData(context.Background(), classID, []string{"student01", "student02", "student03"}); err != nil {
			return DemoResetSummary{}, fmt.Errorf("reset demo students: %w", err)
		}
	}
	classroomMemory.Lock()
	for key, progress := range classroomMemory.selfStudy {
		if progress.ClassID == classID {
			if _, ok := demoStudents[progress.StudentID]; ok {
				delete(classroomMemory.selfStudy, key)
			}
		}
	}
	classroomMemory.Unlock()

	now := time.Now().UnixMilli()
	returned, err := UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
		ClassID: classID, NodeID: "P1T1-N01", StudentID: "student02", StudentName: "陈同学",
		CompletedSteps: []string{"problem", "visual", "steps", "correction", "exercise", "output"},
		StartedAt:      now - 900000, TimeSpentSeconds: 720, PracticeAttempts: 2, PracticeScore: 100,
		WrongKnowledgePoints: []string{"证据来源", "判断边界"}, FormalTestAttempts: 1,
		FirstScore: 72, BestScore: 72, LatestScore: 72, TestCompletedAt: now - 300000,
		FormalTestSubmission: &SelfStudyTestAttempt{
			VersionID: "FORM-P1T1-N01-2026.08-v1-A1", SubmittedAt: now - 300000, ElapsedSeconds: 680, Score: 72,
			SingleAnswer: "记录站址与机房位置", Sequence: []string{"确认对象", "采集照片", "补充日志"},
			Evidence: []string{"现场照片"}, Conclusion: []string{"任务对象", "关键证据"},
			WrongKnowledgePoints: []string{"证据来源", "判断边界"},
		},
		StudentOutput: "已记录站址、楼层和机房边界，待补充照片与日志来源。", OutputSubmittedAt: now - 240000,
	})
	if err != nil {
		return DemoResetSummary{}, err
	}
	if _, err := ReviewSelfStudyProgress(SelfStudyReviewRequest{
		ClassID: classID, NodeID: returned.NodeID, StudentID: returned.StudentID,
		Status: "需修改", Comment: "请补充照片编号、日志来源和采集时间，再说明判断边界。",
	}); err != nil {
		return DemoResetSummary{}, err
	}

	nodeIDs := []string{
		"P1T1-N01", "P1T1-N02", "P1T1-N03", "P1T1-N04",
		"P1T2-N01", "P1T2-N02", "P1T2-N03", "P1T2-N04",
		"P1T3-N01", "P1T3-N02", "P1T3-N03", "P1T3-N04",
	}
	for index, nodeID := range nodeIDs {
		score := 88 + index%4*3
		outputSubmittedAt := now - int64(1800000-index*30000)
		progress, updateErr := UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
			ClassID: classID, NodeID: nodeID, StudentID: "student03", StudentName: "王同学",
			CompletedSteps: []string{"problem", "visual", "steps", "correction", "exercise", "output"},
			StartedAt:      now - int64(7200000-index*120000), TimeSpentSeconds: 840 + index*30,
			PracticeAttempts: 1, PracticeScore: 100, FormalTestAttempts: 1,
			FirstScore: score, BestScore: score, LatestScore: score, TestCompletedAt: now - int64(3600000-index*60000),
			FormalTestSubmission: &SelfStudyTestAttempt{
				VersionID: fmt.Sprintf("FORM-%s-2026.08-v1-A1", nodeID), SubmittedAt: now - int64(3600000-index*60000),
				ElapsedSeconds: 540 + index*10, Score: score, SingleAnswer: "按任务边界读取并核验对象",
				Sequence: []string{"明确对象", "读取证据", "执行判断", "形成记录"},
				Evidence: []string{"现场照片", "采集日志"}, Conclusion: []string{"任务对象", "关键证据", "判断边界", "后续动作"},
			},
			StudentOutput:     fmt.Sprintf("%s 已形成可追溯的现场对象、证据来源与职业判断记录。", nodeID),
			OutputSubmittedAt: outputSubmittedAt,
		})
		if updateErr != nil {
			return DemoResetSummary{}, updateErr
		}
		if nodeID == "P1T1-N02" {
			if _, reviewErr := ReviewSelfStudyProgress(SelfStudyReviewRequest{
				ClassID: classID, NodeID: nodeID, StudentID: progress.StudentID,
				Status: "需修改", Comment: "补拍设备柜位与端口同框照片，并标明日志来源。",
			}); reviewErr != nil {
				return DemoResetSummary{}, reviewErr
			}
			progress, updateErr = UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
				ClassID: classID, NodeID: nodeID, StudentID: progress.StudentID, StudentName: progress.StudentName,
				CompletedSteps: progress.CompletedSteps, StartedAt: progress.StartedAt, TimeSpentSeconds: progress.TimeSpentSeconds,
				PracticeAttempts: progress.PracticeAttempts, PracticeScore: progress.PracticeScore,
				WrongKnowledgePoints: progress.WrongKnowledgePoints, ReviewStatus: "待审核",
				FormalTestAttempts: progress.FormalTestAttempts, FirstScore: progress.FirstScore, BestScore: progress.BestScore,
				LatestScore: progress.LatestScore, TestCompletedAt: progress.TestCompletedAt,
				StudentOutput:     nodeID + " 已补充设备柜位、端口同框照片与日志来源，证据缺口已关闭。",
				OutputSubmittedAt: outputSubmittedAt + 15000,
			})
			if updateErr != nil {
				return DemoResetSummary{}, updateErr
			}
		}
		if _, reviewErr := ReviewSelfStudyProgress(SelfStudyReviewRequest{
			ClassID: classID, NodeID: nodeID, StudentID: progress.StudentID,
			Status: "已认证", Comment: func() string {
				if nodeID == "P1T1-N02" {
					return "v2 已关闭设备位置与日志来源缺口，证据链完整。"
				}
				return "证据完整、结论有边界，已认证为项目成果证据。"
			}(),
		}); reviewErr != nil {
			return DemoResetSummary{}, reviewErr
		}
	}

	return DemoResetSummary{
		ClassID: classID, ResetStudents: 3, SeededRecords: len(nodeIDs) + 1,
		CompletedRecords: len(nodeIDs), UpdatedAt: time.Now().UnixMilli(),
	}, nil
}

func SelfStudyAnalyticsData(classID, nodeID string) SelfStudyAnalytics {
	classID = normalizeClassroomID(classID)
	nodeID = normalizeClassroomNodeID(nodeID)
	cards := make([]SelfStudyProgress, 0)
	if store := currentPostgres(); store != nil {
		items, err := store.selfStudyForNode(context.Background(), classID, nodeID)
		if err == nil {
			cards = items
		} else {
			log.Printf("load self-study analytics from postgres: %v", err)
		}
	} else {
		classroomMemory.Lock()
		prefix := classID + "::" + nodeID + "::"
		for key, item := range classroomMemory.selfStudy {
			if strings.HasPrefix(key, prefix) {
				cards = append(cards, item)
			}
		}
		classroomMemory.Unlock()
	}
	scoreSum := 0
	durationSum := 0
	completed := 0
	needsSupport := 0
	weakAbilityCounts := map[string]int{}
	studentIDs := map[string]struct{}{}
	accuracyScoreSum := 0
	accuracySamples := 0
	retries := 0
	errorCounts := map[string]int{}
	for _, item := range cards {
		studentIDs[item.StudentID] = struct{}{}
		scoreSum += item.AbilityScore
		durationSum += item.TimeSpentSeconds
		if len(item.CompletedSteps) >= 6 && item.PracticeScore >= 100 && item.FormalTestAttempts > 0 && item.OutputSubmittedAt > 0 {
			completed++
		}
		if item.AbilityScore < 60 || (item.PracticeAttempts > 0 && item.PracticeScore < 100) || (item.FormalTestAttempts > 0 && item.BestScore < 60) || item.ReviewStatus == "需修改" {
			needsSupport++
		}
		if item.FormalTestAttempts > 0 {
			accuracyScoreSum += item.LatestScore
			accuracySamples++
			if item.FormalTestAttempts > 1 {
				retries += item.FormalTestAttempts - 1
			}
		} else if item.PracticeAttempts > 0 {
			accuracyScoreSum += item.PracticeScore
			accuracySamples++
			if item.PracticeAttempts > 1 {
				retries += item.PracticeAttempts - 1
			}
		}
		for _, point := range item.WrongKnowledgePoints {
			errorCounts[point]++
		}
		for _, ability := range item.Abilities {
			if ability.Score < 100 {
				weakAbilityCounts[ability.Label]++
			}
		}
	}
	sort.Slice(cards, func(i, j int) bool { return cards[i].UpdatedAt > cards[j].UpdatedAt })
	average := 0
	if len(cards) > 0 {
		average = scoreSum / len(cards)
	}
	averageDuration := 0
	if len(cards) > 0 {
		averageDuration = durationSum / len(cards)
	}
	submissions := ClassroomSubmissions(classID, nodeID)
	attempts := map[string]int{}
	for _, item := range submissions {
		studentIDs[item.StudentID] = struct{}{}
		accuracyScoreSum += item.Score
		accuracySamples++
		attemptKey := item.StudentID + "::" + item.TaskID
		attempts[attemptKey]++
		for _, tag := range item.Tags {
			errorCounts[tag]++
		}
	}
	accuracy := 0
	if accuracySamples > 0 {
		accuracy = accuracyScoreSum / accuracySamples
	}
	for _, count := range attempts {
		if count > 1 {
			retries += count - 1
		}
	}
	return SelfStudyAnalytics{
		ClassID: classID, NodeID: nodeID, Students: len(studentIDs), Completed: completed,
		AverageAbility: average, AverageAccuracy: accuracy, AverageDurationSeconds: averageDuration,
		TotalRetries: retries, NeedsSupport: needsSupport, TypicalErrors: analyticsItemsFromCounts(errorCounts),
		WeakAbilities: analyticsItemsFromCounts(weakAbilityCounts), Engagement: LearningEngagementWithProgress(classID, nodeID, cards),
		Cards: cards, UpdatedAt: time.Now().UnixMilli(),
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

func selfStudyKey(classID, nodeID, studentID string) string {
	return classID + "::" + nodeID + "::" + studentID
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

func cleanSelfStudySteps(values []string) []string {
	allowed := map[string]bool{"problem": true, "visual": true, "steps": true, "correction": true, "exercise": true, "output": true}
	steps := make([]string, 0, 6)
	seen := map[string]bool{}
	for _, value := range values {
		value = strings.ToLower(strings.TrimSpace(value))
		if allowed[value] && !seen[value] {
			seen[value] = true
			steps = append(steps, value)
		}
	}
	return steps
}

func selfStudyAbilities(steps []string) []SelfStudyAbility {
	completed := map[string]bool{}
	for _, step := range steps {
		completed[step] = true
	}
	ability := func(label string, requirements ...string) SelfStudyAbility {
		count := 0
		for _, requirement := range requirements {
			if completed[requirement] {
				count++
			}
		}
		score := count * 100 / len(requirements)
		status := "待开始"
		if score == 100 {
			status = "已达成"
		} else if score > 0 {
			status = "进行中"
		}
		return SelfStudyAbility{Label: label, Score: score, Status: status}
	}
	return []SelfStudyAbility{
		ability("场景理解", "problem", "visual"),
		ability("流程执行", "steps", "correction"),
		ability("证据判断", "visual", "exercise"),
		ability("结论表达", "exercise", "output"),
	}
}

func mergeUniqueStrings(groups ...[]string) []string {
	seen := map[string]bool{}
	merged := []string{}
	for _, values := range groups {
		for _, value := range values {
			value = strings.TrimSpace(value)
			if value != "" && !seen[value] {
				seen[value] = true
				merged = append(merged, value)
			}
		}
	}
	return merged
}

func cleanStringList(values []string) []string {
	cleaned := make([]string, 0, len(values))
	for _, value := range values {
		if value = strings.TrimSpace(value); value != "" {
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
