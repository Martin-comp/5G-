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

func TestClassroomAnalyticsUsesEmptyStateWithoutSubmissions(t *testing.T) {
	ClosePostgres()
	resetClassroomMemoryForTest()

	analytics := ClassroomAnalyticsData("测试班", "P1T1-N01")
	if analytics.Submitted != 0 || analytics.TotalStudents != 0 || analytics.AverageScore != 0 {
		t.Fatalf("expected real empty analytics instead of seeded demo data, got %+v", analytics)
	}
	if len(analytics.CommonMistakes) != 0 || len(analytics.PriorityItems) != 0 || len(analytics.SuggestedFocus) != 0 {
		t.Fatalf("expected no fabricated findings for an empty class, got %+v", analytics)
	}
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
	if len(reviewed.OutputVersions) != 1 || reviewed.OutputVersions[0].ReviewStatus != "已认证" || reviewed.OutputVersions[0].ReviewedAt == 0 {
		t.Fatalf("expected immutable certified output version, got %+v", reviewed.OutputVersions)
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
	if len(resubmitted.OutputVersions) != 2 {
		t.Fatalf("expected two immutable output versions, got %+v", resubmitted.OutputVersions)
	}
	if resubmitted.OutputVersions[0].StudentOutput != original.StudentOutput || resubmitted.OutputVersions[0].ReviewStatus != "需修改" {
		t.Fatalf("expected returned first version to remain unchanged, got %+v", resubmitted.OutputVersions[0])
	}
	if resubmitted.OutputVersions[1].StudentOutput != resubmitted.StudentOutput || resubmitted.OutputVersions[1].ReviewStatus != "待审核" {
		t.Fatalf("expected pending second version, got %+v", resubmitted.OutputVersions[1])
	}
}

func TestResetDemoStudentsCreatesThreeDistinctStates(t *testing.T) {
	ClosePostgres()
	resetClassroomMemoryForTest()

	summary, err := ResetDemoStudents("演示班")
	if err != nil {
		t.Fatal(err)
	}
	if summary.ResetStudents != 3 || summary.SeededRecords != 13 || summary.CompletedRecords != 12 {
		t.Fatalf("unexpected reset summary: %+v", summary)
	}
	if empty := SelfStudyProgressData("演示班", "P1T1-N01", "student01"); empty.StudentID != "" {
		t.Fatalf("student01 must start without progress, got %+v", empty)
	}
	returned := SelfStudyProgressData("演示班", "P1T1-N01", "student02")
	if returned.ReviewStatus != "需修改" || len(returned.OutputVersions) != 1 || len(returned.FormalTestVersions) != 1 || returned.ReviewComment == "" {
		t.Fatalf("student02 must show a returned output, got %+v", returned)
	}
	for _, nodeID := range []string{"P1T1-N01", "P1T1-N04", "P1T2-N04", "P1T3-N04"} {
		complete := SelfStudyProgressData("演示班", nodeID, "student03")
		if complete.ReviewStatus != "已认证" || len(complete.CompletedSteps) != 6 || len(complete.OutputVersions) != 1 || len(complete.FormalTestVersions) != 1 {
			t.Fatalf("student03 must have a certified result for %s, got %+v", nodeID, complete)
		}
	}
	revised := SelfStudyProgressData("演示班", "P1T1-N02", "student03")
	if len(revised.OutputVersions) != 2 || revised.OutputVersions[0].ReviewStatus != "需修改" || revised.OutputVersions[1].ReviewStatus != "已认证" {
		t.Fatalf("student03 P01 must preserve returned v1 and certified v2, got %+v", revised.OutputVersions)
	}
}

func TestFormalTestAttemptsRemainImmutable(t *testing.T) {
	ClosePostgres()
	resetClassroomMemoryForTest()

	first, err := UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
		ClassID: "测试班", NodeID: "P1T1-N02", StudentID: "s1", StudentName: "学生一",
		FormalTestAttempts: 1, FirstScore: 50, BestScore: 50, LatestScore: 50, TestCompletedAt: 100,
		FormalTestSubmission: &SelfStudyTestAttempt{
			VersionID: "FORM-P1T1-N02-v1-A1", SubmittedAt: 100, ElapsedSeconds: 300, Score: 50,
			SingleAnswer: "错误答案", Sequence: []string{"步骤二", "步骤一"}, Evidence: []string{"个人印象"},
			Conclusion: []string{"绝对化结论"}, WrongKnowledgePoints: []string{"判断边界"},
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	second, err := UpdateSelfStudyProgress(SelfStudyProgressUpdateRequest{
		ClassID: "测试班", NodeID: "P1T1-N02", StudentID: "s1", StudentName: "学生一",
		CompletedSteps: first.CompletedSteps, FormalTestAttempts: 2, FirstScore: 50, BestScore: 100, LatestScore: 100, TestCompletedAt: 200,
		FormalTestSubmission: &SelfStudyTestAttempt{
			VersionID: "FORM-P1T1-N02-v1-A2", SubmittedAt: 200, ElapsedSeconds: 240, Score: 100,
			SingleAnswer: "正确答案", Sequence: []string{"步骤一", "步骤二"}, Evidence: []string{"日志", "照片"},
			Conclusion: []string{"任务对象", "关键证据", "判断边界", "后续动作"},
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	if len(second.FormalTestVersions) != 2 {
		t.Fatalf("expected two immutable formal test versions, got %+v", second.FormalTestVersions)
	}
	if second.FormalTestVersions[0].Score != 50 || second.FormalTestVersions[0].SingleAnswer != "错误答案" {
		t.Fatalf("first attempt must remain unchanged, got %+v", second.FormalTestVersions[0])
	}
	if second.FormalTestVersions[1].Attempt != 2 || second.FormalTestVersions[1].Score != 100 {
		t.Fatalf("second attempt was not appended, got %+v", second.FormalTestVersions[1])
	}
}
