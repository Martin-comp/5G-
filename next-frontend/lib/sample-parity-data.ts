export type ProjectTaskBlueprint = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  output: string;
  nodes: { nodeId: string; title: string; criterion: string }[];
};

export type DeliverableEvidence = {
  src: string;
  alt: string;
  caption: string;
};

export type DeliverableField = {
  id: string;
  label: string;
  nodeId: string;
  versions: Record<number, {
    value: string;
    evidence: DeliverableEvidence[];
  }>;
};

export type StructuredDeliverable = {
  title: string;
  summary: string;
  fields: DeliverableField[];
  rubric: { label: string; description: string }[];
};

export const projectTaskBlueprints: Record<string, ProjectTaskBlueprint[]> = {
  P1: [
    {
      id: 'P01', code: 'P1-T1', title: '室内信息采集', subtitle: '核对站址、设备、运行条件与归档证据', output: '室内信息采集成果',
      nodes: [
        { nodeId: 'P1T1-N01', title: '室内资源边界', criterion: '站址、楼层、机房和对象边界明确' },
        { nodeId: 'P1T1-N02', title: '设备拓扑', criterion: '设备、端口、链路与配套可追溯' },
        { nodeId: 'P1T1-N03', title: '运行条件', criterion: '供电、传输、环境和告警已核对' },
        { nodeId: 'P1T1-N04', title: '证据与归档', criterion: '照片、编号、坐标、时间和日志互证' }
      ]
    },
    {
      id: 'P02', code: 'P1-T2', title: '室外信息采集', subtitle: '记录环境、天线、现场证据和采集成果', output: '室外信息采集成果',
      nodes: [
        { nodeId: 'P1T2-N01', title: '环境与站点信息', criterion: '站点、遮挡、楼层和道路边界完整' },
        { nodeId: 'P1T2-N02', title: '天线与覆盖对象', criterion: '姿态、方向和目标道路对应' },
        { nodeId: 'P1T2-N03', title: '室外现场证据', criterion: '点位、照片、坐标和时间互证' },
        { nodeId: 'P1T2-N04', title: '室外采集记录', criterion: '路线、对象和证据通过复核' }
      ]
    },
    {
      id: 'P03', code: 'P1-T3', title: '投诉信息采集', subtitle: '把用户描述转为可验证事实与调查入口', output: '投诉信息采集成果',
      nodes: [
        { nodeId: 'P1T3-N01', title: '结构化投诉线索', criterion: '时间、位置、业务和频次明确' },
        { nodeId: 'P1T3-N02', title: '还原投诉场景', criterion: '楼层、区域、路径和业务条件可复现' },
        { nodeId: 'P1T3-N03', title: '关联网络侧证据', criterion: '覆盖、告警和日志证据已关联' },
        { nodeId: 'P1T3-N04', title: '形成投诉调查单', criterion: '事实、边界、依据和测试入口完整' }
      ]
    }
  ],
  P2: [
    {
      id: 'P01', code: 'P2-T1', title: '室外测试准备', subtitle: '确定边界、姿态、遮挡与风险路线', output: '室外测试准备成果',
      nodes: [
        { nodeId: 'P2T1-N01', title: '室外覆盖边界', criterion: '任务区域和投诉点进入测试边界' },
        { nodeId: 'P2T1-N02', title: '天线姿态', criterion: '方位角、下倾角、高度和朝向一致' },
        { nodeId: 'P2T1-N03', title: '场景与遮挡', criterion: '遮挡位置与指标变化对应' },
        { nodeId: 'P2T1-N04', title: '风险路线', criterion: '风险点、顺序和复测条件固定' }
      ]
    }
  ]
};

