package httpapi

import (
	"testing"
	"time"
)

func TestClassroomPresenceTracksReceipt(t *testing.T) {
	hub := newClassroomHub()
	now := time.Now().UnixMilli()
	teacher := &classroomClient{classID: "通信2301班", role: "teacher", deviceID: "teacher-1", name: "张老师", connectedAt: now, lastSeenAt: now, send: make(chan []byte, 8), done: make(chan struct{})}
	student := &classroomClient{classID: "通信2301班", role: "student", deviceID: "student-1", name: "王同学", connectedAt: now, lastSeenAt: now, send: make(chan []byte, 8), done: make(chan struct{})}
	hub.add(teacher)
	hub.add(student)
	hub.touch(student, []byte(`{"type":"receipt","nodeId":"P1T1-N02","updatedAt":12345}`))

	presence := hub.presence("通信2301班")
	if presence.Students != 1 || presence.Teachers != 1 || len(presence.Devices) != 2 {
		t.Fatalf("unexpected presence: %#v", presence)
	}
	var received classroomPresenceDevice
	for _, device := range presence.Devices {
		if device.DeviceID == "student-1" {
			received = device
		}
	}
	if received.ReceivedNodeID != "P1T1-N02" || received.ReceivedUpdateAt != 12345 {
		t.Fatalf("receipt not tracked: %#v", received)
	}
}
