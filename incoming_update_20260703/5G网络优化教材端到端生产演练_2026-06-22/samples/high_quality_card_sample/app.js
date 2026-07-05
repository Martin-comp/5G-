const imageBase = "../resource_output_package/resources/images/";
const storageKey = "p4t2_high_quality_card_sample_state_v1";

const cards = [
  {
    id: "P4T2-C01",
    type: "情境卡",
    title: "视频卡顿是不是优化没做好？",
    node: "识别优化验证场景",
    source: "原教材任务导入 + AI教学重构",
    review: "待专家审核",
    duration: "3分钟",
    evidence: "初步问题判断文本",
    lead: "你现在扮演网络优化助理工程师，需要判断一次5G网络优化结果是否真正达标。",
    body: `
      <div class="body-block"><p>某校园区域完成一轮5G网络优化后，普通网页访问恢复正常，但晚间宿舍区仍有人反馈微信视频通话偶发卡顿，直播上行时延偏高。现场已有覆盖指标、切换流程记录、端到端性能指标和仿真截图。</p></div>
      <p>你的任务不是马上判断“优化成功”或“优化失败”，而是先判断问题更可能集中在哪类验证对象上。最终你要完成一份简短结论：本次优化结果是否达标、依据是什么、如果证据不足还需要补充什么数据。</p>
    `,
    activity: {
      kind: "textarea",
      title: "写出初步判断",
      prompt: "按句式填写：我认为当前问题可能主要与____有关，因为____。但我还需要查看____证据。",
      field: "initialJudgement",
      placeholder: "例如：我认为当前问题可能主要与端到端性能和切换有关，因为投诉集中在视频通话和直播上行体验，但还需要查看覆盖、切换、时延和速率证据。"
    }
  },
  {
    id: "P4T2-C02",
    type: "诊断交互卡",
    title: "问题可能属于哪一类？",
    node: "区分覆盖、切换、性能问题",
    source: "原教材任务要求 + AI教学重构",
    review: "待专家审核",
    duration: "3分钟",
    evidence: "问题类型选择记录",
    lead: "真实网优分析不能把问题混在一起，要先分流，再找证据。",
    body: `
      <p>原教材将本任务分为覆盖、切换、时延、速率、容量、掉线六类优化结果验证。它们经常互相关联，但分析时需要先判断最可能的入口。</p>
      <div class="mini-grid">
        <div class="mini-card"><strong>覆盖</strong>看SS-RSRP、SS-SINR、弱覆盖和交叉覆盖。</div>
        <div class="mini-card"><strong>切换</strong>看测量事件、切换流程、邻区和切换参数。</div>
        <div class="mini-card"><strong>性能</strong>看时延、速率、容量和业务体验。</div>
      </div>
    `,
    activity: {
      kind: "checkWithReason",
      title: "选择优先验证方向",
      field: "problemTypes",
      reasonField: "problemReason",
      options: ["覆盖问题", "切换问题", "端到端性能问题", "掉线或业务保持问题", "证据不足"]
    }
  },
  {
    id: "P4T2-C03",
    type: "知识卡",
    title: "覆盖验证看什么",
    node: "理解覆盖验证指标",
    source: "原教材覆盖优化基础知识重构",
    review: "待专家审核",
    duration: "3分钟",
    evidence: "指标含义判断",
    lead: "覆盖改善是业务改善的基础，但不能单独证明端到端体验已经恢复。",
    body: `
      <p>5G NR覆盖优化主要处理覆盖空洞、弱覆盖、越区覆盖和导频污染等问题。现场分析时，可以先归纳为两类：弱覆盖和交叉覆盖。</p>
      <table class="data-table">
        <thead><tr><th>指标</th><th>帮助判断什么</th><th>学习提示</th></tr></thead>
        <tbody>
          <tr><td>SS-RSRP</td><td>同步信号接收功率，反映信号强度</td><td>数值过低通常提示弱覆盖风险</td></tr>
          <tr><td>SS-SINR</td><td>同步信号信干噪比，反映信号质量</td><td>数值差可能提示干扰或交叉覆盖风险</td></tr>
        </tbody>
      </table>
      <div class="body-block warning"><p>原文后续出现“SS-RSRP≥105dBm”表述，结合表4-2-1和常见单位表达，本样章暂按“SS-RSRP≥-105 dBm”处理，需专家审核。</p></div>
    `,
    activity: {
      kind: "trueFalse",
      title: "判断指标说法",
      statements: [
        ["s1", "SS-RSRP主要用于观察信号强度。", "true"],
        ["s2", "SS-SINR主要用于观察信号质量和干扰情况。", "true"],
        ["s3", "只要覆盖指标达标，就能证明视频通话一定不卡顿。", "false"]
      ]
    }
  },
  {
    id: "P4T2-C04",
    type: "证据卡",
    title: "优化前后覆盖指标对比",
    node: "判断覆盖优化效果",
    source: "原教材覆盖指标要求 + 教学模拟数据",
    review: "待专家审核",
    duration: "3分钟",
    evidence: "覆盖证据标注",
    lead: "这组数据用于练习覆盖验证，不是正式运营商验收标准。",
    body: `
      <table class="data-table">
        <thead><tr><th>覆盖指标</th><th>参考要求</th><th>优化前</th><th>优化后</th><th>初步判断</th></tr></thead>
        <tbody>
          <tr><td>SS-RSRP≥-105 dBm覆盖率</td><td>≥95%</td><td>88.4%</td><td>96.3%</td><td>达到参考要求</td></tr>
          <tr><td>SS-SINR≥-7 dB覆盖率</td><td>≥95%</td><td>84.2%</td><td>94.1%</td><td>接近但未达到参考要求</td></tr>
          <tr><td>弱覆盖采样点占比</td><td>越低越好</td><td>12.6%</td><td>3.8%</td><td>明显改善</td></tr>
          <tr><td>交叉覆盖疑似区域数</td><td>越少越好</td><td>8个</td><td>3个</td><td>有改善但仍需核查</td></tr>
        </tbody>
      </table>
      <p>较稳妥的覆盖结论是：覆盖强度基本达标，覆盖质量仍需进一步核查。</p>
    `,
    activity: {
      kind: "evidencePick",
      title: "标注覆盖证据",
      field: "coverageEvidence",
      options: ["SS-RSRP覆盖率提升", "SS-SINR覆盖率仍低于95%", "弱覆盖采样点下降", "交叉覆盖疑似区域减少", "覆盖数据可单独证明视频卡顿已解决"]
    }
  },
  {
    id: "P4T2-C05",
    type: "知识卡",
    title: "切换验证看什么",
    node: "理解切换事件与流程",
    source: "原教材切换优化基础知识重构",
    review: "待专家审核",
    duration: "3分钟",
    evidence: "切换事件识别",
    lead: "切换验证要看测量事件和切换流程，判断业务连续性是否得到保障。",
    media: [{ src: "image236.png", caption: "图4-2-1 切换流程：测量、判决、执行" }],
    body: `
      <p>切换指终端从一个小区或信道变更到另一个小区或信道时，业务仍能继续进行。原教材指出，5G NR切换流程仍包括测量、判决、执行三个阶段。</p>
      <table class="data-table">
        <thead><tr><th>事件</th><th>教学化理解</th><th>常见作用</th></tr></thead>
        <tbody>
          <tr><td>A2</td><td>服务小区低于门限</td><td>提示需要打开测量</td></tr>
          <tr><td>A3</td><td>邻区比服务小区更好</td><td>常用于切换触发</td></tr>
          <tr><td>A5</td><td>服务小区差且邻区满足条件</td><td>适合时间关键切换</td></tr>
          <tr><td>B1/B2</td><td>异系统邻区测量</td><td>系统间切换或互操作</td></tr>
        </tbody>
      </table>
    `,
    activity: {
      kind: "matching",
      title: "匹配切换事件",
      pairs: [
        ["A2", "服务小区低于门限，通常提示需要打开测量"],
        ["A3", "邻区比服务小区更好，常用于切换触发"],
        ["A5", "服务小区低于门限且邻区满足条件，适合时间关键切换"],
        ["B1/B2", "异系统邻区测量或系统间切换相关"]
      ]
    }
  },
  {
    id: "P4T2-C06",
    type: "交互卡",
    title: "切换流程是否合理？",
    node: "判断切换验证流程合理性",
    source: "原教材SA/NSA切换流程重构",
    review: "待专家审核",
    duration: "4分钟",
    evidence: "流程排序结果",
    lead: "通过排序和异常定位，判断切换验证流程是否合理。",
    media: [{ src: "image245.png", caption: "图4-2-10 SA组网下的切换流程" }],
    body: `
      <p>SA组网下，源gNodeB收到UE测量上报并判决切换后，会通过Xn接口向目标gNodeB申请资源，之后通过空口重配消息通知UE切换，切换成功后释放原小区资源并更新用户面、控制面路径。</p>
      <div class="mini-grid">
        <div class="mini-card"><strong>A</strong>源gNodeB根据测量上报判决是否切换</div>
        <div class="mini-card"><strong>B</strong>UE上报测量结果</div>
        <div class="mini-card"><strong>C</strong>源gNodeB向目标gNodeB申请资源</div>
        <div class="mini-card"><strong>D</strong>目标gNodeB完成资源准备</div>
        <div class="mini-card"><strong>E</strong>源gNodeB通知UE切换</div>
        <div class="mini-card"><strong>F</strong>UE接入目标小区并完成切换</div>
        <div class="mini-card"><strong>G</strong>目标gNodeB通知源侧释放原资源</div>
        <div class="mini-card"><strong>H</strong>数据转发并更新用户面、控制面路径</div>
      </div>
    `,
    activity: {
      kind: "order",
      title: "填写合理顺序",
      orderField: "handoverOrder",
      abnormalField: "handoverAbnormal",
      placeholder: "例如：B-A-C-D-E-F-G-H"
    }
  },
  {
    id: "P4T2-C07",
    type: "知识卡",
    title: "端到端性能验证看什么",
    node: "理解端到端性能指标",
    source: "原教材时延、速率、容量、掉线基础知识重构",
    review: "待专家审核",
    duration: "3分钟",
    evidence: "业务现象与指标匹配结果",
    lead: "端到端性能验证关注用户业务是否真正变好。",
    body: `
      <table class="data-table">
        <thead><tr><th>验证对象</th><th>关注问题</th><th>与业务体验的关系</th></tr></thead>
        <tbody>
          <tr><td>时延</td><td>数据从发送端到接收端或服务器返回的时间</td><td>影响视频通话、直播、远程控制</td></tr>
          <tr><td>速率</td><td>单位时间内传送的数据量</td><td>影响下载、上传、高清视频和直播推流</td></tr>
          <tr><td>容量</td><td>系统可承载用户数或业务量</td><td>高负荷区域可能拥塞、速率下降</td></tr>
          <tr><td>掉线</td><td>业务保持过程中异常释放或长时间无数据</td><td>用户直接感知为断连或业务中断</td></tr>
        </tbody>
      </table>
      <p>如果覆盖已经改善，但直播上行仍延迟，不能只继续盯着RSRP，还要看上行速率、端到端时延、容量负荷和掉线记录。</p>
    `,
    activity: {
      kind: "checkWithReason",
      title: "业务现象匹配指标",
      field: "performanceFocus",
      reasonField: "performanceReason",
      options: ["视频通话卡顿：时延/切换/掉线", "直播上行延迟：上行速率/上行时延", "晚高峰下载变慢：容量/下行速率", "业务突然断开：掉线/RLF/重建立"]
    }
  },
  {
    id: "P4T2-C08",
    type: "证据卡",
    title: "业务体验与性能指标对照",
    node: "判断性能优化效果",
    source: "原教材性能指标框架 + 教学模拟数据",
    review: "待专家审核",
    duration: "3分钟",
    evidence: "性能证据判断",
    lead: "这组教学模拟数据用于练习端到端性能判断，不代表正式验收阈值。",
    body: `
      <table class="data-table">
        <thead><tr><th>指标</th><th>样章参考目标</th><th>优化前</th><th>优化后</th><th>判断</th></tr></thead>
        <tbody>
          <tr><td>视频通话平均端到端时延</td><td>≤50 ms</td><td>78 ms</td><td>42 ms</td><td>达到样章目标</td></tr>
          <tr><td>直播上行95分位时延</td><td>≤80 ms</td><td>180 ms</td><td>110 ms</td><td>明显改善但未达目标</td></tr>
          <tr><td>上行平均吞吐率</td><td>≥15 Mbps</td><td>8 Mbps</td><td>16 Mbps</td><td>达到样章目标</td></tr>
          <tr><td>晚高峰小区负荷</td><td>≤70%</td><td>86%</td><td>74%</td><td>仍偏高</td></tr>
          <tr><td>10分钟业务卡顿次数</td><td>≤1次</td><td>6次</td><td>2次</td><td>改善但未达目标</td></tr>
          <tr><td>掉线次数</td><td>0次</td><td>1次</td><td>0次</td><td>达到样章目标</td></tr>
        </tbody>
      </table>
    `,
    activity: {
      kind: "performance",
      title: "判断达标状态",
      field: "performanceEvidence",
      statusField: "performanceStatus",
      options: ["视频平均时延达标", "直播上行95分位时延未达标", "上行平均吞吐率达标", "晚高峰小区负荷仍偏高", "卡顿次数仍未达目标", "掉线次数达标"]
    }
  },
  {
    id: "P4T2-C09",
    type: "证据卡",
    title: "仿真截图能说明什么",
    node: "使用仿真结果辅助验证",
    source: "原教材任务实施图片",
    review: "待编辑审核",
    duration: "2分钟",
    evidence: "仿真证据边界判断",
    lead: "这些截图来自非通用仿真软件，样章中只能作为占位证据，不能默认可用于正式教学。",
    media: [
      { src: "image287.png", caption: "仿真软件step4查询界面" },
      { src: "image288.png", caption: "覆盖优化结果" },
      { src: "image289.png", caption: "切换优化结果" },
      { src: "image290.png", caption: "时延优化结果" },
      { src: "image291.png", caption: "速率优化结果" },
      { src: "image292.png", caption: "容量优化结果" },
      { src: "image293.png", caption: "掉线优化结果" }
    ],
    body: `
      <p>原教材要求学生登录网络优化仿真软件，在step4中查询站点覆盖、切换、时延、速率、容量、掉线等优化结果。但这些截图属于特定软件界面，缺少字段解释、读图路径和结果说明时，学生很难知道“看哪里、说明什么、能不能作为结论依据”。</p>
      <div class="body-block warning"><p>样章阶段，这些截图只作为媒体审查对象和占位材料。正式版需要三选一：补充清晰标注和读图说明；替换为通用化教学图；重新绘制教学版仿真界面。</p></div>
      <table class="data-table">
        <thead><tr><th>审查问题</th><th>教学处理</th></tr></thead>
        <tbody>
          <tr><td>学生不知道界面字段含义</td><td>增加标注层，解释关键区域</td></tr>
          <tr><td>截图不能证明真实业务体验</td><td>必须配合指标表、日志或测试报告</td></tr>
          <tr><td>软件非通用，迁移性弱</td><td>正式版优先重绘通用化示意图</td></tr>
        </tbody>
      </table>
    `,
    activity: {
      kind: "mediaReview",
      title: "判断截图是否可直接用于学习",
      field: "mediaReview",
      reasonField: "mediaReviewReason",
      options: ["可直接用于学生自学", "可作为占位但必须补标注", "应替换为通用化示意图", "应重新绘制教学版界面", "必须配合指标表或日志"]
    }
  },
  {
    id: "P4T2-C10",
    type: "任务卡",
    title: "写出优化结果验证结论",
    node: "形成优化结果验证结论",
    source: "原教材任务实施与任务测评重构",
    review: "待专家审核",
    duration: "4分钟",
    evidence: "结构化短报告",
    lead: "验证结论不是一句好或不好，而是要说明判断、依据和后续建议。",
    body: `
      <p>请基于覆盖、切换、端到端性能和仿真证据，完成结构化任务单。高质量结论应有明确达标状态、至少两类证据、证据边界和后续核查建议。</p>
      <div class="body-block"><p>参考句式：本次优化结果可判断为____。依据是：____指标从____改善到____，说明____；但____指标仍未达到____，说明____。因此，建议后续重点核查____，并补充____数据。</p></div>
    `,
    activity: { kind: "taskForm", title: "提交结构化任务单" }
  },
  {
    id: "P4T2-C11",
    type: "反馈卡",
    title: "你的证据链完整吗？",
    node: "修正证据链与表达",
    source: "AI教学重构",
    review: "待专家审核",
    duration: "2分钟",
    evidence: "修订记录",
    lead: "用自查清单修正结论，避免把局部改善写成整体达标。",
    body: `
      <table class="data-table">
        <thead><tr><th>自查问题</th><th>判断</th></tr></thead>
        <tbody>
          <tr><td>是否说明了达标、部分达标、未达标或无法判断？</td><td>必须说明</td></tr>
          <tr><td>是否至少引用覆盖和性能两类证据？</td><td>建议至少两类</td></tr>
          <tr><td>是否说明未达标或证据不足部分？</td><td>必须说明</td></tr>
          <tr><td>是否避免了“覆盖改善=全部业务恢复”的错误？</td><td>必须避免</td></tr>
          <tr><td>是否给出了后续核查建议？</td><td>建议写出</td></tr>
        </tbody>
      </table>
      <p>常见误区：只看SS-RSRP、不看SS-SINR和业务体验；只看平均时延、不看95分位时延；只看截图、不看指标；把“部分改善”写成“完全达标”。</p>
    `,
    activity: {
      kind: "textarea",
      title: "修改你的最终结论",
      field: "revision",
      placeholder: "请至少修改一处理由、证据或后续建议。"
    }
  },
  {
    id: "P4T2-C12",
    type: "教师卡",
    title: "课堂讲评与学情观察",
    node: "组织讲评与观察学情",
    source: "AI教学重构",
    review: "待教师审核",
    duration: "教师使用",
    evidence: "模拟学情看板",
    lead: "本卡用于教师组织课堂，不作为学生主学习卡。",
    body: `
      <p>教师讲评重点不是让学生背诵全部5G网优参数，而是训练最小能力闭环：问题分流、读懂证据、形成达标状态判断、写出工程化短结论。</p>
      <div class="body-block warning"><p>样章阶段下列学情均为模拟数据，不能声称来自真实课堂。</p></div>
    `,
    activity: {
      kind: "teacher",
      title: "教师动作",
      prompt: "课前选择卡片，课堂查看问题类型选择、证据漏选和最终结论，课后决定是否补讲覆盖质量、切换流程或端到端性能证据。"
    }
  }
];

