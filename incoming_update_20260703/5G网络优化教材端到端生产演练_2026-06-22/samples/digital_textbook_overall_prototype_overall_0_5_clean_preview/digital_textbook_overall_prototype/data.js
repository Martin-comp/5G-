window.DIGITAL_TEXTBOOK_OVERALL = {
  meta: {
    version: "overall-0.2",
    title: "5G网络优化教材（高级）",
    subtitle: "数字教材整体原型",
    stage: "横向整书框架 + 四任务图谱关系层 + 项目四任务2纵向深样章",
    boundary: "本原型用于验证整书层级、课程能力图谱暗线和多角色流转。除项目四任务2外，其他任务尚未形成完整教材正文；P2-T3、P5-T3、P6-T2仅作为课程能力图谱关系层试拆样本。",
    deepSampleHref: "../task_workbench_3_5a1_two_period_sample/index.html"
  },
  courseStatus: [
    { label: "项目", value: "6", note: "来自全书结构抽取" },
    { label: "任务", value: "18", note: "项目四任务2已深样章化" },
    { label: "课程主链", value: "7", note: "贯穿采集、测试、管理、优化、验证、提升、信令" },
    { label: "关系层任务", value: "4", note: "P2-T3、P4-T2、P5-T3、P6-T2" },
    { label: "深样章", value: "1", note: "P4-T2：5G网络优化结果验证" }
  ],
  projects: [
    {
      id: "P1",
      title: "项目一：5G网络信息采集",
      capabilityNode: "CG-01",
      abilityGroup: "信息采集",
      goal: "完成室内、室外和投诉信息采集，为后续测试和优化建立事实基础。",
      status: "结构占位",
      tasks: [
        { id: "P1-T1", title: "任务1：室内环境信息采集", status: "结构占位", activity: "室内信息核验", output: "采集信息完整性记录" },
        { id: "P1-T2", title: "任务2：室外环境信息采集", status: "结构占位", activity: "室外场景信息整理", output: "室外环境采集清单" },
        { id: "P1-T3", title: "任务3：投诉信息采集", status: "结构占位", activity: "投诉线索分类", output: "投诉线索到验证对象的初步映射" }
      ]
    },
    {
      id: "P2",
      title: "项目二：5G网络测试",
      capabilityNode: "CG-02",
      abilityGroup: "网络测试",
      goal: "完成DT/CQT测试、测试问题处理和测试数据分析，为优化提供可复核数据。",
      status: "结构占位",
      tasks: [
        { id: "P2-T1", title: "任务1：DT/CQT测试准备和执行", status: "结构占位", activity: "测试准备与执行流程排序", output: "测试执行记录" },
        { id: "P2-T2", title: "任务2：5G网络测试问题处理", status: "结构占位", activity: "测试问题归因", output: "问题处理记录和依据说明" },
        { id: "P2-T3", title: "任务3：5G网络测试数据分析", status: "结构占位", activity: "测试数据读表与判断", output: "测试数据分析结论" }
      ]
    },
    {
      id: "P3",
      title: "项目三：5G网络信息管理",
      capabilityNode: "CG-03",
      abilityGroup: "信息管理",
      goal: "识别网管架构、监控运行状态、检查并设置参数，形成可管理的信息基础。",
      status: "结构占位",
      tasks: [
        { id: "P3-T1", title: "任务1：5G网管架构和功能", status: "结构占位", activity: "网管功能识别", output: "网管功能用途说明" },
        { id: "P3-T2", title: "任务2：5G网络运行监控", status: "结构占位", activity: "运行状态读表", output: "监控异常识别记录" },
        { id: "P3-T3", title: "任务3：5G网络参数检查", status: "结构占位", activity: "参数一致性检查", output: "参数异常清单" },
        { id: "P3-T4", title: "任务4：5G网络参数设置", status: "结构占位", activity: "参数设置步骤确认", output: "参数设置记录" }
      ]
    },
    {
      id: "P4",
      title: "项目四：5G端到端网络优化",
      capabilityNode: "CG-04/CG-05",
      abilityGroup: "优化实施与结果验证",
      goal: "从优化方案实施进入结果验证，再输出优化报告，形成端到端闭环。",
      status: "当前重点项目",
      tasks: [
        { id: "P4-T1", title: "任务1：5G网络优化方案实施", status: "结构占位", activity: "优化动作与问题匹配", output: "优化实施记录" },
        { id: "P4-T2", title: "任务2：5G网络优化结果验证", status: "深样章已完成", activity: "投诉归类、流程排序、指标标注、依据分类、结论拼装", output: "包含判断、依据、边界和建议的验收结论", deepSample: true },
        { id: "P4-T3", title: "任务3：5G网络优化报告输出", status: "结构占位", activity: "报告结构组织", output: "优化报告输出样例" }
      ]
    },
    {
      id: "P5",
      title: "项目五：5G全网性能提升",
      capabilityNode: "CG-06",
      abilityGroup: "性能提升",
      goal: "采集全网性能指标、实施性能提升并验证提升效果。",
      status: "结构占位",
      tasks: [
        { id: "P5-T1", title: "任务1：5G全网性能指标采集", status: "结构占位", activity: "性能指标采集", output: "全网指标采集记录" },
        { id: "P5-T2", title: "任务2：5G全网性能提升实施", status: "结构占位", activity: "性能提升动作选择", output: "性能提升实施记录" },
        { id: "P5-T3", title: "任务3：5G全网性能提升验证", status: "结构占位", activity: "性能提升效果验证", output: "提升效果评价结论" }
      ]
    },
    {
      id: "P6",
      title: "项目六：5G信令分析",
      capabilityNode: "CG-07",
      abilityGroup: "信令分析",
      goal: "识读关键信令流程，并对复杂信令问题进行分析与优化。",
      status: "结构占位",
      tasks: [
        { id: "P6-T1", title: "任务1：5G关键信令流程及解析", status: "结构占位", activity: "信令流程识读", output: "信令流程说明" },
        { id: "P6-T2", title: "任务2：5G信令问题分析及优化", status: "结构占位", activity: "信令问题定位", output: "信令问题分析结论" }
      ]
    }
  ],
  graph: {
    relationReviewHref: "../course_capability_graph_v2_relation_review/index.html",
    courseChain: [
      { id: "CG-01", label: "信息采集", project: "P1", status: "占位", desc: "收集投诉、环境、设备和测试前置信息。", next: "CG-02" },
      { id: "CG-02", label: "网络测试", project: "P2", status: "占位", desc: "完成DT/CQT测试、问题处理和测试数据分析。", next: "CG-03" },
      { id: "CG-03", label: "信息管理", project: "P3", status: "占位", desc: "整理网管、运行监控和参数信息。", next: "CG-04" },
      { id: "CG-04", label: "优化实施", project: "P4", status: "占位", desc: "实施优化方案，是结果验证的直接前置环节。", next: "CG-05" },
      { id: "CG-05", label: "结果验证", project: "P4", status: "深样章", desc: "复核优化后是否达到目标，当前以P4-T2作为深样章。", next: "CG-06" },
      { id: "CG-06", label: "性能提升", project: "P5", status: "占位", desc: "在验收基础上继续做全网性能提升。", next: "CG-07" },
      { id: "CG-07", label: "信令分析", project: "P6", status: "占位", desc: "面向复杂问题进行信令级分析和优化。", next: "" }
    ],
    detailNodes: [
      { id: "P4T2-N01", label: "识别验证场景", activity: "投诉线索归类", output: "把投诉归到覆盖、移动性、体验或容量验证对象" },
      { id: "P4T2-N02", label: "区分改善与达标", activity: "结论边界修正", output: "写出已达标依据和未闭环边界" },
      { id: "P4T2-N03", label: "读覆盖指标", activity: "验证流程排序", output: "说明覆盖指标能支持什么、不能证明什么" },
      { id: "P4T2-N04", label: "读移动性指标", activity: "移动性流程排序", output: "排出移动性验证流程" },
      { id: "P4T2-N05", label: "读体验与容量指标", activity: "指标行标注", output: "标出通过依据和边界指标" },
      { id: "P4T2-N06", label: "选择判断依据", activity: "依据分类", output: "整理通过依据、边界和背景信息" },
      { id: "P4T2-N07", label: "形成验收结论", activity: "结论拼装与提交", output: "形成判断、依据、边界、建议四段式结论" },
      { id: "P4T2-N08", label: "修正职业表达", activity: "结论修改与自评", output: "修正过度判断、依据不足和边界缺失" }
    ]
  },
  resources: [
    { id: "R-01", title: "投诉线索归类互动", type: "互动", project: "P4", task: "P4-T2", node: "P4T2-N01", status: "样章内已有学习活动", audit: "教学模拟，待专业复核" },
    { id: "R-02", title: "覆盖/移动性指标表", type: "表格", project: "P4", task: "P4-T2", node: "P4T2-N03/P4T2-N04", status: "样章内已有", audit: "阈值待专业复核" },
    { id: "R-03", title: "指标行标注活动", type: "互动", project: "P4", task: "P4-T2", node: "P4T2-N05", status: "样章内已有学习活动", audit: "教学模拟，待专业复核" },
    { id: "R-04", title: "结论拼装与修正句", type: "学习单", project: "P4", task: "P4-T2", node: "P4T2-N07/P4T2-N08", status: "样章内已有", audit: "待一线试看" },
    { id: "R-05", title: "教师2课时带教材料", type: "教师材料", project: "P4", task: "P4-T2", node: "P4T2-N01-P4T2-N08", status: "样章内已有", audit: "待一线教师试看" },
    { id: "R-06", title: "全书媒体池", type: "图片/截图", project: "全书", task: "多任务", node: "多节点", status: "已抽取，未治理完成", audit: "不可默认发布" },
    { id: "R-07", title: "课程能力图谱跨层映射表", type: "结构化数据", project: "全书", task: "18个任务", node: "CG-01-CG-07", status: "已形成", audit: "需后续专家复核图谱合理性" }
  ],
  teacherSupport: [
    { title: "课程教学总览", body: "查看6个项目、18个任务和课程能力图谱主链，判断当前班级应推进到哪一段。" },
    { title: "项目四带教", body: "项目四按照方案实施、结果验证、报告输出组织。任务2当前可进入深样章。" },
    { title: "任务2课堂组织", body: "沿用3.5A-1的2课时安排、关键提问、典型答案、模拟学情和专业复核表。" },
    { title: "外部门禁", body: "真实一线试看、通信专业复核和出版社平台接口均未完成，不能写成已验证。" }
  ],
  publication: [
    { title: "资源包输出", state: "已有P4-T2样本资源包，整体原型阶段只展示整书资源中心和审核状态。" },
    { title: "直接呈现挂接", state: "3.5A-1可作为单任务直接呈现样章；整体原型将新增整书入口。" },
    { title: "平台接口", state: "暂不接入真实出版社平台接口，仅保留挂接位置和状态说明。" },
    { title: "质量检测", state: "浏览器QA可执行；内容专业复核、媒体版权审查、一线试看仍需外部流程。" }
  ]
};
