package httpapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"digital-textbook-backend/internal/data"
)

func (s *Server) aiHint(w http.ResponseWriter, r *http.Request) {
	var request data.AIHintRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}

	if apiKey := strings.TrimSpace(os.Getenv("DEEPSEEK_API_KEY")); apiKey != "" {
		response, err := requestDeepSeek(apiKey, request)
		if err == nil {
			writeJSON(w, http.StatusOK, response)
			return
		}
	}

	if baseURL := strings.TrimSpace(os.Getenv("OPENMAIC_API_BASE")); baseURL != "" {
		response, err := requestOpenMAIC(baseURL, request)
		if err == nil {
			writeJSON(w, http.StatusOK, response)
			return
		}
	}

	writeJSON(w, http.StatusOK, localAIHint(request))
}

func (s *Server) aiChat(w http.ResponseWriter, r *http.Request) {
	var request data.AIChatRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	if strings.TrimSpace(request.Question) == "" {
		writeError(w, http.StatusBadRequest, "question is required")
		return
	}

	if baseURL := strings.TrimSpace(os.Getenv("OPENMAIC_API_BASE")); baseURL != "" {
		response, err := requestOpenMAICPBLChat(baseURL, request)
		if err == nil {
			writeJSON(w, http.StatusOK, response)
			return
		}
	}

	if apiKey := strings.TrimSpace(os.Getenv("DEEPSEEK_API_KEY")); apiKey != "" {
		response, err := requestDeepSeekChat(apiKey, request)
		if err == nil {
			writeJSON(w, http.StatusOK, response)
			return
		}
	}

	writeJSON(w, http.StatusOK, data.AIChatResponse{
		Provider: "local-assistant",
		Mode:     "local-fallback",
		Answer:   "我现在先用本地规则回答：这个节点的关键是不要只看覆盖率，要把切换成功率、重建次数和短掉线日志放在同一条移动路径上判断。",
	})
}

func (s *Server) aiStudyInsight(w http.ResponseWriter, r *http.Request) {
	var request data.AIStudyInsightRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}
	if strings.TrimSpace(request.NodeID) == "" {
		writeError(w, http.StatusBadRequest, "nodeId is required")
		return
	}

	analytics := data.SelfStudyAnalyticsData(request.ClassID, request.NodeID)
	if strings.TrimSpace(request.StudentID) != "" {
		if _, ok := studyInsightStudent(analytics, request.StudentID); !ok {
			writeError(w, http.StatusNotFound, "student learning record not found")
			return
		}
	}
	if apiKey := strings.TrimSpace(os.Getenv("DEEPSEEK_API_KEY")); apiKey != "" {
		response, err := requestDeepSeekStudyInsight(apiKey, request, analytics)
		if err == nil {
			writeJSON(w, http.StatusOK, response)
			return
		}
	}

	writeJSON(w, http.StatusOK, localStudyInsight(request, analytics))
}

func requestOpenMAICPBLChat(baseURL string, payload data.AIChatRequest) (data.AIChatResponse, error) {
	endpoint := strings.TrimRight(baseURL, "/") + "/api/pbl/chat"
	body, err := json.Marshal(map[string]any{
		"message": openMAICPBLPrompt(payload),
		"agent": map[string]any{
			"name":            "课程助教",
			"actor_role":      "5G网络优化课程助教",
			"role_division":   "development",
			"system_prompt":   openMAICPBLSystemPrompt(),
			"default_mode":    "chat",
			"delay_time":      0,
			"env":             map[string]any{},
			"is_user_role":    false,
			"is_active":       true,
			"is_system_agent": false,
		},
		"currentIssue": map[string]any{
			"id":                  "P4T2-N04",
			"title":               "读移动性指标",
			"description":         "判断覆盖达标后移动中仍会中断的原因，围绕切换成功率、重建次数和短掉线日志形成证据闭环。",
			"person_in_charge":    "课程助教",
			"participants":        []string{"学生", "课程助教"},
			"notes":               "职业教育5G网络优化数字教材互动闯关。",
			"parent_issue":        nil,
			"index":               1,
			"is_done":             false,
			"is_active":           true,
			"generated_questions": "覆盖达标后为什么移动中仍会中断？如何用切换成功率、重建次数、短掉线日志判断移动性未闭环？",
			"question_agent_name": "课程助教",
			"judge_agent_name":    "课程助教",
		},
		"recentMessages": recentOpenMAICMessages(payload.History),
		"userRole":       "学生",
		"agentType":      "question",
	})
	if err != nil {
		return data.AIChatResponse{}, err
	}

	request, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return data.AIChatResponse{}, err
	}
	request.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(request)
	if err != nil {
		return data.AIChatResponse{}, err
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return data.AIChatResponse{}, err
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return data.AIChatResponse{}, fmt.Errorf("openmaic status %d: %s", resp.StatusCode, string(raw))
	}

	var parsed struct {
		Success   bool   `json:"success"`
		Message   string `json:"message"`
		AgentName string `json:"agentName"`
	}
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return data.AIChatResponse{}, err
	}
	if !parsed.Success || strings.TrimSpace(parsed.Message) == "" {
		return data.AIChatResponse{}, fmt.Errorf("openmaic returned empty message")
	}
	return data.AIChatResponse{
		Provider: "OpenMAIC",
		Mode:     "pbl-agent",
		Answer:   strings.TrimSpace(parsed.Message),
	}, nil
}

