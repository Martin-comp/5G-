package data

import (
	"testing"
	"time"
)

func TestLearningEventsAndEngagement(t *testing.T) {
	ClosePostgres()
	learningEventState.Lock()
	learningEventState.items = []LearningEvent{}
	learningEventState.Unlock()

	create := func(studentID, studentName, eventType, sectionID string) {
		t.Helper()
		if _, err := CreateLearningEvent(LearningEventRequest{
			ClassID: "通信2301班", NodeID: "P1T1-N01", StudentID: studentID,
			StudentName: studentName, EventType: eventType, SectionID: sectionID,
		}); err != nil {
			t.Fatalf("create learning event: %v", err)
		}
		time.Sleep(time.Millisecond)
	}

	create("s1", "王同学", "session-start", "problem")
	create("s1", "王同学", "section-view", "problem")
	create("s1", "王同学", "section-complete", "problem")
	create("s2", "李同学", "section-view", "visual")

	items := LearningEventsData("通信2301班", "P1T1-N01")
	if len(items) != 4 || items[0].StudentID != "s2" {
		t.Fatalf("unexpected learning events: %#v", items)
	}
	engagement := LearningEngagementData("通信2301班", "P1T1-N01")
	if engagement.TotalEvents != 4 || engagement.ActiveStudents != 2 || engagement.AverageEventsPerStudent != 2 {
		t.Fatalf("unexpected engagement totals: %#v", engagement)
	}
	if engagement.StalledStudents != 1 || len(engagement.SectionActivity) != 2 {
		t.Fatalf("unexpected engagement detail: %#v", engagement)
	}
}

func TestLearningEventValidation(t *testing.T) {
	ClosePostgres()
	if _, err := CreateLearningEvent(LearningEventRequest{
		NodeID: "P1T1-N01", StudentID: "s1", EventType: "unknown",
	}); err == nil {
		t.Fatal("expected invalid event type error")
	}
	if _, err := CreateLearningEvent(LearningEventRequest{
		NodeID: "P1T1-N01", StudentID: "s1", EventType: "section-view", SectionID: "unknown",
	}); err == nil {
		t.Fatal("expected invalid section error")
	}
}

func TestLearningDiagnosisLinksStudentsSectionsAndResources(t *testing.T) {
	ClosePostgres()
	learningEventState.Lock()
	learningEventState.items = []LearningEvent{}
	learningEventState.Unlock()
	resourceGovernanceState.Lock()
	resourceGovernanceState.items = map[string]ResourceGovernanceRecord{}
	resourceGovernanceState.Unlock()

	create := func(studentID, eventType, sectionID string) {
		t.Helper()
		if _, err := CreateLearningEvent(LearningEventRequest{
			ClassID: "通信2301班", NodeID: "P1T1-N01", StudentID: studentID,
			StudentName: "李同学", EventType: eventType, SectionID: sectionID,
		}); err != nil {
			t.Fatalf("create learning event: %v", err)
		}
	}
	create("s2", "section-view", "visual")
	create("s2", "section-view", "visual")
	create("s2", "exercise-error", "exercise")

	engagement := LearningEngagementWithProgress("通信2301班", "P1T1-N01", []SelfStudyProgress{{
		StudentID: "s2", StudentName: "李同学", AbilityScore: 45,
		CompletedSteps: []string{"problem"}, FormalTestAttempts: 1, BestScore: 50,
		ReviewStatus: "需修改",
	}})
	if len(engagement.PriorityStudents) != 1 || engagement.PriorityStudents[0].RiskLevel != "高" {
		t.Fatalf("unexpected priority students: %#v", engagement.PriorityStudents)
	}
	if len(engagement.SectionRisks) < 2 || engagement.SectionRisks[0].RiskLevel != "高" {
		t.Fatalf("unexpected section risks: %#v", engagement.SectionRisks)
	}
	if len(engagement.ResourceOutcomes) != 1 || engagement.ResourceOutcomes[0].ExposureCount != 2 {
		t.Fatalf("unexpected resource outcomes: %#v", engagement.ResourceOutcomes)
	}
	if len(engagement.SuggestedFocus) == 0 {
		t.Fatal("expected suggested focus")
	}
}
