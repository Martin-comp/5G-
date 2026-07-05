window.DIGITAL_TEXTBOOK_OVERALL = {
  meta: {
    version: "overall-0.4-phase3-p2",
    title: "5G网络优化教材（高级）",
    subtitle: "阶段3项目二闭环复制验证原型",
    stage: "V0.3.13图谱底座 + 项目二P2-T1/P2-T2/P2-T3内容闭环",
    boundary: "本原型用于验证项目二从DT/CQT测试准备执行、测试异常处理分支到测试数据分析输出的教材闭环。P2-T3为深样章候选；当前不是专业定稿、正式资源包或平台发布稿。",
    deepSampleHref: ""
  },
  courseStatus: [
    { label: "项目", value: "6", note: "来自全书结构抽取" },
    { label: "项目二闭环任务", value: "3", note: "P2-T1、P2-T2、P2-T3" },
    { label: "项目二详细节点", value: "19", note: "来自V0.3.13当前主数据" },
    { label: "异常处理分支", value: "1", note: "P2-T2不是固定必经任务" },
    { label: "深样章候选", value: "P2-T3", note: "测试数据分析输出" }
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
      status: "阶段3闭环复制验证",
      tasks: [
        { id: "P2-T1", title: "任务1：DT/CQT测试准备和执行", status: "阶段3内容样稿", activity: "确认测试任务、准备设备软件、执行DT/CQT并移交LOG", output: "测试任务确认单、设备软件检查表、测试执行记录、测试数据交付包" },
        { id: "P2-T2", title: "任务2：5G网络测试问题处理", status: "条件分支样稿", activity: "只在测试中出现中断、定位异常、软件异常或数据不可用时进入", output: "测试异常处理记录、是否继续测试判断、升级沟通记录" },
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
      status: "阶段2闭环样本",
      tasks: [
        { id: "P4-T1", title: "任务1：5G网络优化方案实施", status: "阶段2轻量样稿", activity: "确认优化对象、责任边界和复测入口", output: "优化实施记录与复测验证交接清单" },
        { id: "P4-T2", title: "任务2：5G网络优化结果验证", status: "深样章锚点", activity: "投诉归类、指标判断、依据分类、结论拼装", output: "四段式验收结论", deepSample: true },
        { id: "P4-T3", title: "任务3：5G网络优化报告输出", status: "阶段2轻量样稿", activity: "报告口径确认、证据链归集和结论边界修订", output: "优化报告输出样稿与沟通提纲" }
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
      { id: "CG-02", label: "网络测试", project: "P2", status: "阶段3验证", desc: "完成DT/CQT测试、问题处理和测试数据分析。", next: "CG-03" },
      { id: "CG-03", label: "信息管理", project: "P3", status: "占位", desc: "整理网管、运行监控和参数信息。", next: "CG-04" },
      { id: "CG-04", label: "优化实施", project: "P4", status: "阶段2样本", desc: "实施优化方案，是结果验证的直接前置环节。", next: "CG-05" },
      { id: "CG-05", label: "结果验证", project: "P4", status: "深样章锚点", desc: "复核优化后是否达到目标，当前以P4-T2作为深样章。", next: "CG-06" },
      { id: "CG-06", label: "性能提升", project: "P5", status: "占位", desc: "在验收基础上继续做全网性能提升。", next: "CG-07" },
      { id: "CG-07", label: "信令分析", project: "P6", status: "占位", desc: "面向复杂问题进行信令级分析和优化。", next: "" }
    ],
    detailNodes: [
      { id: "P2T1-N01", label: "明确测试任务与场景边界", task: "P2-T1", project: "P2", activity: "填写测试任务确认单", output: "测试任务确认单", status: "阶段3内容样稿" },
      { id: "P2T1-N02", label: "核对测试设备与终端状态", task: "P2-T1", project: "P2", activity: "完成设备终端检查", output: "设备终端检查表", status: "阶段3内容样稿" },
      { id: "P2T1-N03", label: "配置测试软件与记录模板", task: "P2-T1", project: "P2", activity: "检查测试软件工程和记录字段", output: "软件配置检查记录", status: "待媒体重绘" },
      { id: "P2T1-N04", label: "规划DT路线与CQT点位", task: "P2-T1", project: "P2", activity: "绘制路线点位说明", output: "DT路线/CQT点位说明", status: "待专业复核" },
      { id: "P2T1-N05", label: "执行DT测试并记录过程", task: "P2-T1", project: "P2", activity: "记录行驶、采样、事件和异常", output: "DT测试执行记录", status: "阶段3内容样稿" },
      { id: "P2T1-N06", label: "执行CQT测试并记录过程", task: "P2-T1", project: "P2", activity: "记录定点测试项目和结果", output: "CQT测试执行记录", status: "阶段3内容样稿" },
      { id: "P2T1-N07", label: "整理LOG与测试数据交付包", task: "P2-T1", project: "P2", activity: "核验LOG、GPS、截图和现场记录", output: "测试数据交付包", status: "阶段3内容样稿" },
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
      { id: "P2T3-N08", label: "输出分析报告并连接复测", task: "P2-T3", project: "P2", activity: "形成测试数据分析报告并说明后续复测入口", output: "测试数据分析报告", status: "深样章候选" }
    ]
  },
  resources: [
    { id: "R-P2T1-01", title: "测试任务确认单", type: "学习单", project: "P2", task: "P2-T1", node: "P2T1-N01", status: "阶段3样稿", audit: "场景口径待专业复核" },
    { id: "R-P2T1-02", title: "设备终端检查表", type: "表格/互动", project: "P2", task: "P2-T1", node: "P2T1-N02", status: "阶段3样稿", audit: "设备型号需泛化处理" },
    { id: "R-P2T1-03", title: "测试软件配置示意图", type: "重绘图片", project: "P2", task: "P2-T1", node: "P2T1-N03", status: "需重绘", audit: "原软件截图不可直接发布" },
    { id: "R-P2T1-04", title: "DT路线/CQT点位说明模板", type: "地图/表格", project: "P2", task: "P2-T1", node: "P2T1-N04", status: "阶段3样稿", audit: "真实路线需脱敏" },
    { id: "R-P2T1-05", title: "测试数据交付包清单", type: "清单", project: "P2", task: "P2-T1", node: "P2T1-N07", status: "阶段3样稿", audit: "LOG和GPS数据需脱敏" },
    { id: "R-P2T2-01", title: "异常进入判断单", type: "互动/分支", project: "P2", task: "P2-T2", node: "P2T2-N01", status: "阶段3样稿", audit: "不得把所有学生固定带入P2-T2" },
    { id: "R-P2T2-02", title: "本地排查记录表", type: "表格", project: "P2", task: "P2-T2", node: "P2T2-N02", status: "阶段3样稿", audit: "排查顺序待专业复核" },
    { id: "R-P2T2-03", title: "GPS短时跳变案例卡", type: "案例/互动", project: "P2", task: "P2-T2", node: "P2T2-N03", status: "阶段3样稿", audit: "教学模拟，待专业复核" },
    { id: "R-P2T3-01", title: "LOG导入导出流程", type: "动画脚本", project: "P2", task: "P2-T3", node: "P2T3-N02", status: "待制作", audit: "软件界面需教学化重绘" },
    { id: "R-P2T3-02", title: "关键指标读法与边界表", type: "表格/术语", project: "P2", task: "P2-T3", node: "P2T3-N03", status: "阶段3样稿", audit: "阈值待专业复核" },
    { id: "R-P2T3-03", title: "覆盖/移动性异常证据链活动", type: "互动", project: "P2", task: "P2-T3", node: "P2T3-N04/P2T3-N05", status: "阶段3样稿", audit: "教学模拟，待专业复核" },
    { id: "R-P2T3-04", title: "测试数据分析报告模板", type: "报告模板", project: "P2", task: "P2-T3", node: "P2T3-N08", status: "阶段3样稿", audit: "报告口径待编辑复核" },
    { id: "R-ALL-01", title: "全书媒体池", type: "图片/截图", project: "全书", task: "多任务", node: "多节点", status: "已抽取，未治理完成", audit: "不可默认发布" },
    { id: "R-ALL-02", title: "课程能力图谱跨层映射表", type: "结构化数据", project: "全书", task: "18个任务", node: "CG-01-CG-07", status: "已形成", audit: "需后续专家复核图谱合理性" }
  ],
  phase2Loop: {
    title: "项目二闭环复制验证",
    boundary: "本闭环只验证项目二三任务能否在整书原型中连起来。P2-T1是测试采集主线，P2-T2是异常处理分支，P2-T3是分析输出与深样章候选。P2-T2不得设计成所有学生固定必经的第二页。",
    route: [
      { id: "P2-T1", title: "DT/CQT测试准备和执行", role: "主线入口", focus: "先确认任务、场景、设备软件、路线点位和数据交付要求。", output: "测试数据交付包" },
      { id: "P2-T2", title: "5G网络测试问题处理", role: "条件分支", focus: "只在测试中断、定位异常、软件异常或数据不可用时进入。", output: "异常处理记录与继续测试判断" },
      { id: "P2-T3", title: "5G网络测试数据分析", role: "分析出口", focus: "把LOG、指标、场景和问题原因组织成可复核分析报告。", output: "测试数据分析报告" }
    ],
    taskSamples: [
      {
        id: "P2-T1",
        title: "DT/CQT测试准备和执行",
        role: "主线入口",
        openingCase: "某校园投诉晚高峰室外道路视频卡顿，室内食堂扫码支付偶发失败。测试小组不能拿到手机就出发，而要先确认测试目标、路线点位、设备软件状态和最终交付的数据包。",
        studentRead: "本任务训练的是把一次测试做成可复核的工程过程。你要能说清测什么、在哪里测、用什么测、怎样记录、出了异常怎样处理，以及最后交给分析人员哪些文件。",
        steps: [
          "填写测试任务确认单：写清场景、时间、目标业务、测试范围和不能凭经验替代的数据。",
          "完成设备终端检查：核对终端、电量、SIM卡、GPS、测试软件工程文件和记录模板。",
          "规划DT路线与CQT点位：区分连续道路测试和定点室内/热点场景测试。",
          "执行DT/CQT并记录过程：记录采样、事件、现场备注和临时异常。",
          "整理测试数据交付包：核验LOG、GPS轨迹、截图、现场记录和文件命名。"
        ],
        completion: "学生提交测试任务确认单、设备软件检查表、DT路线/CQT点位说明、测试执行记录和测试数据交付包。",
        teacherUse: "教师重点检查学生是否先确认任务和交付标准，再进入软件操作；发现异常时才引导进入P2-T2。"
      },
      {
        id: "P2-T2",
        title: "5G网络测试问题处理",
        role: "条件分支",
        openingCase: "DT测试途中LOG仍在记录，但GPS轨迹突然跳到校外；另一组CQT测试中软件工程文件无法识别小区事件。此时不能继续把数据交给分析，而要先判断数据是否可用。",
        studentRead: "P2-T2不是每次测试都必须完整走一遍。它解决的是测试过程出了问题时，学生能否判断继续、重测、补测或升级沟通，并把处理过程留下证据。",
        steps: [
          "判断是否进入异常分支：测试中断、GPS异常、时间不一致、采样缺口或软件工程错误才进入。",
          "按本地排查顺序处理：先查设备、终端、软件、工程文件和记录模板，再判断是否需要外部支持。",
          "处理GPS短时跳变：区分可备注保留、需补测和需重测的情况。",
          "形成继续测试判断：写明继续、补测、重测或升级沟通的依据。",
          "把处理记录回写到数据交付包，供P2-T3分析时判断数据可信度。"
        ],
        completion: "学生提交异常进入判断单、本地排查记录、数据可用性修正记录、升级沟通记录和继续测试判断。",
        teacherUse: "教师用P2-T2训练学生的工程边界意识：数据不可信时，分析结论不能强行成立。"
      },
      {
        id: "P2-T3",
        title: "5G网络测试数据分析",
        role: "深样章候选",
        openingCase: "测试数据已经交付，但报告中同时出现弱覆盖、切换失败和速率波动。学生不能只把软件导出的图贴进去，而要解释指标、场景和原因链之间的关系。",
        studentRead: "本任务适合作为后续深样章：它把前面的测试采集证据转化为可教学、可练习、可评价的分析报告。重点不是背阈值，而是学会用指标和现场证据说明问题边界。",
        steps: [
          "确认数据来源与分析目标：区分DT、CQT、投诉和网管侧数据能支持什么判断。",
          "完成LOG导入与报告导出：留下软件操作和导出字段记录。",
          "识读关键指标与边界：说明RSRP、SINR、速率、时延、掉线、切换事件各自的证据作用。",
          "判断覆盖类、移动性类和邻区类异常：把指标变化和场景位置联系起来。",
          "归纳问题类型、提出整改建议，并输出测试数据分析报告。"
        ],
        completion: "学生提交数据分析任务单、导入导出流程记录、指标读法与边界表、异常证据链、整改建议卡和测试数据分析报告。",
        teacherUse: "教师重点讲评学生是否把软件截图转化为解释性证据，而不是把截图当答案。",
        deepCandidate: true
      }
    ],
    evidenceChain: [
      { from: "P2-T1", to: "P2-T3", text: "测试任务确认、路线点位、LOG和现场记录直接进入数据分析，这是正常主线。" },
      { from: "P2-T1", to: "P2-T2", text: "只有当测试中断、定位异常、软件异常或数据不可用时，才进入异常处理分支。" },
      { from: "P2-T2", to: "P2-T3", text: "异常处理结论决定哪些数据可用、哪些需剔除、哪些必须补测或重测。" },
      { from: "P2-T3", to: "P4-T2", text: "测试数据分析报告可成为后续优化结果验证的证据来源，但不能替代优化后复测。" }
    ]
  },
  teacherSupport: [
    { title: "项目二课堂组织", body: "建议按2课时组织：第1课时完成任务确认、设备软件检查和DT/CQT执行逻辑；第2课时处理异常分支入口，并把可用数据转入分析报告。" },
    { title: "何时直接进入P2-T3", body: "当测试过程完整、LOG/GPS/现场记录可用、文件命名和字段齐全时，学生可从P2-T1直接进入P2-T3。" },
    { title: "何时进入P2-T2", body: "当出现中断、定位漂移、软件工程错误、采样缺口或时间不一致时，进入P2-T2；教师应要求学生写出继续、补测、重测或升级依据。" },
    { title: "P2-T3讲评重点", body: "讲评重点是指标能证明什么、不能证明什么，以及学生是否把场景、指标、原因链和整改建议连起来。" },
    { title: "外部门禁", body: "真实LOG、GPS轨迹、软件截图和设备照片必须脱敏或重绘；通信专业复核、一线试看和出版社接口仍未完成。" }
  ],
  publication: [
    { title: "资源包输出", state: "阶段3项目二已形成资源、活动、评价位置清单；真实LOG、GPS轨迹和软件界面不得直接发布。" },
    { title: "直接呈现挂接", state: "本原型展示项目二闭环入口、异常分支和P2-T3深样章候选位置，尚未形成可交付深样章页面。" },
    { title: "平台接口", state: "暂不接入真实出版社平台接口，仅保留挂接位置和状态说明。" },
    { title: "质量检测", state: "可执行浏览器QA；内容专业复核、媒体版权审查、数据脱敏和一线试看仍需外部流程。" }
  ]
};