func openMAICPBLSystemPrompt() string {
	return `你是 OpenMAIC 多智能体课堂中的“课程助教”，嵌入在一套职业教育 5G网络优化数字教材里。
当前章节：P4-T2/N04 读移动性指标。
你的任务是回答学生随堂问题，帮助学生理解：
- 覆盖达标不等于移动性闭环；
- 切换成功率、10次往返重建、短掉线日志如何共同构成证据；
- 如何围绕移动路径边界判断中断原因。
回答要求：中文、简洁、像助教，不要超过 120 字；不要替学生写完整作业答案；优先引导学生观察证据。`
}

func openMAICPBLPrompt(payload data.AIChatRequest) string {
	return fmt.Sprintf(`学生问题：%s

当前互动状态：
- 选中路线节点：%s
- 已选证据：%s
- 当前得分：%d

请作为 OpenMAIC 课程助教回答。`, payload.Question, emptyText(payload.SelectedNode), emptyText(strings.Join(payload.SelectedEvidence, ",")), payload.Score)
}

func recentOpenMAICMessages(history []data.AIChatMessage) []map[string]string {
	messages := []map[string]string{}
	for _, item := range history {
		content := strings.TrimSpace(item.Content)
		if content == "" {
			continue
		}
		name := "学生"
		if item.Role == "assistant" {
			name = "课程助教"
		}
		messages = append(messages, map[string]string{
			"agent_name": name,
			"message":    content,
		})
	}
	if len(messages) > 5 {
		return messages[len(messages)-5:]
	}
	return messages
}

type chatCompletionRequest struct {
	Model       string        `json:"model"`
	Messages    []chatMessage `json:"messages"`
	Temperature float64       `json:"temperature"`
}

type chatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type chatCompletionResponse struct {
	Choices []struct {
		Message chatMessage `json:"message"`
	} `json:"choices"`
}

func requestDeepSeek(apiKey string, payload data.AIHintRequest) (data.AIHintResponse, error) {
	content, err := requestDeepSeekCompletion(apiKey, []chatMessage{
		{
			Role:    "system",
			Content: "你是职业教育5G网络优化数字教材里的AI助教。你要根据学生在互动闯关中的选择，给出短、具体、可操作的中文引导。不要直接替学生写完整答案，要引导他观察指标、选择证据、形成闭环判断。只返回JSON，格式为 {\"hint\":\"...\",\"next\":\"...\",\"tags\":[\"...\",\"...\"]}。",
		},
		{
			Role:    "user",
			Content: deepSeekPrompt(payload),
		},
	}, 0.3)
	if err != nil {
		return data.AIHintResponse{}, err
	}

	hint := parseAIHintContent(content)
	hint.Provider = "DeepSeek"
	hint.Mode = "remote"
	return hint, nil
}

