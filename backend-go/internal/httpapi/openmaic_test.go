package httpapi

import (
	"strings"
	"testing"

	"digital-textbook-backend/internal/data"
)

func TestStudentStudyInsightUsesSelectedRecord(t *testing.T) {
	analytics := data.SelfStudyAnalytics{
		NodeID:   "P1T1-N02",
		Students: 2,
		Cards: []data.SelfStudyProgress{
			{StudentID: "student-1", StudentName: "张同学", CompletedSteps: []string{"problem"}, AbilityScore: 40},
			{
				StudentID: "student-2", StudentName: "李同学", CompletedSteps: []string{"problem", "visual", "steps"},
				AbilityScore: 58, PracticeAttempts: 2, PracticeScore: 60,
				WrongKnowledgePoints: []string{"证据链对应"}, ReviewStatus: "需修改", ReviewComment: "补充照片与日志对应关系",
			},
		},
	}
	request := data.AIStudyInsightRequest{NodeID: "P1T1-N02", StudentID: "student-2"}

	response := localStudyInsight(request, analytics)

	if !strings.Contains(response.Summary, "李同学") {
		t.Fatalf("summary should identify selected student, got %q", response.Summary)
	}
	if !strings.Contains(response.Focus, "补充照片与日志对应关系") {
		t.Fatalf("focus should use selected student's review comment, got %q", response.Focus)
	}
}

func TestStudentStudyInsightPromptExcludesOtherStudents(t *testing.T) {
	analytics := data.SelfStudyAnalytics{
		NodeID: "P1T1-N02",
		Cards: []data.SelfStudyProgress{
			{StudentID: "student-1", StudentName: "张同学"},
			{StudentID: "student-2", StudentName: "李同学", WrongKnowledgePoints: []string{"采集边界"}},
		},
	}
	request := data.AIStudyInsightRequest{NodeID: "P1T1-N02", StudentID: "student-2"}

	prompt := studyInsightPrompt(request, analytics)

	if !strings.Contains(prompt, "李同学") || !strings.Contains(prompt, "采集边界") {
		t.Fatalf("prompt should contain selected student's evidence, got %q", prompt)
	}
	if strings.Contains(prompt, "张同学") {
		t.Fatalf("prompt should not include another student, got %q", prompt)
	}
}
