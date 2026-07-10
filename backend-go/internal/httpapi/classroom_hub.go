package httpapi

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type classroomRealtimeEvent struct {
	Type      string `json:"type"`
	ClassID   string `json:"classId"`
	NodeID    string `json:"nodeId,omitempty"`
	UpdatedAt int64  `json:"updatedAt"`
}

type classroomClient struct {
	classID string
	role    string
	conn    *websocket.Conn
	send    chan []byte
	done    chan struct{}
}

type classroomHub struct {
	mu      sync.RWMutex
	classes map[string]map[*classroomClient]struct{}
}

func newClassroomHub() *classroomHub {
	return &classroomHub{classes: map[string]map[*classroomClient]struct{}{}}
}

func (h *classroomHub) serveWS(w http.ResponseWriter, r *http.Request) {
	classID := normalizeClassID(r.URL.Query().Get("classId"))
	role := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("role")))
	if role != "teacher" {
		role = "student"
	}

	upgrader := websocket.Upgrader{CheckOrigin: func(*http.Request) bool { return true }}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	client := &classroomClient{classID: classID, role: role, conn: conn, send: make(chan []byte, 16), done: make(chan struct{})}
	h.add(client)
	h.broadcast(classID, classroomRealtimeEvent{Type: "classroom-presence", ClassID: classID, UpdatedAt: time.Now().UnixMilli()})

	go func() {
		defer func() {
			h.remove(client)
			_ = conn.Close()
			h.broadcast(classID, classroomRealtimeEvent{Type: "classroom-presence", ClassID: classID, UpdatedAt: time.Now().UnixMilli()})
		}()
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				return
			}
		}
	}()

	for {
		select {
		case <-client.done:
			return
		case message := <-client.send:
			if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		}
	}
}

func (h *classroomHub) add(client *classroomClient) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.classes[client.classID] == nil {
		h.classes[client.classID] = map[*classroomClient]struct{}{}
	}
	h.classes[client.classID][client] = struct{}{}
}

func (h *classroomHub) remove(client *classroomClient) {
	h.mu.Lock()
	defer h.mu.Unlock()
	clients := h.classes[client.classID]
	delete(clients, client)
	if len(clients) == 0 {
		delete(h.classes, client.classID)
	}
	close(client.done)
}

func (h *classroomHub) broadcast(classID string, event classroomRealtimeEvent) {
	message, err := json.Marshal(event)
	if err != nil {
		return
	}
	h.mu.RLock()
	clients := make([]*classroomClient, 0, len(h.classes[classID]))
	for client := range h.classes[classID] {
		clients = append(clients, client)
	}
	h.mu.RUnlock()
	for _, client := range clients {
		select {
		case client.send <- message:
		default:
		}
	}
}

func normalizeClassID(classID string) string {
	classID = strings.TrimSpace(classID)
	if classID == "" {
		return "通信2301班"
	}
	return classID
}
