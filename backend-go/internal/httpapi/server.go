package httpapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"digital-textbook-backend/internal/data"
)

type Server struct {
	mux *http.ServeMux
	hub *classroomHub
}

func NewServer() *Server {
	server := &Server{mux: http.NewServeMux(), hub: newClassroomHub()}
	server.routes()
	return server
}

func (s *Server) Handler() http.Handler {
	return withCORS(s.mux)
}

func (s *Server) routes() {
	s.mux.HandleFunc("GET /api/health", s.health)
	s.mux.HandleFunc("GET /api/course/overview", s.courseOverview)
	s.mux.HandleFunc("GET /api/projects/{projectId}", s.projectDetail)
	s.mux.HandleFunc("GET /api/tasks/{taskId}", s.taskDetail)
	s.mux.HandleFunc("GET /api/graph/course", s.graphCourse)
	s.mux.HandleFunc("GET /api/teacher/tasks/{taskId}/suggestions", s.teacherSuggestions)
	s.mux.HandleFunc("GET /api/teacher/suggestions", s.teacherSuggestions)
	s.mux.HandleFunc("POST /api/submissions", s.createSubmission)
	s.mux.HandleFunc("GET /api/classroom/session", s.classroomSession)
	s.mux.HandleFunc("POST /api/classroom/session", s.updateClassroomSession)
	s.mux.HandleFunc("GET /api/classroom/active", s.activeClassroomSession)
	s.mux.HandleFunc("GET /api/classroom/ws", s.classroomWebSocket)
	s.mux.HandleFunc("GET /api/classroom/tools", s.classroomTools)
	s.mux.HandleFunc("POST /api/classroom/tools", s.updateClassroomTools)
	s.mux.HandleFunc("GET /api/classroom/submissions", s.classroomSubmissions)
	s.mux.HandleFunc("POST /api/classroom/submissions", s.createClassroomSubmission)
	s.mux.HandleFunc("GET /api/classroom/exits", s.classroomExits)
	s.mux.HandleFunc("POST /api/classroom/exits", s.createClassroomExit)
	s.mux.HandleFunc("GET /api/classroom/analytics", s.classroomAnalytics)
	s.mux.HandleFunc("GET /api/classroom/portfolio", s.classroomLearningPortfolio)
	s.mux.HandleFunc("GET /api/self-study/progress", s.selfStudyProgress)
	s.mux.HandleFunc("POST /api/self-study/progress", s.updateSelfStudyProgress)
	s.mux.HandleFunc("POST /api/self-study/review", s.reviewSelfStudyProgress)
	s.mux.HandleFunc("GET /api/self-study/analytics", s.selfStudyAnalytics)
	s.mux.HandleFunc("GET /api/classroom/poll", s.classroomPoll)
	s.mux.HandleFunc("POST /api/classroom/poll", s.createClassroomPollResponse)
	s.mux.HandleFunc("GET /api/classroom/discussion", s.classroomDiscussion)
	s.mux.HandleFunc("POST /api/classroom/discussion", s.createClassroomDiscussionMessage)
	s.mux.HandleFunc("GET /api/classroom/groups", s.classroomGroups)
	s.mux.HandleFunc("POST /api/classroom/groups", s.createClassroomGroupResponse)
	s.mux.HandleFunc("POST /api/ai/hint", s.aiHint)
	s.mux.HandleFunc("POST /api/ai/chat", s.aiChat)
	s.mux.HandleFunc("POST /api/ai/study-insight", s.aiStudyInsight)
	s.mux.HandleFunc("POST /api/tts", s.textToSpeech)
}

func (s *Server) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"status":  "ok",
		"service": "5g-digital-textbook-backend",
		"storage": data.StorageMode(),
		"time":    time.Now().Format(time.RFC3339),
	})
}

func (s *Server) courseOverview(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.CourseOverviewData())
}

