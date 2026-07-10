package data

import "strings"

var CourseStats = []CourseStat{
	{Label: "课程项目", Value: "6", Note: "覆盖5G网优完整工作链"},
	{Label: "学习任务", Value: "18", Note: "按项目任务组织学习"},
	{Label: "重点路径", Value: "2", Note: "网络测试到优化验证"},
	{Label: "完整任务", Value: "P4-T2", Note: "结果验证闭环样章"},
}

var Projects = []Project{
	{ID: "P1", Title: "5G网络信息采集", Status: "样章已接入", Note: "信息采集 · 线索闭环"},
	{ID: "P2", Title: "5G网络测试", Status: "样章已接入", Note: "测试数据 · 证据输入"},
	{ID: "P3", Title: "5G网络信息管理", Status: "样章已接入", Note: "信息管理 · 告警参数关联"},
	{ID: "P4", Title: "5G端到端网络优化", Status: "进行中", Note: "优化实施与结果验证"},
	{ID: "P5", Title: "5G全网性能提升", Status: "样章已接入", Note: "性能提升 · 效果评估"},
	{ID: "P6", Title: "5G信令分析", Status: "样章已接入", Note: "信令分析 · 原因定位"},
}

var ProjectTasks = map[string][]Task{
	"P1": {
		{ID: "P1-T1", Title: "室内环境信息采集", Desc: "采集室内覆盖、设备和业务场景信息。"},
		{ID: "P1-T2", Title: "室外环境信息采集", Desc: "整理室外站点、道路和场景边界信息。"},
		{ID: "P1-T3", Title: "投诉信息采集", Desc: "将用户投诉转化为可验证的问题线索。"},
	},
	"P2": {
		{ID: "P2-T1", Title: "DT/CQT测试准备和执行", Desc: "准备设备软件并执行路测与定点测试。"},
		{ID: "P2-T2", Title: "5G网络测试问题处理", Desc: "处理测试中断、定位异常和数据不可用问题。"},
		{ID: "P2-T3", Title: "5G网络测试数据分析", Desc: "形成覆盖、SINR、切换事件等分析结果。"},
	},
	"P3": {
		{ID: "P3-T1", Title: "网管架构识别", Desc: "理解网络信息管理对象与系统结构。"},
		{ID: "P3-T2", Title: "运行状态监控", Desc: "识别告警、状态和性能监控入口。"},
		{ID: "P3-T3", Title: "参数检查与设置", Desc: "检查关键参数并形成管理记录。"},
	},
	"P4": {
		{ID: "P4-T1", Title: "优化实施", Desc: "完成参数调整与策略变更。"},
		{ID: "P4-T2", Title: "结果验证", Desc: "确认优化是否真正达标并闭环。", Active: true},
		{ID: "P4-T3", Title: "报告输出", Desc: "整理验证结论并提出后续建议。"},
	},
	"P5": {
		{ID: "P5-T1", Title: "性能问题归因", Desc: "定位性能瓶颈与容量风险。"},
		{ID: "P5-T2", Title: "全网性能提升方案", Desc: "组合多维指标形成提升策略。"},
		{ID: "P5-T3", Title: "提升效果评估", Desc: "评估全网性能提升结果。"},
	},
	"P6": {
		{ID: "P6-T1", Title: "信令流程识别", Desc: "识别注册、切换、会话等关键信令流程。"},
		{ID: "P6-T2", Title: "异常信令分析", Desc: "从信令交互中定位异常原因。"},
		{ID: "P6-T3", Title: "信令分析报告", Desc: "形成可复核的信令分析结论。"},
	},
}

var P4N04Tasks = []Task{
	{ID: "N01", Title: "识别验证场景", Desc: "确定需要验证的问题和场景"},
	{ID: "N02", Title: "区分改善与达标", Desc: "判断指标改善与是否达标"},
	{ID: "N03", Title: "读覆盖指标", Desc: "读取RSRP/SINR等覆盖指标"},
	{ID: "N04", Title: "读移动性指标", Desc: "读取切换成功率、掉线等指标", Active: true},
	{ID: "N05", Title: "读体验容量指标", Desc: "读取速率、时延、容量等体验指标"},
	{ID: "N06", Title: "选择判断依据", Desc: "选择关键依据支撑结论"},
	{ID: "N07", Title: "形成验收结论", Desc: "输出可交付的验收结论"},
	{ID: "N08", Title: "修正职业表达", Desc: "优化报告表达，符合规范"},
}

var MobilityMetrics = []Metric{
	{Label: "切换成功率", Value: "94.5%", Target: "目标 ≥ 98%", Status: "未达标", Tone: "danger"},
	{Label: "10次往返重建", Value: "4次", Target: "目标 ≤ 1次", Status: "未达标", Tone: "danger"},
	{Label: "短掉线日志", Value: "1段", Target: "需要复核", Status: "待复核", Tone: "warn"},
}

