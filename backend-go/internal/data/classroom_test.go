package data

import "testing"

func resetClassroomMemoryForTest() {
	classroomMemory.Lock()
	defer classroomMemory.Unlock()
	classroomMemory.sessions = map[string]ClassroomSessionState{}
	classroomMemory.tools = map[string]ClassroomToolState{}
	classroomMemory.submissions = map[string][]ClassroomSubmission{}
	classroomMemory.polls = map[string]map[string]ClassroomPollResponse{}
	classroomMemory.messages = map[string][]ClassroomDiscussionMessage{}
	classroomMemory.groups = map[string]map[string]ClassroomGroupResponse{}
	classroomMemory.exits = map[string][]ClassroomExit{}
	classroomMemory.activeNodes = map[string]string{}
	classroomMemory.selfStudy = map[string]SelfStudyProgress{}
}

func TestSelfStudyAnalyticsCombinesProgressAndHomework(t *testing.T) {
	ClosePostgres()
	resetClassroomMemoryForTest()

	_, err := UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
		ClassID: "测试班", NodeID: "P1T1-N01", StudentID: "s1", StudentName: "学生一",
		CompletedSteps: []string{"case", "evidence", "practice", "summary"}, StartedAt: 1, TimeSpentSeconds: 120,
	})
	if err != nil {
		t.Fatal(err)
	}
	_, err = UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
		ClassID: "测试班", NodeID: "P1T1-N01", StudentID: "s2", StudentName: "学生二",
		CompletedSteps: []string{"case", "evidence"}, StartedAt: 2, TimeSpentSeconds: 60,
	})
	if err != nil {
		t.Fatal(err)
	}

	for _, request := range []ClassroomSubmissionRequest{
		{ClassID: "测试班", NodeID: "P1T1-N01", TaskID: "task-a", StudentID: "s1", StudentName: "学生一", Answer: "覆盖达标", Score: 50},
		{ClassID: "测试班", NodeID: "P1T1-N01", TaskID: "task-a", StudentID: "s1", StudentName: "学生一", Answer: "覆盖达标但需要继续核查", Score: 70},
		{ClassID: "测试班", NodeID: "P1T1-N01", TaskID: "task-a", StudentID: "s2", StudentName: "学生二", Answer: "切换、重建与掉线证据完整", Score: 100},
	} {
		if _, err := CreateClassroomSubmission(request); err != nil {
			t.Fatal(err)
		}
	}

	analytics := SelfStudyAnalyticsData("测试班", "P1T1-N01")
	if analytics.Students != 2 || analytics.Completed != 1 {
		t.Fatalf("unexpected progress summary: %+v", analytics)
	}
	if analytics.AverageAccuracy != 73 {
		t.Fatalf("expected average accuracy 73, got %d", analytics.AverageAccuracy)
	}
	if analytics.TotalRetries != 1 {
		t.Fatalf("expected one retry, got %d", analytics.TotalRetries)
	}
	if analytics.AverageDurationSeconds != 90 {
		t.Fatalf("expected average duration 90 seconds, got %d", analytics.AverageDurationSeconds)
	}
	if len(analytics.TypicalErrors) == 0 {
		t.Fatal("expected typical errors from submission tags")
	}
	if len(analytics.WeakAbilities) == 0 {
		t.Fatal("expected weak abilities from incomplete progress")
	}
}