func requestDeepSeekChat(apiKey string, payload data.AIChatRequest) (data.AIChatResponse, error) {
	messages := []chatMessage{
		{
			Role: "system",
			Content: `你是“5G网络优化（高级）数字教材”的课程助教，面向职业教育学生。
当前教学节点是 P4-T2/N04：读移动性指标。
你需要像课堂助教一样回答学生随堂问题：
- 回答要短、清楚、具体。
- 优先结合本节内容：覆盖率、切换成功率、10次往返重建、短掉线日志、移动路径边界。
- 不要泛泛讲通信原理，要把回答落到“如何判断移动性未闭环”。
- 学生问代码、配置或无关问题时，先拉回本节学习任务。
- 可以追问学生当前选择了哪些证据，但不要捏造外部数据。`,
		},
	}

	for _, item := range payload.History {
		role := strings.TrimSpace(item.Role)
		if role != "user" && role != "assistant" {
			continue
		}
		content := strings.TrimSpace(item.Content)
		if content == "" {
			continue
		}
		messages = append(messages, chatMessage{Role: role, Content: content})
	}

	messages = append(messages, chatMessage{
		Role: "user",
		Content: fmt.Sprintf(`学生问题：%s

当前互动状态：
- 选中路线节点：%s
- 已选证据：%s
- 当前得分：%d

请用中文回答，最多 120 字。`, payload.Question, emptyText(payload.SelectedNode), emptyText(strings.Join(payload.SelectedEvidence, ",")), payload.Score),
	})

	content, err := requestDeepSeekCompletion(apiKey, messages, 0.4)
	if err != nil {
		return data.AIChatResponse{}, err
	}
	return data.AIChatResponse{
		Provider: "DeepSeek",
		Mode:     "remote",
		Answer:   strings.TrimSpace(content),
	}, nil
}

func requestDeepSeekStudyInsight(apiKey string, request data.AIStudyInsightRequest, analytics data.SelfStudyAnalytics) (data.AIStudyInsightResponse, error) {
	content, err := requestDeepSeekCompletion(apiKey, []chatMessage{
		{
			Role:    "system",
			Content: "你是职业教育5G网络优化数字教材的教师学情助手。仅依据给出的自学完成数据生成简洁中文学情卡。不得捏造学生行为或具体错误。只返回 JSON：{\"summary\":\"不超过45字\",\"focus\":\"不超过45字\",\"action\":\"不超过45字\"}。",
		},
		{Role: "user", Content: studyInsightPrompt(request, analytics)},
	}, 0.2)
	if err != nil {
		return data.AIStudyInsightResponse{}, err
	}
	response := parseStudyInsightContent(content, request, analytics)
	response.Provider = "DeepSeek"
	response.Mode = "remote"
	return response, nil
}

func studyInsightPrompt(request data.AIStudyInsightRequest, analytics data.SelfStudyAnalytics) string {
	if student, ok := studyInsightStudent(analytics, request.StudentID); ok {
		return fmt.Sprintf(`课程：5G网络优化（高级）
节点：%s
学生：%s（%s）
完成阶段：%d/6
能力数：%d
学习用时：%d秒
微练习：%d分，共%d次
正式测试：首次%d分、最高%d分、最近%d分，共%d次
错误知识点：%s
学习产出：%s
教师审核：%s
审核意见：%s

请只依据该生真实记录，生成教师可直接使用的个人学习概况、首要薄弱点和下一步讲评或辅导动作。`,
			request.NodeID, student.StudentName, student.StudentID, len(student.CompletedSteps), student.AbilityScore,
			student.TimeSpentSeconds, student.PracticeScore, student.PracticeAttempts, student.FirstScore, student.BestScore,
			student.LatestScore, student.FormalTestAttempts, emptyText(strings.Join(student.WrongKnowledgePoints, "、")),
			emptyText(student.StudentOutput), emptyText(student.ReviewStatus), emptyText(student.ReviewComment))
	}
	studentSnapshots := make([]string, 0, len(analytics.Cards))
	for _, card := range analytics.Cards {
		studentSnapshots = append(studentSnapshots, fmt.Sprintf("%s：能力数%d，完成%d/6阶段，用时%d秒，正式测试首次%d/最高%d/最近%d，共%d次，审核状态%s，错误点%s",
			card.StudentName, card.AbilityScore, len(card.CompletedSteps), card.TimeSpentSeconds, card.FirstScore, card.BestScore,
			card.LatestScore, card.FormalTestAttempts, emptyText(card.ReviewStatus), emptyText(strings.Join(card.WrongKnowledgePoints, "、"))))
	}
	typicalErrors := make([]string, 0, len(analytics.TypicalErrors))
	for _, item := range analytics.TypicalErrors {
		typicalErrors = append(typicalErrors, fmt.Sprintf("%s(%d次)", item.Label, item.Count))
	}
	weakAbilities := make([]string, 0, len(analytics.WeakAbilities))
	for _, item := range analytics.WeakAbilities {
		weakAbilities = append(weakAbilities, fmt.Sprintf("%s(%d人)", item.Label, item.Count))
	}
	return fmt.Sprintf(`课程：5G网络优化（高级）
节点：%s
学习数据：参与%d人，完整完成%d人，平均能力数%d，作业正确率%d%%，累计重试%d次，平均学习用时%d秒，需要支持%d人。
典型错误：%s
能力短板：%s
学生概览：%s

请优先依据正式测试的首次/最高/最近成绩、重试次数、错误知识点和教师审核状态，生成给教师看的班级概况、重点学生、优先讲评内容和下一步课堂动作。`, request.NodeID, analytics.Students, analytics.Completed, analytics.AverageAbility, analytics.AverageAccuracy, analytics.TotalRetries, analytics.AverageDurationSeconds, analytics.NeedsSupport, emptyText(strings.Join(typicalErrors, "；")), emptyText(strings.Join(weakAbilities, "；")), emptyText(strings.Join(studentSnapshots, "；")))
}

