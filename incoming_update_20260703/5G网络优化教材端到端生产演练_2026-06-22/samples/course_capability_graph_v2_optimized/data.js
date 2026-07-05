window.COURSE_CAPABILITY_GRAPH_V2 = {
  meta: {
    version: "v2-optimized-four-task-chain",
    title: "课程能力图谱V2优化版",
    boundary: "本版用于验证课程能力图谱模型是否从目录映射升级为岗位工作过程图谱，并通过P2-T3、P4-T2、P5-T3、P6-T2四任务链条检验迁移能力。"
  },
  basis: [
    {
      id: "B-01",
      title: "专业教学标准",
      body: "移动通信网络规划与优化涉及站点勘察、网络测试、数据分析、信令分析、优化方案、优化实施和报告输出。"
    },
    {
      id: "B-02",
      title: "岗位任务",
      body: "面向信息通信网络运行、维护、管理与优化，强调分析网络运行状况、提出优化建议、制定方案、评估效果。"
    },
    {
      id: "B-03",
      title: "数字教材标准",
      body: "资源、题目、实训任务、评价、审核状态和使用数据需要结构化挂接。"
    },
    {
      id: "B-04",
      title: "职业教育关键要素改革",
      body: "课程能力图谱应按产业环节、生产流程和职业逻辑组织，而不是按传统章节孤立组织。"
    }
  ],
  jobProcesses: [
    { id: "JP-01", title: "明确场景与需求", desc: "收集站点、场景、投诉和业务需求，判断要解决什么问题。", tasks: ["P1-T1", "P1-T2", "P1-T3"], basis: ["B-01", "B-04"] },
    { id: "JP-02", title: "组织测试与采集数据", desc: "设计并执行DT/CQT、业务体验和必要专项测试。", tasks: ["P2-T1"], basis: ["B-01", "B-04"] },
    { id: "JP-03", title: "整理数据与识读指标", desc: "处理测试、监控、参数和日志材料，形成可判断的数据基础。", tasks: ["P2-T2", "P2-T3", "P3-T2", "P3-T3"], basis: ["B-01", "B-03"] },
    { id: "JP-04", title: "定位问题与制定方案", desc: "识别覆盖、干扰、切换、容量、体验等问题，并形成优化方案。", tasks: ["P2-T2", "P3-T3", "P4-T1"], basis: ["B-01", "B-02"] },
    { id: "JP-05", title: "实施优化与记录变更", desc: "执行参数、工程、容量或策略优化，并记录实施依据。", tasks: ["P3-T4", "P4-T1"], basis: ["B-02"] },
    { id: "JP-06", title: "验证效果与表达结论", desc: "复测优化效果，形成判断、依据、边界和报告表达。", tasks: ["P4-T2", "P4-T3"], basis: ["B-01", "B-03"] },
    { id: "JP-07", title: "持续提升与复杂复盘", desc: "对未闭环问题做性能提升、信令分析和复杂问题复盘。", tasks: ["P5-T1", "P5-T2", "P5-T3", "P6-T1", "P6-T2"], basis: ["B-01", "B-02"] }
  ],
  abilityUnits: [
    { id: "AU-01", title: "场景、站点与投诉信息采集", process: "JP-01", tasks: ["P1-T1", "P1-T2", "P1-T3"], goal: "能采集并整理站点、环境、投诉和场景信息。", resources: "采集表、投诉单、场景图", activities: "采集核验、投诉归类", assessment: "采集清单、投诉映射", audit: "待细化" },
    { id: "AU-02", title: "测试准备与测试执行", process: "JP-02", tasks: ["P2-T1"], goal: "能完成DT/CQT测试准备和执行。", resources: "测试任务书、路线图、工具清单", activities: "测试准备核对、流程排序", assessment: "测试执行记录", audit: "待细化" },
    { id: "AU-03", title: "测试问题处理与数据分析", process: "JP-03", tasks: ["P2-T2", "P2-T3"], goal: "能处理测试问题并分析测试数据。", resources: "测试指标表、问题日志、轨迹图", activities: "读表标注、问题归因", assessment: "测试数据分析结论", audit: "P2-T3已试拆；待专业复核", deep: true },
    { id: "AU-04", title: "网管、监控与参数信息管理", process: "JP-03", tasks: ["P3-T1", "P3-T2", "P3-T3", "P3-T4"], goal: "能识别网管功能、监控运行状态并管理参数。", resources: "网管结构图、监控表、参数表", activities: "运行状态读表、参数检查", assessment: "监控异常记录、参数异常清单", audit: "待细化" },
    { id: "AU-05", title: "网络问题定位与方案制定", process: "JP-04", tasks: ["P2-T2", "P3-T3", "P4-T1"], goal: "能从现象和数据定位问题并选择优化动作。", resources: "问题清单、方案卡、参数对比", activities: "问题归因、动作匹配", assessment: "优化方案草案", audit: "待细化" },
    { id: "AU-06", title: "优化实施与变更记录", process: "JP-05", tasks: ["P3-T4", "P4-T1"], goal: "能执行优化方案并保留变更记录。", resources: "操作流程、变更记录表", activities: "步骤排序、风险确认", assessment: "优化实施记录", audit: "待细化" },
    { id: "AU-07", title: "优化结果验证", process: "JP-06", tasks: ["P4-T2"], goal: "能判断优化是否达标，并说明依据和边界。", resources: "指标表、投诉线索卡、学习单、结论卡", activities: "投诉归类、流程排序、指标标注、依据分类", assessment: "验收结论", audit: "已深展开；待专业复核", deep: true },
    { id: "AU-08", title: "优化报告与职业表达", process: "JP-06", tasks: ["P4-T3"], goal: "能将验证结论整理为优化报告和可讲评表达。", resources: "报告模板、结论示例、修改量规", activities: "报告结构组织、结论修订", assessment: "优化报告输出样例", audit: "待细化" },
    { id: "AU-09", title: "全网性能提升与复测", process: "JP-07", tasks: ["P5-T1", "P5-T2", "P5-T3"], goal: "能采集全网指标、实施性能提升并复测效果。", resources: "全网KPI、性能对比图、复测记录", activities: "性能对比、方案选择、复测判断", assessment: "性能提升验证结论", audit: "P5-T3已试拆；有条件成立；待专业复核和媒体审查", deep: true },
    { id: "AU-10", title: "信令分析与复杂问题复盘", process: "JP-07", tasks: ["P6-T1", "P6-T2"], goal: "能解析关键流程并定位复杂信令问题。", resources: "信令流程图、异常日志、复盘单", activities: "流程标注、异常定位、复盘表达", assessment: "信令分析结论", audit: "P6-T2已试拆；有条件成立；待专业复核和媒体审查", deep: true }
  ],
  taskChain: [
    { id: "P2-T3", title: "数据分析", unit: "AU-03/AU-05", desc: "读数据、找异常、提出分析建议。", status: "试拆完成；待专业复核" },
    { id: "P4-T2", title: "结果验证", unit: "AU-07/AU-08", desc: "用优化前后证据判断结果是否可验收。", status: "深样章已实现；待专业复核" },
    { id: "P5-T3", title: "持续提升", unit: "AU-09", desc: "判断全网性能提升是否持续闭环。", status: "试拆完成；待专业复核和媒体审查" },
    { id: "P6-T2", title: "信令复盘", unit: "AU-10", desc: "对未闭环或复杂问题做信令分析和优化复盘。", status: "试拆完成；专业风险高；待专业复核和媒体审查" }
  ],
  deepNodes: [
    { id: "P2T3-N01", title: "明确分析任务与数据来源", unit: "AU-03", task: "P2-T3", resources: "测试任务单、LOG清单、场景说明", activity: "信息核对、分析对象确认", assessment: "数据分析任务单", nodeStatus: "试拆完成", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "资源卡片待正式制作" },
    { id: "P2T3-N02", title: "完成LOG导入与报告导出", unit: "AU-03", task: "P2-T3", resources: "导入导出流程卡、报告字段清单、软件截图重绘位", activity: "流程排序、报告字段核对", assessment: "导入导出流程记录", nodeStatus: "试拆完成", reviewStatus: "待专业和媒体复核", mediaStatus: "软件截图需重绘", resourceStatus: "流程卡和字段清单待制作" },
    { id: "P2T3-N03", title: "识读关键指标与判断边界", unit: "AU-03", task: "P2-T3", resources: "指标读法卡、指标关系图、边界说明卡", activity: "指标匹配、边界标注", assessment: "指标读法与边界表", nodeStatus: "试拆完成", reviewStatus: "阈值待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "指标卡和关系图待制作" },
    { id: "P2T3-N04", title: "判断覆盖类异常", unit: "AU-03", task: "P2-T3", resources: "覆盖指标表、弱覆盖分析卡、采样点示意图", activity: "采样点标注、覆盖异常判断", assessment: "覆盖异常判断记录", nodeStatus: "试拆完成", reviewStatus: "案例数据待复核", mediaStatus: "无媒体处理项", resourceStatus: "案例表和示意图待制作" },
    { id: "P2T3-N05", title: "判断移动性/邻区异常", unit: "AU-03/AU-05", task: "P2-T3", resources: "邻区漏配案例卡、测量报告日志、切换命令记录、配置检查表", activity: "证据链排序、异常定位", assessment: "移动性异常证据链", nodeStatus: "试拆完成", reviewStatus: "案例需专业复核", mediaStatus: "无媒体处理项", resourceStatus: "证据链材料待制作" },
    { id: "P2T3-N06", title: "归纳问题类型与原因链", unit: "AU-05", task: "P2-T3", resources: "问题类型卡、原因链模板、异常清单", activity: "问题归类、原因链补全", assessment: "异常问题清单", nodeStatus: "试拆完成", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "原因链模板待制作" },
    { id: "P2T3-N07", title: "制定整改建议", unit: "AU-05", task: "P2-T3", resources: "整改建议卡、方案匹配表、风险提示卡", activity: "整改动作匹配、风险判断", assessment: "整改建议卡", nodeStatus: "试拆完成", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "整改建议卡待制作" },
    { id: "P2T3-N08", title: "输出分析报告并连接复测", unit: "AU-03/AU-08", task: "P2-T3", resources: "分析报告模板、复测对比表、职业表达量规", activity: "报告结构组织、复测要求填写", assessment: "测试数据分析报告", nodeStatus: "试拆完成", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "报告模板待制作" },
    { id: "P4T2-N01", title: "识别验证场景", unit: "AU-07", task: "P4-T2", resources: "情境任务卡、投诉线索卡", activity: "投诉线索归类", assessment: "投诉到验证对象映射", nodeStatus: "深样章已实现", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "样章资源已进入3.5A-1" },
    { id: "P4T2-N02", title: "区分改善与达标", unit: "AU-07", task: "P4-T2", resources: "改善与达标解释卡、边界表达卡", activity: "结论边界修正", assessment: "已达标依据和未闭环边界", nodeStatus: "深样章已实现", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "样章资源已进入3.5A-1" },
    { id: "P4T2-N03", title: "读覆盖指标", unit: "AU-07", task: "P4-T2", resources: "覆盖指标表、路径图", activity: "验证流程排序、读表标注", assessment: "覆盖指标判断", nodeStatus: "深样章已实现", reviewStatus: "待专业复核", mediaStatus: "图表需复核或重绘", resourceStatus: "样章资源已进入3.5A-1" },
    { id: "P4T2-N04", title: "读移动性指标", unit: "AU-07", task: "P4-T2", resources: "移动性日志、流程卡", activity: "移动性流程排序", assessment: "移动性验证流程", nodeStatus: "深样章已实现", reviewStatus: "待专业复核", mediaStatus: "流程图需复核或重绘", resourceStatus: "样章资源已进入3.5A-1" },
    { id: "P4T2-N05", title: "读体验与容量指标", unit: "AU-07", task: "P4-T2", resources: "体验指标表、容量边界卡", activity: "指标行标注", assessment: "通过依据和边界指标", nodeStatus: "深样章已实现", reviewStatus: "待专业复核", mediaStatus: "图表需复核或重绘", resourceStatus: "样章资源已进入3.5A-1" },
    { id: "P4T2-N06", title: "选择判断依据", unit: "AU-07", task: "P4-T2", resources: "依据分类卡、案例材料", activity: "依据分类", assessment: "依据链分类结果", nodeStatus: "深样章已实现", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "样章资源已进入3.5A-1" },
    { id: "P4T2-N07", title: "形成验收结论", unit: "AU-07/AU-08", task: "P4-T2", resources: "结论拼装卡、学习单", activity: "结论拼装与提交", assessment: "四段式验收结论", nodeStatus: "深样章已实现", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "样章资源已进入3.5A-1" },
    { id: "P4T2-N08", title: "修正职业表达", unit: "AU-08", task: "P4-T2", resources: "错误结论诊断卡、修改示范卡", activity: "结论修改与自评", assessment: "修正后的职业表达", nodeStatus: "深样章已实现", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "样章资源已进入3.5A-1" },
    { id: "P5T3-N01", title: "确认性能提升方案与验证口径", unit: "AU-09", task: "P5-T3", resources: "文本卡、工作单、表格", activity: "阅读性能提升方案摘要，填写验证目标、范围、基线和达成口径。", assessment: "性能提升验证任务单", nodeStatus: "试拆完成", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "资源卡片待正式制作" },
    { id: "P5T3-N02", title: "选择验证数据源与复测路径", unit: "AU-09", task: "P5-T3", resources: "文本卡、图表、工作单", activity: "将不同验证目标拖入网管、大数据、路测、用户回访等数据源类别。", assessment: "验证数据源选择表", nodeStatus: "试拆完成", reviewStatus: "待媒体审查", mediaStatus: "媒体需重绘", resourceStatus: "资源卡片待正式制作" },
    { id: "P5T3-N03", title: "建立优化前后KPI对比基线", unit: "AU-09", task: "P5-T3", resources: "表格、图表、工作单", activity: "在优化前后KPI表中标注改善、未改善和仍需复测的指标。", assessment: "优化前后KPI对比表", nodeStatus: "试拆完成", reviewStatus: "待媒体审查，高风险", mediaStatus: "媒体需重绘", resourceStatus: "资源卡片待正式制作" },
    { id: "P5T3-N04", title: "验证接入与保持类提升效果", unit: "AU-09", task: "P5-T3", resources: "教学模拟案例、标注图、重绘图、工作单", activity: "对接入类和保持类案例进行依据标注，判断优化后是否闭环。", assessment: "接入/保持类效果判断记录", nodeStatus: "试拆完成", reviewStatus: "待媒体审查，高风险", mediaStatus: "媒体需重绘", resourceStatus: "资源卡片待正式制作" },
    { id: "P5T3-N05", title: "验证移动性、资源与可用类提升效果", unit: "AU-09", task: "P5-T3", resources: "教学模拟案例、表格、图表、重绘图、工作单", activity: "把复测数据与原问题描述对照，判断三类问题是否已经闭环。", assessment: "移动性/资源/可用类效果判断记录", nodeStatus: "试拆完成", reviewStatus: "待媒体审查，高风险", mediaStatus: "媒体需重绘", resourceStatus: "资源卡片待正式制作" },
    { id: "P5T3-N06", title: "判断未闭环指标与二次分析入口", unit: "AU-09", task: "P5-T3", resources: "工作单、文本卡、评价量规", activity: "将不同验证结果归入闭环状态，并选择二次分析或复盘入口。", assessment: "未闭环问题清单", nodeStatus: "试拆完成", reviewStatus: "待专业复核，高风险", mediaStatus: "无媒体处理项", resourceStatus: "资源卡片待正式制作" },
    { id: "P5T3-N07", title: "输出全网性能提升验证报告", unit: "AU-09", task: "P5-T3", resources: "报告模板、工作单、评价量规、教师指南", activity: "学生按报告模板整合前面六个节点产出，形成完整验证报告。", assessment: "全网性能提升验证报告", nodeStatus: "试拆完成", reviewStatus: "待专业复核", mediaStatus: "无媒体处理项", resourceStatus: "报告模板待正式制作" },
    { id: "P6T2-N01", title: "明确信令问题分析任务与数据来源", unit: "AU-10", task: "P6-T2", resources: "文本卡、工作单、教学模拟案例", activity: "根据任务现象和可用材料，先界定要分析的问题和证据来源。", assessment: "问题分析任务单", nodeStatus: "试拆完成", reviewStatus: "待媒体审查", mediaStatus: "媒体需标注", resourceStatus: "资源卡片待正式制作" },
    { id: "P6T2-N02", title: "区分覆盖、接入、切换、掉线类问题", unit: "AU-10", task: "P6-T2", resources: "重绘图、工作单、表格", activity: "将现象和证据卡片匹配到覆盖、接入、切换、掉线四类问题。", assessment: "问题类型判断表", nodeStatus: "试拆完成", reviewStatus: "待媒体审查，高风险", mediaStatus: "媒体需重绘", resourceStatus: "资源卡片待正式制作" },
    { id: "P6T2-N03", title: "建立接入类问题排查链", unit: "AU-10", task: "P6-T2", resources: "重绘图、工作单、教学模拟案例", activity: "把接入类问题排查步骤排序，并为每一步匹配可查看的信令或参数。", assessment: "接入问题排查路径", nodeStatus: "试拆完成", reviewStatus: "待媒体审查，高风险", mediaStatus: "媒体需重绘", resourceStatus: "资源卡片待正式制作" },
    { id: "P6T2-N04", title: "建立切换类问题信令证据链", unit: "AU-10", task: "P6-T2", resources: "标注图、重绘图、工作单", activity: "在切换流程和案例材料中标注卡点、证据和可能原因。", assessment: "切换问题证据链", nodeStatus: "试拆完成", reviewStatus: "待媒体审查，高风险", mediaStatus: "媒体需重绘", resourceStatus: "资源卡片待正式制作" },
    { id: "P6T2-N05", title: "建立掉线类问题复盘链", unit: "AU-10", task: "P6-T2", resources: "文本卡、工作单、评价量规", activity: "根据掉线表现复盘可能原因，并标出证据和不确定项。", assessment: "掉线原因复盘单", nodeStatus: "试拆完成", reviewStatus: "待专业复核，高风险", mediaStatus: "无媒体处理项", resourceStatus: "资源卡片待正式制作" },
    { id: "P6T2-N06", title: "提出优化建议并说明适用边界", unit: "AU-10", task: "P6-T2", resources: "教学模拟案例、重绘图、工作单、表格", activity: "把问题原因匹配到优化建议，并判断建议的适用边界和复测要求。", assessment: "优化建议卡", nodeStatus: "试拆完成", reviewStatus: "待媒体审查，高风险", mediaStatus: "媒体需重绘", resourceStatus: "资源卡片待正式制作" },
    { id: "P6T2-N07", title: "输出信令问题分析与复盘报告", unit: "AU-10", task: "P6-T2", resources: "报告模板、工作单、评价量规、教师指南", activity: "按照模板输出信令问题分析报告，并标注待复核边界。", assessment: "信令问题分析报告", nodeStatus: "试拆完成", reviewStatus: "待专业复核，高风险", mediaStatus: "无媒体处理项", resourceStatus: "报告模板待正式制作" }
  ]
};
