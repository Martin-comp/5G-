window.DIGITAL_TEXTBOOK_OVERALL = {
  meta: {
    version: "overall-0.3-phase2-p4",
    title: "5G网络优化教材（高级）",
    subtitle: "阶段2项目四小范围内容闭环原型",
    stage: "V0.3.13图谱底座 + 项目四P4-T1/P4-T2/P4-T3内容闭环",
    boundary: "本原型用于验证项目四从优化方案实施、结果验证到报告输出的教材闭环。P4-T2继续复用3.5A-1深样章，P4-T1和P4-T3为阶段2轻量内容样稿；其余项目仍为整书结构占位。",
    deepSampleHref: "../task_workbench_3_5a1_two_period_sample/index.html"
  },
  courseStatus: [
    { label: "项目", value: "6", note: "来自全书结构抽取" },
    { label: "项目四闭环任务", value: "3", note: "P4-T1、P4-T2、P4-T3" },
    { label: "项目四详细节点", value: "20", note: "来自V0.3.13当前主数据" },
    { label: "深样章", value: "1", note: "P4-T2：5G网络优化结果验证" },
    { label: "轻量样稿", value: "2", note: "P4-T1和P4-T3用于闭环验证" }
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
      status: "阶段2闭环样本",
      tasks: [
        { id: "P4-T1", title: "任务1：5G网络优化方案实施", status: "阶段2轻量样稿", activity: "确认优化对象、责任边界、参数依据、实施步骤和复测交接", output: "优化实施记录与复测验证交接清单" },
        { id: "P4-T2", title: "任务2：5G网络优化结果验证", status: "深样章锚点", activity: "投诉归类、流程排序、指标标注、依据分类、结论拼装", output: "包含判断、依据、边界和建议的验收结论", deepSample: true },
        { id: "P4-T3", title: "任务3：5G网络优化报告输出", status: "阶段2轻量样稿", activity: "报告口径确认、证据链归集、结构组织、结论边界和沟通修订", output: "优化报告输出样稿与沟通提纲" }
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
      { id: "P4T1-N01", label: "明确优化对象与实施边界", task: "P4-T1", project: "P4", activity: "填写优化实施任务单", output: "优化实施任务单", status: "阶段2轻量样稿" },
      { id: "P4T1-N02", label: "区分优化动作类型与责任边界", task: "P4-T1", project: "P4", activity: "填写优化动作分类与责任边界表", output: "优化动作分类与责任边界表", status: "阶段2轻量样稿" },
      { id: "P4T1-N03", label: "读取关键参数与变更依据", task: "P4-T1", project: "P4", activity: "标注关键参数和待复核信息", output: "参数依据记录表", status: "待媒体重绘" },
      { id: "P4T1-N04", label: "制定实施步骤与风险回退检查", task: "P4-T1", project: "P4", activity: "排序实施步骤并补充回退条件", output: "实施步骤与回退检查单", status: "待专业复核" },
      { id: "P4T1-N05", label: "记录实施结果与变更凭据", task: "P4-T1", project: "P4", activity: "填写变更前后状态和证据记录", output: "优化实施变更记录", status: "待专业复核" },
      { id: "P4T1-N06", label: "形成复测验证入口并交接P4-T2", task: "P4-T1", project: "P4", activity: "汇总复测场景、指标和交接材料", output: "复测验证交接清单", status: "阶段2轻量样稿" },
      { id: "P4T2-N01", label: "识别验证场景", activity: "投诉线索归类", output: "把投诉归到覆盖、移动性、体验或容量验证对象" },
      { id: "P4T2-N02", label: "区分改善与达标", activity: "结论边界修正", output: "写出已达标依据和未闭环边界" },
      { id: "P4T2-N03", label: "读覆盖指标", activity: "验证流程排序", output: "说明覆盖指标能支持什么、不能证明什么" },
      { id: "P4T2-N04", label: "读移动性指标", activity: "移动性流程排序", output: "排出移动性验证流程" },
      { id: "P4T2-N05", label: "读体验与容量指标", activity: "指标行标注", output: "标出通过依据和边界指标" },
      { id: "P4T2-N06", label: "选择判断依据", activity: "依据分类", output: "整理通过依据、边界和背景信息" },
      { id: "P4T2-N07", label: "形成验收结论", activity: "结论拼装与提交", output: "形成判断、依据、边界、建议四段式结论" },
      { id: "P4T2-N08", label: "修正职业表达", activity: "结论修改与自评", output: "修正过度判断、依据不足和边界缺失" },
      { id: "P4T3-N01", label: "明确报告对象与交付口径", task: "P4-T3", project: "P4", activity: "填写报告交付口径确认单", output: "报告交付口径确认单", status: "阶段2轻量样稿" },
      { id: "P4T3-N02", label: "归集实施与验证证据", task: "P4-T3", project: "P4", activity: "整理实施记录、验证结论和测试分析材料", output: "报告证据链清单", status: "待专业复核" },
      { id: "P4T3-N03", label: "选择报告结构并组织材料", task: "P4-T3", project: "P4", activity: "选择报告结构并排列材料", output: "报告结构草稿", status: "待编辑复核" },
      { id: "P4T3-N04", label: "对比指标并写出结论边界", task: "P4-T3", project: "P4", activity: "改写过度结论并形成边界表达", output: "指标对比结论段", status: "待专业复核" },
      { id: "P4T3-N05", label: "编写典型案例分析段落", task: "P4-T3", project: "P4", activity: "补齐问题、原因、措施、证据和边界", output: "典型案例分析段", status: "待媒体重绘" },
      { id: "P4T3-N06", label: "修订报告表达并准备客户沟通", task: "P4-T3", project: "P4", activity: "删除越权承诺并形成沟通提纲", output: "优化报告输出样稿与沟通提纲", status: "待编辑复核" }
    ]
  },
  resources: [
    { id: "R-P4T1-01", title: "优化实施任务单", type: "学习单", project: "P4", task: "P4-T1", node: "P4T1-N01", status: "阶段2轻量样稿", audit: "待专业复核" },
    { id: "R-P4T1-02", title: "优化动作分类与责任边界表", type: "表格/互动", project: "P4", task: "P4-T1", node: "P4T1-N02", status: "阶段2轻量样稿", audit: "工程授权边界待复核" },
    { id: "R-P4T1-03", title: "教学化参数依据表", type: "重绘表格", project: "P4", task: "P4-T1", node: "P4T1-N03", status: "需重绘", audit: "原仿真截图不可直接发布" },
    { id: "R-P4T1-04", title: "实施步骤与回退检查单", type: "学习单", project: "P4", task: "P4-T1", node: "P4T1-N04/P4T1-N05/P4T1-N06", status: "阶段2轻量样稿", audit: "待专业复核" },
    { id: "R-01", title: "投诉线索归类互动", type: "互动", project: "P4", task: "P4-T2", node: "P4T2-N01", status: "样章内已有学习活动", audit: "教学模拟，待专业复核" },
    { id: "R-02", title: "覆盖/移动性指标表", type: "表格", project: "P4", task: "P4-T2", node: "P4T2-N03/P4T2-N04", status: "样章内已有", audit: "阈值待专业复核" },
    { id: "R-03", title: "指标行标注活动", type: "互动", project: "P4", task: "P4-T2", node: "P4T2-N05", status: "样章内已有学习活动", audit: "教学模拟，待专业复核" },
    { id: "R-04", title: "结论拼装与修正句", type: "学习单", project: "P4", task: "P4-T2", node: "P4T2-N07/P4T2-N08", status: "样章内已有", audit: "待一线试看" },
    { id: "R-05", title: "教师2课时带教材料", type: "教师材料", project: "P4", task: "P4-T2", node: "P4T2-N01-P4T2-N08", status: "样章内已有", audit: "待一线教师试看" },
    { id: "R-P4T3-01", title: "报告交付口径确认单", type: "学习单", project: "P4", task: "P4-T3", node: "P4T3-N01", status: "阶段2轻量样稿", audit: "客户沟通边界待复核" },
    { id: "R-P4T3-02", title: "报告证据链清单", type: "表格", project: "P4", task: "P4-T3", node: "P4T3-N02", status: "阶段2轻量样稿", audit: "证据来源待专业复核" },
    { id: "R-P4T3-03", title: "指标结论改写活动", type: "互动/学习单", project: "P4", task: "P4-T3", node: "P4T3-N04", status: "阶段2轻量样稿", audit: "阈值和结论口径待复核" },
    { id: "R-P4T3-04", title: "典型案例分析段与沟通提纲", type: "报告模板", project: "P4", task: "P4-T3", node: "P4T3-N05/P4T3-N06", status: "阶段2轻量样稿", audit: "截图需重绘，客户承诺边界待复核" },
    { id: "R-06", title: "全书媒体池", type: "图片/截图", project: "全书", task: "多任务", node: "多节点", status: "已抽取，未治理完成", audit: "不可默认发布" },
    { id: "R-07", title: "课程能力图谱跨层映射表", type: "结构化数据", project: "全书", task: "18个任务", node: "CG-01-CG-07", status: "已形成", audit: "需后续专家复核图谱合理性" }
  ],
  phase2Loop: {
    title: "项目四小范围内容闭环",
    boundary: "本闭环只验证项目四三任务能否在整书原型中连起来。P4-T1和P4-T3为轻量样稿，P4-T2为深样章锚点，三者都不得写成专业定稿。",
    route: [
      { id: "P4-T1", title: "优化方案实施", focus: "先确认问题、依据、边界和复测入口。", output: "优化实施记录与复测验证交接清单" },
      { id: "P4-T2", title: "优化结果验证", focus: "判断哪些达标、哪些只是改善、哪些仍未闭环。", output: "四段式验收结论" },
      { id: "P4-T3", title: "优化报告输出", focus: "把实施证据和验证结论组织成可复核报告。", output: "优化报告样稿与沟通提纲" }
    ],
    taskSamples: [
      {
        id: "P4-T1",
        title: "5G网络优化方案实施",
        role: "实施入口",
        openingCase: "宿舍区晚高峰视频卡顿、局部弱覆盖和疑似参数问题并存。学生不能马上写“调整参数”，要先确认优化对象、实施边界、责任归属和复测入口。",
        studentRead: "优化实施不是凭经验动手，而是把前序整改建议转成受控行动。你要先说明这次解决什么问题、依据来自哪里、哪些动作需要授权、做完以后交给谁验证。",
        steps: [
          "填写优化实施任务单：写清问题现象、前序依据、优化对象和不能直接操作的内容。",
          "完成责任边界表：把天线、无线、承载网、核心网相关动作分清，并说明授权边界。",
          "标注参数依据：说明参数能支持什么判断，还缺哪些复核信息。",
          "排序实施步骤：补充影响范围、回退条件和复核人。",
          "形成复测交接：把需复测场景、指标和对比口径交给P4-T2。"
        ],
        completion: "学生提交优化实施任务单、责任边界表、参数依据记录表、实施步骤与回退检查单、变更记录和复测交接清单。",
        teacherUse: "教师重点追问依据、授权、影响范围和复测入口，避免学生把软件操作当成优化能力。"
      },
      {
        id: "P4-T2",
        title: "5G网络优化结果验证",
        role: "判断中枢",
        openingCase: "优化后数据看起来变好了，但这不等于所有问题都能验收。学生要从投诉场景、指标表和依据链中判断哪些达标、哪些仍需写边界。",
        studentRead: "本任务继续打开3.5A-1深样章学习。你要学会把验证对象分清，把改善和达标分清，把结论写成判断、依据、边界和建议四部分。",
        steps: [
          "识别验证场景：把投诉线索归入覆盖、移动性、体验或容量。",
          "区分改善与达标：把已达标依据和未闭环边界分开写。",
          "读取多类指标：说明覆盖、移动性、体验和容量指标各自能证明什么。",
          "整理依据链：区分通过依据、必须写边界和背景信息。",
          "提交四段式验收结论，并完成二次修正。"
        ],
        completion: "学生提交四段式验收结论和修订记录。",
        teacherUse: "教师使用2课时深样章材料组织课堂，重点讲评过度结论、依据不足和边界缺失。"
      },
      {
        id: "P4-T3",
        title: "5G网络优化报告输出",
        role: "表达出口",
        openingCase: "项目组需要一份优化报告。学生不能只套模板，也不能把未复核的指标写成客户承诺，而要把实施记录、验证结论和未闭环问题组织成可复核报告。",
        studentRead: "报告不是标题集合。你要先确认报告对象和交付口径，再归集证据、选择结构、改写结论边界，最后修订客户沟通表达。",
        steps: [
          "填写报告交付口径确认单：说明报告写给谁、按什么口径写、哪些不能承诺。",
          "整理报告证据链：把实施依据、实施过程、验证结果和边界材料分开。",
          "选择报告结构：按问题概述、优化措施、验证结果、结论边界和后续建议组织材料。",
          "改写指标结论：把“优化成功”改成有依据和边界的表达。",
          "形成报告样稿与沟通提纲，删除越权承诺。"
        ],
        completion: "学生提交报告交付口径确认单、报告证据链清单、结构草稿、指标对比结论段、典型案例分析段、报告样稿与沟通提纲。",
        teacherUse: "教师重点检查证据是否来自P4-T1/P4-T2，结论是否过满，客户沟通是否越权。"
      }
    ],
    evidenceChain: [
      { from: "P4-T1", to: "P4-T2", text: "优化实施记录和复测交接清单进入结果验证，不直接宣称优化成功。" },
      { from: "P4-T2", to: "P4-T3", text: "验收结论、依据链和边界表达进入优化报告，防止报告空泛化。" },
      { from: "P4-T3", to: "P4-T2", text: "写报告时发现证据不足或边界混乱，应回到结果验证补证据或修正判断。" }
    ]
  },
  teacherSupport: [
    { title: "课程教学总览", body: "查看6个项目、18个任务和课程能力图谱主链，判断当前班级应推进到哪一段。" },
    { title: "项目四带教", body: "项目四按照方案实施、结果验证、报告输出组织。阶段2已形成P4-T1轻量样稿、P4-T2深样章锚点和P4-T3轻量样稿。" },
    { title: "任务1课堂组织", body: "先讲案例和边界，再让学生填实施任务单、责任边界表、参数依据记录和复测交接清单。" },
    { title: "任务2课堂组织", body: "沿用3.5A-1的2课时安排、关键提问、典型答案、模拟学情和专业复核表。" },
    { title: "任务3课堂组织", body: "围绕报告对象、证据链、结论边界和客户沟通组织，避免报告变成模板标题集合。" },
    { title: "外部门禁", body: "真实一线试看、通信专业复核和出版社平台接口均未完成，不能写成已验证。" }
  ],
  publication: [
    { title: "资源包输出", state: "阶段2已形成项目四三任务资源活动评价清单；P4-T1/P4-T3仍为轻量样稿，不能作为正式资源包发布。" },
    { title: "直接呈现挂接", state: "3.5A-1可作为单任务直接呈现样章；阶段2原型展示项目四闭环入口和三任务流转。" },
    { title: "平台接口", state: "暂不接入真实出版社平台接口，仅保留挂接位置和状态说明。" },
    { title: "质量检测", state: "浏览器QA可执行；内容专业复核、媒体版权审查、一线试看仍需外部流程。" }
  ]
};