func parseStudyInsightContent(content string, request data.AIStudyInsightRequest, analytics data.SelfStudyAnalytics) data.AIStudyInsightResponse {
	content = strings.TrimSpace(strings.Trim(content, "`"))
	if strings.HasPrefix(content, "json") {
		content = strings.TrimSpace(strings.TrimPrefix(content, "json"))
	}
	var parsed struct {
		Summary string `json:"summary"`
		Focus   string `json:"focus"`
		Action  string `json:"action"`
	}
	if err := json.Unmarshal([]byte(content), &parsed); err == nil && strings.TrimSpace(parsed.Summary) != "" {
		return data.AIStudyInsightResponse{Summary: parsed.Summary, Focus: parsed.Focus, Action: parsed.Action}
	}
	response := localStudyInsight(request, analytics)
	if strings.TrimSpace(content) != "" {
		response.Summary = content
	}
	return response
}

func localStudyInsight(request data.AIStudyInsightRequest, analytics data.SelfStudyAnalytics) data.AIStudyInsightResponse {
	if student, ok := studyInsightStudent(analytics, request.StudentID); ok {
		score := student.PracticeScore
		scoreLabel := "微练习"
		if student.FormalTestAttempts > 0 {
			score = student.BestScore
			scoreLabel = "正式测试最高分"
		}
		focus := "继续完成尚未点亮的学习阶段。"
		switch {
		case student.ReviewStatus == "需修改":
			focus = fmt.Sprintf("学习产出已退回，需按审核意见修改：%s", emptyText(student.ReviewComment))
		case len(student.WrongKnowledgePoints) > 0:
			focus = fmt.Sprintf("首要薄弱点是“%s”，需要回到对应场景和证据重新判断。", student.WrongKnowledgePoints[0])
		case student.FormalTestAttempts > 0 && student.BestScore < 60:
			focus = fmt.Sprintf("正式测试最高分%d分，需先纠正错误再进行一次测试。", student.BestScore)
		case len(student.CompletedSteps) >= 6 && student.ReviewStatus == "待审核":
			focus = "六阶段已完成，当前重点是核验学习产出与证据是否一致。"
		}
		action := "安排一次针对性讲解，再让学生修正产出或重做测试。"
		if student.ReviewStatus == "已认证" && score >= 60 {
			action = "该生已达到当前节点要求，可进入下一知识节点并保留抽查。"
		}
		return data.AIStudyInsightResponse{
			Provider: "local-insight", Mode: "local-fallback",
			Summary: fmt.Sprintf("%s已完成%d/6阶段，能力数%d，%s%d分。", student.StudentName, len(student.CompletedSteps), student.AbilityScore, scoreLabel, score),
			Focus:   focus,
			Action:  action,
		}
	}
	if analytics.Students == 0 {
		return data.AIStudyInsightResponse{
			Provider: "local-insight", Mode: "local-fallback",
			Summary: "暂未收到学生自学记录，暂不能形成班级学情判断。",
			Focus:   "先让学生完成至少一个知识小节并保存进度。",
			Action:  "学生数据进入后，再生成面向本节点的讲评建议。",
		}
	}
	focus := "重点核查未完成小节，避免只看能力总分。"
	for _, card := range analytics.Cards {
		if card.ReviewStatus == "需修改" {
			focus = fmt.Sprintf("优先跟进%s的退回产出，并对照审核意见完成修改。", card.StudentName)
			break
		}
		if card.FormalTestAttempts > 0 && card.BestScore < 60 {
			focus = fmt.Sprintf("优先支持%s，其正式测试最高分为%d分。", card.StudentName, card.BestScore)
			break
		}
	}
	if len(analytics.TypicalErrors) > 0 {
		if focus == "重点核查未完成小节，避免只看能力总分。" {
			focus = fmt.Sprintf("优先讲评“%s”，该错误在当前作业中出现%d次。", analytics.TypicalErrors[0].Label, analytics.TypicalErrors[0].Count)
		}
	}
	for _, card := range analytics.Cards {
		if focus != "重点核查未完成小节，避免只看能力总分。" {
			break
		}
		if len(analytics.TypicalErrors) > 0 {
			break
		}
		for _, ability := range card.Abilities {
			if ability.Score < 100 {
				focus = fmt.Sprintf("优先讲评“%s”，这是当前学习记录中的薄弱维度。", ability.Label)
				break
			}
		}
		if focus != "重点核查未完成小节，避免只看能力总分。" {
			break
		}
	}
	return data.AIStudyInsightResponse{
		Provider: "local-insight", Mode: "local-fallback",
		Summary: fmt.Sprintf("本节点已有%d人学习，%d人完成，平均能力数%d，作业正确率%d%%。", analytics.Students, analytics.Completed, analytics.AverageAbility, analytics.AverageAccuracy),
		Focus:   focus,
		Action:  fmt.Sprintf("优先支持%d名薄弱学生，并围绕典型错误组织一次针对性讲评。", analytics.NeedsSupport),
	}
}

