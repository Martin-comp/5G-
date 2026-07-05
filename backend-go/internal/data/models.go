package data

type CourseStat struct {
	Label string `json:"label"`
	Value string `json:"value"`
	Note  string `json:"note"`
}

type Project struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"`
	Note   string `json:"note"`
}

type Task struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Desc   string `json:"desc"`
	Active bool   `json:"active,omitempty"`
}

type Metric struct {
	Label  string `json:"label"`
	Value  string `json:"value"`
	Target string `json:"target"`
	Status string `json:"status"`
	Tone   string `json:"tone"`
}

type GraphNode struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Active bool   `json:"active,omitempty"`
}

type ResourceCard struct {
	Title string `json:"title"`
	Desc  string `json:"desc"`
}

type TeacherSuggestion struct {
	Title string `json:"title"`
	Desc  string `json:"desc"`
}

type CourseOverview struct {
	Title     string       `json:"title"`
	Subtitle  string       `json:"subtitle"`
	Stats     []CourseStat `json:"stats"`
	Projects  []Project    `json:"projects"`
	MainRoute []string     `json:"mainRoute"`
}

type ProjectDetail struct {
	Project       Project  `json:"project"`
	CurrentTask   string   `json:"currentTask"`
	Tasks         []Task   `json:"tasks"`
	EvidenceFlow  []string `json:"evidenceFlow"`
	NextProjectID string   `json:"nextProjectId"`
}

type TaskDetail struct {
	ID             string         `json:"id"`
	Title          string         `json:"title"`
	Question       string         `json:"question"`
	RoutePoints    []string       `json:"routePoints"`
	Conclusion     string         `json:"conclusion"`
	Metrics        []Metric       `json:"metrics"`
	ClassroomTasks []string       `json:"classroomTasks"`
	Resources      []ResourceCard `json:"resources"`
}

type GraphDetail struct {
	Nodes         []GraphNode    `json:"nodes"`
	LocalTaskID   string         `json:"localTaskId"`
	LocalNodes    []Task         `json:"localNodes"`
	ResourceCards []ResourceCard `json:"resourceCards"`
}

type SubmissionRequest struct {
	TaskID     string `json:"taskId"`
	StudentID  string `json:"studentId"`
	Answer     string `json:"answer"`
	Evidence   string `json:"evidence,omitempty"`
	Conclusion string `json:"conclusion,omitempty"`
}

type SubmissionResponse struct {
	ID      string `json:"id"`
	Status  string `json:"status"`
	Message string `json:"message"`
}

type AIHintRequest struct {
	ProjectID        string   `json:"projectId"`
	TaskID           string   `json:"taskId"`
	Step             string   `json:"step"`
	SelectedNode     string   `json:"selectedNode"`
	SelectedEvidence []string `json:"selectedEvidence"`
	Score            int      `json:"score"`
}

type AIHintResponse struct {
	Provider string   `json:"provider"`
	Mode     string   `json:"mode"`
	Hint     string   `json:"hint"`
	Next     string   `json:"next"`
	Tags     []string `json:"tags"`
}

type AIChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type AIChatRequest struct {
	ProjectID        string          `json:"projectId"`
	TaskID           string          `json:"taskId"`
	Question         string          `json:"question"`
	SelectedNode     string          `json:"selectedNode"`
	SelectedEvidence []string        `json:"selectedEvidence"`
	Score            int             `json:"score"`
	History          []AIChatMessage `json:"history"`
}

type AIChatResponse struct {
	Provider string `json:"provider"`
	Mode     string `json:"mode"`
	Answer   string `json:"answer"`
}
