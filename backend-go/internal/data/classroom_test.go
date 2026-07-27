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
		CompletedSteps: []string{"problem", "visual", "steps", "correction", "exercise", "output"}, StartedAt: 1, TimeSpentSeconds: 120,
		PracticeAttempts: 2, PracticeScore: 100, WrongKnowledgePoints: []string{"室内资源边界"},
		FormalTestAttempts: 2, FirstScore: 60, BestScore: 80, LatestScore: 80, TestCompletedAt: 10,
		StudentOutput: "已完成室内资源边界、证据和判断结论记录。", OutputSubmittedAt: 11,
	})
	if err != nil {
		t.Fatal(err)
	}
	_, err = UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
		ClassID: "测试班", NodeID: "P1T1-N01", StudentID: "s2", StudentName: "学生二",
		CompletedSteps: []string{"problem", "visual"}, StartedAt: 2, TimeSpentSeconds: 60,
		PracticeAttempts: 1, PracticeScore: 0, WrongKnowledgePoints: []string{"室内资源边界"},
		FormalTestAttempts: 1, FirstScore: 0, BestScore: 0, LatestScore: 0, TestCompletedAt: 12,
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
	if analytics.AverageAccuracy != 60 {
		t.Fatalf("expected blended average accuracy 60, got %d", analytics.AverageAccuracy)
	}
	if analytics.TotalRetries != 2 {
		t.Fatalf("expected two retries, got %d", analytics.TotalRetries)
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
	var completedCard SelfStudyProgress
	for _, card := range analytics.Cards {
		if card.StudentID == "s1" {
			completedCard = card
		}
	}
	if completedCard.PracticeScore != 100 || completedCard.ReviewStatus != "待审核" || completedCard.BestScore != 80 || completedCard.StudentOutput == "" {
		t.Fatalf("expected persisted practice and review data, got %+v", completedCard)
	}
	reviewed, err := ReviewSelfStudyProgress(SelfStudyReviewRequest{
		ClassID: "测试班", NodeID: "P1T1-N01", StudentID: "s1", Status: "已认证", Comment: "证据完整，可以进入下一节点。",
	})
	if err != nil {
		t.Fatal(err)
	}
	if reviewed.ReviewStatus != "已认证" || reviewed.CertifiedAt == 0 || reviewed.ReviewComment == "" {
		t.Fatalf("expected certified review, got %+v", reviewed)
	}
}

func TestReturnedSelfStudyCanBeResubmittedForReview(t *testing.T) {
	ClosePostgres()
	resetClassroomMemoryForTest()

	original, err := UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
		ClassID: "测试班", NodeID: "P1T1-N02", StudentID: "s1", StudentName: "学生一",
		CompletedSteps:   []string{"problem", "visual", "steps", "correction", "exercise", "output"},
		PracticeAttempts: 1, PracticeScore: 100, FormalTestAttempts: 1,
		FirstScore: 80, BestScore: 80, LatestScore: 80,
		StudentOutput: "第一版学习产出，包含对象、证据和初步判断。", OutputSubmittedAt: 100,
	})
	if err != nil {
		t.Fatal(err)
	}
	returned, err := ReviewSelfStudyProgress(SelfStudyReviewRequest{
		ClassID: "测试班", NodeID: "P1T1-N02", StudentID: "s1",
		Status: "需修改", Comment: "请补充证据来源和判断边界。",
	})
	if err != nil {
		t.Fatal(err)
	}
	if original.ReviewStatus != "待审核" || returned.ReviewComment == "" {
		t.Fatalf("expected returned review with comment, got original=%+v returned=%+v", original, returned)
	}

	resubmitted, err := UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
		ClassID: "测试班", NodeID: "P1T1-N02", StudentID: "s1", StudentName: "学生一",
		CompletedSteps: returned.CompletedSteps, PracticeAttempts: returned.PracticeAttempts,
		PracticeScore: returned.PracticeScore, FormalTestAttempts: returned.FormalTestAttempts,
		FirstScore: returned.FirstScore, BestScore: returned.BestScore, LatestScore: returned.LatestScore,
		StudentOutput:     "第二版学习产出，已补充证据来源、对象对应关系和判断边界。",
		OutputSubmittedAt: 200, ReviewStatus: "待审核",
	})
	if err != nil {
		t.Fatal(err)
	}
	if resubmitted.ReviewStatus != "待审核" || resubmitted.ReviewComment != "" || resubmitted.CertifiedAt != 0 {
		t.Fatalf("expected a clean pending review after resubmission, got %+v", resubmitted)
	}
	if resubmitted.StudentOutput == returned.StudentOutput || resubmitted.OutputSubmittedAt != 200 {
		t.Fatalf("expected the revised output to be saved, got %+v", resubmitted)
	}
}