func studyInsightStudent(analytics data.SelfStudyAnalytics, studentID string) (data.SelfStudyProgress, bool) {
	studentID = strings.TrimSpace(studentID)
	if studentID == "" {
		return data.SelfStudyProgress{}, false
	}
	for _, card := range analytics.Cards {
		if card.StudentID == studentID {
			return card, true
		}
	}
	return data.SelfStudyProgress{}, false
}

func requestDeepSeekCompletion(apiKey string, messages []chatMessage, temperature float64) (string, error) {
	baseURL := strings.TrimSpace(os.Getenv("DEEPSEEK_BASE_URL"))
	if baseURL == "" {
		baseURL = "https://api.deepseek.com/v1"
	}
	model := strings.TrimSpace(os.Getenv("DEEPSEEK_MODEL"))
	if model == "" {
		model = "deepseek-chat"
	}

	body, err := json.Marshal(chatCompletionRequest{
		Model:       model,
		Temperature: temperature,
		Messages:    messages,
	})
	if err != nil {
		return "", err
	}

	endpoint := strings.TrimRight(baseURL, "/") + "/chat/completions"
	request, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{Timeout: 18 * time.Second}
	resp, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("deepseek status %d", resp.StatusCode)
	}

	var completion chatCompletionResponse
	if err := json.Unmarshal(raw, &completion); err != nil {
		return "", err
	}
	if len(completion.Choices) == 0 {
		return "", fmt.Errorf("deepseek returned no choices")
	}

	return strings.TrimSpace(completion.Choices[0].Message.Content), nil
}

func deepSeekPrompt(payload data.AIHintRequest) string {
	return fmt.Sprintf(`课程：5G网络优化（高级）
任务：P4-T2/N04 读移动性指标
核心问题：覆盖达标后，为什么移动中仍会中断？
当前阶段：%s
学生选择的路线节点：%s
学生选择的证据：%s
当前得分：%d

证据背景：
- 覆盖率 97.5%%，目标 >=95%%，已经达标。
- 切换成功率 94.5%%，目标 >=98%%，未达标。
- 10次往返重建 4次，目标 <=1次，未达标。
- 短掉线日志 1段，需要复核。

请输出适合右侧助教面板的一句话提示、下一步动作、2到3个标签。`, payload.Step, emptyText(payload.SelectedNode), strings.Join(payload.SelectedEvidence, ","), payload.Score)
}