var GraphNodes = []GraphNode{
	{ID: "CG-01", Title: "信息采集"},
	{ID: "CG-02", Title: "网络测试"},
	{ID: "CG-03", Title: "信息管理"},
	{ID: "CG-04", Title: "优化实施"},
	{ID: "CG-05", Title: "结果验证"},
	{ID: "CG-06", Title: "性能提升"},
	{ID: "CG-07", Title: "信令分析"},
}

var ResourceCards = []ResourceCard{
	{Title: "N04 学生自学页", Desc: "图文讲解 · 步骤演示"},
	{Title: "N04 教师授课页", Desc: "教学课件 · 重点提示"},
	{Title: "N04 投屏页", Desc: "课堂投屏 · 关键步骤"},
	{Title: "移动性指标表", Desc: "参数说明 · 参考阈值"},
	{Title: "路线示意图", Desc: "移动轨迹 · 典型路径"},
}

var TeacherSuggestions = []TeacherSuggestion{
	{Title: "任务组织建议", Desc: "先用投诉场景引出验证问题，再组织指标判断、依据分类和结论表达。"},
	{Title: "课堂推进建议", Desc: "按“覆盖改善是否足够、移动性是否闭环、证据是否完整”三个问题推进。"},
	{Title: "讲评反馈建议", Desc: "优先讲评切换成功率未达标、重建次数异常和短掉线日志漏读。"},
	{Title: "专业复核建议", Desc: "阈值、指标口径和验收结论需由通信专业教师或行业专家复核。"},
}

var ClassroomTasks = []string{
	"判断投诉发生在静止点还是移动路径？",
	"标注一个未闭环依据，并说明证据来源。",
	"写一句边界结论，说明为什么还会断。",
}

func FindProject(id string) (Project, bool) {
	id = strings.ToUpper(strings.TrimSpace(id))
	for _, project := range Projects {
		if project.ID == id {
			return project, true
		}
	}
	return Project{}, false
}

func CourseOverviewData() CourseOverview {
	return CourseOverview{
		Title:     "5G网络优化教材（高级）",
		Subtitle:  "数字教材 · 项目任务导学 · 课程能力图谱",
		Stats:     CourseStats,
		Projects:  Projects,
		MainRoute: []string{"课程首页", "项目四", "P4-T2结果验证", "N04读移动性指标", "图谱", "教师端"},
	}
}

func ProjectDetailData(projectID string) (ProjectDetail, bool) {
	project, ok := FindProject(projectID)
	if !ok {
		return ProjectDetail{}, false
	}
	return ProjectDetail{
		Project:       project,
		CurrentTask:   currentTaskForProject(project.ID),
		Tasks:         ProjectTasks[project.ID],
		EvidenceFlow:  evidenceFlowForProject(project.ID),
		NextProjectID: nextProjectID(project.ID),
	}, true
}

func TaskDetailData(taskID string) TaskDetail {
	if strings.TrimSpace(taskID) == "" {
		taskID = "P4T2-N04"
	}
	return TaskDetail{
		ID:             taskID,
		Title:          "读移动性指标",
		Question:       "覆盖达标后，为什么移动中仍会断？",
		RoutePoints:    []string{"电梯口", "A-B边界", "食堂入口", "就餐区"},
		Conclusion:     "覆盖已改善，但移动性未闭环",
		Metrics:        MobilityMetrics,
		ClassroomTasks: ClassroomTasks,
		Resources:      ResourceCards,
	}
}

func GraphDetailData(projectID string) (GraphDetail, bool) {
	project, ok := FindProject(projectID)
	if !ok {
		return GraphDetail{}, false
	}
	activeGraph := map[string]string{"P1": "CG-01", "P2": "CG-02", "P3": "CG-03", "P4": "CG-05", "P5": "CG-06", "P6": "CG-07"}[project.ID]
	nodes := make([]GraphNode, len(GraphNodes))
	copy(nodes, GraphNodes)
	for idx := range nodes {
		nodes[idx].Active = nodes[idx].ID == activeGraph
	}
	localNodes := ProjectTasks[project.ID]
	if project.ID == "P4" {
		localNodes = P4N04Tasks
	}
	return GraphDetail{
		Nodes:         nodes,
		LocalTaskID:   project.ID,
		LocalNodes:    localNodes,
		ResourceCards: ResourceCards,
	}, true
}

func currentTaskForProject(projectID string) string {
	if projectID == "P4" {
		return "P4-T2"
	}
	tasks := ProjectTasks[projectID]
	if len(tasks) == 0 {
		return ""
	}
	return tasks[0].ID
}

func evidenceFlowForProject(projectID string) []string {
	if projectID == "P2" {
		return []string{"P2-T3测试数据分析", "输出覆盖/SINR/切换事件", "进入P4-T2结果验证", "形成验收依据"}
	}
	if projectID == "P4" {
		return []string{"P2-T3测试数据分析", "输出数据", "支撑验证维度", "结果验证结论"}
	}
	return []string{"项目任务", "学习资源", "学习活动", "评价产出"}
}

func nextProjectID(projectID string) string {
	ids := []string{"P1", "P2", "P3", "P4", "P5", "P6"}
	for idx, id := range ids {
		if id == projectID && idx+1 < len(ids) {
			return ids[idx+1]
		}
	}
	return ""
}