func (s *Server) projectDetail(w http.ResponseWriter, r *http.Request) {
	projectID := r.PathValue("projectId")
	detail, ok := data.ProjectDetailData(projectID)
	if !ok {
		writeError(w, http.StatusNotFound, "project not found")
		return
	}
	writeJSON(w, http.StatusOK, detail)
}

func (s *Server) taskDetail(w http.ResponseWriter, r *http.Request) {
	taskID := r.PathValue("taskId")
	writeJSON(w, http.StatusOK, data.TaskDetailData(taskID))
}

func (s *Server) graphCourse(w http.ResponseWriter, r *http.Request) {
	projectID := r.URL.Query().Get("project")
	if strings.TrimSpace(projectID) == "" {
		projectID = "P4"
	}
	detail, ok := data.GraphDetailData(projectID)
	if !ok {
		writeError(w, http.StatusNotFound, "project graph not found")
		return
	}
	writeJSON(w, http.StatusOK, detail)
}

func (s *Server) teacherSuggestions(w http.ResponseWriter, r *http.Request) {
	projectID := r.URL.Query().Get("project")
	if strings.TrimSpace(projectID) == "" {
		projectID = "P4"
	}
	project, ok := data.FindProject(projectID)
	if !ok {
		writeError(w, http.StatusNotFound, "project not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"project":     project,
		"suggestions": data.TeacherSuggestions,
	})
}

func (s *Server) createSubmission(w http.ResponseWriter, r *http.Request) {
	var request data.SubmissionRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	if strings.TrimSpace(request.TaskID) == "" || strings.TrimSpace(request.Answer) == "" {
		writeError(w, http.StatusBadRequest, "taskId and answer are required")
		return
	}
	response := data.SubmissionResponse{
		ID:      fmt.Sprintf("SUB-%d", time.Now().UnixMilli()),
		Status:  "received",
		Message: "作答已接收，等待教师讲评。",
	}
	writeJSON(w, http.StatusCreated, response)
}

func (s *Server) classroomSession(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ClassroomSession(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId")))
}

func (s *Server) updateClassroomSession(w http.ResponseWriter, r *http.Request) {
	var request data.ClassroomSessionUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	state, err := data.UpdateClassroomSession(request)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	s.hub.broadcast(state.ClassID, classroomRealtimeEvent{Type: "classroom-session", ClassID: state.ClassID, NodeID: state.NodeID, UpdatedAt: state.UpdatedAt})
	writeJSON(w, http.StatusOK, state)
}

func (s *Server) activeClassroomSession(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ActiveClassroomSession(r.URL.Query().Get("classId")))
}

func (s *Server) classroomWebSocket(w http.ResponseWriter, r *http.Request) {
	s.hub.serveWS(w, r)
}

