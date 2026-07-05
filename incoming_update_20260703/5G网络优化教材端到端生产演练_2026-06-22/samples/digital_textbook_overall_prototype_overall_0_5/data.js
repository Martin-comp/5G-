window.DIGITAL_TEXTBOOK_OVERALL = {
  meta: {
    version: "overall-0.5-integrated",
    title: "5G网络优化教材（高级）",
    subtitle: "整书综合母版原型 overall-0.5",
    stage: "V0.3.13图谱底座 + 项目二闭环 + 项目四闭环 + P4-T2深样章",
    boundary: "本母版用于把已形成的整书框架、项目二闭环、项目四闭环和P4-T2任务级深样章统一到一个入口中。它不是完整数字教材定稿，也不是出版社平台发布稿。",
    deepSampleHref: "../task_workbench_3_5a1_two_period_sample/index.html",
    stage2Href: "../digital_textbook_overall_prototype_phase2_p4_loop/index.html",
    stage3Href: "../digital_textbook_overall_prototype_phase3_p2_loop/index.html",
    baselineHref: "../digital_textbook_overall_prototype/index.html"
  },
  courseStatus: [
    { label: "整书项目", value: "6", note: "课程项目链仍保持完整" },
    { label: "已接入闭环", value: "2", note: "项目二、项目四" },
    { label: "闭环节点", value: "39", note: "P2 19个，P4 20个" },
    { label: "任务级深样章", value: "1", note: "P4-T2 3.5A-1" },
    { label: "深样章候选", value: "1", note: "P2-T3" }
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
      status: "已接入闭环",
      loopStatus: "阶段3闭环复制验证",
      tasks: [
        { id: "P2-T1", title: "任务1：DT/CQT测试准备和执行", status: "项目级样稿", activity: "确认测试任务、准备设备软件、执行DT/CQT并移交LOG", output: "测试数据交付包" },
        { id: "P2-T2", title: "任务2：5G网络测试问题处理", status: "条件分支样稿", activity: "只在测试中断、定位异常、软件异常或数据不可用时进入", output: "异常处理记录与继续测试判断" },
        { id: "P2-T3", title: "任务3：5G网络测试数据分析", status: "深样章候选", activity: "导入LOG、读取指标、判断异常、归纳原因链并输出分析报告", output: "测试数据分析报告", deepCandidate: true }
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
        { id: "P3-T4", title: "任务4：5G网络参数设置", status: "结构占位", activity: "参数设置记录", output: "参数设置记录" }
      ]
    },
    {
      id: "P4",
      title: "项目四：5G端到端网络优化",
      capabilityNode: "CG-04/CG-05",
      abilityGroup: "优化实施与结果验证",
      goal: "从优化方案实施进入结果验证，再输出优化报告，形成端到端闭环。",
      status: "已接入闭环",
      loopStatus: "阶段2项目级闭环样本",
      tasks: [
        { id: "P4-T1", title: "任务1：5G网络优化方案实施", status: "轻量样稿", activity: "确认优化对象、责任边界和复测入口", output: "优化实施记录与复测验证交接清单" },
        { id: "P4-T2", title: "任务2：5G网络优化结果验证", status: "任务级深样章", activity: "投诉归类、指标判断、依据分类、结论拼装", output: "四段式验收结论", deepSample: true },
        { id: "P4-T3", title: "任务3：5G网络优化报告输出", status: "轻量样稿", activity: "报告口径确认、证据链归集和结论边界修订", output: "优化报告输出样稿与沟通提纲" }
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
      { id: "CG-02", label: "网络测试", project: "P2", status: "阶段3闭环", desc: "完成DT/CQT测试、问题处理和测试数据分析。", next: "CG-03" },
      { id: "CG-03", label: "信息管理", project: "P3", status: "占位", desc: "整理网管、运行监控和参数信息。", next: "CG-04" },
      { id: "CG-04", label: "优化实施", project: "P4", status: "阶段2闭环", desc: "实施优化方案，是结果验证的直接前置环节。", next: "CG-05" },
      { id: "CG-05", label: "结果验证", project: "P4", status: "任务级深样章", desc: "复核优化后是否达到目标，当前以P4-T2作为深样章。", next: "CG-06" },
      { id: "CG-06", label: "性能提升", project: "P5", status: "占位", desc: "在验收基础上继续做全网性能提升。", next: "CG-07" },
      { id: "CG-07", label: "信令分析", project: "P6", status: "占位", desc: "面向复杂问题进行信令级分析和优化。", next: "" }
    ],
    detailNodes: [
      { id: "P2T1-N01", label: "明确测试任务与场景边界", task: "P2-T1", project: "P2", activity: "填写测试任务确认单", output: "测试任务确认单", status: "项目级样稿" },
      { id: "P2T1-N02", label: "核对测试设备与终端状态", task: "P2-T1", project: "P2", activity: "完成设备终端检查", output: "设备终端检查表", status: "项目级样稿" },
      { id: "P2T1-N03", label: "配置测试软件与记录模板", task: "P2-T1", project: "P2", activity: "检查测试软件工程和记录字段", output: "软件配置检查记录", status: "待媒体重绘" },
      { id: "P2T1-N04", label: "规划DT路线与CQT点位", task: "P2-T1", project: "P2", activity: "绘制路线点位说明", output: "DT路线/CQT点位说明", status: "待专业复核" },
      { id: "P2T1-N05", label: "执行DT测试并记录过程", task: "P2-T1", project: "P2", activity: "记录行驶、采样、事件和异常", output: "DT测试执行记录", status: "项目级样稿" },
      { id: "P2T1-N06", label: "执行CQT测试并记录过程", task: "P2-T1", project: "P2", activity: "记录定点测试项目和结果", output: "CQT测试执行记录", status: "项目级样稿" },
      { id: "P2T1-N07", label: "整理LOG与测试数据交付包", task: "P2-T1", project: "P2", activity: "核验LOG、GPS、截图和现场记录", output: "测试数据交付包", status: "项目级样稿" },
      { id: "P2T2-N01", label: "识别测试中断与数据不可用风险", task: "P2-T2", project: "P2", activity: "判断是否进入异常处理分支", output: "异常进入判断单", status: "条件分支样稿" },
      { id: "P2T2-N02", label: "排查设备终端和软件问题", task: "P2-T2", project: "P2", activity: "按设备、终端、软件、工程文件顺序排查", output: "本地排查记录", status: "条件分支样稿" },
      { id: "P2T2-N03", label: "处理GPS、时间和采样异常", task: "P2-T2", project: "P2", activity: "识别定位漂移、时间不一致和采样缺口", output: "数据可用性修正记录", status: "待专业复核" },
      { id: "P2T2-N04", label: "完成升级沟通与继续测试判断", task: "P2-T2", project: "P2", activity: "决定继续、重测、补测或升级", output: "升级沟通记录与继续测试判断", status: "条件分支样稿" },
      { id: "P2T3-N01", label: "确认数据来源与分析目标", task: "P2-T3", project: "P2", activity: "区分DT、CQT、投诉和网管侧数据用途", output: "数据分析任务单", status: "深样章候选" },
      { id: "P2T3-N02", label: "完成LOG导入与报告导出", task: "P2-T3", project: "P2", activity: "导入LOG并导出基础报告", output: "导入导出流程记录", status: "深样章候选" },
      { id: "P2T3-N03", label: "识读关键指标与判断边界", task: "P2-T3", project: "P2", activity: "读取RSRP、SINR、速率、时延、掉线和切换指标", output: "指标读法与边界表", status: "深样章候选" },
      { id: "P2T3-N04", label: "判断覆盖类异常", task: "P2-T3", project: "P2", activity: "用指标和场景证据判断弱覆盖或越区覆盖", output: "覆盖异常判断记录", status: "深样章候选" },
      { id: "P2T3-N05", label: "判断移动性与邻区异常", task: "P2-T3", project: "P2", activity: "识别切换失败、邻区漏配或乒乓切换线索", output: "移动性异常证据链", status: "深样章候选" },
      { id: "P2T3-N06", label: "归纳问题类型与原因链", task: "P2-T3", project: "P2", activity: "把指标现象、场景和可能原因连成证据链", output: "异常问题清单", status: "深样章候选" },
      { id: "P2T3-N07", label: "制定整改建议", task: "P2-T3", project: "P2", activity: "把建议写成可复核、不过度承诺的表达", output: "整改建议卡", status: "深样章候选" },
      { id: "P2T3-N08", label: "输出分析报告并连接复测", task: "P2-T3", project: "P2", activity: "形成测试数据分析报告并说明后续复测入口", output: "测试数据分析报告", status: "深样章候选" },
      { id: "P4T1-N01", label: "明确优化对象与实施边界", task: "P4-T1", project: "P4", activity: "填写优化实施任务单", output: "优化实施任务单", status: "轻量样稿" },
      { id: "P4T1-N02", label: "区分优化动作类型与责任边界", task: "P4-T1", project: "P4", activity: "填写优化动作分类与责任边界表", output: "优化动作分类与责任边界表", status: "轻量样稿" },
      { id: "P4T1-N03", label: "读取关键参数与变更依据", task: "P4-T1", project: "P4", activity: "标注关键参数和待复核信息", output: "参数依据记录表", status: "待媒体重绘" },
      { id: "P4T1-N04", label: "制定实施步骤与风险回退检查", task: "P4-T1", project: "P4", activity: "排序实施步骤并补充回退条件", output: "实施步骤与回退检查单", status: "待专业复核" },
      { id: "P4T1-N05", label: "记录实施结果与变更凭据", task: "P4-T1", project: "P4", activity: "填写变更前后状态和证据记录", output: "优化实施变更记录", status: "待专业复核" },
      { id: "P4T1-N06", label: "形成复测验证入口并交接P4-T2", task: "P4-T1", project: "P4", activity: "汇总复测场景、指标和交接材料", output: "复测验证交接清单", status: "轻量样稿" },
      { id: "P4T2-N01", label: "识别验证场景", task: "P4-T2", project: "P4", activity: "投诉线索归类", output: "投诉到验证对象映射", status: "任务级深样章" },
      { id: "P4T2-N02", label: "区分改善与达标", task: "P4-T2", project: "P4", activity: "结论边界修正", output: "已达标依据和未闭环边界", status: "任务级深样章" },
      { id: "P4T2-N03", label: "读覆盖指标", task: "P4-T2", project: "P4", activity: "验证流程排序", output: "覆盖指标判断", status: "任务级深样章" },
      { id: "P4T2-N04", label: "读移动性指标", task: "P4-T2", project: "P4", activity: "移动性流程排序", output: "移动性验证流程", status: "任务级深样章" },
      { id: "P4T2-N05", label: "读体验与容量指标", task: "P4-T2", project: "P4", activity: "指标行标注", output: "通过依据和边界指标", status: "任务级深样章" },
      { id: "P4T2-N06", label: "选择判断依据", task: "P4-T2", project: "P4", activity: "依据分类", output: "依据链分类结果", status: "任务级深样章" },
      { id: "P4T2-N07", label: "形成验收结论", task: "P4-T2", project: "P4", activity: "结论拼装与提交", output: "四段式验收结论", status: "任务级深样章" },
      { id: "P4T2-N08", label: "修正职业表达", task: "P4-T2", project: "P4", activity: "结论修改与自评", output: "修正后的职业表达", status: "任务级深样章" },
      { id: "P4T3-N01", label: "明确报告对象与交付口径", task: "P4-T3", project: "P4", activity: "填写报告交付口径确认单", output: "报告交付口径确认单", status: "轻量样稿" },
      { id: "P4T3-N02", label: "归集实施与验证证据", task: "P4-T3", project: "P4", activity: "整理实施记录、验证结论和测试分析材料", output: "报告证据链清单", status: "待专业复核" },
      { id: "P4T3-N03", label: "选择报告结构并组织材料", task: "P4-T3", project: "P4", activity: "选择报告结构并排列材料", output: "报告结构草稿", status: "待编辑复核" },
      { id: "P4T3-N04", label: "对比指标并写出结论边界", task: "P4-T3", project: "P4", activity: "改写过度结论并形成边界表达", output: "指标对比结论段", status: "待专业复核" },
      { id: "P4T3-N05", label: "编写典型案例分析段落", task: "P4-T3", project: "P4", activity: "补齐问题、原因、措施、证据和边界", output: "典型案例分析段", status: "待媒体重绘" },
      { id: "P4T3-N06", label: "修订报告表达并准备客户沟通", task: "P4-T3", project: "P4", activity: "删除越权承诺并形成沟通提纲", output: "优化报告输出样稿与沟通提纲", status: "待编辑复核" }
    ]
  },
  loops: {
    P2: {
      title: "项目二闭环：测试采集主线 + 异常处理分支 + 数据分析输出",
      boundary: "P2-T1是正常主线入口，P2-T2只在测试异常或数据不可用时进入，P2-T3是数据分析输出和下一步任务级深样章候选。",
      route: [
        { id: "P2-T1", title: "DT/CQT测试准备和执行", role: "主线入口", focus: "先确认任务、场景、设备软件、路线点位和数据交付要求。", output: "测试数据交付包" },
        { id: "P2-T2", title: "5G网络测试问题处理", role: "条件分支", focus: "只在测试中断、定位异常、软件异常或数据不可用时进入。", output: "异常处理记录与继续测试判断" },
        { id: "P2-T3", title: "5G网络测试数据分析", role: "分析出口", focus: "把LOG、指标、场景和问题原因组织成可复核分析报告。", output: "测试数据分析报告", deepCandidate: true }
      ],
      evidenceChain: [
        { from: "P2-T1", to: "P2-T3", text: "测试任务确认、路线点位、LOG和现场记录直接进入数据分析，这是正常主线。" },
        { from: "P2-T1", to: "P2-T2", text: "测试中断、定位异常、软件异常或数据不可用时，才进入异常处理分支。" },
        { from: "P2-T2", to: "P2-T3", text: "异常处理结论决定哪些数据可用、哪些需剔除、哪些必须补测或重测。" },
        { from: "P2-T3", to: "P4-T2", text: "测试数据分析报告可成为后续优化结果验证的证据来源，但不能替代优化后复测。" }
      ]
    },
    P4: {
      title: "项目四闭环：优化实施 + 结果验证 + 报告输出",
      boundary: "P4-T1和P4-T3是轻量样稿，P4-T2是已完成的任务级深样章锚点。项目四用于证明一个项目级闭环可以在整书中连通。",
      route: [
        { id: "P4-T1", title: "5G网络优化方案实施", role: "实施入口", focus: "确认问题、依据、边界和复测入口。", output: "优化实施记录与复测验证交接清单" },
        { id: "P4-T2", title: "5G网络优化结果验证", role: "任务级深样章", focus: "判断哪些达标、哪些只是改善、哪些仍未闭环。", output: "四段式验收结论", deepSample: true },
        { id: "P4-T3", title: "5G网络优化报告输出", role: "表达出口", focus: "把实施证据和验证结论组织成可复核报告。", output: "优化报告样稿与沟通提纲" }
      ],
      evidenceChain: [
        { from: "P4-T1", to: "P4-T2", text: "优化实施记录和复测交接清单进入结果验证，不直接宣称优化成功。" },
        { from: "P4-T2", to: "P4-T3", text: "验收结论、依据链和边界表达进入优化报告，防止报告空泛化。" },
        { from: "P4-T3", to: "P4-T2", text: "写报告时发现证据不足或边界混乱，应回到结果验证补证据或修正判断。" }
      ]
    }
  },
  resources: [
    { id: "R-P2T1-01", title: "测试任务确认单", type: "学习单", project: "P2", task: "P2-T1", node: "P2T1-N01", status: "项目级样稿", audit: "场景口径待专业复核" },
    { id: "R-P2T1-02", title: "设备终端检查表", type: "表格/互动", project: "P2", task: "P2-T1", node: "P2T1-N02", status: "项目级样稿", audit: "设备型号需泛化处理" },
    { id: "R-P2T1-03", title: "测试软件配置示意图", type: "重绘图片", project: "P2", task: "P2-T1", node: "P2T1-N03", status: "需重绘", audit: "原软件截图不可直接发布" },
    { id: "R-P2T1-04", title: "DT路线/CQT点位说明模板", type: "地图/表格", project: "P2", task: "P2-T1", node: "P2T1-N04", status: "项目级样稿", audit: "真实路线需脱敏" },
    { id: "R-P2T2-01", title: "异常进入判断单", type: "互动/分支", project: "P2", task: "P2-T2", node: "P2T2-N01", status: "项目级样稿", audit: "不得固定带入P2-T2" },
    { id: "R-P2T3-01", title: "LOG导入导出流程", type: "动画脚本", project: "P2", task: "P2-T3", node: "P2T3-N02", status: "待制作", audit: "软件界面需教学化重绘" },
    { id: "R-P2T3-02", title: "关键指标读法与边界表", type: "表格/术语", project: "P2", task: "P2-T3", node: "P2T3-N03", status: "深样章候选资源", audit: "阈值待专业复核" },
    { id: "R-P2T3-03", title: "测试数据分析报告模板", type: "报告模板", project: "P2", task: "P2-T3", node: "P2T3-N08", status: "项目级样稿", audit: "报告口径待编辑复核" },
    { id: "R-P4T1-01", title: "优化实施任务单", type: "学习单", project: "P4", task: "P4-T1", node: "P4T1-N01", status: "轻量样稿", audit: "待专业复核" },
    { id: "R-P4T1-02", title: "优化动作分类与责任边界表", type: "表格/互动", project: "P4", task: "P4-T1", node: "P4T1-N02", status: "轻量样稿", audit: "工程授权边界待复核" },
    { id: "R-P4T2-01", title: "P4-T2任务级深样章", type: "直接呈现样章", project: "P4", task: "P4-T2", node: "P4T2-N01-P4T2-N08", status: "3.5A-1评审准备版", audit: "待一线试看和专业复核" },
    { id: "R-P4T3-01", title: "报告交付口径确认单", type: "学习单", project: "P4", task: "P4-T3", node: "P4T3-N01", status: "轻量样稿", audit: "客户沟通边界待复核" },
    { id: "R-P4T3-02", title: "报告证据链清单", type: "表格", project: "P4", task: "P4-T3", node: "P4T3-N02", status: "轻量样稿", audit: "证据来源待专业复核" },
    { id: "R-ALL-01", title: "全书媒体池", type: "图片/截图", project: "全书", task: "多任务", node: "多节点", status: "已抽取，未治理完成", audit: "不可默认发布" },
    { id: "R-ALL-02", title: "课程能力图谱主数据", type: "结构化数据", project: "全书", task: "18个任务", node: "CG-01-CG-07", status: "V0.3.13推荐基线", audit: "需后续专家复核图谱合理性" }
  ],
  teacherSupport: [
    { title: "整书带教入口", body: "教师先看课程项目链和两个已接入闭环，判断本轮课堂是进入项目四结果验证，还是进入项目二测试分析。" },
    { title: "项目二带教", body: "P2-T1控制测试任务和数据交付质量；出现异常才进入P2-T2；数据可用后进入P2-T3讲评指标解释和报告表达。" },
    { title: "项目四带教", body: "P4-T1说明优化实施边界，P4-T2使用3.5A-1深样章组织两课时学习，P4-T3讲评报告证据链和客户沟通边界。" },
    { title: "图谱使用边界", body: "完整图谱用于教师、编辑和专家评审；学生端只应看到与当前任务相关的局部路径。" },
    { title: "外部门禁", body: "通信专业复核、媒体重绘/审查、真实一线试看和出版社平台接口均未完成，不能写成正式教学验证通过。" }
  ],
  publication: [
    { title: "资源包输出", state: "当前只形成项目二和项目四的资源治理位置，不是正式出版社资源包。" },
    { title: "直接呈现挂接", state: "P4-T2已有3.5A-1任务级深样章入口；P2-T3只作为候选，不伪造页面入口。" },
    { title: "版本追溯", state: "overall-0.2、阶段2项目四原型、阶段3项目二原型均保留为追溯入口。" },
    { title: "平台接口", state: "暂不接入真实出版社平台接口，仅保留挂接位置和状态说明。" },
    { title: "质量检测", state: "可执行浏览器QA；内容专业复核、媒体版权审查、数据脱敏和一线试看仍需外部流程。" }
  ]
};