const p01Evidence = {
  site: { src: '/evidence/p01/site-context.png', alt: '站址与机房场景', caption: '站址、机房与室外天线相对位置' },
  antenna: { src: '/evidence/p01/antenna-direction.png', alt: '天线方向现场证据', caption: '天线安装方向与周边覆盖对象' },
  rru: { src: '/evidence/p01/rru-panel.jpeg', alt: 'RRU设备面板', caption: 'RRU设备外观与端口位置' },
  meter: { src: '/evidence/p01/distance-meter.jpeg', alt: '现场测距仪', caption: '机房距离与安装边界测量工具' },
  endpoint: { src: '/evidence/p01/endpoint-record.jpeg', alt: '端口记录片段', caption: '本端与对端端口核对记录' },
  signal: { src: '/evidence/p01/signal-analysis.png', alt: '信令分析界面', caption: '信令事件与路测指标交叉验证' },
  measurement: { src: '/evidence/p01/site-measurement.png', alt: '站点测量界面', caption: '站点方位与现场参数采集' }
};

export const structuredDeliverables: Record<string, StructuredDeliverable> = {
  'P1:P01': {
    title: '室内信息采集成果记录',
    summary: '以站址、设备、端口、链路和现场证据构成可复核的室内采集闭环。',
    fields: [
      {
        id: 'locationEvidence', label: '站址与机房位置证据', nodeId: 'P1T1-N01',
        versions: {
          1: { value: '站名与楼层已记录，但机房边界照片缺失，无法确认采集对象是否完整。', evidence: [p01Evidence.site] },
          2: { value: '滨河路站点 A 栋 3 层 K02 机房；入口、机柜区与电源区边界均已编号并形成全景证据。', evidence: [p01Evidence.site, p01Evidence.meter] }
        }
      },
      {
        id: 'collectionScope', label: '采集范围与排除对象', nodeId: 'P1T1-N01',
        versions: {
          1: { value: '采集 BBU、传输与电源设备，未说明共址设备的排除边界。', evidence: [p01Evidence.site] },
          2: { value: '纳入 BBU、RRU、传输、电源和接地；明确排除共址运营商机柜与非本次工单对象。', evidence: [p01Evidence.site] }
        }
      },
      {
        id: 'equipmentLocation', label: '设备位置证据', nodeId: 'P1T1-N02',
        versions: {
          1: { value: 'BBU 位于 K02 机柜，RRU 位于楼顶天线侧，缺少二者方位关系。', evidence: [p01Evidence.rru] },
          2: { value: 'BBU 位于 K02 机柜 U18-U20；RRU 位于楼顶东南侧抱杆，方位角 152°，位置关系已标注。', evidence: [p01Evidence.rru, p01Evidence.antenna] }
        }
      },
      {
        id: 'equipmentIdentity', label: '设备身份与铭牌', nodeId: 'P1T1-N02',
        versions: {
          1: { value: '记录设备类型，未完整抄录设备编号与端口标签。', evidence: [p01Evidence.rru] },
          2: { value: 'BBU-01、RRU-03 与电源柜 PWR-01 的名称、编号、厂家和铭牌照片一一对应。', evidence: [p01Evidence.rru] }
        }
      },
      {
        id: 'localEndpoint', label: '本端设备与端口', nodeId: 'P1T1-N02',
        versions: {
          1: { value: '本端记录为 BBU-01，端口仅写“光口1”，缺少板卡位置。', evidence: [p01Evidence.endpoint] },
          2: { value: '本端 BBU-01 / UBBP 板 / CPRI0，标签与设备面板照片一致。', evidence: [p01Evidence.endpoint, p01Evidence.rru] }
        }
      },
      {
        id: 'remoteEndpoint', label: '对端设备与端口', nodeId: 'P1T1-N02',
        versions: {
          1: { value: '对端仅记录 RRU，设备编号和物理端口未确认。', evidence: [p01Evidence.rru] },
          2: { value: '对端 RRU-03 / CPRI0，端口标签、设备编号与楼顶安装位置互相印证。', evidence: [p01Evidence.rru, p01Evidence.antenna] }
        }
      },
      {
        id: 'connectionPath', label: '连接方向与中间路径', nodeId: 'P1T1-N03',
        versions: {
          1: { value: '记录 BBU 到 RRU 的直连关系，未说明 ODF 与走线路径。', evidence: [p01Evidence.endpoint] },
          2: { value: '链路方向为 BBU-01 CPRI0 → ODF-02 盘 3 端口 7 → RRU-03 CPRI0；中间跳接与标签已核对。', evidence: [p01Evidence.endpoint, p01Evidence.signal] }
        }
      },
      {
        id: 'evidenceIndex', label: '照片与证据索引', nodeId: 'P1T1-N04',
        versions: {
          1: { value: '共 5 张照片，文件名未包含对象编号和采集时间。', evidence: [p01Evidence.site, p01Evidence.rru] },
          2: { value: '形成 E01-E09 证据索引；文件名包含站点、对象、时间和采集人，并绑定对应字段。', evidence: [p01Evidence.site, p01Evidence.rru, p01Evidence.signal] }
        }
      },
      {
        id: 'evidenceGap', label: '证据缺口与补采动作', nodeId: 'P1T1-N04',
        versions: {
          1: { value: '未识别证据缺口，无法说明机房边界和接地是否经过复核。', evidence: [] },
          2: { value: '已补采 K02 机柜全景和 PWR-01 接地端子照片；原缺口关闭，补采时间与人员已登记。', evidence: [p01Evidence.meter, p01Evidence.measurement] }
        }
      },
      {
        id: 'reviewConclusion', label: '风险与复核结论', nodeId: 'P1T1-N04',
        versions: {
          1: { value: '设备与链路基本可识别，建议后续补充现场照片。', evidence: [p01Evidence.signal] },
          2: { value: '站址、设备、端口、路径和接地证据已闭环；未发现影响后续测试的数据缺口，可进入网络测试任务。', evidence: [p01Evidence.signal, p01Evidence.measurement] }
        }
      }
    ],
    rubric: [
      { label: '证据分类', description: '对象、照片和字段能否准确对应' },
      { label: '链路重建', description: '本端、中间路径和对端是否完整' },
      { label: '错误修订', description: '退回问题是否被定位并闭环' },
      { label: '专业结论', description: '结论是否有边界、有依据、可交付' }
    ]
  }
};

