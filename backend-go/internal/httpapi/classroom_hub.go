package httpapi

import (
	"encoding/json"
	"net/http"
	"sort"
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
	classID          string
	role             string
	deviceID         string
	name             string
	connectedAt      int64
	lastSeenAt       int64
	receivedNodeID   string
	receivedUpdateAt int64
	conn             *websocket.Conn
	send             chan []byte
	done             chan struct{}
}

type classroomPresenceDevice struct {
	DeviceID         string `json:"deviceId"`
	Name             string `json:"name"`
	Role             string `json:"role"`
	ConnectedAt      int64  `json:"connectedAt"`
	LastSeenAt       int64  `json:"lastSeenAt"`
	ReceivedNodeID   string `json:"receivedNodeId"`
	ReceivedUpdateAt int64  `json:"receivedUpdateAt"`
}

type classroomPresence struct {
	ClassID   string                    `json:"classId"`
	Students  int                       `json:"students"`
	Teachers  int                       `json:"teachers"`
	Devices   []classroomPresenceDevice `json:"devices"`
	UpdatedAt int64                     `json:"updatedAt"`
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
	deviceID := strings.TrimSpace(r.URL.Query().Get("deviceId"))
	if deviceID == "" {
		deviceID = role + "-" + time.Now().Format("150405.000")
	}
	name := strings.TrimSpace(r.URL.Query().Get("name"))
	if name == "" {
		if role == "teacher" {
			name = "教师端"
		} else {
			name = "学生端"
		}
	}

	upgrader := websocket.Upgrader{CheckOrigin: func(*http.Request) bool { return true }}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	now := time.Now().UnixMilli()
	client := &classroomClient{
		classID: classID, role: role, deviceID: deviceID, name: name,
		connectedAt: now, lastSeenAt: now, conn: conn, send: make(chan []byte, 16), done: make(chan struct{}),
	}
	h.add(client)
	h.broadcast(classID, classroomRealtimeEvent{Type: "classroom-presence", ClassID: classID, UpdatedAt: time.Now().UnixMilli()})

	go func() {
		defer func() {
			h.remove(client)
			_ = conn.Close()
			h.broadcast(classID, classroomRealtimeEvent{Type: "classroom-presence", ClassID: classID, UpdatedAt: time.Now().UnixMilli()})
		}()
		for {
			if _, message, err := conn.ReadMessage(); err != nil {
				return
			} else {
				h.touch(client, message)
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

func (h *classroomHub) touch(client *classroomClient, message []byte) {
	now := time.Now().UnixMilli()
	var receipt struct {
		Type      string `json:"type"`
		NodeID    string `json:"nodeId"`
		UpdatedAt int64  `json:"updatedAt"`
	}
	_ = json.Unmarshal(message, &receipt)
	h.mu.Lock()
	client.lastSeenAt = now
	nodeID := client.receivedNodeID
	if receipt.Type == "receipt" && strings.TrimSpace(receipt.NodeID) != "" {
		client.receivedNodeID = strings.ToUpper(strings.TrimSpace(receipt.NodeID))
		client.receivedUpdateAt = receipt.UpdatedAt
		if client.receivedUpdateAt == 0 {
			client.receivedUpdateAt = now
		}
		nodeID = client.receivedNodeID
	}
	h.mu.Unlock()
	if receipt.Type == "receipt" {
		h.broadcast(client.classID, classroomRealtimeEvent{Type: "classroom-presence", ClassID: client.classID, NodeID: nodeID, UpdatedAt: now})
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

func (h *classroomHub) presence(classID string) classroomPresence {
	classID = normalizeClassID(classID)
	h.mu.RLock()
	devicesByID := map[string]classroomPresenceDevice{}
	for client := range h.classes[classID] {
		key := client.role + "::" + client.deviceID
		device := classroomPresenceDevice{
			DeviceID: client.deviceID, Name: client.name, Role: client.role,
			ConnectedAt: client.connectedAt, LastSeenAt: client.lastSeenAt,
			ReceivedNodeID: client.receivedNodeID, ReceivedUpdateAt: client.receivedUpdateAt,
		}
		if existing, ok := devicesByID[key]; !ok || device.LastSeenAt > existing.LastSeenAt {
			devicesByID[key] = device
		}
	}
	h.mu.RUnlock()

	presence := classroomPresence{ClassID: classID, Devices: make([]classroomPresenceDevice, 0, len(devicesByID)), UpdatedAt: time.Now().UnixMilli()}
	for _, device := range devicesByID {
		presence.Devices = append(presence.Devices, device)
		if device.Role == "teacher" {
			presence.Teachers++
		} else {
			presence.Students++
		}
	}
	sort.Slice(presence.Devices, func(i, j int) bool {
		if presence.Devices[i].Role != presence.Devices[j].Role {
			return presence.Devices[i].Role < presence.Devices[j].Role
		}
		return presence.Devices[i].Name < presence.Devices[j].Name
	})
	return presence
}

func normalizeClassID(classID string) string {
	classID = strings.TrimSpace(classID)
	if classID == "" {
		return "通信2301班"
	}
	return classID
}
