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
}

func NewServer() *Server {
	server := &Server{mux: http.NewServeMux()}
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
}

func (s *Server) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"status": "ok",
		"service": "5g-digital-textbook-backend",
		"time": time.Now().Format(time.RFC3339),
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
		"project": project,
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
		ID: fmt.Sprintf("SUB-%d", time.Now().UnixMilli()),
		Status: "received",
		Message: "作答已接收，等待教师讲评。",
	}
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
