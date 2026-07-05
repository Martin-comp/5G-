window.P4T2_PROGRESSIVE = {
  meta: {
    version: "3.4",
    title: "5G网络优化结果验证",
    subtitle: "多案例递进式课堂任务版",
    role: "网络优化助理工程师",
    bigQuestion: "面对不同投诉和指标，怎样判断优化结果能不能验收？",
    promise: "这一节课不只跟做一个案例，而是用5个教学模拟案例学会比较、辨析和迁移。",
    simulationNote: "本样章案例均为教学模拟案例，阈值为本课验收目标，不代表通用行业标准。",
    modes: {
      class: "课堂带学",
      self: "自学跟练"
    }
  },
  lessonFlow: [
    { id: "warmup", label: "引入", minutes: "5分钟", text: "看懂为什么不能只凭一句“好了”验收。" },
    { id: "demo", label: "示范", minutes: "12分钟", text: "教师带读一个完整案例。" },
    { id: "contrast", label: "对照", minutes: "18分钟", text: "用两个反例纠正常见误区。" },
    { id: "guided", label: "半扶手", minutes: "15分钟", text: "学生选择依据并生成结论。" },
    { id: "mission", label: "独立实践", minutes: "20分钟", text: "独立完成一段可提交结论。" }
  ],
  cases: [
    {
      id: "demo-dorm",
      stage: "入门样例",
      shortTitle: "宿舍区投诉复盘",
      title: "宿舍区：网页好了，但视频和直播还卡",
      task: "先建立一个基本判断框架：改善不等于全部达标。",
      scenario: [
        "某宿舍区完成天线下倾角调整和参数优化后，学生反馈网页打开明显顺畅。",
        "但晚高峰仍有人反馈视频通话偶发卡顿，直播上行延迟偏高。你需要给出本次优化结果能否验收的初步结论。"
      ],
      focus: ["覆盖改善", "业务体验边界", "部分达标表达"],
      guidance: {
        class: "先让学生投票：网页好了是否等于验收通过。再带学生读覆盖表和体验表。",
        self: "先判断投诉是否全部解决，再读数据。不要先背术语。"
      },
      metrics: [
        { group: "覆盖", name: "SS-RSRP覆盖率", target: "≥95%", before: "88.4%", after: "96.3%", result: "达标", reading: "覆盖强度改善，可作为通过部分依据。" },
        { group: "覆盖", name: "弱覆盖采样点占比", target: "≤5%", before: "12.6%", after: "3.8%", result: "达标", reading: "弱覆盖问题明显减少。" },
        { group: "体验", name: "视频平均时延", target: "≤50ms", before: "78ms", after: "42ms", result: "达标", reading: "平均体验改善。" },
        { group: "体验", name: "直播上行95分位时延", target: "≤90ms", before: "180ms", after: "110ms", result: "未达标", reading: "较差体验仍需复核。" }
      ],
      action: {
        prompt: "这个案例最稳的验收判断是：",
        options: [
          { id: "pass", label: "全部达标，可以验收", correct: false, feedback: "过度判断。直播上行95分位仍未达标。" },
          { id: "partial", label: "部分达标，需要补充复核", correct: true, feedback: "正确。覆盖和平均体验改善，但直播上行尾部体验仍有边界。" },
          { id: "fail", label: "完全失败", correct: false, feedback: "过度否定。覆盖和视频平均体验已有明确改善。" }
        ]
      },
      conclusion: {
        judgement: "本次优化建议判断为部分达标。",
        evidence: ["覆盖强度和弱覆盖采样点已达到本课目标。", "视频平均时延已改善并达到本课目标。"],
        boundary: "直播上行95分位时延仍高于本课目标，不能证明晚高峰直播体验全部恢复。",
        next: "建议补充晚高峰直播上行日志、容量负荷和复测数据。"
      },
      ability: ["识别投诉是否全部闭环", "区分改善与达标"],
      conversions: ["投诉投票互动", "覆盖/体验双表带读", "部分达标结论拼句"]
    },
    {
      id: "contrast-canteen",
      stage: "对照样例A",
      shortTitle: "地下食堂切换失败",
      title: "地下食堂：覆盖达标，但电梯口切换失败",
      task: "纠正“覆盖达标就一定可以验收”的误区。",
      scenario: [
        "地下食堂新增室分后，静止测试点的SS-RSRP和SS-SINR都达到本课目标。",
        "但学生从电梯口走向食堂时，视频会议出现中断，日志显示切换失败和重建次数偏高。"
      ],
      focus: ["覆盖不是全部", "移动性验证", "日志边界"],
      guidance: {
        class: "先遮住移动性数据，只看覆盖表让学生判断；再展示切换失败数据，让学生修正结论。",
        self: "先问自己：这个投诉发生在静止点，还是移动过程中？移动过程要看切换和保持。"
      },
      metrics: [
        { group: "覆盖", name: "SS-RSRP覆盖率", target: "≥95%", before: "82.0%", after: "97.5%", result: "达标", reading: "静态覆盖已修复。" },
        { group: "覆盖", name: "SS-SINR覆盖率", target: "≥90%", before: "76.5%", after: "92.0%", result: "达标", reading: "信号质量已改善。" },
        { group: "移动性", name: "电梯口切换成功率", target: "≥98%", before: "93.0%", after: "94.5%", result: "未达标", reading: "移动过程仍有明显风险。" },
        { group: "移动性", name: "10次往返重建次数", target: "≤1次", before: "5次", after: "4次", result: "未达标", reading: "中断问题未闭环。" }
      ],
      action: {
        prompt: "这个案例主要提醒你补看哪一类数据？",
        options: [
          { id: "mobility", label: "切换成功率、重建、掉线日志", correct: true, feedback: "正确。投诉发生在移动路径上，必须看移动性和保持。" },
          { id: "coverageOnly", label: "只看SS-RSRP覆盖率", correct: false, feedback: "不够。覆盖达标不能证明移动过程不中断。" },
          { id: "ui", label: "仿真软件截图是否美观", correct: false, feedback: "截图美观不能替代现场日志和移动测试。" }
        ]
      },
      conclusion: {
        judgement: "本次优化不能直接判定全部达标。",
        evidence: ["静态覆盖和信号质量已达到本课目标。"],
        boundary: "电梯口切换成功率和重建次数未达到本课目标，移动过程体验未闭环。",
        next: "建议复核邻区关系、切换参数和电梯口往返测试日志。"
      },
      ability: ["验证移动保持", "避免只看覆盖"],
      conversions: ["覆盖达标/切换失败翻牌", "路径切换动画", "移动性日志找错小游戏"]
    },
    {
      id: "contrast-lab",
      stage: "对照样例B",
      shortTitle: "实训楼尾部体验",
      title: "实训楼：平均速率好，但晚高峰尾部体验差",
      task: "纠正“平均值好就代表全部学生体验好”的误区。",
      scenario: [
        "实训楼扩容后，测速平均下行速率明显提升，白天测试大多顺畅。",
        "但晚高峰在线人数集中，最差一段体验仍然差，学生上云实验时偶发卡顿。"
      ],
      focus: ["平均值", "95分位", "高峰容量"],
      guidance: {
        class: "让学生先只看平均速率，再补充95分位和PRB利用率，比较两次判断差异。",
        self: "平均值看多数体验，95分位看较差体验，高峰负荷看容量边界。"
      },
      metrics: [
        { group: "速率", name: "下行平均速率", target: "≥300Mbps", before: "180Mbps", after: "360Mbps", result: "达标", reading: "多数测速体验改善。" },
        { group: "体验", name: "实验登录95分位时延", target: "≤120ms", before: "260ms", after: "170ms", result: "未达标", reading: "尾部体验仍偏差。" },
        { group: "容量", name: "晚高峰PRB利用率", target: "≤80%", before: "92%", after: "88%", result: "未达标", reading: "高峰容量仍紧张。" },
        { group: "体验", name: "10分钟卡顿次数", target: "≤1次", before: "6次", after: "2次", result: "未达标", reading: "有改善但未闭环。" }
      ],
      action: {
        prompt: "这个案例中，为什么不能只写“平均速率达标，所以验收通过”？",
        options: [
          { id: "tail", label: "95分位和高峰负荷仍未达目标", correct: true, feedback: "正确。平均值不能替代较差体验和高峰容量。" },
          { id: "average", label: "因为平均速率没有变化", correct: false, feedback: "事实不对。平均速率已经改善并达标。" },
          { id: "none", label: "因为所有数据都没有价值", correct: false, feedback: "数据有价值，关键是不能只取对自己有利的一项。" }
        ]
      },
      conclusion: {
        judgement: "本次优化只能判断为体验有改善，但高峰体验未完全达标。",
        evidence: ["下行平均速率达到本课目标。"],
        boundary: "95分位时延、晚高峰PRB利用率和卡顿次数仍未达到本课目标。",
        next: "建议继续做高峰容量评估、业务分流或扩容复测。"
      },
      ability: ["理解平均值和尾部体验", "判断容量边界"],
      conversions: ["平均值/95分位切换动画", "高峰容量热度条", "只看平均值纠错小游戏"]
    },
    {
      id: "guided-gym",
      stage: "半扶手练习",
      shortTitle: "体育馆活动保障",
      title: "体育馆：活动保障优化后，学生自己选依据",
      task: "从给定数据中选择支持结论的依据，并生成一段结论。",
      scenario: [
        "体育馆将举行大型活动，优化后需要复核现场扫码、直播上传和人群移动体验。",
        "系统不再一步步给答案，你需要自己选依据。"
      ],
      focus: ["选择依据", "生成结论", "从示范迁移"],
      guidance: {
        class: "让学生两人一组先选依据，再对比系统生成结论。教师重点追问为什么没有选择无关数据。",
        self: "先看每项是否达到本课目标，再选能支持判断或说明边界的数据。"
      },
      metrics: [
        { group: "覆盖", name: "看台SS-RSRP覆盖率", target: "≥95%", before: "89%", after: "96%", result: "达标", reading: "覆盖可支持通过部分。" },
        { group: "业务", name: "扫码支付成功率", target: "≥99%", before: "96.8%", after: "99.3%", result: "达标", reading: "关键业务成功率达标。" },
        { group: "上行", name: "直播上行平均速率", target: "≥40Mbps", before: "22Mbps", after: "45Mbps", result: "达标", reading: "平均上行能力达标。" },
        { group: "移动性", name: "人群移动切换成功率", target: "≥98%", before: "96.2%", after: "97.1%", result: "未达标", reading: "移动过程仍需复核。" }
      ],
      action: {
        prompt: "请选择最适合写入结论的三条依据或边界：",
        options: [
          { id: "coverage", label: "看台覆盖率达标", correct: true, feedback: "覆盖可以作为通过部分依据。" },
          { id: "pay", label: "扫码支付成功率达标", correct: true, feedback: "关键业务成功率可以作为通过部分依据。" },
          { id: "handover", label: "移动切换成功率未达标", correct: true, feedback: "这是必须写出的边界。" },
          { id: "before", label: "优化前数据很差", correct: false, feedback: "优化前数据可作背景，但不能单独证明优化后达标。" }
        ],
        multi: true
      },
      conclusion: {
        judgement: "本次体育馆优化建议判断为部分达标。",
        evidence: ["看台覆盖率、扫码支付成功率和直播上行平均速率达到本课目标。"],
        boundary: "人群移动切换成功率仍未达到本课目标，移动过程体验存在边界。",
        next: "建议补充活动模拟人流下的移动性复测和切换日志分析。"
      },
      ability: ["选择有效依据", "形成半独立判断"],
      conversions: ["三证据选择互动", "体育馆人流路径动画", "结论自动生成反馈"]
    },
    {
      id: "mission-jobfair",
      stage: "独立实践",
      shortTitle: "招聘会扩容验收",
      title: "校园招聘会：临时扩容后是否可以验收？",
      task: "独立完成一个可提交的验收结论。",
      scenario: [
        "校园招聘会当天将有大量学生扫码签到、查看岗位页面、上传简历附件。",
        "网络侧完成临时扩容和参数优化后，你要独立给出验收建议。"
      ],
      focus: ["独立判断", "完整结论", "教师讲评"],
      guidance: {
        class: "这一阶段教师少讲，让学生先独立提交，再挑选典型结论讲评。",
        self: "按判断、依据、边界、建议四步写，不要只写“通过”或“不通过”。"
      },
      metrics: [
        { group: "容量", name: "忙时RRC连接成功率", target: "≥99%", before: "96.5%", after: "99.2%", result: "达标", reading: "接入能力达到本课目标。" },
        { group: "业务", name: "岗位页面打开平均时延", target: "≤2s", before: "4.8s", after: "1.6s", result: "达标", reading: "页面访问体验达标。" },
        { group: "上行", name: "简历上传95分位时延", target: "≤5s", before: "12s", after: "6.8s", result: "未达标", reading: "较差上传体验仍未闭环。" },
        { group: "稳定", name: "30分钟异常掉线次数", target: "≤1次", before: "5次", after: "1次", result: "达标", reading: "保持性达到本课目标。" }
      ],
      action: {
        prompt: "独立实践：先选择最终判断，再点击生成参考结论。",
        options: [
          { id: "pass", label: "全部达标", correct: false, feedback: "过度判断。简历上传95分位时延仍未达目标。" },
          { id: "partial", label: "部分达标", correct: true, feedback: "正确。多数关键指标达标，但上传尾部体验仍需补查。" },
          { id: "fail", label: "完全未达标", correct: false, feedback: "过度否定。接入、页面和稳定性已有达标依据。" }
        ],
        independent: true
      },
      conclusion: {
        judgement: "本次招聘会临时扩容建议判断为部分达标。",
        evidence: ["忙时RRC连接成功率、岗位页面打开平均时延和异常掉线次数达到本课目标。"],
        boundary: "简历上传95分位时延仍高于本课目标，较差上传体验未完全闭环。",
        next: "建议补充上传业务日志、上行容量负荷和招聘会高峰时段复测。"
      },
      ability: ["独立形成验收建议", "完整职业表达"],
      conversions: ["独立结论提交", "自动批改反馈", "教师讲评样例库"]
    }
  ],
  abilityMap: [
    { label: "识别投诉闭环", caseId: "demo-dorm", desc: "先判断投诉是否全部解释清楚。" },
    { label: "验证覆盖结果", caseId: "demo-dorm", desc: "读覆盖指标，区分能说明和不能说明。" },
    { label: "验证移动保持", caseId: "contrast-canteen", desc: "看切换、重建和掉线，避免只看静态覆盖。" },
    { label: "验证业务体验", caseId: "contrast-lab", desc: "比较平均值、95分位和高峰负荷。" },
    { label: "选择有效依据", caseId: "guided-gym", desc: "从多项数据中选择结论依据和边界。" },
    { label: "形成验收结论", caseId: "mission-jobfair", desc: "写出判断、依据、边界和建议。" }
  ],
  teacher: {
    flow: [
      "5分钟：用宿舍区投诉投票引入，先不讲术语。",
      "12分钟：教师带读入门样例，建立判断、依据、边界、建议四步框架。",
      "18分钟：两个对照样例分别纠正只看覆盖、只看平均值的误区。",
      "15分钟：体育馆半扶手练习，让学生选择证据并生成结论。",
      "20分钟：招聘会独立实践，学生提交结论，教师讲评典型错误。"
    ],
    groupWork: [
      "覆盖组：负责读SS-RSRP、SS-SINR和弱覆盖。",
      "体验组：负责读速率、时延、95分位和卡顿。",
      "移动组：负责读切换、重建、掉线和路径测试。",
      "结论组：负责把依据、边界和建议整理为职业表达。"
    ],
    reviewQuestions: [
      "学生是否能说出“改善”和“达标”的区别？",
      "学生是否还会只看覆盖或只看平均值？",
      "学生能否主动写出不能说明什么？",
      "独立实践结论是否包含判断、依据、边界、建议四部分？"
    ],
    risks: [
      "本版案例为教学模拟案例，需要通信专业教师复核阈值和口径。",
      "3GPP等规范提供指标和测量方向，但具体验收目标需结合项目、运营商和课程要求确定。",
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