export const productionStages = [
  { id: '01', title: '多源素材输入', desc: '教材、课件、标准、案例和媒体素材进入统一清单。' },
  { id: '02', title: '诊断与检索', desc: '识别知识点、任务边界、素材缺口与来源风险。' },
  { id: '03', title: '能力图谱构建', desc: '连接岗位任务、能力、节点、资源、活动和评价。' },
  { id: '04', title: '资源生成', desc: '生成图文、语音、动画脚本、互动与学习单。' },
  { id: '05', title: '质量治理', desc: '执行完整性、可用性、版权和视觉质量门禁。' },
  { id: '06', title: '数字教材编排', desc: '形成项目、任务、节点与顺序学习路径。' },
  { id: '07', title: '教学协同', desc: '连接学生自学、课堂听讲、教师授课与讲评。' },
  { id: '08', title: '数据回流', desc: '学习、测试、产出和审核数据回流能力图谱。' }
];

export const publicResourceSummary = [
  { title: 'P01 室内信息采集', nodes: 4, interactions: 2, output: '室内信息采集成果' },
  { title: 'P02 室外信息采集', nodes: 4, interactions: 2, output: '室外信息采集成果' },
  { title: 'P03 投诉信息采集', nodes: 4, interactions: 2, output: '投诉信息采集成果' }
];

export const governanceGates = [
  { title: '内容完整性门禁', status: '通过', checks: ['节点六阶段完整', '正式测试与产出齐全', '教师讲稿可用'] },
  { title: '资源可用性门禁', status: '通过', checks: ['资源链接可访问', '来源与用途已标注', '必需资源无缺失'] },
  { title: '视觉质量门禁', status: '待复核', checks: ['关键图示清晰', '移动端不溢出', '生成图片人工确认'] },
  { title: '版本追溯门禁', status: '通过', checks: ['节点与资源版本关联', '学习产出保留历史', '审核动作可追溯'] }
];

export const deliveryPackage = [
  '课程项目与任务目录', '能力图谱结构数据', '节点图文与语音资源', '互动活动与正式测试',
  '学生学习与教师授课页面', '资源治理与版本追溯清单'
];