func (s *Server) classroomTools(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ClassroomTools(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId")))
}

func (s *Server) updateClassroomTools(w http.ResponseWriter, r *http.Request) {
	var request data.ClassroomToolUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	state, err := data.UpdateClassroomTools(request)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	s.hub.broadcast(state.ClassID, classroomRealtimeEvent{Type: "classroom-tools", ClassID: state.ClassID, NodeID: state.NodeID, UpdatedAt: state.UpdatedAt})
	writeJSON(w, http.StatusOK, state)
}

func (s *Server) classroomSubmissions(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ClassroomSubmissions(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId")))
}

func (s *Server) createClassroomSubmission(w http.ResponseWriter, r *http.Request) {
	var request data.ClassroomSubmissionRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	if strings.TrimSpace(request.TaskID) == "" {
		writeError(w, http.StatusBadRequest, "taskId is required")
		return
	}
	if strings.TrimSpace(request.Answer) == "" && strings.TrimSpace(request.Conclusion) == "" && len(request.Evidence) == 0 {
		writeError(w, http.StatusBadRequest, "answer, conclusion or evidence is required")
		return
	}
	submission, err := data.CreateClassroomSubmission(request)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	s.hub.broadcast(submission.ClassID, classroomRealtimeEvent{Type: "classroom-submission", ClassID: submission.ClassID, NodeID: submission.NodeID, UpdatedAt: submission.CreatedAt})
	writeJSON(w, http.StatusCreated, submission)
}

func (s *Server) classroomExits(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ClassroomExits(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId")))
}

func (s *Server) createClassroomExit(w http.ResponseWriter, r *http.Request) {
	var request data.ClassroomExitRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	exit, err := data.CreateClassroomExit(request)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	s.hub.broadcast(exit.ClassID, classroomRealtimeEvent{Type: "classroom-exit", ClassID: exit.ClassID, NodeID: exit.NodeID, UpdatedAt: exit.CreatedAt})
	writeJSON(w, http.StatusCreated, exit)
}

func (s *Server) classroomAnalytics(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ClassroomAnalyticsData(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId")))
}

func (s *Server) classroomLearningPortfolio(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ClassroomLearningPortfolioData(r.URL.Query().Get("classId")))
}

func (s *Server) selfStudyProgress(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.SelfStudyProgressData(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId"), r.URL.Query().Get("studentId")))
}

func (s *Server) updateSelfStudyProgress(w http.ResponseWriter, r *http.Request) {
	var request data.SelfStudyProgressUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	progress, err := data.UpdateSelfStudyProgress(request)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	s.hub.broadcast(progress.ClassID, classroomRealtimeEvent{Type: "self-study-progress", ClassID: progress.ClassID, NodeID: progress.NodeID, UpdatedAt: progress.UpdatedAt})
	writeJSON(w, http.StatusOK, progress)
}

func (s *Server) selfStudyAnalytics(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.SelfStudyAnalyticsData(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId")))
}

func (s *Server) reviewSelfStudyProgress(w http.ResponseWriter, r *http.Request) {
	var request data.SelfStudyReviewRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	progress, err := data.ReviewSelfStudyProgress(request)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	s.hub.broadcast(progress.ClassID, classroomRealtimeEvent{Type: "self-study-review", ClassID: progress.ClassID, NodeID: progress.NodeID, UpdatedAt: progress.UpdatedAt})
	writeJSON(w, http.StatusOK, progress)
}

func (s *Server) classroomPoll(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ClassroomPollData(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId")))
}

func (s *Server) createClassroomPollResponse(w http.ResponseWriter, r *http.Request) {
	var request data.ClassroomPollResponseRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	response, err := data.CreateClassroomPollResponse(request)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	s.hub.broadcast(response.ClassID, classroomRealtimeEvent{Type: "classroom-poll", ClassID: response.ClassID, NodeID: response.NodeID, UpdatedAt: response.CreatedAt})
	writeJSON(w, http.StatusCreated, response)
}

func (s *Server) classroomDiscussion(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ClassroomDiscussionMessages(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId")))
}

func (s *Server) createClassroomDiscussionMessage(w http.ResponseWriter, r *http.Request) {
	var request data.ClassroomDiscussionMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	message, err := data.CreateClassroomDiscussionMessage(request)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	s.hub.broadcast(message.ClassID, classroomRealtimeEvent{Type: "classroom-discussion", ClassID: message.ClassID, NodeID: message.NodeID, UpdatedAt: message.CreatedAt})
	writeJSON(w, http.StatusCreated, message)
}

func (s *Server) classroomGroups(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, data.ClassroomGroupResponses(r.URL.Query().Get("classId"), r.URL.Query().Get("nodeId")))
}

func (s *Server) createClassroomGroupResponse(w http.ResponseWriter, r *http.Request) {
	var request data.ClassroomGroupResponseRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	response, err := data.CreateClassroomGroupResponse(request)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	s.hub.broadcast(response.ClassID, classroomRealtimeEvent{Type: "classroom-group", ClassID: response.ClassID, NodeID: response.NodeID, UpdatedAt: response.CreatedAt})
	writeJSON(w, http.StatusCreated, response)
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
