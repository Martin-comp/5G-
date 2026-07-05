window.P4T2_GRAPH_DRIVEN = {
  meta: {
    version: "3.5",
    title: "5G网络优化结果验证",
    subtitle: "课程能力图谱驱动版",
    role: "网络优化助理工程师",
    bigQuestion: "怎样把投诉、指标和结论连成一次可靠的优化验收？",
    promise: "本版把课程能力图谱作为暗线，把每个案例、卡片、练习和评价都挂接到能力节点上。",
    simulationNote: "本样章案例均为教学模拟案例，阈值为本课验收目标，不代表通用行业标准。",
    modes: {
      class: "课堂带学",
      self: "自学跟练"
    }
  },
  lessonFlow: [
    { id: "warmup", label: "识别问题", minutes: "5分钟", text: "把投诉语言转成需要验证的网络对象。" },
    { id: "demo", label: "建立路径", minutes: "12分钟", text: "按覆盖、移动性、体验、容量逐步找依据。" },
    { id: "contrast", label: "纠正常见误区", minutes: "18分钟", text: "用两个反例训练学生不要只看单项指标。" },
    { id: "guided", label: "半独立处理", minutes: "15分钟", text: "把多项材料分成依据、边界和背景。" },
    { id: "mission", label: "形成结论", minutes: "20分钟", text: "拼装并提交可讲评的验收结论。" }
  ],
  courseGraph: {
    courseChain: [
      { id: "CG-01", label: "信息采集", status: "course", desc: "收集投诉、场景、测试要求和已有配置。" },
      { id: "CG-02", label: "网络测试", status: "course", desc: "组织路测、定点测试和业务体验测试。" },
      { id: "CG-03", label: "信息管理", status: "course", desc: "整理日志、指标、截图和问题清单。" },
      { id: "CG-04", label: "优化实施", status: "course", desc: "执行参数、邻区、工程和容量优化。" },
      { id: "CG-05", label: "结果验证", status: "active", desc: "复核优化后是否达到目标，是本样章所在能力群。" },
      { id: "CG-06", label: "性能提升", status: "course", desc: "在验收后继续做性能提升和体验优化。" },
      { id: "CG-07", label: "信令分析", status: "course", desc: "对复杂问题进行信令级定位和复盘。" }
    ],
    taskNodes: [
      {
        id: "P4T2-N01",
        label: "识别验证场景",
        level: "任务能力",
        kind: "job_task",
        goal: "能从投诉、场景和优化动作中判断本次验收要验证什么。",
        summary: "学生先判断问题是否真的闭环，而不是看到一句“好了”就结束。",
        prerequisites: ["CG-01", "CG-02"],
        next: ["P4T2-N02", "P4T2-N03"],
        caseId: "demo-dorm",
        cards: ["情境任务卡", "投诉线索卡", "验证对象卡"],
        activity: "投诉线索归类",
        evaluation: "能把投诉归到覆盖、移动性、业务体验或容量验证对象。",
        resourceTypes: ["表格", "互动归类", "课堂投票"]
      },
      {
        id: "P4T2-N02",
        label: "区分改善与达标",
        level: "知识技能节点",
        kind: "capability",
        goal: "能说明优化后改善不等于全部验收通过。",
        summary: "看懂覆盖、体验或容量中仍未闭环的数据边界。",
        prerequisites: ["P4T2-N01"],
        next: ["P4T2-N06", "P4T2-N08"],
        caseId: "demo-dorm",
        cards: ["改善与达标解释卡", "边界表达卡"],
        activity: "投诉线索归类",
        evaluation: "结论中能同时写出已达标依据和未闭环边界。",
        resourceTypes: ["对照表", "结论句式支架"]
      },
      {
        id: "P4T2-N03",
        label: "读覆盖指标",
        level: "知识技能节点",
        kind: "knowledge",
        goal: "能使用SS-RSRP、SS-SINR和弱覆盖采样点解释覆盖验证结果。",
        summary: "覆盖指标能证明信号强度和质量改善，但不能单独证明移动过程不中断。",
        prerequisites: ["CG-02"],
        next: ["P4T2-N04", "P4T2-N06"],
        caseId: "contrast-canteen",
        cards: ["覆盖指标解读卡", "覆盖能说明/不能说明卡"],
        activity: "验证流程排序",
        evaluation: "能把覆盖验证放在移动性验证之前，但不把它当成唯一结论。",
        resourceTypes: ["指标表", "路径图"]
      },
      {
        id: "P4T2-N04",
        label: "读移动性指标",
        level: "知识技能节点",
        kind: "skill",
        goal: "能使用切换成功率、重建次数和掉线日志判断移动过程是否闭环。",
        summary: "移动路径上的投诉必须补看切换和保持，不能只看静止点覆盖。",
        prerequisites: ["P4T2-N03"],
        next: ["P4T2-N06"],
        caseId: "contrast-canteen",
        cards: ["移动性日志卡", "验证流程卡"],
        activity: "验证流程排序",
        evaluation: "能排出移动性验证流程，并说明每一步看什么数据。",
        resourceTypes: ["流程排序", "动画", "小游戏"]
      },
      {
        id: "P4T2-N05",
        label: "读体验与容量指标",
        level: "知识技能节点",
        kind: "skill",
        goal: "能比较平均值、95分位、PRB利用率和卡顿次数。",
        summary: "平均速率好只能说明多数体验改善，不能替代尾部体验和高峰容量。",
        prerequisites: ["CG-02", "CG-03"],
        next: ["P4T2-N06"],
        caseId: "contrast-lab",
        cards: ["平均值与尾部体验卡", "容量边界卡"],
        activity: "指标行标注",
        evaluation: "能标出哪些指标可作通过依据，哪些指标必须写成边界。",
        resourceTypes: ["热度条", "指标标注", "对照图"]
      },
      {
        id: "P4T2-N06",
        label: "选择判断依据",
        level: "任务能力",
        kind: "capability",
        goal: "能从多项材料中分出通过依据、边界和背景信息。",
        summary: "半扶手阶段开始减少直接提示，让学生自己整理依据链。",
        prerequisites: ["P4T2-N02", "P4T2-N03", "P4T2-N04", "P4T2-N05"],
        next: ["P4T2-N07"],
        caseId: "guided-gym",
        cards: ["依据分类卡", "活动保障案例卡"],
        activity: "依据分类",
        evaluation: "能把关键业务、覆盖、移动性等材料分到正确类别。",
        resourceTypes: ["分类互动", "表格", "人流路径动画"]
      },
      {
        id: "P4T2-N07",
        label: "形成验收结论",
        level: "任务能力",
        kind: "assessment",
        goal: "能按判断、依据、边界、建议组织一段可提交的验收结论。",
        summary: "独立实践阶段要求学生把技术判断转成职业表达。",
        prerequisites: ["P4T2-N06"],
        next: ["P4T2-N08"],
        caseId: "mission-jobfair",
        cards: ["结论拼装卡", "独立提交卡"],
        activity: "结论拼装与提交",
        evaluation: "结论包含判断、依据、边界和后续建议四部分。",
        resourceTypes: ["句式拼装", "自查清单", "教师讲评样例库"]
      },
      {
        id: "P4T2-N08",
        label: "修正职业表达",
        level: "评价反馈节点",
        kind: "assessment",
        goal: "能发现并修正过度判断、依据不足和边界缺失。",
        summary: "教师讲评和自学反馈都要指向可修改的表达，而不是只给分。",
        prerequisites: ["P4T2-N07"],
        next: ["CG-06"],
        caseId: "mission-jobfair",
        cards: ["错误结论诊断卡", "修改示范卡"],
        activity: "结论拼装与提交",
        evaluation: "能根据量规修改一段不合格结论。",
        resourceTypes: ["讲评板", "对照改写", "自评量规"]
      }
    ]
  },
  cases: [
    {
      id: "demo-dorm",
      stage: "入门样例",
      shortTitle: "宿舍区投诉复盘",
      title: "宿舍区：网页好了，但视频和直播还卡",
      task: "先把投诉语言归到验证对象，再判断哪些问题已经闭环。",
      graphNodeIds: ["P4T2-N01", "P4T2-N02"],
      scenario: [
        "某宿舍区完成天线下倾角调整和参数优化后，学生反馈网页打开明显顺畅。",
        "但晚高峰仍有人反馈视频通话偶发卡顿，直播上行延迟偏高。你要把这些投诉线索转成需要复核的指标。"
      ],
      focus: ["投诉转指标", "改善与达标", "边界表达"],
      modeSupport: {
        class: {
          title: "课堂组织",
          steps: ["先让学生对四条投诉线索做归类。", "教师暂不公布答案，只追问每条投诉需要看哪类数据。", "全班汇总后再打开指标表验证。"],
          callout: "课堂重点不是抢答，而是让学生说清楚为什么这条投诉不能只看覆盖。"
        },
        self: {
          title: "自学路线",
          steps: ["先读投诉，不急着看答案。", "把每条投诉归到覆盖、移动性、业务体验或容量。", "查看反馈后，再读指标表和参考结论。"],
          terms: ["SS-RSRP：反映接收信号强度。", "95分位时延：更关注较差体验，不等同于平均值。"],
          checklist: ["我是否把每条投诉对应到了要验证的数据？", "我是否区分了已经改善和仍未闭环？"]
        }
      },
      metrics: [
        { id: "rsrp", group: "覆盖", name: "SS-RSRP覆盖率", target: "≥95%", before: "88.4%", after: "96.3%", result: "达标", reading: "覆盖强度改善，可作为通过部分依据。" },
        { id: "weak", group: "覆盖", name: "弱覆盖采样点占比", target: "≤5%", before: "12.6%", after: "3.8%", result: "达标", reading: "弱覆盖问题明显减少。" },
        { id: "video", group: "体验", name: "视频平均时延", target: "≤50ms", before: "78ms", after: "42ms", result: "达标", reading: "平均体验改善。" },
        { id: "uplinkTail", group: "体验", name: "直播上行95分位时延", target: "≤90ms", before: "180ms", after: "110ms", result: "未达标", reading: "较差体验仍需复核。" }
      ],
      activity: {
        type: "complaint-sort",
        title: "投诉线索归类",
        instruction: "逐条判断：这句话主要提醒你补看哪类数据。",
        categories: [
          { id: "coverage", label: "覆盖验证" },
          { id: "mobility", label: "移动性验证" },
          { id: "experience", label: "业务体验验证" },
          { id: "capacity", label: "容量验证" }
        ],
        items: [
          { id: "web", text: "网页打开明显顺畅。", target: "experience", feedback: "这条线索指向业务体验改善，但只能说明网页访问体验，不等于所有业务都闭环。" },
          { id: "video", text: "视频通话偶发卡顿。", target: "experience", feedback: "视频卡顿要看时延、丢包、速率等体验指标。" },
          { id: "live", text: "直播上行延迟偏高。", target: "experience", feedback: "直播上行延迟属于业务体验问题，还可能关联上行容量。" },
          { id: "peak", text: "晚高峰问题更明显。", target: "capacity", feedback: "晚高峰通常要补看容量负荷和尾部体验。" }
        ]
      },
      conclusion: {
        judgement: "本次优化建议判断为部分达标。",
        evidence: ["覆盖强度、弱覆盖采样点和视频平均时延已达到本课目标。"],
        boundary: "直播上行95分位时延仍高于本课目标，不能证明晚高峰直播体验全部恢复。",
        next: "建议补充晚高峰直播上行日志、容量负荷和复测数据。"
      },
      ability: ["识别验证场景", "区分改善与达标"],
      conversions: ["投诉归类互动", "覆盖/体验双表带读", "部分达标结论拼句"]
    },
    {
      id: "contrast-canteen",
      stage: "对照样例A",
      shortTitle: "地下食堂切换失败",
      title: "地下食堂：覆盖达标，但电梯口切换失败",
      task: "把移动性问题的验证步骤排清楚，纠正只看覆盖的误区。",
      graphNodeIds: ["P4T2-N03", "P4T2-N04"],
      scenario: [
        "地下食堂新增室分后，静止测试点的SS-RSRP和SS-SINR都达到本课目标。",
        "但学生从电梯口走向食堂时，视频会议出现中断，日志显示切换失败和重建次数偏高。"
      ],
      focus: ["覆盖不是全部", "移动性验证", "流程顺序"],
      modeSupport: {
        class: {
          title: "课堂组织",
          steps: ["先遮住移动性数据，只展示覆盖数据。", "让学生按小组排出验证步骤。", "公布切换数据后讲评为什么流程里必须有移动路径测试。"],
          callout: "教师讲评重点是：覆盖数据是必要条件，不是充分条件。"
        },
        self: {
          title: "自学路线",
          steps: ["先读场景，判断投诉发生在静止点还是移动路径。", "按顺序点击验证步骤。", "如果顺序错误，回到场景文字找关键词“走向食堂”。"],
          terms: ["切换成功率：终端移动时从一个小区切到另一个小区的成功比例。", "重建次数：连接中断后重新建立的次数，过高说明保持性风险。"],
          checklist: ["我是否先确认场景，再看覆盖和移动性？", "我是否能解释为什么覆盖达标仍不能验收？"]
        }
      },
      metrics: [
        { id: "rsrp", group: "覆盖", name: "SS-RSRP覆盖率", target: "≥95%", before: "82.0%", after: "97.5%", result: "达标", reading: "静态覆盖已修复。" },
        { id: "sinr", group: "覆盖", name: "SS-SINR覆盖率", target: "≥90%", before: "76.5%", after: "92.0%", result: "达标", reading: "信号质量已改善。" },
        { id: "handover", group: "移动性", name: "电梯口切换成功率", target: "≥98%", before: "93.0%", after: "94.5%", result: "未达标", reading: "移动过程仍有明显风险。" },
        { id: "rebuild", group: "移动性", name: "10次往返重建次数", target: "≤1次", before: "5次", after: "4次", result: "未达标", reading: "中断问题未闭环。" }
      ],
      activity: {
        type: "sequence",
        title: "排出移动性验证流程",
        instruction: "按岗位处理顺序点击步骤。顺序不是背流程，而是为了避免只看静止覆盖。",
        steps: [
          { id: "scene", text: "确认投诉发生在移动路径上" },
          { id: "coverage", text: "复核静止点覆盖和信号质量" },
          { id: "mobility", text: "查看切换成功率、重建和掉线日志" },
          { id: "conclusion", text: "写出覆盖达标但移动性未闭环的结论" }
        ],
        correctOrder: ["scene", "coverage", "mobility", "conclusion"]
      },
      conclusion: {
        judgement: "本次优化不能直接判定全部达标。",
        evidence: ["静态覆盖和信号质量已达到本课目标。"],
        boundary: "电梯口切换成功率和重建次数未达到本课目标，移动过程体验未闭环。",
        next: "建议复核邻区关系、切换参数和电梯口往返测试日志。"
      },
      ability: ["读覆盖指标", "读移动性指标"],
      conversions: ["覆盖达标/切换失败对照图", "路径切换动画", "流程排序小游戏"]
    },
    {
      id: "contrast-lab",
      stage: "对照样例B",
      shortTitle: "实训楼尾部体验",
      title: "实训楼：平均速率好，但晚高峰尾部体验差",
      task: "在指标表上标出通过依据和必须写出的边界。",
      graphNodeIds: ["P4T2-N05"],
      scenario: [
        "实训楼扩容后，测速平均下行速率明显提升，白天测试大多顺畅。",
        "但晚高峰在线人数集中，最差一段体验仍然差，学生上云实验时偶发卡顿。"
      ],
      focus: ["平均值", "95分位", "高峰容量"],
      modeSupport: {
        class: {
          title: "课堂组织",
          steps: ["先只展示平均速率，让学生形成第一次判断。", "再补充95分位、PRB和卡顿次数，让学生修正判断。", "教师板书“能支持什么/不能说明什么”。"],
          callout: "课堂重点是让学生亲自经历一次判断被数据修正。"
        },
        self: {
          title: "自学路线",
          steps: ["先找达标行，再找未达标行。", "给每一行标注“通过依据”或“边界数据”。", "把标注结果改写成一句验收边界。"],
          terms: ["平均值：反映多数样本的一般水平。", "95分位：反映较差样本的体验边界。", "PRB利用率：反映无线资源是否紧张。"],
          checklist: ["我是否只用达标数据写依据？", "我是否把未达标数据写进边界？"]
        }
      },
      metrics: [
        { id: "avgRate", group: "速率", name: "下行平均速率", target: "≥300Mbps", before: "180Mbps", after: "360Mbps", result: "达标", reading: "多数测速体验改善。" },
        { id: "p95", group: "体验", name: "实验登录95分位时延", target: "≤120ms", before: "260ms", after: "170ms", result: "未达标", reading: "尾部体验仍偏差。" },
        { id: "prb", group: "容量", name: "晚高峰PRB利用率", target: "≤80%", before: "92%", after: "88%", result: "未达标", reading: "高峰容量仍紧张。" },
        { id: "stuck", group: "体验", name: "10分钟卡顿次数", target: "≤1次", before: "6次", after: "2次", result: "未达标", reading: "有改善但未闭环。" }
      ],
      activity: {
        type: "metric-mark",
        title: "给指标行做验收标注",
        instruction: "不是判断对错题，而是练习把每行数据写成结论依据或边界。",
        marks: [
          { metricId: "avgRate", target: "support", feedback: "平均速率达标，可作为体验改善的通过依据。" },
          { metricId: "p95", target: "boundary", feedback: "95分位未达标，必须写成尾部体验边界。" },
          { metricId: "prb", target: "boundary", feedback: "PRB利用率偏高，说明高峰容量仍紧张。" },
          { metricId: "stuck", target: "boundary", feedback: "卡顿次数未达标，说明体验未完全闭环。" }
        ],
        categories: [
          { id: "support", label: "通过依据" },
          { id: "boundary", label: "必须写边界" }
        ]
      },
      conclusion: {
        judgement: "本次优化只能判断为体验有改善，但高峰体验未完全达标。",
        evidence: ["下行平均速率达到本课目标。"],
        boundary: "95分位时延、晚高峰PRB利用率和卡顿次数仍未达到本课目标。",
        next: "建议继续做高峰容量评估、业务分流或扩容复测。"
      },
      ability: ["读体验与容量指标", "判断容量边界"],
      conversions: ["平均值/95分位对照图", "高峰容量热度条", "指标标注互动"]
    },
    {
      id: "guided-gym",
      stage: "半扶手练习",
      shortTitle: "体育馆活动保障",
      title: "体育馆：活动保障优化后，整理依据链",
      task: "把材料分成通过依据、必须写边界和背景信息。",
      graphNodeIds: ["P4T2-N06"],
      scenario: [
        "体育馆将举行大型活动，优化后需要复核现场扫码、直播上传和人群移动体验。",
        "系统不直接给结论，你需要自己整理依据链。"
      ],
      focus: ["依据分类", "边界识别", "半独立判断"],
      modeSupport: {
        class: {
          title: "课堂组织",
          steps: ["两人一组先分类材料。", "组内说明为什么某条材料只是背景。", "教师抽取一组结论进行公开修订。"],
          callout: "课堂重点是把“我觉得可以”改成“哪些数据支持、哪些数据限制”。"
        },
        self: {
          title: "自学路线",
          steps: ["先读每条材料，不看参考结论。", "把材料分入三类。", "检查后把分类结果写成判断、依据、边界、建议。"],
          terms: ["通过依据：能证明某项验收目标已达到的数据。", "边界：说明仍不能完全验收的数据。", "背景：有助于理解问题，但不能单独证明达标。"],
          checklist: ["我是否把优化前数据误当成验收依据？", "我是否留下了必须复测的移动性边界？"]
        }
      },
      metrics: [
        { id: "stand", group: "覆盖", name: "看台SS-RSRP覆盖率", target: "≥95%", before: "89%", after: "96%", result: "达标", reading: "覆盖可支持通过部分。" },
        { id: "pay", group: "业务", name: "扫码支付成功率", target: "≥99%", before: "96.8%", after: "99.3%", result: "达标", reading: "关键业务成功率达标。" },
        { id: "uplink", group: "上行", name: "直播上行平均速率", target: "≥40Mbps", before: "22Mbps", after: "45Mbps", result: "达标", reading: "平均上行能力达标。" },
        { id: "handover", group: "移动性", name: "人群移动切换成功率", target: "≥98%", before: "96.2%", after: "97.1%", result: "未达标", reading: "移动过程仍需复核。" }
      ],
      activity: {
        type: "evidence-sort",
        title: "整理验收依据链",
        instruction: "把每条材料放入最合适的类别。分类完成后再生成参考结论。",
        categories: [
          { id: "support", label: "通过依据" },
          { id: "boundary", label: "必须写边界" },
          { id: "background", label: "背景信息" }
        ],
        items: [
          { id: "stand", text: "看台SS-RSRP覆盖率优化后达到96%。", target: "support", feedback: "覆盖达到目标，可作为通过依据。" },
          { id: "pay", text: "扫码支付成功率达到99.3%。", target: "support", feedback: "关键业务成功率达到目标，可作为通过依据。" },
          { id: "handover", text: "人群移动切换成功率只有97.1%。", target: "boundary", feedback: "移动性未达目标，必须写成边界。" },
          { id: "before", text: "优化前直播上行平均速率只有22Mbps。", target: "background", feedback: "优化前数据可说明改善背景，但不能单独证明优化后达标。" }
        ]
      },
      conclusion: {
        judgement: "本次体育馆优化建议判断为部分达标。",
        evidence: ["看台覆盖率、扫码支付成功率和直播上行平均速率达到本课目标。"],
        boundary: "人群移动切换成功率仍未达到本课目标，移动过程体验存在边界。",
        next: "建议补充活动模拟人流下的移动性复测和切换日志分析。"
      },
      ability: ["选择判断依据", "形成半独立判断"],
      conversions: ["依据分类互动", "体育馆人流路径动画", "结论自动生成反馈"]
    },
    {
      id: "mission-jobfair",
      stage: "独立实践",
      shortTitle: "招聘会扩容验收",
      title: "校园招聘会：临时扩容后是否可以验收？",
      task: "拼装并提交一段可讲评的验收结论。",
      graphNodeIds: ["P4T2-N07", "P4T2-N08"],
      scenario: [
        "校园招聘会当天将有大量学生扫码签到、查看岗位页面、上传简历附件。",
        "网络侧完成临时扩容和参数优化后，你要独立给出验收建议。"
      ],
      focus: ["独立判断", "完整结论", "职业表达"],
      modeSupport: {
        class: {
          title: "课堂组织",
          steps: ["学生独立拼装结论。", "教师收集两类典型结论：边界缺失、依据不足。", "全班共同修订一段可提交版本。"],
          callout: "课堂重点是讲评学生产出，不再重新讲概念。"
        },
        self: {
          title: "自学路线",
          steps: ["先读指标表，再拼装四段结论。", "提交后按量规自查。", "如果缺少边界，回到未达标指标重写。"],
          terms: ["职业表达：说明判断、依据、边界和后续建议，避免只写“通过/不通过”。"],
          checklist: ["我的结论是否包含四部分？", "我是否明确写出上传95分位时延未达标？"]
        }
      },
      metrics: [
        { id: "rrc", group: "容量", name: "忙时RRC连接成功率", target: "≥99%", before: "96.5%", after: "99.2%", result: "达标", reading: "接入能力达到本课目标。" },
        { id: "page", group: "业务", name: "岗位页面打开平均时延", target: "≤2s", before: "4.8s", after: "1.6s", result: "达标", reading: "页面访问体验达标。" },
        { id: "upload", group: "上行", name: "简历上传95分位时延", target: "≤5s", before: "12s", after: "6.8s", result: "未达标", reading: "较差上传体验仍未闭环。" },
        { id: "drop", group: "稳定", name: "30分钟异常掉线次数", target: "≤1次", before: "5次", after: "1次", result: "达标", reading: "保持性达到本课目标。" }
      ],
      activity: {
        type: "compose",
        title: "拼装可提交验收结论",
        instruction: "为四个位置选择最合适的句子。提交后查看这段结论是否能用于教师讲评。",
        slots: [
          {
            id: "judgement",
            label: "判断",
            correct: "partial",
            options: [
              { id: "pass", text: "本次优化全部达标，可以直接验收。" },
              { id: "partial", text: "本次优化建议判断为部分达标。" },
              { id: "fail", text: "本次优化完全没有效果。" }
            ]
          },
          {
            id: "evidence",
            label: "依据",
            correct: "evidence",
            options: [
              { id: "before", text: "优化前体验较差，所以优化后一定可以验收。" },
              { id: "evidence", text: "忙时RRC连接成功率、岗位页面打开平均时延和异常掉线次数已达到本课目标。" },
              { id: "feel", text: "学生主观感觉好多了。" }
            ]
          },
          {
            id: "boundary",
            label: "边界",
            correct: "upload",
            options: [
              { id: "none", text: "没有需要说明的边界。" },
              { id: "upload", text: "简历上传95分位时延仍高于本课目标，上传尾部体验未完全闭环。" },
              { id: "rsrp", text: "SS-RSRP没有出现在表格中，所以无法判断任何内容。" }
            ]
          },
          {
            id: "next",
            label: "建议",
            correct: "retest",
            options: [
              { id: "stop", text: "不需要后续动作。" },
              { id: "retest", text: "建议补充上传业务日志、上行容量负荷和招聘会高峰时段复测。" },
              { id: "redo", text: "建议重新学习全部课程。" }
            ]
          }
        ]
      },
      conclusion: {
        judgement: "本次招聘会临时扩容建议判断为部分达标。",
        evidence: ["忙时RRC连接成功率、岗位页面打开平均时延和异常掉线次数达到本课目标。"],
        boundary: "简历上传95分位时延仍高于本课目标，较差上传体验未完全闭环。",
        next: "建议补充上传业务日志、上行容量负荷和招聘会高峰时段复测。"
      },
      ability: ["形成验收结论", "修正职业表达"],
      conversions: ["结论拼装互动", "自评量规", "教师讲评样例库"]
    }
  ],
  teacher: {
    flow: [
      "5分钟：用投诉线索归类进入课程能力图谱中的“识别验证场景”。",
      "12分钟：围绕覆盖和移动性节点建立验证流程。",
      "18分钟：用两个对照案例纠正只看覆盖、只看平均值的误区。",
      "15分钟：学生完成依据分类，教师观察分类错误。",
      "20分钟：学生拼装并提交验收结论，教师按量规讲评。"
    ],
    groupWork: [
      "场景组：负责从投诉文字中提取验证对象。",
      "指标组：负责读覆盖、移动性、体验和容量数据。",
      "依据组：负责区分通过依据、边界和背景。",
      "表达组：负责把技术判断改写成验收结论。"
    ],
    reviewQuestions: [
      "学生是否能从投诉文字找到验证对象？",
      "学生是否仍把覆盖达标当成全部验收通过？",
      "学生是否能主动写出不能说明什么？",
      "独立实践结论是否包含判断、依据、边界、建议四部分？"
    ],
    risks: [
      "本版是项目四任务2的详细子图谱，不代表全书课程能力图谱已经完整生成。",
      "案例为教学模拟案例，需要通信专业教师复核阈值和结论口径。",
      "本版仍未接入真实仿真软件或真实路测日志。"
    ]
  },
  sources: [
    { name: "3GPP TS 28.552", desc: "移动网络性能测量方向，用于支撑性能指标组织思路。", url: "https://www.3gpp.org/dynareport/28552.htm" },
    { name: "3GPP TS 38.215", desc: "NR物理层测量方向，用于支撑SS-RSRP、SS-SINR等覆盖质量指标口径。", url: "https://www.3gpp.org/dynareport/38215.htm" },
    { name: "3GPP TS 28.554", desc: "端到端KPI方向，用于支撑端到端体验指标组织思路。", url: "https://www.3gpp.org/dynareport/28554.htm" },
    { name: "GZ035 5G组网与运维赛项规程", desc: "本地已抽取材料，包含覆盖、上行带宽、时延、切换/重选等技能任务。", url: "local:research/competition_text/GZ035_5G组网与运维赛项规程_2023.txt" }
  ]
};