func parseAIHintContent(content string) data.AIHintResponse {
	content = strings.TrimSpace(strings.Trim(content, "`"))
	if strings.HasPrefix(content, "json") {
		content = strings.TrimSpace(strings.TrimPrefix(content, "json"))
	}
	var parsed struct {
		Hint string   `json:"hint"`
		Next string   `json:"next"`
		Tags []string `json:"tags"`
	}
	if err := json.Unmarshal([]byte(content), &parsed); err == nil && strings.TrimSpace(parsed.Hint) != "" {
		if len(parsed.Tags) == 0 {
			parsed.Tags = []string{"AI助教", "移动性判断"}
		}
		return data.AIHintResponse{Hint: parsed.Hint, Next: parsed.Next, Tags: parsed.Tags}
	}
	return data.AIHintResponse{
		Hint: content,
		Next: "继续结合路线节点和移动性证据完善判断。",
		Tags: []string{"AI助教", "动态提示"},
	}
}

func emptyText(value string) string {
	if strings.TrimSpace(value) == "" {
		return "尚未选择"
	}
	return value
}

func requestOpenMAIC(baseURL string, payload data.AIHintRequest) (data.AIHintResponse, error) {
	path := strings.TrimSpace(os.Getenv("OPENMAIC_HINT_PATH"))
	if path == "" {
		path = "/api/ai/hint"
	}
	endpoint := strings.TrimRight(baseURL, "/") + "/" + strings.TrimLeft(path, "/")

	body, err := json.Marshal(payload)
	if err != nil {
		return data.AIHintResponse{}, err
	}

	request, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return data.AIHintResponse{}, err
	}
	request.Header.Set("Content-Type", "application/json")
	if apiKey := strings.TrimSpace(os.Getenv("OPENMAIC_API_KEY")); apiKey != "" {
		request.Header.Set("Authorization", "Bearer "+apiKey)
	}

	client := &http.Client{Timeout: 8 * time.Second}
	resp, err := client.Do(request)
	if err != nil {
		return data.AIHintResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return data.AIHintResponse{}, os.ErrInvalid
	}

	var hint data.AIHintResponse
	if err := json.NewDecoder(resp.Body).Decode(&hint); err != nil {
		return data.AIHintResponse{}, err
	}
	if hint.Provider == "" {
		hint.Provider = "OpenMAIC"
	}
	if hint.Mode == "" {
		hint.Mode = "remote"
	}
	return hint, nil
}

func localAIHint(request data.AIHintRequest) data.AIHintResponse {
	selected := map[string]bool{}
	for _, item := range request.SelectedEvidence {
		selected[item] = true
	}

	if strings.TrimSpace(request.SelectedNode) == "" {
		return data.AIHintResponse{
			Provider: "OpenMAIC-adapter",
			Mode:     "local-fallback",
			Hint:     "先观察移动路径，优先点击 A-B边界 或 食堂入口，这两个位置更可能发生切换失败或短时中断。",
			Next:     "定位一个风险节点后，再选择移动性证据。",
			Tags:     []string{"定位风险点", "移动路径"},
		}
	}
	if selected["coverage"] {
		return data.AIHintResponse{
			Provider: "OpenMAIC-adapter",
			Mode:     "local-fallback",
			Hint:     "覆盖率已改善，不能只用覆盖指标解释移动中断。继续查找切换成功率、重建次数和短掉线日志。",
			Next:     "取消或弱化覆盖率证据，补充至少两个移动性证据。",
			Tags:     []string{"避免单看覆盖", "证据筛选"},
		}
	}
	if selected["handover"] && selected["rebuild"] {
		return data.AIHintResponse{
			Provider: "OpenMAIC-adapter",
			Mode:     "local-fallback",
			Hint:     "切换成功率低于目标，且重建次数偏多，这两个证据可以共同支撑“移动性未闭环”的判断。",
			Next:     "再结合短掉线日志，形成边界结论。",
			Tags:     []string{"证据闭环", "移动性判断"},
		}
	}
	return data.AIHintResponse{
		Provider: "OpenMAIC-adapter",
		Mode:     "local-fallback",
		Hint:     "你已经定位了风险点。下一步至少选择两个移动性证据，说明为什么覆盖改善后仍然会断。",
		Next:     "优先比较切换成功率、重建次数和短掉线日志。",
		Tags:     []string{"证据组合", "结论表达"},
	}
}
