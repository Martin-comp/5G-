window.COURSE_CAPABILITY_GRAPH_REVIEW = {
  meta: {
    title: "5G网络优化教材（高级）完整课程能力图谱",
    version: "review-0.1",
    boundary: "全课程框架完整，P4-T2深度展开；其他任务为待细化结构节点。"
  },
  chain: [
    {
      id: "CG-01",
      label: "信息采集",
      projectIds: ["P1"],
      desc: "收集室内、室外、投诉和场景信息，为测试、优化和验证提供事实起点。",
      reviewQuestion: "是否能体现岗位中的信息采集，而不只是项目一目录名？"
    },
    {
      id: "CG-02",
      label: "网络测试",
      projectIds: ["P2"],
      desc: "完成DT/CQT测试、测试问题处理和测试数据分析，形成可复核测试材料。",
      reviewQuestion: "测试准备、执行、问题处理、数据分析是否需要拆成更细主链？"
    },
    {
      id: "CG-03",
      label: "信息管理",
      projectIds: ["P3"],
      desc: "管理网管架构、运行监控和参数配置，为优化判断提供结构化信息。",
      reviewQuestion: "信息管理是否应与参数配置分成两个能力群？"
    },
    {
      id: "CG-04",
      label: "优化实施",
      projectIds: ["P4"],
      desc: "根据问题定位和优化方案执行参数、工程或容量等优化动作。",
      reviewQuestion: "项目四任务1是否足以代表优化实施，还是需要显式前接问题定位？"
    },
    {
      id: "CG-05",
      label: "结果验证",
      projectIds: ["P4"],
      desc: "复核优化后是否达到目标，整理依据、边界和后续建议。",
      reviewQuestion: "项目四任务3报告输出是否应并入结果验证，还是单独成为成果表达节点？"
    },
    {
      id: "CG-06",
      label: "性能提升",
      projectIds: ["P5"],
      desc: "在验收基础上采集全网指标、实施提升并验证提升效果。",
      reviewQuestion: "性能提升与结果验证的边界是否清楚？"
    },
    {
      id: "CG-07",
      label: "信令分析",
      projectIds: ["P6"],
      desc: "面对复杂问题时进行信令级流程解析、问题分析和优化。",
      reviewQuestion: "信令分析是最后一个高阶能力，还是应作为贯穿多个项目的诊断工具？"
    }
  ],
  projects: [
    {
      id: "P1",
      title: "项目一：5G网络信息采集",
      chainId: "CG-01",
      tasks: [
        { id: "P1-T1", title: "室内环境信息采集", status: "待细化", capability: "室内信息核验", output: "采集信息完整性记录" },
        { id: "P1-T2", title: "室外环境信息采集", status: "待细化", capability: "室外场景信息整理", output: "室外环境采集清单" },
        { id: "P1-T3", title: "投诉信息采集", status: "待细化", capability: "投诉线索分类", output: "投诉线索到验证对象的初步映射", feeds: ["P4T2-N01"] }
      ]
    },
    {
      id: "P2",
      title: "项目二：5G网络测试",
      chainId: "CG-02",
      tasks: [
        { id: "P2-T1", title: "DT/CQT测试准备和执行", status: "待细化", capability: "测试准备与执行", output: "测试执行记录" },
        { id: "P2-T2", title: "5G网络测试问题处理", status: "待细化", capability: "测试问题归因", output: "问题处理记录和依据说明" },
        { id: "P2-T3", title: "5G网络测试数据分析", status: "待细化", capability: "测试数据读表与判断", output: "测试数据分析结论", feeds: ["P4T2-N03", "P4T2-N04", "P4T2-N05"] }
      ]
    },
    {
      id: "P3",
      title: "项目三：5G网络信息管理",
      chainId: "CG-03",
      tasks: [
        { id: "P3-T1", title: "5G网管架构和功能", status: "待细化", capability: "网管功能识别", output: "网管功能用途说明" },
        { id: "P3-T2", title: "5G网络运行监控", status: "待细化", capability: "运行状态读表", output: "监控异常识别记录", feeds: ["P4T2-N06"] },
        { id: "P3-T3", title: "5G网络参数检查", status: "待细化", capability: "参数一致性检查", output: "参数异常清单", feeds: ["P4T2-N06"] },
        { id: "P3-T4", title: "5G网络参数设置", status: "待细化", capability: "参数设置步骤确认", output: "参数设置记录" }
      ]
    },
    {
      id: "P4",
      title: "项目四：5G端到端网络优化",
      chainId: "CG-04/CG-05",
      tasks: [
        { id: "P4-T1", title: "5G网络优化方案实施", status: "待细化", capability: "优化动作与问题匹配", output: "优化实施记录", feeds: ["P4-T2"] },
        { id: "P4-T2", title: "5G网络优化结果验证", status: "已深展开", capability: "结果验证闭环", output: "验收结论", deep: true },
        { id: "P4-T3", title: "5G网络优化报告输出", status: "待细化", capability: "报告结构组织", output: "优化报告输出样例", receives: ["P4T2-N07", "P4T2-N08"] }
      ]
    },
    {
      id: "P5",
      title: "项目五：5G全网性能提升",
      chainId: "CG-06",
      tasks: [
        { id: "P5-T1", title: "5G全网性能指标采集", status: "待细化", capability: "性能指标采集", output: "全网指标采集记录" },
        { id: "P5-T2", title: "5G全网性能提升实施", status: "待细化", capability: "性能提升动作选择", output: "性能提升实施记录" },
        { id: "P5-T3", title: "5G全网性能提升验证", status: "待细化", capability: "性能提升效果验证", output: "提升效果评价结论", receives: ["P4T2-N08"] }
      ]
    },
    {
      id: "P6",
      title: "项目六：5G信令分析",
      chainId: "CG-07",
      tasks: [
        { id: "P6-T1", title: "5G关键信令流程及解析", status: "待细化", capability: "信令流程识读", output: "信令流程说明" },
        { id: "P6-T2", title: "5G信令问题分析及优化", status: "待细化", capability: "信令问题定位", output: "信令问题分析结论" }
      ]
    }
  ],
  deepNodes: [
    { id: "P4T2-N01", label: "识别验证场景", activity: "投诉线索归类", output: "把投诉归到覆盖、移动性、体验或容量验证对象", source: ["P1-T3"] },
    { id: "P4T2-N02", label: "区分改善与达标", activity: "结论边界修正", output: "写出已达标依据和未闭环边界", source: ["P4-T1"] },
    { id: "P4T2-N03", label: "读覆盖指标", activity: "验证流程排序", output: "说明覆盖指标能支持什么、不能证明什么", source: ["P2-T3"] },
    { id: "P4T2-N04", label: "读移动性指标", activity: "移动性流程排序", output: "排出移动性验证流程", source: ["P2-T3"] },
    { id: "P4T2-N05", label: "读体验与容量指标", activity: "指标行标注", output: "标出通过依据和边界指标", source: ["P2-T3"] },
    { id: "P4T2-N06", label: "选择判断依据", activity: "依据分类", output: "整理通过依据、边界和背景信息", source: ["P3-T2", "P3-T3"] },
    { id: "P4T2-N07", label: "形成验收结论", activity: "结论拼装与提交", output: "形成判断、依据、边界、建议四段式结论", source: ["P4T2-N01", "P4T2-N06"] },
    { id: "P4T2-N08", label: "修正职业表达", activity: "结论修改与自评", output: "修正过度判断、依据不足和边界缺失", source: ["P4T2-N07"], target: ["P4-T3", "P5-T3"] }
  ],
  crossLinks: [
    { from: "P1-T3 投诉信息采集", to: "P4T2-N01 识别验证场景", why: "投诉语言需要转成覆盖、移动性、体验或容量验证对象。" },
    { from: "P2-T3 测试数据分析", to: "P4T2-N03/N04/N05 指标读法", why: "覆盖、移动性、体验和容量指标是结果验证的主要依据。" },
    { from: "P3-T2/P3-T3 运行监控和参数检查", to: "P4T2-N06 选择判断依据", why: "监控和参数材料决定哪些数据能作为通过依据，哪些只能作为背景。" },
    { from: "P4-T1 优化方案实施", to: "P4-T2 结果验证", why: "只有知道实施了什么，才能判断验证什么、如何验收。" },
    { from: "P4-T2 结果验证", to: "P4-T3 优化报告输出", why: "报告输出应承接判断、依据、边界和建议，不能只写结果。" },
    { from: "P4T2-N08 修正职业表达", to: "P5 性能提升", why: "未闭环边界和后续建议应自然进入持续性能提升任务。" }
  ]
};