const studentCards = cards.filter((card) => card.activity.kind !== "teacher");
const teacherCard = cards.find((card) => card.activity.kind === "teacher");

const modeCopy = {
  classroom: {
    label: "课堂模式提示",
    text: "本模式默认教师在场。页面保留核心任务、关键证据和必要操作，复杂解释由教师按学情展开。",
  },
  selfStudy: {
    label: "自学模式补充",
    text: "自学时请按“先判断问题类型 -> 再看证据 -> 说明证据边界 -> 写结论”的顺序完成。每张卡做完后，应能说清这张卡解决什么问题、支持什么结论、还不能证明什么。",
  },
};

const teacherMetrics = [
  { title: "完成人数", value: "38/42", note: "大部分学生能完成最小闭环" },
  { title: "首次选择覆盖问题", value: "71%", note: "学生容易从信号强度入手" },
  { title: "判断完全达标", value: "31%", note: "部分学生忽略未达标指标" }
];

const errorBars = [
  ["漏选SS-SINR未达标证据", 48, "risk"],
  ["没有说明证据边界", 42, "warn"],
  ["只看截图不看指标", 37, "warn"],
  ["漏写后续建议", 52, "risk"],
  ["能写出部分达标", 64, "good"]
];

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === "object") {
      return { currentIndex: 0, completed: {}, answers: {}, mode: "classroom", ...saved };
    }
  } catch (error) {
    console.warn("Failed to load state", error);
  }
  return { currentIndex: 0, completed: {}, answers: {}, mode: "classroom" };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  renderTabs();
  renderModeControls();
  renderStepJumps();
  renderCardNav();
  renderCurrentCard();
  renderWorkbench();
  renderEvidence();
  renderTeacherDashboard();
  renderTraceTable();
}

