window.P4T2_WORKBENCH = {
  task: {
    version: "3.2",
    title: "5G网络优化结果验证",
    subtitle: "项目四 / 任务2 / 教材正文驱动样章3.2",
    focusTitle: "网页好了，为什么还不能直接说优化成功",
    role: "网络优化助理工程师",
    question: "某高职院校宿舍区完成一轮5G网络优化。普通网页访问明显顺畅，但晚间视频通话仍偶发卡顿，直播上行仍有明显延迟。",
    finalOutput: "判断本次优化结果是否可以验收通过，并写出依据、边界和后续建议。",
    auditNotice: "样章数据为教学模拟数据，不代表真实运营商验收标准；专业阈值和技术结论需通信专业教师或行业专家复核。",
    classroomIntro: "课堂中先让学生完成个人初判，再分组阅读覆盖、移动、业务体验和媒体边界材料，最后合并形成可讲评的结论。",
    selfStudyIntro: "自学时先写初步判断，再按正文和材料一步步读数据。每读一组数据，都要写清它能说明什么、还不能说明什么。",
    judgmentOptions: ["达标", "部分达标", "未达标", "暂时无法判断"],
    modeGuidance: {
      classroom: {
        title: "课堂协作路线",
        subtitle: "教师组织下完成个人判断、小组分工、课堂汇报和讲评修正。",
        steps: [
          "个人先投出初步判断，并写下第一理由。",
          "四个小组分别阅读覆盖与质量、移动与保持、业务体验、媒体边界。",
          "每组汇报一条能支持结论的数据和一条不能直接说明的问题。",
          "全班合并结论，教师讲评后修正职业表达。"
        ],
        recordTitle: "课堂讨论准备",
        recordChecks: [
          "我能向同组同学说明自己引用了哪组数据。",
          "我能指出这组数据能支持什么、还不能说明什么。",
          "我准备了一个需要教师确认的阈值、日志或媒体问题。"
        ],
        editorTitle: "课堂汇报句式",
        editorTips: [
          "先说判断状态，再说两条以上数据依据。",
          "不要只报数值，要说明数值和用户体验的关系。",
          "把仍需教师或行业专家确认的口径单独说出来。"
        ]
      },
      self: {
        title: "自学任务书",
        subtitle: "没有教师即时讲解时，按“读情境、看数据、写边界、改结论”的顺序完成。",
        steps: [
          "先用自己的话复述投诉现象和最终要提交的结论。",
          "按覆盖与质量、移动与保持、业务体验、媒体边界逐项阅读。",
          "每看一类材料，都写一句“能说明什么、还不能说明什么”。",
          "提交前用句式支架检查结论是否有依据、有边界、有后续建议。"
        ],
        recordTitle: "自学检查",
        recordChecks: [
          "我已经引用至少两类数据，而不是只看覆盖。",
          "我能解释“改善”和“达标”不是同一件事。",
          "我写出了还需要补充核查的数据或后续动作。"
        ],
        editorTitle: "自学作答支架",
        editorTips: [
          "可以按“我的判断是……依据是……但还不能说明……所以建议……”来写。",
          "如果读不懂某张图，不要硬用它，把它写成需要补充说明的材料。",
          "提交前逐句检查：每个判断后面是否有数据支撑。"
        ]
      }
    }
  },
  sourceLayers: [
    { code: "A", title: "原教材内容", note: "来自《5G网络优化教材（高级）》项目四任务2，作为任务范围、术语和原始资源池。" },
    { code: "B", title: "AI教学化重构", note: "基于原教材、任务目标和教学逻辑进行语言、结构、案例和练习重写。" },
    { code: "C", title: "政策与专业教学标准", note: "用于确定职业教育数字教材形态、能力边界和工作过程。" },
    { code: "D", title: "职业技能与岗位依据", note: "用于确定优化结果验证、报告输出和职业表达要求。" },
    { code: "E", title: "技术规范与行业依据", note: "用于支撑NR测量、RRC、切换和指标边界，正式阈值需专业复核。" },
    { code: "F", title: "教学模拟数据", note: "为样章演示构造，不得冒充真实网络或正式验收标准。" }
  ],
  lessonSegments: [
    {
      id: "seg-scenario",
      title: "网页好了，为什么还不能直接说优化成功",
      groupId: null,
      nodeId: "scene",
      body: [
        "某高职院校宿舍区完成了一轮5G网络优化。优化前，学生集中投诉晚间网络体验差：微信视频经常卡顿，直播推流延迟明显，个别位置还会短时掉线。优化后，普通网页访问基本恢复，图片和文字页面打开明显顺畅。",
        "但新的投诉又出现了：到了晚间高峰，视频通话仍然偶发卡顿，直播上行仍有明显延迟。现场负责人要求网优小组给出一个判断：本次优化结果是否可以验收通过？",
        "你不能只回答“好了”或“没好”，而要写出一个能被追问的结论：是否达标、依据哪些数据、哪些数据还不能证明结论、下一步还要补充什么测试或优化。"
      ],
      studentAction: "先写下初步判断。这个判断可以先不正确，后续要用数据修正。",
      classroomPause: "让学生投票选择达标、部分达标、未达标或暂时无法判断，并追问第一理由。",
      selfStudySupport: "先不要急着看答案。把投诉现象翻译成你要验证的对象：覆盖、移动保持、业务体验和媒体材料边界。",
      sourceRefs: ["A", "B", "D"],
      auditStatus: "待教师审读"
    },
    {
      id: "seg-workflow",
      title: "验证不是看一张截图",
      groupId: null,
      nodeId: "diagnosis",
      body: [
        "优化结果验证不是打开软件看一张结果图，也不是看到某个指标变好就写优化成功。更可靠的顺序是：先明确投诉和验收目标；再查看优化前后的覆盖、切换和业务体验数据；然后判断每类数据能支持什么、不能支持什么；最后写出是否达标、依据和后续建议。",
        "原教材包含覆盖、切换、时延、速率、容量和掉线六类内容。本样章先把它们组织成三条判断线：覆盖与质量、移动与保持、业务体验。媒体边界单独列出，用来处理原教材中的仿真软件截图。"
      ],
      table: {
        columns: ["学习入口", "对应原教材内容", "它回答的问题"],
        rows: [
          ["覆盖与质量", "覆盖优化结果、SS-RSRP、SS-SINR、弱覆盖", "信号是否够强、质量是否够好"],
          ["移动与保持", "切换优化结果、A类事件、SA/NSA切换、掉线", "移动过程中业务是否连续"],
          ["业务体验", "时延、速率、容量、卡顿、直播上行", "用户真实业务是否恢复"]
        ]
      },
      studentAction: "选择你准备优先查看的一组数据，并说明理由。",
      classroomPause: "让不同学生说明为什么不能只看覆盖或只看网页访问。",
      selfStudySupport: "把这一步当作阅读地图。后面每组材料都要回答同一个问题：能支持什么，不能说明什么。",
      sourceRefs: ["A", "B", "C", "D"],
      auditStatus: "待教师审读"
    },
    {
      id: "seg-coverage",
      title: "覆盖与质量：信号强，不代表体验一定好",
      groupId: "coverage",
      nodeId: "coverage",
      body: [
        "覆盖验证常见指标包括SS-RSRP和SS-SINR。SS-RSRP可先理解为同步信号接收功率，适合回答优化后信号是不是更强、弱覆盖是不是减少。SS-SINR可先理解为信号质量和干扰情况，适合回答信号是不是更干净、干扰是不是仍可能影响业务。",
        "下面是样章教学模拟数据，不代表真实验收标准。正式教材中，阈值、场景和运营商口径必须由专业教师或行业专家复核。"
      ],
      table: {
        columns: ["指标", "优化前", "优化后", "目标状态", "读法"],
        rows: [
          ["SS-RSRP覆盖率", "88.4%", "96.3%", "需按场景复核", "覆盖强度明显改善"],
          ["SS-SINR覆盖率", "84.2%", "94.1%", "需按场景复核", "质量改善，但不能直接写成完全达标"],
          ["弱覆盖采样点占比", "12.6%", "3.8%", "越低越好", "弱覆盖明显减少"]
        ]
      },
      supports: [
        "覆盖侧优化有效，覆盖强度和弱覆盖问题已有明显改善。",
        "可用于支撑“部分达标”中的覆盖侧依据。"
      ],
      limits: [
        "不能单独证明视频通话不卡顿。",
        "不能单独证明直播上行体验已经恢复。"
      ],
      modelSentence: "覆盖侧已有明显改善，但还不能仅凭覆盖数据判断整体优化达标，需要继续查看业务体验和移动过程数据。",
      studentAction: "写一句覆盖侧判断，并明确它还不能说明什么。",
      classroomPause: "追问：如果覆盖率已经提升，为什么仍不能直接写全部达标？",
      selfStudySupport: "先看优化前后变化，再看目标状态。读完后必须写出“能说明”和“不能说明”两句话。",
      sourceRefs: ["A", "B", "E", "F"],
      auditStatus: "待专家复核"
    },
    {
      id: "seg-mobility",
      title: "移动与保持：流程图能帮助理解，但不能替代现场日志",
      groupId: "handover",
      nodeId: "handover",
      body: [
        "学生在宿舍区移动时，手机可能从一个小区切换到另一个小区。切换做得好，视频或直播能较平稳地继续；切换过早、过晚、失败或过于频繁，都可能导致卡顿、掉线或重连。",
        "原教材讲了A1、A2、A3、A4、A5等测量事件。学生第一次学习时，不需要背完每个公式。先抓住A3事件的岗位含义：当邻区比当前服务小区更适合服务终端时，网络可能触发切换判断。",
        "流程图能说明正常情况下切换怎么发生，但不能证明本次现场切换没有问题。要判断视频卡顿是不是切换造成的，还需要现场日志。"
      ],
      table: {
        columns: ["需要补充的数据", "用来判断什么"],
        rows: [
          ["切换成功率", "是否存在大量切换失败"],
          ["切换时延", "切换是否过慢影响业务连续性"],
          ["重建立/异常释放记录", "是否出现无线链路失败或掉线"],
          ["事件触发位置和服务小区/邻区RSRP、SINR", "是否存在切换过早、过晚或邻区漏配"]
        ]
      },
      supports: [
        "切换流程图可以帮助理解验证思路。",
        "A3事件能解释为什么移动过程中可能触发切换。"
      ],
      limits: [
        "流程图不能证明现场切换一定正常。",
        "没有日志时，不能判断是否存在切换失败、过晚或异常释放。"
      ],
      modelSentence: "切换流程图只能说明验证思路。若要判断本次现场移动过程中业务是否连续，还需要查看切换成功率、重建立、异常释放和相关信令日志。",
      studentAction: "列出至少两类还需要补充的切换或保持类数据。",
      classroomPause: "让学生区分“理论流程完整”和“现场日志正常”这两件事。",
      selfStudySupport: "如果你手里只有流程图，不要写现场切换正常；应写还需查看哪些日志。",
      sourceRefs: ["A", "B", "E"],
      auditStatus: "待专家复核"
    },
    {
      id: "seg-experience",
      title: "业务体验：平均值变好，不代表晚高峰用户都满意",
      groupId: "performance",
      nodeId: "performance",
      body: [
        "业务体验最接近用户真实感受。网页访问、视频通话、直播上行、游戏和下载对网络的要求不同。本任务的投诉重点不是网页能否打开，而是视频和直播是否稳定。",
        "平均值可以说明大多数时间的表现，但不能代表体验较差的那部分用户。直播上行95分位时延提醒我们关注较差时段：即使大多数时间还可以，少数高时延时段也会让直播用户明显感到延迟。"
      ],
      table: {
        columns: ["指标", "优化前", "优化后", "读法"],
        rows: [
          ["视频通话平均端到端时延", "78 ms", "42 ms", "平均体验明显改善"],
          ["直播上行95分位时延", "180 ms", "110 ms", "有改善，但仍需按目标判断是否达标"],
          ["10分钟业务卡顿次数", "6次", "2次", "卡顿减少，但问题未必完全解决"]
        ]
      },
      supports: [
        "视频通话平均体验明显改善。",
        "直播上行体验和卡顿次数也有改善。"
      ],
      limits: [
        "平均时延改善不能证明晚高峰直播体验完全恢复。",
        "卡顿次数下降不等于卡顿已经消除。"
      ],
      modelSentence: "业务体验已有改善，其中视频通话平均时延明显下降；但直播上行95分位时延和卡顿次数仍需结合目标值复核，不能直接判断为全部达标。",
      studentAction: "把每项指标分别判断为“改善”或“达标”，不要混用。",
      classroomPause: "比较平均值和95分位：哪一个更能暴露晚高峰体验问题？",
      selfStudySupport: "先判断是否改善，再判断是否达标。看到95分位时，要想到体验较差的那部分情况。",
      sourceRefs: ["A", "B", "D", "F"],
      auditStatus: "待专家复核"
    },
    {
      id: "seg-extension",
      title: "容量、速率和掉线：为什么本样章不直接展开所有细节",
      groupId: "performance",
      nodeId: "performance",
      body: [
        "原教材还包含速率、容量和掉线优化结果验证。它们不是不重要，而是本样章先聚焦学生如何形成结果验证结论。",
        "如果视频和直播投诉集中在晚高峰，就不能只看覆盖。晚高峰可能同时涉及容量和上行资源问题。如果学生移动时卡顿明显，就要补看切换和掉线日志。"
      ],
      table: {
        columns: ["验证对象", "学生端先这样理解", "常见补充数据"],
        rows: [
          ["速率", "用户上传、下载是否达到业务需要", "上/下行吞吐率、边缘速率、资源块利用率"],
          ["容量", "晚高峰用户多时网络是否还能承载", "用户数、PRB利用率、负荷、拥塞记录"],
          ["掉线", "业务是否异常中断", "掉线率、异常释放、RLF、重建立失败"]
        ]
      },
      supports: ["帮助学生理解为什么完整结论必须包含补充核查。"],
      limits: ["本样章未展开全部专业细节，不能替代完整课程内容。"],
      studentAction: "从速率、容量、掉线中选择一类你认为还需要补充核查的数据，并说明原因。",
      classroomPause: "追问：晚高峰直播问题更可能补看哪些数据？",
      selfStudySupport: "如果你不知道选哪类，先回到投诉：晚高峰、直播上行、卡顿，分别对应容量、上行体验和业务保持。",
      sourceRefs: ["A", "B", "D"],
      auditStatus: "待教师审读"
    },
    {
      id: "seg-media",
      title: "仿真截图怎么处理：看不懂的图不能强行当依据",
      groupId: "media",
      nodeId: "media",
      body: [
        "原教材任务实施中使用仿真软件查询覆盖、切换、时延、速率、容量、掉线等优化结果。仿真软件对实训有价值，但截图不能直接成为学生主学习材料。",
        "如果一张图不能说明看哪里、字段是什么意思、能支持什么、不能支持什么，就不应放在学生主学习区。正式数字教材应优先使用重绘教学图、指标表或交互数据面板。"
      ],
      table: {
        columns: ["原材料", "学生端替代形式", "目的"],
        rows: [
          ["覆盖优化截图", "SS-RSRP/SS-SINR对比表或热力示意图", "教学生读覆盖结果"],
          ["切换优化截图", "三阶段切换流程图 + 异常日志样例", "教学生判断切换风险"],
          ["时延优化截图", "平均值、95分位、业务类型对比表", "防止只看平均值"],
          ["容量/掉线截图", "晚高峰负荷关系图、异常释放/RLF证据链", "解释高峰体验差和业务中断"]
        ]
      },
      supports: [
        "原截图可作为资源审查和教师讲解线索。",
        "重绘后的图表可进入学生主学习区。"
      ],
      limits: [
        "未标注截图不能单独作为学生结论依据。",
        "特定软件界面存在版权、授权和平台适配风险。"
      ],
      modelSentence: "仿真截图可作为辅助材料，但正式结论应优先引用可解释的数据表、日志或重绘后的教学图；未标注截图不能单独作为最终判断依据。",
      studentAction: "判断一张仿真截图应保留、重绘、替换还是转入附录，并说明理由。",
      classroomPause: "让学生说出一张图进入学生主学习区前必须补齐哪些信息。",
      selfStudySupport: "看到截图时先问三件事：我看哪里？字段是什么意思？这张图能独立支撑判断吗？",
      sourceRefs: ["A", "B", "C"],
      auditStatus: "待编辑审核"
    },
    {
      id: "seg-practice",
      title: "学生实践：完成一份短结论",
      groupId: null,
      nodeId: "conclusion",
      body: [
        "现在请根据前面的数据完成结论任务。第一步判断状态；第二步写两条支持依据；第三步写一个还需要补充核查的数据；第四步形成职业表达。",
        "职业表达的基本结构是：本次优化结果建议判断为____。依据是____。但____仍不能证明全部达标，还需补充____。建议下一步____。"
      ],
      studentAction: "进入结论区，完成结构化短报告。",
      classroomPause: "选取两份学生结论，重点讲评依据是否充分、边界是否写清、建议是否具体。",
      selfStudySupport: "不要只写一段总评。先把依据、边界和后续建议分开写，再合成为职业表达。",
      sourceRefs: ["B", "D", "F"],
      auditStatus: "待教师审读"
    },
    {
      id: "seg-feedback",
      title: "常见错误和修改示范",
      groupId: null,
      nodeId: "conclusion",
      body: [
        "错误一：网页能打开了，所以优化成功。问题是网页访问恢复不等于视频、直播等实时业务恢复。",
        "错误二：覆盖率提升，所以整体达标。问题是覆盖改善不能替代业务体验验证。",
        "错误三：流程图显示切换流程完整，所以切换没有问题。问题是流程图说明理论流程，不代表现场日志正常。",
        "错误四：仿真截图显示结果改善，所以可以作为最终依据。问题是未标注截图无法说明字段含义、指标口径和适用边界。"
      ],
      studentAction: "对照四类错误修改自己的结论。",
      classroomPause: "让学生把错误表达改成可提交表达。",
      selfStudySupport: "如果你的结论里有“所以优化成功”“说明全部达标”等绝对表达，请回到数据边界重新检查。",
      sourceRefs: ["B", "D"],
      auditStatus: "待教师审读"
    }
  ],
  abilityNodes: [
    {
      id: "scene",
      label: "识别优化验证场景",
      studentLabel: "先弄清要解决的问题",
      segmentId: "seg-scenario",
      status: "available",
      purpose: "判断自己面对的是一次结果验证任务，而不是单纯查一个指标。",
      outcome: "能说清当前投诉现象、角色任务和最终要提交的结论。",
      resources: ["R-SCENE-01"],
      evidenceGroups: [],
      previous: [],
      next: ["diagnosis"]
    },
    {
      id: "diagnosis",
      label: "区分验证对象",
      studentLabel: "先确定要看哪些数据",
      segmentId: "seg-workflow",
      status: "available",
      purpose: "把投诉问题分成覆盖、移动保持、业务体验和媒体边界，再决定阅读顺序。",
      outcome: "能说明为什么不能只看网页访问或一张截图。",
      resources: ["R-DIAG-01"],
      evidenceGroups: ["coverage", "handover", "performance", "media"],
      previous: ["scene"],
      next: ["coverage", "handover", "performance"]
    },
    {
      id: "coverage",
      label: "验证覆盖优化结果",
      studentLabel: "查看覆盖与质量",
      segmentId: "seg-coverage",
      status: "available",
      purpose: "判断覆盖强度和覆盖质量是否改善，以及这些数据的边界。",
      outcome: "能区分覆盖改善和整体体验达标。",
      resources: ["R-COV-KNOW", "R-COV-DATA"],
      evidenceGroups: ["coverage"],
      previous: ["diagnosis"],
      next: ["handover", "performance"]
    },
    {
      id: "handover",
      label: "验证切换/掉线风险",
      studentLabel: "查看移动与保持",
      segmentId: "seg-mobility",
      status: "available",
      purpose: "判断业务卡顿是否可能与切换触发、流程、邻区配置或异常释放有关。",
      outcome: "能说明流程图、A3事件和现场日志之间的关系。",
      resources: ["R-HO-KNOW", "R-HO-DATA"],
      evidenceGroups: ["handover"],
      previous: ["diagnosis", "coverage"],
      next: ["performance", "conclusion"]
    },
    {
      id: "performance",
      label: "验证业务体验",
      studentLabel: "查看业务体验",
      segmentId: "seg-experience",
      status: "available",
      purpose: "用时延、卡顿、容量和用户体验数据判断是否真正恢复。",
      outcome: "能说明平均值改善不等于晚高峰用户都满意。",
      resources: ["R-PERF-KNOW", "R-PERF-DATA"],
      evidenceGroups: ["performance"],
      previous: ["diagnosis", "coverage"],
      next: ["media", "conclusion"]
    },
    {
      id: "media",
      label: "判断媒体材料边界",
      studentLabel: "判断图片能不能直接用",
      segmentId: "seg-media",
      status: "review",
      purpose: "理解非通用仿真软件截图为什么不能裸用。",
      outcome: "能说明图片材料需要标注、重绘、替换或转入附录。",
      resources: ["R-MEDIA-GUIDE"],
      evidenceGroups: ["media"],
      previous: ["performance"],
      next: ["conclusion"]
    },
    {
      id: "conclusion",
      label: "形成优化结果验证结论",
      studentLabel: "写出判断依据和后续建议",
      segmentId: "seg-practice",
      status: "available",
      purpose: "把多组数据组织成一个有依据、有边界、有建议的职业表达。",
      outcome: "能写出是否达标、依据是什么、还不能说明什么、下一步做什么。",
      resources: ["R-CONCLUSION", "R-FEEDBACK"],
      evidenceGroups: ["coverage", "handover", "performance", "media"],
      previous: ["coverage", "handover", "performance", "media"],
      next: []
    }
  ],
  evidenceGroups: [
    {
      id: "coverage",
      title: "覆盖与质量",
      studentTitle: "覆盖与质量",
      node: "coverage",
      segmentId: "seg-coverage",
      resourceId: "R-COV-DATA",
      summary: "覆盖强度明显改善，但不能单独证明视频和直播体验已经全部恢复。",
      readingSteps: ["先看SS-RSRP覆盖率变化", "再看SS-SINR覆盖率", "最后写清覆盖数据不能说明什么"],
      classroomTask: "本组负责说明覆盖已经改善的依据，同时准备回答为什么覆盖改善不能直接等于体验达标。",
      selfStudyTask: "先读SS-RSRP，再读SS-SINR。每读一个指标，都写一句“它能支持什么、还不能说明什么”。",
      items: [
        { id: "EV-COV-01", label: "SS-RSRP覆盖率从88.4%提升到96.3%", supports: "可以支持覆盖强度明显改善。", limits: "不能单独证明视频通话一定不卡顿。", auditStatus: "待专家复核" },
        { id: "EV-COV-02", label: "SS-SINR覆盖率从84.2%提升到94.1%", supports: "可以说明覆盖质量有改善。", limits: "是否满足本场景目标值仍需复核，不能写成完全达标。", auditStatus: "待专家复核" },
        { id: "EV-COV-03", label: "弱覆盖采样点占比从12.6%降至3.8%", supports: "可以支持弱覆盖问题明显减少。", limits: "不能解释直播上行时延仍偏高的全部原因。", auditStatus: "待专家复核" }
      ]
    },
    {
      id: "handover",
      title: "移动与保持",
      studentTitle: "移动与保持",
      node: "handover",
      segmentId: "seg-mobility",
      resourceId: "R-HO-DATA",
      summary: "切换流程能解释验证思路，但还需要现场日志判断是否存在失败、过晚或异常释放。",
      readingSteps: ["先看测量、判决、执行三阶段", "再列出还缺哪些现场日志", "不要把流程图写成现场正常"],
      classroomTask: "本组负责判断切换材料能否解释移动过程中的卡顿，并提出还需要教师补充的真实日志。",
      selfStudyTask: "如果只有流程图，不要直接写切换正常。读完后问自己：这能证明现场切换一定没有问题吗？",
      items: [
        { id: "EV-HO-01", label: "A3事件可帮助理解邻区优于服务小区后的切换触发", supports: "可以解释为什么移动过程中可能需要切换。", limits: "不能单独证明本次切换没有失败或过晚。", auditStatus: "待专家复核" },
        { id: "EV-HO-02", label: "切换流程可拆为测量、判决、执行三阶段", supports: "可以帮助检查验证思路是否完整。", limits: "原图信息密度高，正式版应重绘为教学图。", auditStatus: "待专业审核" }
      ]
    },
    {
      id: "performance",
      title: "业务体验",
      studentTitle: "业务体验",
      node: "performance",
      segmentId: "seg-experience",
      resourceId: "R-PERF-DATA",
      summary: "视频平均体验明显改善，但直播上行95分位时延和卡顿次数仍需结合目标复核。",
      readingSteps: ["先判断是否改善", "再判断是否达标", "重点比较平均值和95分位"],
      classroomTask: "本组负责判断用户体验是否真正恢复，汇报时必须同时说明平均值和95分位数据。",
      selfStudyTask: "先判断每项指标是改善还是达标。遇到95分位和卡顿次数时，要特别检查它们是否仍有风险。",
      items: [
        { id: "EV-PERF-01", label: "视频通话平均端到端时延从78 ms降至42 ms", supports: "可以支持视频通话平均体验明显改善。", limits: "不能解释直播推流的95分位时延问题。", auditStatus: "待专家复核" },
        { id: "EV-PERF-02", label: "直播上行95分位时延从180 ms降至110 ms", supports: "可以说明直播上行体验有改善。", limits: "仍需结合目标复核，不能直接写成全部达标。", auditStatus: "待专家复核" },
        { id: "EV-PERF-03", label: "10分钟业务卡顿次数从6次降至2次", supports: "可以说明卡顿明显减少。", limits: "卡顿减少不等于卡顿完全消除，后续需继续核查。", auditStatus: "待专家复核" }
      ]
    },
    {
      id: "media",
      title: "媒体边界",
      studentTitle: "媒体边界",
      node: "media",
      segmentId: "seg-media",
      resourceId: "R-MEDIA-GUIDE",
      summary: "非通用仿真软件截图不能裸用；正式版应重绘、替换、补充标注或转入附录。",
      readingSteps: ["先判断学生能不能看懂字段", "再判断它能支持什么", "最后决定重绘、替换或转入附录"],
      classroomTask: "本组负责判断图片材料是否适合直接给学生使用，并给出重绘、替换或转入附录的建议。",
      selfStudyTask: "看到图片材料时不要只看结论。先问：我看哪里？字段是什么意思？这张图能不能独立支撑判断？",
      items: [
        { id: "EV-MEDIA-01", label: "原仿真截图来自非通用软件界面", supports: "可以提示正式版需要解释字段、入口和读图路径。", limits: "不能作为学生自学时的直接判断依据。", auditStatus: "待编辑审核" },
        { id: "EV-MEDIA-02", label: "覆盖、切换、时延、速率、容量、掉线截图需重绘或替换", supports: "可以指导后续媒体治理工作。", limits: "不能替代正式教学图或真实导出数据。", auditStatus: "待编辑审核" }
      ]
    }
  ],
  resources: [
    {
      id: "R-SCENE-01",
      type: "任务说明",
      title: "为什么不能直接判断优化成功",
      abilityNode: "scene",
      studentBlocks: [
        "网页访问恢复只能说明部分业务变顺畅，不能证明视频通话、直播上行和晚高峰体验都恢复。",
        "岗位任务不是找一个好看的结果图，而是给出可被追问的判断：状态、依据、边界和后续建议。"
      ],
      classroomSupport: "课堂中可让学生先各自写一句初步判断，再比较不同判断用了哪些数据。",
      selfStudySupport: "自学时先回答两个问题：用户反馈的现象是什么？你还缺哪些数据才能判断是否达标？",
      sourceRefs: ["A", "B", "D"],
      auditStatus: "待教师审读"
    },
    {
      id: "R-DIAG-01",
      type: "阅读方法",
      title: "先分类，再找数据",
      abilityNode: "diagnosis",
      studentBlocks: [
        "覆盖数据回答信号强度和质量有没有改善。",
        "移动与保持材料回答移动过程中业务能不能连续。",
        "业务体验数据回答用户真实感受到的时延、卡顿和高峰体验是否改善。"
      ],
      classroomSupport: "教师可用这个环节观察学生是否会把覆盖、移动保持和端到端体验区分开。",
      selfStudySupport: "不要急着选唯一答案。视频卡顿可能和覆盖、切换、容量、时延都有关，先写出你准备优先查看的数据。",
      sourceRefs: ["B", "C", "D"],
      auditStatus: "待教师审读"
    },
    {
      id: "R-COV-KNOW",
      type: "术语解释",
      title: "覆盖验证看什么",
      abilityNode: "coverage",
      studentBlocks: [
        "SS-RSRP主要反映同步信号接收功率，可帮助判断覆盖强度。",
        "SS-SINR反映信号质量和干扰情况。覆盖强度达标，但SINR未达标时，仍可能影响业务体验。",
        "覆盖改善不等于端到端业务体验一定改善。"
      ],
      classroomSupport: "课堂讲解时重点区分SS-RSRP和SS-SINR，不需要展开所有覆盖优化细节。",
      selfStudySupport: "先看SS-RSRP是否改善，再看SS-SINR是否也改善。一个偏强度，一个偏质量和干扰。",
      sourceRefs: ["A", "B", "E"],
      auditStatus: "待专家复核"
    },
    {
      id: "R-COV-DATA",
      type: "数据读法",
      title: "覆盖指标对比怎么读",
      abilityNode: "coverage",
      studentBlocks: [
        "SS-RSRP覆盖率从88.4%提升到96.3%，支持覆盖强度改善。",
        "SS-SINR覆盖率为94.1%，只能说明质量改善，是否达标还需按场景复核。",
        "这组数据不能单独证明直播上行体验已经恢复。"
      ],
      classroomSupport: "课堂中可让学生先找支持改善的数据，再找仍不能证明全部达标的数据。",
      selfStudySupport: "先圈出变化最大的指标，再问自己：这项数据能证明什么？还不能证明什么？",
      sourceRefs: ["A", "B", "E", "F"],
      auditStatus: "待专家复核"
    },
    {
      id: "R-HO-KNOW",
      type: "术语解释",
      title: "切换事件与业务连续性",
      abilityNode: "handover",
      studentBlocks: [
        "A3事件可先理解为邻区比当前服务小区更适合时，网络可能触发切换判断。",
        "切换流程可先拆成测量、判决、执行三步。",
        "切换不及时、过早、失败或频繁切换，都可能造成业务卡顿。"
      ],
      classroomSupport: "教师可重点讲A3事件和测量、判决、执行三个阶段。",
      selfStudySupport: "把切换理解成终端移动时业务不断线地换到更合适的小区。先看触发，再看是否有现场日志。",
      sourceRefs: ["A", "B", "E"],
      auditStatus: "待专家复核"
    },
    {
      id: "R-HO-DATA",
      type: "材料读法",
      title: "切换材料怎么用",
      abilityNode: "handover",
      studentBlocks: [
        "A3事件和切换流程可以帮助理解验证思路。",
        "仅有流程图不能证明本次现场切换一定正常。",
        "还需要切换成功率、重建立、异常释放和相关信令日志。"
      ],
      classroomSupport: "课堂中可让学生判断这类材料能说明流程，但不能替代真实日志。",
      selfStudySupport: "读切换材料时先找触发条件，再看流程是否完整，最后列出还缺哪些现场日志。",
      sourceRefs: ["A", "B", "E"],
      auditStatus: "待专家复核"
    },
    {
      id: "R-PERF-KNOW",
      type: "术语解释",
      title: "端到端性能验证看什么",
      abilityNode: "performance",
      studentBlocks: [
        "时延影响视频通话、直播和实时互动。",
        "速率影响上传、下载和高清视频业务。",
        "容量和负荷会影响晚高峰业务体验。",
        "掉线和异常释放会直接造成业务中断。"
      ],
      classroomSupport: "教师可把时延、速率、容量、掉线分别对应到用户体验。",
      selfStudySupport: "把投诉翻译成指标：视频卡顿看时延、切换和掉线；直播上行延迟看上行速率和上行时延。",
      sourceRefs: ["A", "B", "D"],
      auditStatus: "待专家复核"
    },
    {
      id: "R-PERF-DATA",
      type: "数据读法",
      title: "业务体验数据怎么判断",
      abilityNode: "performance",
      studentBlocks: [
        "视频平均端到端时延明显改善。",
        "直播上行95分位时延提醒我们关注体验较差的那部分时段。",
        "卡顿次数减少但仍可能影响用户感知。"
      ],
      classroomSupport: "课堂中可让学生比较平均值和95分位数据，避免只看一个指标。",
      selfStudySupport: "先看是否改善，再看是否达标。平均值和95分位不能混用。",
      sourceRefs: ["A", "B", "D", "F"],
      auditStatus: "待专家复核"
    },
    {
      id: "R-MEDIA-GUIDE",
      type: "媒体治理",
      title: "仿真截图为什么不能裸用",
      abilityNode: "media",
      studentBlocks: [
        "原教材多张仿真截图来自特定软件界面，缺少字段解释时，学生难以独立读懂。",
        "3.2学生主学习区不直接展示这些截图，而用教学化数据表和读图路径替代。",
        "正式版应选择重绘、替换、补充标注或转入附录。"
      ],
      classroomSupport: "教师可说明截图不是不能用，而是必须有字段解释、读图路径和使用目的。",
      selfStudySupport: "看到软件截图，不要只问图上有什么，还要问我看哪里、这能说明什么、还缺什么数据。",
      sourceRefs: ["A", "B", "C"],
      auditStatus: "待编辑审核"
    },
    {
      id: "R-CONCLUSION",
      type: "结论任务",
      title: "写出优化结果验证结论",
      abilityNode: "conclusion",
      studentBlocks: [
        "建议结论结构：判断状态、两条依据、每条依据的边界、还需补充的数据、下一步建议。",
        "后续建议应指向补充测试或继续优化，而不是泛泛写继续观察。"
      ],
      classroomSupport: "教师可先要求学生引用至少两类数据，再写是否达标。",
      selfStudySupport: "写结论时按判断状态、引用数据、说明边界、提出建议的顺序组织。",
      sourceRefs: ["B", "D", "F"],
      auditStatus: "待教师审读"
    },
    {
      id: "R-FEEDBACK",
      type: "反馈修正",
      title: "常见错误和修改示范",
      abilityNode: "conclusion",
      studentBlocks: [
        "网页能打开了，所以优化成功。修改为：网页访问已有改善，但还需查看视频通话和直播上行体验。",
        "覆盖率提升，所以整体达标。修改为：覆盖改善明显，但整体是否达标还需结合业务时延、卡顿、切换和掉线数据。",
        "流程图显示切换流程完整，所以切换没有问题。修改为：流程图只能帮助理解验证步骤，现场判断仍需日志。"
      ],
      classroomSupport: "教师讲评时可重点抓三类错误：只看覆盖、只看截图、把改善写成达标。",
      selfStudySupport: "提交前检查：是否引用至少两类数据？是否说明不能单独证明结论？是否写了下一步建议？",
      sourceRefs: ["B", "D"],
      auditStatus: "待教师审读"
    }
  ],
  conclusionTemplate: {
    minimumEvidenceCount: 2,
    statusOptions: ["达标", "部分达标", "未达标", "暂时无法判断"],
    scaffold: "本次优化结果建议判断为____。依据是____。但____仍不能证明全部达标，还需补充____。建议下一步____。"
  },
  teacherPanel: {
    notice: "当前学情数据为样章模拟数据，不代表真实平台数据。课堂可用本样章观察学生是否会读数据、写边界、修正结论。",
    goals: [
      "学生能区分覆盖改善和业务体验改善。",
      "学生能引用至少两类数据形成判断。",
      "学生能说明仿真截图和重绘教学图的使用边界。"
    ],
    pausePoints: [
      "初判后：让学生投票并说明第一理由。",
      "覆盖数据后：追问覆盖改善能不能证明视频不卡顿。",
      "业务体验数据后：比较平均值和95分位的判断差异。",
      "结论提交前：选取两份学生结论，讲评依据和边界。"
    ],
    groups: [
      "覆盖组：负责SS-RSRP、SS-SINR和弱覆盖采样点。",
      "移动组：负责A3事件、切换流程和需补充日志。",
      "体验组：负责平均时延、95分位时延和卡顿次数。",
      "媒体组：负责判断截图是否可直接进入学生主学习区。"
    ],
    mistakes: [
      "网页能打开了，所以优化成功。",
      "覆盖率提升，所以整体达标。",
      "流程图显示切换流程完整，所以切换没有问题。",
      "仿真截图显示结果改善，所以可以作为最终依据。"
    ],
    questions: [
      "这条数据能支持什么判断？",
      "这条数据还不能说明什么？",
      "如果要把结论写得更稳，还缺哪类数据？",
      "这张图进入学生主学习区前需要补哪些标注？"
    ]
  },
  reviewChecklists: {
    professional: [
      "原教材中疑似SS-RSRP阈值符号问题需核对。",
      "SS-RSRP、SS-SINR、视频时延、直播上行时延和卡顿次数目标值需复核。",
      "切换成功率、重建立、异常释放、RLF等日志字段是否适合本层级学生需确认。",
      "“部分达标”结论是否符合课程评分和行业表达习惯需确认。"
    ],
    publish: [
      "教学模拟数据不得冒充真实网络或正式验收标准。",
      "AI教学化扩展内容不得伪装成原教材内容。",
      "专业阈值、运营商口径和现场结论必须保留审核状态。",
      "原仿真软件截图不得裸进学生主学习区。"
    ]
  },
  mediaAudit: [
    { id: "IMG-236", file: "image236.png", originalUse: "切换流程图", currentIssue: "图意相对明确但缺少教学标注", action: "redraw", recommendation: "重绘为测量-判决-执行三阶段流程图", studentMainUse: "可用教学版重绘图，不直接依赖原图", auditStatus: "待专业审核" },
    { id: "IMG-245", file: "image245.png", originalUse: "SA组网下切换流程", currentIssue: "流程复杂且图中文字密度高", action: "redraw", recommendation: "拆分为教学版SA切换流程分步图", studentMainUse: "可用重绘分步图", auditStatus: "待专业审核" },
    { id: "IMG-287", file: "image287.png", originalUse: "仿真软件step4界面", currentIssue: "非通用软件截图且学生不知道入口含义", action: "appendix_only", recommendation: "只作操作说明或附录，不进入学生主学习界面", studentMainUse: "禁用于学生主学习区", auditStatus: "待编辑审核" },
    { id: "IMG-288", file: "image288.png", originalUse: "覆盖优化结果截图", currentIssue: "非通用软件截图且缺少字段解释", action: "redraw", recommendation: "重绘覆盖结果教学面板并标注SS-RSRP/SS-SINR", studentMainUse: "以教学化数据面板替代", auditStatus: "待编辑审核" },
    { id: "IMG-289", file: "image289.png", originalUse: "切换优化结果截图", currentIssue: "非通用软件截图且缺少异常判断路径", action: "redraw", recommendation: "重绘切换事件或流程验证教学图", studentMainUse: "以事件列表或流程图替代", auditStatus: "待编辑审核" },
    { id: "IMG-290", file: "image290.png", originalUse: "时延优化结果截图", currentIssue: "非通用软件截图且缺少指标口径", action: "replace_with_table", recommendation: "替换为时延指标对比表或趋势图", studentMainUse: "以指标表替代", auditStatus: "待编辑审核" },
    { id: "IMG-291", file: "image291.png", originalUse: "速率优化结果截图", currentIssue: "非通用软件截图且缺少上下行说明", action: "replace_with_table", recommendation: "替换为上下行速率对比表和业务体验说明", studentMainUse: "以指标表替代", auditStatus: "待编辑审核" },
    { id: "IMG-292", file: "image292.png", originalUse: "容量优化结果截图", currentIssue: "非通用软件截图且缺少负荷和容量解释", action: "redraw", recommendation: "重绘容量、负荷和用户数关系图", studentMainUse: "以教学图替代", auditStatus: "待编辑审核" },
    { id: "IMG-293", file: "image293.png", originalUse: "掉线优化结果截图", currentIssue: "非通用软件截图且缺少掉线定义与证据边界", action: "redraw", recommendation: "重绘掉线率、异常释放和重建立关系图", studentMainUse: "以教学图替代", auditStatus: "待编辑审核" }
  ]
};