function renderTabs() {
  qsa(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      qsa(".tab-button").forEach((item) => item.classList.remove("active"));
      qsa(".view").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      qs(`#${button.dataset.view}View`).classList.add("active");
    });
  });
}

function renderModeControls() {
  qsa(".mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      saveState();
      renderCurrentCard();
      renderWorkbench();
      qsa(".mode-button").forEach((item) => item.classList.toggle("active", item.dataset.mode === state.mode));
    });
  });
}

function renderStepJumps() {
  qsa("[data-jump-card]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = studentCards.findIndex((card) => card.id === button.dataset.jumpCard);
      if (index < 0) return;
      state.currentIndex = index;
      saveState();
      renderCardNav();
      renderCurrentCard();
      renderWorkbench();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function renderCardNav() {
  const nav = qs("#cardNav");
  nav.innerHTML = studentCards
    .map((card, index) => {
      const active = index === state.currentIndex ? " active" : "";
      const complete = state.completed[card.id] ? " complete" : "";
      return `
        <li>
          <button class="${active}${complete}" type="button" data-index="${index}" aria-label="打开${card.title}">
            <span class="nav-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="nav-title">${card.title}</span>
            <span class="nav-type">${card.type}</span>
          </button>
        </li>
      `;
    })
    .join("");
  qsa("[data-index]", nav).forEach((button) => {
    button.addEventListener("click", () => {
      state.currentIndex = Number(button.dataset.index);
      saveState();
      renderCurrentCard();
      renderWorkbench();
      renderCardNav();
    });
  });
  updateProgress();
}

function updateProgress() {
  const completed = studentCards.filter((card) => state.completed[card.id]).length;
  qs("#progressText").textContent = `${completed} / ${studentCards.length}`;
  qs("#progressFill").style.width = `${(completed / studentCards.length) * 100}%`;
}

function renderCurrentCard() {
  if (state.currentIndex >= studentCards.length) state.currentIndex = studentCards.length - 1;
  const card = studentCards[state.currentIndex];
  qs("#cardType").textContent = card.type;
  qs("#cardNode").textContent = card.node;
  qs("#cardReview").textContent = card.review;
  qs("#cardTitle").textContent = card.title;
  qs("#cardLead").textContent = card.lead;
  qs("#cardBody").innerHTML = card.body;
  renderMedia(card);
  renderModePanel(card);
  renderActivity(card);
  qs("#feedbackBox").hidden = true;
  qs("#prevCard").disabled = state.currentIndex === 0;
  qs("#nextCard").disabled = state.currentIndex === studentCards.length - 1;
}

function renderWorkbench() {
  const card = studentCards[state.currentIndex];
  const taskAnswer = state.answers["P4T2-C10"];
  const modeLabel = state.mode === "selfStudy" ? "自学模式" : "课堂模式";
  qs("#missionTitle").textContent = `${modeLabel}：${card.title}`;
  qs("#missionHint").textContent = getNextStepHint(card, taskAnswer);
}

function getNextStepHint(card, taskAnswer) {
  if (card.id === "P4T2-C01") return "先把业务投诉转成可验证问题，不急着下最终结论。";
  if (card.id === "P4T2-C02") return "完成问题分流后，按覆盖、切换、性能三条线查看证据。";
  if (card.id === "P4T2-C10") return "提交结论时必须写清达标状态、核心证据、证据边界和后续建议。";
  if (taskAnswer?.taskStatus) return `你已提交“${taskAnswer.taskStatus}”结论，可继续用反馈卡检查证据链是否完整。`;
  return "当前卡片是资源，不是孤立页面。读完后请把它转化为证据、判断或任务单内容。";
}

function renderModePanel(card) {
  const copy = modeCopy[state.mode] || modeCopy.classroom;
  const selfStudyExtra = state.mode === "selfStudy"
    ? `
      <ul>
        <li><strong>为什么学：</strong>${card.node} 是完成最终验证结论的一部分。</li>
        <li><strong>怎么看：</strong>先找本卡能支持的判断，再找它不能证明的边界。</li>
        <li><strong>做完如何判断：</strong>能否把本卡内容写进“我的证据链”。</li>
        <li><strong>常见误区：</strong>只看局部数据或截图，就直接推出整体达标。</li>
        <li><strong>下一步：</strong>${getNextStepHint(card, state.answers["P4T2-C10"])}</li>
      </ul>
    `
    : `<p>教师可根据学情展开解释；学生先完成本卡操作，把结果进入右侧证据链。</p>`;
  qs("#modePanel").innerHTML = `
    <h3>${copy.label}</h3>
    <p>${copy.text}</p>
    ${selfStudyExtra}
  `;
}

function renderMedia(card) {
  const media = card.media || [];
  qs("#cardMedia").innerHTML = media
    .map((item) => `
      <figure class="media-item">
        <img src="${imageBase}${item.src}" alt="${escapeHtml(item.caption)}">
        <figcaption>${escapeHtml(item.caption)}</figcaption>
      </figure>
    `)
    .join("");
}

function renderActivity(card) {
  const activity = card.activity;
  const saved = state.answers[card.id] || {};
  const box = qs("#activityBox");
  if (activity.kind === "textarea") {
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <p>${activity.prompt}</p>
      <textarea data-field="${activity.field}" placeholder="${escapeHtml(activity.placeholder)}">${escapeHtml(saved[activity.field])}</textarea>
    `;
  }
  if (activity.kind === "checkWithReason") {
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <div class="option-list">
        ${activity.options.map((option) => `
          <label><input type="checkbox" data-array="${activity.field}" value="${option}" ${saved[activity.field]?.includes(option) ? "checked" : ""}> <span>${option}</span></label>
        `).join("")}
      </div>
      <div class="field-grid" style="margin-top:12px">
        <label>选择理由
          <textarea data-field="${activity.reasonField}" placeholder="说明为什么先看这些证据。">${escapeHtml(saved[activity.reasonField])}</textarea>
        </label>
      </div>
    `;
  }
  if (activity.kind === "trueFalse") {
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <div class="field-grid">
        ${activity.statements.map(([field, label]) => `
          <label>${label}
            <select data-field="${field}">
              <option value="">请选择</option>
              <option value="true" ${saved[field] === "true" ? "selected" : ""}>成立</option>
              <option value="false" ${saved[field] === "false" ? "selected" : ""}>不成立</option>
            </select>
          </label>
        `).join("")}
      </div>
    `;
  }
  if (activity.kind === "evidencePick") {
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <div class="option-list">
        ${activity.options.map((option) => `
          <label><input type="checkbox" data-array="${activity.field}" value="${option}" ${saved[activity.field]?.includes(option) ? "checked" : ""}> <span>${option}</span></label>
        `).join("")}
      </div>
    `;
  }
  if (activity.kind === "matching") {
    const options = activity.pairs.map((pair) => pair[1]);
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <div class="field-grid">
        ${activity.pairs.map(([event], index) => `
          <label>${event}
            <select data-field="match_${index}">
              <option value="">请选择含义</option>
              ${options.map((option) => `<option value="${option}" ${saved[`match_${index}`] === option ? "selected" : ""}>${option}</option>`).join("")}
            </select>
          </label>
        `).join("")}
      </div>
    `;
  }
  if (activity.kind === "order") {
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <div class="field-grid">
        <label>流程顺序
          <input type="text" data-field="${activity.orderField}" placeholder="${activity.placeholder}" value="${escapeHtml(saved[activity.orderField])}">
        </label>
        <label>“终端已上报测量报告，但网络侧一直未下发切换命令”更可能在哪个阶段？
          <select data-field="${activity.abnormalField}">
            <option value="">请选择</option>
            <option value="判决和命令下发阶段" ${saved[activity.abnormalField] === "判决和命令下发阶段" ? "selected" : ""}>判决和命令下发阶段</option>
            <option value="UE接入目标小区阶段" ${saved[activity.abnormalField] === "UE接入目标小区阶段" ? "selected" : ""}>UE接入目标小区阶段</option>
            <option value="释放原小区资源阶段" ${saved[activity.abnormalField] === "释放原小区资源阶段" ? "selected" : ""}>释放原小区资源阶段</option>
          </select>
        </label>
      </div>
    `;
  }
  if (activity.kind === "performance") {
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <div class="option-list">
        ${activity.options.map((option) => `
          <label><input type="checkbox" data-array="${activity.field}" value="${option}" ${saved[activity.field]?.includes(option) ? "checked" : ""}> <span>${option}</span></label>
        `).join("")}
      </div>
      <div class="field-grid" style="margin-top:12px">
        <label>本次优化结果判断
          <select data-field="${activity.statusField}">
            <option value="">请选择</option>
            ${["达标", "部分达标", "未达标", "无法判断"].map((option) => `<option value="${option}" ${saved[activity.statusField] === option ? "selected" : ""}>${option}</option>`).join("")}
          </select>
        </label>
      </div>
    `;
  }
  if (activity.kind === "mediaReview") {
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <p>请选择这些非通用仿真软件截图在当前样章中的处理方式。</p>
      <div class="option-list">
        ${activity.options.map((option) => `
          <label><input type="checkbox" data-array="${activity.field}" value="${option}" ${saved[activity.field]?.includes(option) ? "checked" : ""}> <span>${option}</span></label>
        `).join("")}
      </div>
      <div class="field-grid" style="margin-top:12px">
        <label>你的审查理由
          <textarea data-field="${activity.reasonField}" placeholder="说明为什么不能直接使用，或者需要怎样补充说明。">${escapeHtml(saved[activity.reasonField])}</textarea>
        </label>
      </div>
    `;
  }
  if (activity.kind === "taskForm") {
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <div class="field-grid">
        <label>问题类型判断
          <input type="text" data-field="taskTypes" placeholder="覆盖、切换、时延、速率、容量、掉线、证据不足，可多选" value="${escapeHtml(saved.taskTypes)}">
        </label>
        <label>核心证据
          <textarea data-field="taskEvidence" placeholder="至少写2条证据。">${escapeHtml(saved.taskEvidence)}</textarea>
        </label>
        <label>优化前后变化
          <textarea data-field="taskChange" placeholder="写出2至4个关键指标变化。">${escapeHtml(saved.taskChange)}</textarea>
        </label>
        <label>是否达标
          <select data-field="taskStatus">
            <option value="">请选择</option>
            ${["达标", "部分达标", "未达标", "无法判断"].map((option) => `<option value="${option}" ${saved.taskStatus === option ? "selected" : ""}>${option}</option>`).join("")}
          </select>
        </label>
        <label>判断理由
          <textarea data-field="taskReason" placeholder="80至150字，说明判断依据和证据边界。">${escapeHtml(saved.taskReason)}</textarea>
        </label>
        <label>后续建议
          <textarea data-field="taskAdvice" placeholder="写1至2条后续核查建议。">${escapeHtml(saved.taskAdvice)}</textarea>
        </label>
      </div>
    `;
  }
  if (activity.kind === "teacher") {
    box.innerHTML = `
      <h3>${activity.title}</h3>
      <p>${activity.prompt}</p>
      <div class="mini-grid">
        <div class="mini-card"><strong>基础较弱班级</strong>保留C01、C02、C04、C08、C10、C11。</div>
        <div class="mini-card"><strong>基础较好班级</strong>增加SA/NSA切换流程对比。</div>
        <div class="mini-card"><strong>实训课</strong>加入仿真软件实际操作。</div>
      </div>
    `;
  }
}

function collectActivity() {
  const box = qs("#activityBox");
  const answer = {};
  qsa("[data-field]", box).forEach((field) => {
    answer[field.dataset.field] = field.value.trim();
  });
  qsa("[data-array]", box).forEach((field) => {
    const key = field.dataset.array;
    if (!answer[key]) answer[key] = [];
    if (field.checked) answer[key].push(field.value);
  });
  return answer;
}

function evaluate(card, answer) {
  const kind = card.activity.kind;
  if (kind === "textarea") {
    const value = Object.values(answer)[0] || "";
    if (value.length >= 24) return ["good", "已保存。你的回答具备基本判断信息，后续请继续补充证据。"];
    return ["warn", "已保存，但回答偏短。建议写出问题类型、理由和需要补充的证据。"];
  }
  if (kind === "checkWithReason") {
    const selected = answer[card.activity.field] || [];
    const reason = answer[card.activity.reasonField] || "";
    if (selected.length >= 2 && reason.length >= 18) return ["good", "分流有效。较好的答案应说明为什么先看这些证据。"];
    return ["warn", "已保存。建议至少选择两个验证方向，并写明证据查看理由。"];
  }
  if (kind === "trueFalse") {
    const total = card.activity.statements.length;
    const correct = card.activity.statements.filter(([field, , expected]) => answer[field] === expected).length;
    if (correct === total) return ["good", `判断正确：${correct}/${total}。`];
    return ["warn", `已保存，当前正确${correct}/${total}。请回看证据边界，避免过度推断。`];
  }
  if (kind === "evidencePick") {
    const selected = answer[card.activity.field] || [];
    const pickedBad = selected.includes("覆盖数据可单独证明视频卡顿已解决");
    if (selected.length >= 3 && !pickedBad) return ["good", "证据标注较完整。你区分了覆盖改善和端到端体验恢复。"];
    if (pickedBad) return ["risk", "已保存，但存在过度推断：覆盖数据不能单独证明视频卡顿已解决。"];
    return ["warn", "已保存。建议同时标注改善证据和仍未达标的证据。"];
  }
  if (kind === "matching") {
    const correct = card.activity.pairs.filter(([, expected], index) => answer[`match_${index}`] === expected).length;
    if (correct === card.activity.pairs.length) return ["good", "切换事件匹配正确。"];
    return ["warn", `已保存，当前正确${correct}/${card.activity.pairs.length}。请特别区分A3、A5和B类事件。`];
  }
  if (kind === "order") {
    const normalized = (answer.handoverOrder || "").toUpperCase().replace(/\s+/g, "").replaceAll("，", "-").replaceAll(",", "-");
    const orderOk = normalized === "B-A-C-D-E-F-G-H";
    const abnormalOk = answer.handoverAbnormal === "判决和命令下发阶段";
    if (orderOk && abnormalOk) return ["good", "流程排序和异常定位都正确。"];
    return ["warn", "已保存。参考顺序为B-A-C-D-E-F-G-H，异常应优先定位到判决和命令下发阶段，同时排查邻区、参数和基站状态。"];
  }
  if (kind === "performance") {
    const statusOk = answer.performanceStatus === "部分达标";
    const selected = answer.performanceEvidence || [];
    const enough = selected.includes("直播上行95分位时延未达标") && selected.includes("晚高峰小区负荷仍偏高");
    if (statusOk && enough) return ["good", "判断较稳妥：本次优化可写为部分达标。"];
    return ["warn", "已保存。建议判断为部分达标，并说明直播上行时延、晚高峰负荷和卡顿次数仍需核查。"];
  }
  if (kind === "mediaReview") {
    const selected = answer.mediaReview || [];
    const reason = answer.mediaReviewReason || "";
    const risky = selected.includes("可直接用于学生自学");
    if (!risky && selected.length >= 2 && reason.length >= 18) {
      return ["good", "媒体审查较稳妥：截图不能裸用，需要标注、替换或重绘，并配合指标证据。"];
    }
    if (risky) return ["risk", "已保存，但判断过于乐观：非通用仿真截图不应直接用于学生自学。"];
    return ["warn", "已保存。建议写明截图缺少哪些解释，以及正式版应补标注、替换还是重绘。"];
  }
  if (kind === "taskForm") {
    const evidenceCount = (answer.taskEvidence || "").split(/[；;。.\n]/).filter(Boolean).length;
    const reasonLength = (answer.taskReason || "").length;
    if (answer.taskStatus === "部分达标" && evidenceCount >= 2 && reasonLength >= 70) {
      return ["good", "任务单具备基本工程表达：有达标状态、证据和证据边界。"];
    }
    return ["warn", "任务单已保存。高质量结论建议写成“部分达标”，至少列出两条证据，并说明未达标指标和后续核查方向。"];
  }
  if (kind === "teacher") {
    return ["good", "教师卡已查看。样章阶段学情数据必须继续标注为模拟数据。"];
  }
  return ["good", "已保存。"];
}

function saveCurrentActivity() {
  const card = studentCards[state.currentIndex];
  const answer = collectActivity();
  state.answers[card.id] = answer;
  state.completed[card.id] = true;
  saveState();
  const [level, message] = evaluate(card, answer);
  showFeedback(level, message);
  renderCardNav();
  renderWorkbench();
  renderEvidence();
}

function showFeedback(level, message) {
  const box = qs("#feedbackBox");
  box.className = `feedback-box ${level}`;
  box.hidden = false;
  box.innerHTML = `<h3>即时反馈</h3><p>${message}</p>`;
}

function renderEvidence() {
  const summary = qs("#evidenceSummary");
  const completedCards = studentCards.filter((card) => state.completed[card.id]);
  const problemTypes = state.answers["P4T2-C02"]?.problemTypes || [];
  const coverageEvidence = state.answers["P4T2-C04"]?.coverageEvidence || [];
  const performanceStatus = state.answers["P4T2-C08"]?.performanceStatus || "";
  const taskAnswer = state.answers["P4T2-C10"];
  const missing = [];
  if (!problemTypes.length) missing.push("问题类型判断");
  if (!coverageEvidence.length) missing.push("覆盖证据");
  if (!performanceStatus) missing.push("端到端性能判断");
  if (!taskAnswer?.taskStatus) missing.push("最终达标状态");
  if (!completedCards.length) {
    summary.innerHTML = `<div class="empty-state">尚未保存证据。完成任一卡片后，这里会显示你的判断、依据、缺失证据和最终结论。</div>`;
  } else {
    summary.innerHTML = `
      <div class="evidence-item">
        <strong>我已判断的问题类型</strong>
        <p>${problemTypes.length ? problemTypes.join("、") : "尚未完成问题分流。"}</p>
      </div>
      <div class="evidence-item">
        <strong>我已引用的覆盖证据</strong>
        <p>${coverageEvidence.length ? coverageEvidence.join("、") : "尚未标注覆盖证据。"}</p>
      </div>
      <div class="evidence-item">
        <strong>我的端到端判断</strong>
        <p>${performanceStatus || "尚未判断性能优化状态。"}</p>
      </div>
      <div class="evidence-item">
        <strong>仍缺的证据</strong>
        <p>${missing.length ? missing.join("、") : "证据链达到样章提交要求。"}</p>
      </div>
      <div class="evidence-item">
        <strong>已完成资源</strong>
        <p>${completedCards.map((card) => card.id).join("、")}</p>
      </div>
    `;
  }
  qs("#taskStatusText").textContent = taskAnswer?.taskStatus
    ? `已提交：${taskAnswer.taskStatus}。${missing.length ? "仍建议补充缺失证据。" : "证据链达到样章提交要求。"}`
    : `尚未提交验证结论。当前还缺：${missing.join("、") || "最终任务单"}。`;
  updateProgress();
}

function renderTeacherDashboard() {
  const dashboard = qs("#teacherDashboard");
  dashboard.innerHTML = `
    <article class="teacher-card full">
      <h3>${teacherCard.title}</h3>
      <p>${teacherCard.lead}</p>
      <div class="body-block warning"><p>教师卡已从学生学习路径移出，只在教师视图和资源追踪中保留。它用于课堂组织、学情观察和讲评，不要求学生逐页学习。</p></div>
    </article>
    ${teacherMetrics.map((metric) => `
      <article class="teacher-card">
        <h3>${metric.title}</h3>
        <div class="metric-value">${metric.value}</div>
        <p>${metric.note}</p>
      </article>
    `).join("")}
    <article class="teacher-card wide">
      <h3>模拟错误分布</h3>
      ${errorBars.map(([label, value, level]) => `
        <div class="bar-row">
          <span>${label}</span>
          <span class="bar-bg"><span class="bar-fill ${level}" style="width:${value}%"></span></span>
          <strong>${value}%</strong>
        </div>
      `).join("")}
    </article>
    <article class="teacher-card">
      <h3>讲评优先级</h3>
      <ol>
        <li>先讲SS-RSRP与SS-SINR区别。</li>
        <li>再讲覆盖改善不等于端到端达标。</li>
        <li>最后讲“部分达标”的工程表达。</li>
      </ol>
    </article>
    <article class="teacher-card full">
      <h3>可调整课堂路径</h3>
      <div class="mini-grid">
        <div class="mini-card"><strong>30分钟基础路径</strong>C01、C02、C04、C08、C10、C11。</div>
        <div class="mini-card"><strong>45分钟标准路径</strong>保留11张学生卡，教师卡只作为讲评资源。</div>
        <div class="mini-card"><strong>实训课路径</strong>加入仿真软件实际操作，要求导出截图与短报告。</div>
      </div>
    </article>
  `;
}

function renderTraceTable() {
  qs("#traceTableWrap").innerHTML = `
    <table class="trace-table">
      <thead>
        <tr>
          <th>卡片ID</th>
          <th>类型</th>
          <th>标题</th>
          <th>能力节点</th>
          <th>学习证据</th>
          <th>来源</th>
          <th>审核状态</th>
        </tr>
      </thead>
      <tbody>
        ${cards.map((card) => `
          <tr>
            <td>${card.id}</td>
            <td>${card.type}</td>
            <td>${card.title}</td>
            <td>${card.node}</td>
            <td>${card.evidence}</td>
            <td>${card.source}</td>
            <td><span class="source-pill">${card.review}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

qs("#completeCard").addEventListener("click", saveCurrentActivity);
qs("#prevCard").addEventListener("click", () => {
  state.currentIndex = Math.max(0, state.currentIndex - 1);
  saveState();
  renderCardNav();
  renderCurrentCard();
  renderWorkbench();
});
qs("#nextCard").addEventListener("click", () => {
  state.currentIndex = Math.min(studentCards.length - 1, state.currentIndex + 1);
  saveState();
  renderCardNav();
  renderCurrentCard();
  renderWorkbench();
});
qs("#jumpTask").addEventListener("click", () => {
  state.currentIndex = studentCards.findIndex((card) => card.id === "P4T2-C10");
  saveState();
  renderCardNav();
  renderCurrentCard();
  renderWorkbench();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

render();
