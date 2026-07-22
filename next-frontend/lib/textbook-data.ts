export type ViewKey = 'course' | 'project' | 'task' | 'graph' | 'teacher' | 'game';

export const courseStats = [
  { label: '课程项目', value: '6', note: '覆盖5G网优完整工作链' },
  { label: '学习任务', value: '18', note: '按项目任务组织学习' },
  { label: '重点路径', value: '2', note: '网络测试到优化验证' },
  { label: '完整任务', value: 'P4-T2', note: '结果验证闭环样章' }
];

export const projects = [
  { id: 'P1', title: '5G网络信息采集', status: '样章已接入', note: '信息采集 · 线索闭环' },
  { id: 'P2', title: '5G网络测试', status: '样章已接入', note: '测试数据 · 证据输入' },
  { id: 'P3', title: '5G网络信息管理', status: '样章已接入', note: '信息管理 · 告警参数关联' },
  { id: 'P4', title: '5G端到端网络优化', status: '进行中', note: '优化实施与结果验证' },
  { id: 'P5', title: '5G全网性能提升', status: '样章已接入', note: '性能提升 · 效果评估' },
  { id: 'P6', title: '5G信令分析', status: '样章已接入', note: '信令分析 · 原因定位' }
];

export const p4Tasks = [
  { id: 'N01', title: '识别验证场景', desc: '确定需要验证的问题和场景' },
  { id: 'N02', title: '区分改善与达标', desc: '判断指标改善与是否达标' },
  { id: 'N03', title: '读覆盖指标', desc: '读取RSRP/SINR等覆盖指标' },
  { id: 'N04', title: '读移动性指标', desc: '读取切换成功率、掉线等指标', active: true },
  { id: 'N05', title: '读体验容量指标', desc: '读取速率、时延、容量等体验指标' },
  { id: 'N06', title: '选择判断依据', desc: '选择关键依据支撑结论' },
  { id: 'N07', title: '形成验收结论', desc: '输出可交付的验收结论' },
  { id: 'N08', title: '修正职业表达', desc: '优化报告表达，符合规范' }
];

export const mobilityMetrics = [
  { label: '切换成功率', value: '94.5%', target: '目标 ≥ 98%', status: '未达标', tone: 'danger' },
  { label: '10次往返重建', value: '4次', target: '目标 ≤ 1次', status: '未达标', tone: 'danger' },
  { label: '短掉线日志', value: '1段', target: '需要复核', status: '待复核', tone: 'warn' }
];

export const graphNodes = [
  { id: 'CG-01', title: '信息采集', project: 'P1', desc: '收集投诉、环境、设备和测试前置信息。' },
  { id: 'CG-02', title: '网络测试', project: 'P2', desc: '完成DT/CQT测试、问题处理和测试数据分析。' },
  { id: 'CG-03', title: '信息管理', project: 'P3', desc: '整理网管、运行监控和参数信息。' },
  { id: 'CG-04', title: '优化实施', project: 'P4', desc: '实施优化方案，是结果验证的直接前置环节。' },
  { id: 'CG-05', title: '结果验证', project: 'P4', desc: '复核优化后是否达到目标，可进入P4-T2学习任务。', active: true },
  { id: 'CG-06', title: '性能提升', project: 'P5', desc: '在验收基础上继续做全网性能提升。' },
  { id: 'CG-07', title: '信令分析', project: 'P6', desc: '面向复杂问题进行信令级分析和优化。' }
];

export const resourceCards = [
  { title: 'N04 学生自学页', desc: '图文讲解 · 步骤演示' },
  { title: 'N04 教师授课页', desc: '教学课件 · 重点提示' },
  { title: '移动性指标表', desc: '参数说明 · 参考阈值' },
  { title: '路线示意图', desc: '移动轨迹 · 典型路径' }
];

export const capabilityNodes = [
  { id: 'P2T3-N01', label: '确认数据来源与分析目标', task: 'P2-T3', project: 'P2', activity: '区分DT、CQT、投诉和网管侧数据用途', output: '数据分析任务单', status: '关键前置' },
  { id: 'P2T3-N02', label: '完成LOG导入与报告导出', task: 'P2-T3', project: 'P2', activity: '导入LOG并导出基础报告', output: '导入导出流程记录', status: '数据准备' },
  { id: 'P2T3-N03', label: '识读关键指标与判断边界', task: 'P2-T3', project: 'P2', activity: '读取RSRP、SINR、速率、时延、掉线和切换指标', output: '指标读法与边界表', status: '关键前置' },
  { id: 'P2T3-N04', label: '判断覆盖类异常', task: 'P2-T3', project: 'P2', activity: '用指标和场景证据判断弱覆盖或越区覆盖', output: '覆盖异常判断记录', status: '证据判断' },
  { id: 'P2T3-N05', label: '判断移动性与邻区异常', task: 'P2-T3', project: 'P2', activity: '识别切换失败、邻区漏配或乒乓切换线索', output: '移动性异常证据链', status: '证据判断' },
  { id: 'P2T3-N06', label: '归纳问题类型与原因链', task: 'P2-T3', project: 'P2', activity: '把指标现象、场景和可能原因连成证据链', output: '异常问题清单', status: '原因链' },
  { id: 'P2T3-N07', label: '制定整改建议', task: 'P2-T3', project: 'P2', activity: '把建议写成可复核、不过度承诺的表达', output: '整改建议卡', status: '建议输出' },
  { id: 'P2T3-N08', label: '输出分析报告并连接复测', task: 'P2-T3', project: 'P2', activity: '形成测试数据分析报告并说明后续复测入口', output: '测试数据分析报告', status: '报告产出' },
  { id: 'P1T1-N01', label: '室内资源边界', task: 'P1-T1', project: 'P1', activity: '确认楼宇、楼层、机房和采集边界', output: '室内资源边界记录', status: '路径起点' },
  { id: 'P1T1-N02', label: '设备拓扑', task: 'P1-T1', project: 'P1', activity: '核对AAU、BBU、RRU和配套连接关系', output: '设备拓扑核对表', status: '前置已解锁' },
  { id: 'P1T1-N03', label: '运行条件', task: 'P1-T1', project: 'P1', activity: '核对供电、传输、环境和运行状态', output: '运行条件检查表', status: '顺序学习' },
  { id: 'P1T1-N04', label: '证据与归档', task: 'P1-T1', project: 'P1', activity: '对齐照片、编号、坐标、时间和日志', output: '现场证据归档包', status: '路径终点' },
  { id: 'P2T1-N01', label: '室外覆盖边界', task: 'P2-T1', project: 'P2', activity: '明确道路、楼宇、测试路线和覆盖边界', output: '室外覆盖边界图', status: '路径起点' },
  { id: 'P2T1-N02', label: '天线姿态', task: 'P2-T1', project: 'P2', activity: '核对方位角、下倾角、高度和朝向', output: '天线姿态核对表', status: '顺序学习' },
  { id: 'P2T1-N03', label: '场景与遮挡', task: 'P2-T1', project: 'P2', activity: '识别楼宇、树木、地形和道路遮挡', output: '场景遮挡记录', status: '顺序学习' },
  { id: 'P2T1-N04', label: '风险路线', task: 'P2-T1', project: 'P2', activity: '规划可复测的高风险测试路线', output: '风险路线测试单', status: '路径终点' },
  { id: 'P1T2-N01', label: '记录环境与站点信息', task: 'P1-T2', project: 'P1', activity: '整理站点、遮挡、楼层和道路边界', output: '环境信息表', status: '前置材料' },
  { id: 'P1T3-N01', label: '结构化投诉线索', task: 'P1-T3', project: 'P1', activity: '把用户原话转成时间、位置、业务和频次', output: '可验证投诉线索卡', status: '项目样章' },
  { id: 'P4T1-N01', label: '明确优化对象与实施边界', task: 'P4-T1', project: 'P4', activity: '填写优化实施任务单', output: '优化实施任务单', status: '实施入口' },
  { id: 'P4T1-N06', label: '形成复测验证入口并交接P4-T2', task: 'P4-T1', project: 'P4', activity: '汇总复测场景、指标和交接材料', output: '复测验证交接清单', status: '前置交接' },
  { id: 'P4T2-N01', label: '识别验证场景', task: 'P4-T2', project: 'P4', activity: '投诉线索归类', output: '投诉到验证对象映射', status: '任务级深样章' },
  { id: 'P4T2-N02', label: '区分改善与达标', task: 'P4-T2', project: 'P4', activity: '结论边界修正', output: '已达标依据和未闭环边界', status: '任务级深样章' },
  { id: 'P4T2-N03', label: '读覆盖指标', task: 'P4-T2', project: 'P4', activity: '验证流程排序', output: '覆盖指标判断', status: '任务级深样章' },
  { id: 'P4T2-N04', label: '读移动性指标', task: 'P4-T2', project: 'P4', activity: '移动性流程排序', output: '移动性验证流程', status: '当前节点' },
  { id: 'P4T2-N05', label: '读体验与容量指标', task: 'P4-T2', project: 'P4', activity: '指标行标注', output: '通过依据和边界指标', status: '任务级深样章' },
  { id: 'P4T2-N06', label: '选择判断依据', task: 'P4-T2', project: 'P4', activity: '依据分类', output: '依据链分类结果', status: '任务级深样章' },
  { id: 'P4T2-N07', label: '形成验收结论', task: 'P4-T2', project: 'P4', activity: '结论拼装与提交', output: '四段式验收结论', status: '任务级深样章' },
  { id: 'P4T2-N08', label: '修正职业表达', task: 'P4-T2', project: 'P4', activity: '结论修改与自评', output: '修正后的职业表达', status: '任务级深样章' },
  { id: 'P4T3-N02', label: '归集实施与验证证据', task: 'P4-T3', project: 'P4', activity: '整理实施记录、验证结论和测试分析材料', output: '报告证据链清单', status: '报告前置' },
  { id: 'P3T1-N01', label: '识别网管对象', task: 'P3-T1', project: 'P3', activity: '区分小区、基站、网元与管理对象', output: '网管对象清单', status: '任务入口' },
  { id: 'P3T2-N01', label: '读取运行状态', task: 'P3-T2', project: 'P3', activity: '识别告警级别、发生时间和影响范围', output: '运行状态记录', status: '状态监控' },
  { id: 'P3T3-N02', label: '关联告警与参数变更', task: 'P3-T3', project: 'P3', activity: '对照告警、关键参数和变更时间', output: '管理异常证据链', status: '项目样章' },
  { id: 'P5T1-N01', label: '识别性能瓶颈对象', task: 'P5-T1', project: 'P5', activity: '定位忙小区、峰值用户和体验下降区域', output: '性能瓶颈对象清单', status: '任务入口' },
  { id: 'P5T2-N01', label: '组合提升策略', task: 'P5-T2', project: 'P5', activity: '基于负载、容量、干扰和体验选择策略', output: '全网提升方案', status: '优化方案' },
  { id: 'P5T3-N02', label: '评估提升效果', task: 'P5-T3', project: 'P5', activity: '复核速率、时延和PRB利用率变化', output: '性能提升评估表', status: '项目样章' },
  { id: 'P6T1-N01', label: '识别信令流程', task: 'P6-T1', project: 'P6', activity: '区分注册、会话、切换和释放流程', output: '信令流程图', status: '任务入口' },
  { id: 'P6T2-N03', label: '定位拒绝原因', task: 'P6-T2', project: 'P6', activity: '结合原因码、重传和消息序列定位失败', output: '信令异常证据链', status: '项目样章' },
  { id: 'P6T3-N02', label: '形成信令分析结论', task: 'P6-T3', project: 'P6', activity: '输出可复核的失败原因与处置建议', output: '信令分析报告', status: '报告产出' }
];

export type LearningNodeExperience = {
  nodeId: string;
  projectId: string;
  taskId: string;
  title: string;
  headline: string;
  subtitle: string;
  caseIntro: string;
  steps: { title: string; desc: string }[];
  evidence: { label: string; value: string; target: string; status: string }[];
  practice: { question: string; answer: string; reason: string }[];
  teacherScript: string[];
  outputs: string[];
  rubric: string[];
  correction?: { mistake: string; correction: string }[];
  microExercise?: {
    prompt: string;
    options: string[];
    correctOption: string;
    explanation: string;
    knowledgePoint: string;
  };
  formalTest?: {
    prompt: string;
    options: string[];
    correctOption: string;
    explanation: string;
    knowledgePoint: string;
  }[];
};

export type ProjectLearningPathNode = {
  nodeId: string;
  title: string;
};

export const projectLearningPaths: Record<string, ProjectLearningPathNode[]> = {
  P1: [
    { nodeId: 'P1T1-N01', title: '室内资源边界' },
    { nodeId: 'P1T1-N02', title: '设备拓扑' },
    { nodeId: 'P1T1-N03', title: '运行条件' },
    { nodeId: 'P1T1-N04', title: '证据与归档' }
  ],
  P2: [
    { nodeId: 'P2T1-N01', title: '室外覆盖边界' },
    { nodeId: 'P2T1-N02', title: '天线姿态' },
    { nodeId: 'P2T1-N03', title: '场景与遮挡' },
    { nodeId: 'P2T1-N04', title: '风险路线' }
  ]
};

function createP4TaskNode(
  nodeId: string,
  title: string,
  headline: string,
  subtitle: string,
  evidenceLabel: string,
  evidenceValue: string,
  evidenceTarget: string,
  conclusion: string
): LearningNodeExperience {
  return {
    nodeId,
    projectId: 'P4',
    taskId: 'P4-T2',
    title,
    headline,
    subtitle,
    caseIntro: `食堂区域完成优化后，需要围绕“${headline}”完成一次结果验证。学生应把场景、指标和结论边界连成可复核的证据链。`,
    steps: [
      { title: '明确场景', desc: '确认本节点面对的验证对象与问题边界。' },
      { title: '读取证据', desc: `读取${evidenceLabel}及其对照信息。` },
      { title: '选择依据', desc: '区分能支撑判断的关键证据与无关材料。' },
      { title: '形成结论', desc: '输出有证据、有边界的验收表达。' }
    ],
    evidence: [
      { label: evidenceLabel, value: evidenceValue, target: evidenceTarget, status: '需判断' },
      { label: '测试场景对照', value: '食堂移动路径', target: '与投诉路径一致', status: '已关联' },
      { label: '优化前后对比', value: '已归档', target: '说明改善边界', status: '可复核' }
    ],
    practice: [
      { question: `本节点应优先读取哪项证据？`, answer: evidenceLabel, reason: `它直接服务于“${headline}”的判断。` },
      { question: '结论应该怎样写？', answer: conclusion, reason: '结论需同时说明已有改善和仍需复核的边界。' }
    ],
    teacherScript: [
      `先让学生回到问题：${headline}`,
      `再用${evidenceLabel}和场景对照完成判断。`,
      '最后要求学生写出证据充分、不过度承诺的验收表达。'
    ],
    outputs: [`${title}判断记录`, '关键依据标注', '验收结论片段'],
    rubric: ['证据选择准确', '场景与指标对应', '结论表达有边界']
  };
}

function createP4LinkedNode(
  nodeId: string,
  taskId: 'P4-T1' | 'P4-T3',
  title: string,
  headline: string,
  subtitle: string,
  evidenceLabel: string,
  evidenceValue: string,
  evidenceTarget: string,
  conclusion: string
): LearningNodeExperience {
  const node = createP4TaskNode(nodeId, title, headline, subtitle, evidenceLabel, evidenceValue, evidenceTarget, conclusion);
  return {
    ...node,
    taskId,
    outputs: taskId === 'P4-T1'
      ? ['优化实施任务单', '复测验证交接清单', 'P4-T2场景与指标输入']
      : ['报告证据链清单', '结构化优化报告', '后续性能提升建议'],
    teacherScript: taskId === 'P4-T1'
      ? ['先确认优化对象、调整范围和实施边界。', '再把复测场景、关键指标和原始材料交接给验证任务。', '强调实施完成不代表验收完成，必须进入P4-T2复测。']
      : ['回收实施记录、测试数据与验收结论。', '检查报告是否说明已改善项、未闭环项和后续动作。', '把需要持续优化的问题交给P5或P6继续处理。']
  };
}

export const p4TaskFlow = [
  { id: 'P4T1-N01', task: 'P4-T1', title: '优化实施', note: '明确对象与实施边界' },
  { id: 'P4T1-N06', task: 'P4-T1', title: '复测交接', note: '交接场景、指标和材料' },
  { id: 'P4T2-N01', task: 'P4-T2', title: '结果验证', note: '完成N01-N08证据判断' },
  { id: 'P4T2-N08', task: 'P4-T2', title: '验收表达', note: '修正职业表达并形成结论' },
  { id: 'P4T3-N02', task: 'P4-T3', title: '报告输出', note: '归集证据，输出优化报告' }
] as const;

const authoredLearningNodeExperiences: LearningNodeExperience[] = [
  createP4LinkedNode('P4T1-N01', 'P4-T1', '明确优化对象与实施边界', '优化实施前，需要先锁定什么边界？', '明确问题小区、目标场景、可调整参数和复测条件，避免实施动作脱离后续验证。', '实施边界清单', '3项', '对象、参数、场景明确', '先形成可复测的实施任务单，再进入优化调整。'),
  createP4LinkedNode('P4T1-N06', 'P4-T1', '形成复测验证入口', '优化完成后，怎样把材料交给结果验证？', '把实施记录、复测场景、关键指标和原始材料整理为可交接的验证输入。', '交接材料完整度', '4类', '场景、指标、日志、实施记录齐全', '没有完整交接材料，就不能可靠判断优化是否闭环。'),
  createP4TaskNode('P4T2-N01', '识别验证场景', '优化后首先该验证什么场景？', '从投诉路径、业务类型和测试条件确定结果验证的对象。', '投诉场景映射', '食堂移动路径', '覆盖实际投诉区域', '先明确场景，再读取指标，避免脱离用户体验做验收。'),
  createP4TaskNode('P4T2-N02', '区分改善与达标', '指标变好了，为什么还不能立刻验收？', '区分单项改善、阈值达标与完整体验闭环。', '覆盖指标对比', 'RSRP 97.5%', '静止点覆盖达标', '覆盖已有改善，但仍需核验移动性和体验是否闭环。'),
  createP4TaskNode('P4T2-N03', '读覆盖指标', '覆盖指标达标，能说明到什么程度？', '读取RSRP、SINR等指标，并识别它们不能单独证明的内容。', 'SINR覆盖率', '92.0%', '目标 ≥90%', '覆盖类指标已达标，但不能替代移动路径体验判断。'),
  createP4TaskNode('P4T2-N05', '读体验与容量指标', '速率、时延和容量怎样进入验收？', '把体验和容量指标放入同一场景对比，避免只看一个KPI。', '下行速率', '48.3Mbps', '目标 ≥50Mbps', '体验指标仍需结合时延和容量继续复核。'),
  createP4TaskNode('P4T2-N06', '选择判断依据', '哪些材料能支撑验收结论？', '从场景、指标、日志和对照材料中选择真正能支撑判断的依据。', '关键证据覆盖度', '4类材料', '场景、指标、日志、对照齐全', '依据需覆盖问题场景和关键指标，不能只引用单一截图。'),
  createP4TaskNode('P4T2-N07', '形成验收结论', '怎样写出真正可交付的验收结论？', '将已改善项、未闭环项、关键依据和后续动作写成结构化结论。', '结论证据完整度', '4段式', '改善、边界、依据、建议完整', '覆盖已改善，但移动性仍需优化，建议继续复核切换参数与邻区关系。'),
  createP4TaskNode('P4T2-N08', '修正职业表达', '怎样让结论专业、清晰、可追溯？', '检查术语、逻辑、量化依据与建议的可执行性。', '表达规范性', '待自评', '术语准确、结构完整', '将绝对化表述改为基于证据的边界表达，并保留后续复核动作。'),
  createP4LinkedNode('P4T3-N02', 'P4-T3', '归集实施与验证证据', '怎样把验证过程变成一份可追溯的优化报告？', '汇总实施记录、测试数据、验收结论和未闭环项，形成可被复核的报告证据链。', '报告证据链', '4类材料', '实施、测试、结论、建议齐全', '报告既要说明优化价值，也要保留未闭环问题的后续动作。'),
  {
    nodeId: 'P1T1-N02', projectId: 'P1', taskId: 'P1-T1', title: '核对站址机房', headline: '站址、机房、设备和照片日志怎样形成可复核证据链？',
    subtitle: '先明确采集对象，再让站名、楼层、设备、照片、坐标和日志之间可以一一对应。',
    caseIntro: '进入教学楼机房前，学生拿到一张站址工单和若干现场照片。任务不是简单拍照，而是确认站址、机房边界、主设备、配套和照片日志是否能相互印证。',
    steps: [{ title: '理解对象', desc: '先确认本次采集的站址、楼层、机房边界和现场对象。' }, { title: '读取证据', desc: '核对设备配套、照片编号、坐标与采集时间。' }, { title: '听讲与判断', desc: '判断哪些材料能够组成可复核的证据链。' }, { title: '形成记录', desc: '输出字段完整、对象可定位的站址机房核对记录。' }],
    evidence: [{ label: '站址与机房', value: '教学楼 B1', target: '站名、楼层、边界一致', status: '需核对' }, { label: '设备与配套', value: 'AAU / BBU / RRU', target: '与工单对象对应', status: '需核对' }, { label: '照片与日志', value: '编号、坐标、时间', target: '可相互复核', status: '需核对' }],
    practice: [{ question: '为什么现场照片不能脱离站址和设备编号单独保存？', answer: '照片必须能够回到明确的采集对象', reason: '只有照片、对象、坐标与时间互相对应，后续人员才能复核现场。' }, { question: '核对完成后应形成什么交付？', answer: '站址机房核对记录', reason: '记录应写明对象、边界、证据编号和可复核信息。' }],
    teacherScript: ['先强调：采集不是拍照，而是建立可复核的现场证据。', '让学生依次核对站址机房、设备配套、照片日志。', '最后检查每份材料能否反向定位到同一现场对象。'],
    outputs: ['站址机房核对记录', '现场照片日志', 'P2测试前置信息'], rubric: ['现场对象清晰', '证据链可复核', '记录字段完整']
  },
  {
    nodeId: 'P1T3-N01', projectId: 'P1', taskId: 'P1-T3', title: '结构化投诉线索', headline: '“食堂视频卡顿”怎样变成可验证的问题？',
    subtitle: '将用户原话拆成时间、位置、业务、频次和终端信息，形成可交给测试环节的线索。',
    caseIntro: '学生反馈午餐高峰从电梯口走到食堂入口时视频会议卡顿，但没有留下准确时间、具体点位和终端信息。需要先判断哪些信息能让后续测试真正复现问题。',
    steps: [{ title: '还原场景', desc: '确认投诉发生的时间段、区域和移动路径。' }, { title: '记录业务', desc: '保留视频卡顿、掉线或速率慢等用户感知。' }, { title: '判断频次', desc: '区分偶发问题和稳定复现问题。' }, { title: '形成线索卡', desc: '输出能交给P2测试的结构化问题。' }],
    evidence: [{ label: '发生时间', value: '12:10-12:30', target: '与话务峰值对齐', status: '已记录' }, { label: '投诉位置', value: '电梯口→食堂入口', target: '明确移动路径', status: '已记录' }, { label: '业务现象', value: '视频会议卡顿', target: '可转化为测试目标', status: '待复核' }],
    practice: [{ question: '要让问题可复现，最先补哪两项信息？', answer: '发生时间与具体位置', reason: '时间和位置能把用户描述与测试轨迹、网络日志对齐。' }, { question: '视频卡顿属于哪类线索？', answer: '业务现象', reason: '业务现象决定后续需要读取速率、时延或中断类指标。' }],
    teacherScript: ['先让学生发现：一句“网络不好”不能直接测试。', '引导学生把投诉拆成时间、位置、业务和频次。', '强调P1产出的是可复现线索，不是提前下网络结论。'],
    outputs: ['结构化投诉线索卡', '测试场景描述', 'P2测试输入'], rubric: ['信息字段完整', '场景边界清楚', '表达可被复测']
  },
  {
    nodeId: 'P2T3-N03', projectId: 'P2', taskId: 'P2-T3', title: '识读关键指标与判断边界', headline: '测试数据能否支撑后续优化验证？',
    subtitle: '把轨迹、采样完整率、RSRP、SINR和业务体验指标连成可复核的测试证据。',
    caseIntro: '同一条食堂测试路线导出了覆盖和速率图，但部分采样点缺失。需要判断哪些数据可以进入后续优化验证，哪些仍需要补测。',
    steps: [{ title: '核验轨迹', desc: '确认测试路线覆盖投诉区域。' }, { title: '检查采样', desc: '判断是否存在影响结论的数据空洞。' }, { title: '读取指标', desc: '将覆盖、质量和体验指标放回场景中看。' }, { title: '输出边界', desc: '说明数据可用范围与补测建议。' }],
    evidence: [{ label: '测试轨迹', value: '覆盖主路径', target: '包含投诉区域', status: '已达标' }, { label: '采样完整率', value: '96%', target: '≥95%', status: '已达标' }, { label: '原始日志', value: '1份', target: '可复核异常事件', status: '已归档' }],
    practice: [{ question: '采样完整率为什么不能省略？', answer: '它决定指标是否存在数据空洞', reason: '缺失采样可能让异常区域被忽略，影响后续判断可靠性。' }, { question: '哪份材料最能复核异常时刻？', answer: '原始日志', reason: '原始日志能还原指标变化和异常事件的时间关系。' }],
    teacherScript: ['先确认数据是否真的覆盖投诉区域。', '再强调图表结论必须能回溯到原始日志。', '最后交接到P4：测试数据只提供证据，不替代验收判断。'],
    outputs: ['关键指标边界表', '测试数据可用性说明', 'P4验证证据输入'], rubric: ['轨迹与场景对应', '指标读法正确', '能说明数据边界']
  },
  {
    nodeId: 'P3T3-N02', projectId: 'P3', taskId: 'P3-T3', title: '关联告警与参数变更', headline: '告警出现后，怎样判断是否与配置变更有关？',
    subtitle: '把网管告警、参数变更和发生时间连成管理侧证据链。',
    caseIntro: '某小区在午餐高峰前发生切换失败告警，前一天又有邻区参数调整。需要判断两者是否只是时间接近，还是存在需要复核的配置关联。',
    steps: [{ title: '识别告警', desc: '确认告警级别、对象和发生时间。' }, { title: '查看参数', desc: '定位相关小区与邻区配置。' }, { title: '时间对齐', desc: '将告警与变更记录放到同一时间线。' }, { title: '形成原因链', desc: '写出需要复核的配置关系。' }],
    evidence: [{ label: '切换失败告警', value: '18条', target: '关注持续发生', status: '需复核' }, { label: '邻区参数变更', value: '前1日调整', target: '与告警时间对齐', status: '已关联' }, { label: '影响小区', value: '2个', target: '明确对象边界', status: '已定位' }],
    practice: [{ question: '告警和参数为什么要一起看？', answer: '用于判断异常是否可能由配置引起', reason: '单条告警只能说明现象，参数变更提供可复核的原因线索。' }, { question: '怎样避免把时间接近当成因果？', answer: '继续核验对象、指标和变更前后对比', reason: '需要更多证据闭合原因链。' }],
    teacherScript: ['提醒学生：告警是现象，不等于根因。', '带学生对齐告警对象、参数对象和时间。', '输出“待复核关联”，避免过度下结论。'],
    outputs: ['告警参数关联表', '管理异常证据链', '复核建议'], rubric: ['对象一致', '时间线清楚', '结论有边界']
  },
  {
    nodeId: 'P5T3-N02', projectId: 'P5', taskId: 'P5-T3', title: '评估提升效果', headline: '扩容后，用户体验真的提升了吗？',
    subtitle: '对比忙小区、PRB、速率和时延，验证性能提升是否覆盖高峰场景。',
    caseIntro: '食堂区域完成小区扩容后，日均速率提升，但午餐高峰仍有用户投诉加载慢。需要判断扩容效果是否已经覆盖实际高负载场景。',
    steps: [{ title: '选择对比时段', desc: '统一优化前后高峰时段。' }, { title: '读取资源指标', desc: '查看PRB利用率与用户数变化。' }, { title: '读取体验指标', desc: '比较速率和时延是否同步改善。' }, { title: '形成效果判断', desc: '说明已改善部分和仍需优化部分。' }],
    evidence: [{ label: 'PRB利用率', value: '78%', target: '≤80%', status: '已改善' }, { label: '下行速率', value: '68Mbps', target: '≥50Mbps', status: '已达标' }, { label: '高峰时延', value: '58ms', target: '≤50ms', status: '待优化' }],
    practice: [{ question: '为什么不能只看平均速率？', answer: '平均值会掩盖高峰时段体验问题', reason: '性能提升需要验证最关键负载场景下的用户感知。' }, { question: '当前是否可以完全验收？', answer: '不能，高峰时延仍未达标', reason: '必须同时说明已改善和未闭环指标。' }],
    teacherScript: ['先固定优化前后相同的高峰场景。', '再用资源与体验指标共同判断效果。', '强调性能提升同样需要写清剩余边界。'],
    outputs: ['性能提升评估表', '高峰体验边界结论', '后续优化建议'], rubric: ['对比条件一致', '资源体验联读', '结论客观完整']
  },
  {
    nodeId: 'P6T2-N03', projectId: 'P6', taskId: 'P6-T2', title: '定位拒绝原因', headline: '业务会话为什么在建立阶段被拒绝？',
    subtitle: '读取拒绝原因码、重传记录和消息序列，恢复一次会话失败的信令过程。',
    caseIntro: '终端已成功注册5G网络，但业务会话建立失败。日志显示存在拒绝消息与多次重传，需要从信令顺序中定位网络侧返回的真实原因。',
    steps: [{ title: '定位失败阶段', desc: '区分注册、会话建立和释放。' }, { title: '读取原因码', desc: '识别网络侧拒绝的具体类型。' }, { title: '对齐消息序列', desc: '确认拒绝前后的交互顺序。' }, { title: '形成定位结论', desc: '输出可复核的原因与建议。' }],
    evidence: [{ label: 'PDU会话请求', value: '已发起', target: '确认失败阶段', status: '已定位' }, { label: '拒绝原因码', value: 'Cause#27', target: '解释失败类型', status: '关键证据' }, { label: '重传记录', value: '3次', target: '确认交互异常', status: '待复核' }],
    practice: [{ question: '原因码为什么必须结合消息序列？', answer: '原因码只说明结果，序列能说明失败前后的过程', reason: '信令定位要避免只看单条消息。' }, { question: '重传记录说明什么？', answer: '交互过程可能存在等待或响应异常', reason: '它能辅助判断失败是否伴随时序问题。' }],
    teacherScript: ['先让学生区分“已注册”和“会话可用”。', '再根据原因码回看消息序列。', '最后要求学生写出可复核的失败阶段和原因。'],
    outputs: ['信令异常证据链', '会话失败定位结论', '处置建议'], rubric: ['流程阶段正确', '原因码解释合理', '证据链可回溯']
  }
];

const generatedProjectProfiles: Record<string, { focus: string; evidence: string; boundary: string; handoff: string }> = {
  P1: { focus: '把现场线索转成可复现的采集任务', evidence: '时间、位置、业务和环境信息', boundary: '不能只保留模糊的用户主观描述', handoff: '交给网络测试环节复测' },
  P2: { focus: '让测试数据能够支撑后续判断', evidence: '轨迹、采样、指标和原始日志', boundary: '不能用缺少场景或采样的数据直接下结论', handoff: '作为优化验证的前置证据' },
  P3: { focus: '用网管信息定位可复核的运行线索', evidence: '告警、对象、参数和变更时间', boundary: '告警现象不等于已经定位根因', handoff: '为优化与验证提供管理侧线索' },
  P4: { focus: '用多维证据判断优化是否真正闭环', evidence: '场景、指标、日志和优化前后对照', boundary: '单项指标改善不等于可以直接验收', handoff: '进入报告输出或后续性能提升' },
  P5: { focus: '验证全网性能提升是否覆盖关键场景', evidence: '负载、资源、速率、时延和用户体验', boundary: '平均指标改善不能掩盖高峰体验问题', handoff: '形成持续优化的效果评估' },
  P6: { focus: '从信令过程恢复异常原因链', evidence: '消息序列、原因码、时间和重传记录', boundary: '单条消息或单一原因码不能完整解释异常', handoff: '输出可复核的信令分析结论' }
};

function createGeneratedNodeExperience(node: (typeof capabilityNodes)[number]): LearningNodeExperience {
  const profile = generatedProjectProfiles[node.project] ?? generatedProjectProfiles.P4;
  return {
    nodeId: node.id,
    projectId: node.project,
    taskId: node.task,
    title: node.label,
    headline: `${node.label}：本节点要怎样完成判断？`,
    subtitle: `${profile.focus}，完成“${node.activity}”并形成“${node.output}”。`,
    caseIntro: `当前进入 ${node.task} 的 ${node.label} 节点。面对实际网优任务时，需要先明确活动对象，再用${profile.evidence}完成可复核判断。`,
    steps: [
      { title: '明确对象', desc: `确认本节点要处理的场景、对象和任务边界。` },
      { title: '完成活动', desc: node.activity },
      { title: '选择证据', desc: `选择能支撑判断的${profile.evidence}。` },
      { title: '形成产出', desc: `按要求完成${node.output}，并保留后续交接边界。` }
    ],
    evidence: [
      { label: '学习活动', value: node.activity, target: '与当前节点活动一致', status: '待完成' },
      { label: '评价产出', value: node.output, target: '可供教师讲评', status: '待提交' },
      { label: '判断边界', value: profile.boundary, target: '避免过度结论', status: '需核验' }
    ],
    practice: [
      { question: `${node.label} 最需要先确认什么？`, answer: '当前任务对象、场景边界与可用证据', reason: '先确认边界，才能让后续活动和评价产出可复核。' },
      { question: '完成本节点后应该保留什么？', answer: node.output, reason: `该产出会${profile.handoff}，成为下一任务的可追溯输入。` }
    ],
    teacherScript: [
      `先用真实任务引出：${profile.focus}。`,
      `带学生完成“${node.activity}”，并提醒证据必须回到场景。`,
      `最后检查${node.output}是否保留了判断边界和后续交接条件。`
    ],
    outputs: [node.output, `${node.task} 学习记录`, `${node.project} 后续任务交接依据`],
    rubric: ['活动对象明确', '证据选择合理', '产出可复核且有边界']
  };
}

type SamplePathNodeConfig = {
  nodeId: string;
  projectId: 'P1' | 'P2';
  taskId: 'P1-T1' | 'P2-T1';
  title: string;
  headline: string;
  subtitle: string;
  caseIntro: string;
  evidence: [string, string, string][];
  mistake: string;
  correction: string;
  output: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  knowledgePoint: string;
};

function createSamplePathNode(config: SamplePathNodeConfig): LearningNodeExperience {
  return {
    nodeId: config.nodeId,
    projectId: config.projectId,
    taskId: config.taskId,
    title: config.title,
    headline: config.headline,
    subtitle: config.subtitle,
    caseIntro: config.caseIntro,
    steps: [
      { title: '确认任务对象', desc: '先明确本节点面对的现场对象、范围和交付要求。' },
      { title: '读取现场证据', desc: `围绕“${config.title}”核对记录、参数与现场信息。` },
      { title: '判断证据边界', desc: '区分直接证据、辅助证据和仍需补充的材料。' },
      { title: '形成可复核产出', desc: `按字段要求完成${config.output}，供教师审核与后续节点使用。` }
    ],
    evidence: config.evidence.map(([label, value, target]) => ({ label, value, target, status: '需核对' })),
    practice: [
      { question: config.question, answer: config.answer, reason: config.explanation },
      { question: '完成本节点后应保留什么？', answer: config.output, reason: '标准化产出会成为下一节点的前置证据。' }
    ],
    teacherScript: [
      `先回到现场任务，说明为什么必须学习“${config.title}”。`,
      '再带学生把对象、证据和判断边界逐项对齐。',
      `最后检查${config.output}能否被另一名人员复核。`
    ],
    outputs: [config.output, `${config.title}微练习记录`, '节点能力点亮记录'],
    rubric: ['对象与边界明确', '证据选择准确', '产出字段完整'],
    correction: [{ mistake: config.mistake, correction: config.correction }],
    microExercise: {
      prompt: config.question,
      options: config.options,
      correctOption: config.answer,
      explanation: config.explanation,
      knowledgePoint: config.knowledgePoint
    },
    formalTest: [
      {
        prompt: config.question,
        options: config.options,
        correctOption: config.answer,
        explanation: config.explanation,
        knowledgePoint: config.knowledgePoint
      },
      {
        prompt: `完成“${config.title}”后，哪项产出最适合作为后续节点的正式证据？`,
        options: [config.output, '口头描述摘要', '无来源的结论截图', '只保留个人备忘'],
        correctOption: config.output,
        explanation: `${config.output}包含本节点要求的结构化字段，可以保存、审核和继续复用。`,
        knowledgePoint: '学习产出'
      },
      {
        prompt: `出现“${config.mistake}”时，正确的纠偏措施是什么？`,
        options: [config.correction, '维持原判断并省略证据', '只增加材料数量', '跳过本节点直接形成结论'],
        correctOption: config.correction,
        explanation: '纠偏必须直接修复当前证据链中的缺口，而不是增加无关材料。',
        knowledgePoint: '纠偏判断'
      }
    ]
  };
}

const sampleLearningNodeExperiences: LearningNodeExperience[] = [
  createSamplePathNode({
    nodeId: 'P1T1-N01', projectId: 'P1', taskId: 'P1-T1', title: '室内资源边界',
    headline: '进入室内采集前，怎样先划清资源边界？', subtitle: '确认站址、楼层、机房、覆盖区域与采集对象，避免现场材料失去定位依据。',
    caseIntro: '某教学楼地下机房需要开展现场采集。工单只写了楼宇名称，学生必须补齐楼层、机房入口、设备区域和采集边界，才能让后续照片与设备记录准确落位。',
    evidence: [['站址楼层', '教学楼 B1', '与工单位置一致'], ['机房边界', '主机房与电源间', '入口和区域可定位'], ['采集对象', '主设备与配套', '对象范围完整']],
    mistake: '只写“教学楼机房”，没有楼层、入口和区域边界。', correction: '把站址、楼层、机房入口、设备区域写成可定位的四级边界。',
    output: '室内资源边界记录', question: '哪组信息最能先确定室内采集边界？',
    options: ['站址、楼层与机房边界', '平均下载速率', '用户手机品牌', '优化后的KPI'], answer: '站址、楼层与机房边界',
    explanation: '现场采集必须先明确空间和对象边界，后续设备、照片和日志才有可复核的定位基准。', knowledgePoint: '室内资源边界'
  }),
  createSamplePathNode({
    nodeId: 'P1T1-N02', projectId: 'P1', taskId: 'P1-T1', title: '设备拓扑',
    headline: '设备名称都拍到了，为什么仍然不能说明连接关系？', subtitle: '核对AAU、BBU、RRU、传输和电源配套之间的拓扑关系。',
    caseIntro: '现场照片包含AAU、BBU和电源柜，但缺少端口和连接关系。学生需要沿设备链路核对对象、端口和配套，形成能够被复核的设备拓扑。',
    evidence: [['主设备', 'AAU / BBU / RRU', '设备编号一致'], ['连接关系', '端口与链路', '上下游可追溯'], ['配套设备', '电源与传输', '与主设备对应']],
    mistake: '把设备清单当作设备拓扑，只记录名称而不记录连接关系。', correction: '按“设备对象—端口—链路—配套”记录上下游关系。',
    output: '设备拓扑核对表', question: '哪组材料能够证明设备拓扑关系？',
    options: ['AAU、BBU、RRU与配套连接', '三张设备外观照片', '机房温度单值', '一段用户投诉'], answer: 'AAU、BBU、RRU与配套连接',
    explanation: '拓扑关注设备之间如何连接，只有对象、端口和链路对应才能支持复核。', knowledgePoint: '设备拓扑'
  }),
  createSamplePathNode({
    nodeId: 'P1T1-N03', projectId: 'P1', taskId: 'P1-T1', title: '运行条件',
    headline: '设备在位，怎样判断它具备正常运行条件？', subtitle: '联合核对供电、传输、环境、告警和运行状态。',
    caseIntro: '设备已经安装并上电，但传输状态和机房环境记录不完整。学生需要检查供电、传输、环境和告警，避免把“设备在位”误判为“运行正常”。',
    evidence: [['供电状态', '电压与备电正常', '供电连续'], ['传输状态', '链路已连通', '无中断告警'], ['环境状态', '温湿度正常', '满足运行要求']],
    mistake: '看到设备指示灯亮，就直接判断运行条件正常。', correction: '同时核对供电、传输、环境和告警，形成多项证据。',
    output: '运行条件检查表', question: '判断运行条件时最完整的组合是什么？',
    options: ['供电、传输与环境状态', '设备外壳颜色', '站点名称', '用户套餐信息'], answer: '供电、传输与环境状态',
    explanation: '运行条件是多因素共同结果，不能用单一指示灯替代供电、传输和环境检查。', knowledgePoint: '运行条件'
  }),
  createSamplePathNode({
    nodeId: 'P1T1-N04', projectId: 'P1', taskId: 'P1-T1', title: '证据与归档',
    headline: '怎样让现场材料在离场后仍然可以被复核？', subtitle: '让照片、编号、坐标、时间与日志形成一一对应的证据链。',
    caseIntro: '采集完成后共有二十张照片和两份日志，但文件名无法对应设备。学生需要统一编号、坐标和时间，形成可追溯、可交接的现场证据包。',
    evidence: [['照片编号', 'P1-001 至 P1-020', '与对象一一对应'], ['坐标时间', '定位与采集时间', '能够还原现场'], ['原始日志', '设备与运行日志', '支持后续复核']],
    mistake: '把所有照片放入文件夹就算完成归档。', correction: '建立“对象—照片—编号—坐标—时间—日志”索引。',
    output: '现场证据归档包', question: '哪种归档方式最便于后续复核？',
    options: ['照片、编号、坐标、时间与日志互证', '只按拍摄顺序保存照片', '只保留汇总结论', '删除原始日志'], answer: '照片、编号、坐标、时间与日志互证',
    explanation: '完整索引能让审核人员从任一材料反向定位现场对象和采集过程。', knowledgePoint: '证据归档'
  }),
  createSamplePathNode({
    nodeId: 'P2T1-N01', projectId: 'P2', taskId: 'P2-T1', title: '室外覆盖边界',
    headline: '测试开始前，怎样确定真正需要覆盖的区域？', subtitle: '把道路、楼宇、投诉点与测试路线放在同一张边界图中。',
    caseIntro: '某园区准备开展室外测试，但路线只覆盖主干道，未经过投诉集中区域。学生需要根据道路、楼宇和投诉点重新确定覆盖边界。',
    evidence: [['目标区域', '园区道路与楼宇', '覆盖任务范围'], ['投诉点位', '3个集中区域', '纳入测试路线'], ['路线边界', '起终点与方向', '可复测']],
    mistake: '直接沿最方便的道路测试，没有覆盖任务目标区域。', correction: '先画出目标边界和投诉点，再规划能够复测的路线。',
    output: '室外覆盖边界图', question: '哪项最能证明测试边界完整？',
    options: ['测试路线覆盖目标道路与区域', '测试车辆速度最快', '日志文件最小', '只经过信号最强点'], answer: '测试路线覆盖目标道路与区域',
    explanation: '路线必须覆盖任务区域和关键问题点，否则测试数据不能代表目标场景。', knowledgePoint: '室外覆盖边界'
  }),
  createSamplePathNode({
    nodeId: 'P2T1-N02', projectId: 'P2', taskId: 'P2-T1', title: '天线姿态',
    headline: '覆盖方向异常时，应该先核对哪些天线信息？', subtitle: '联合读取方位角、下倾角、高度和朝向，判断覆盖指向是否合理。',
    caseIntro: '测试路线一侧信号明显偏弱，现场照片显示天线朝向可能偏离道路。学生需要核对工程参数与现场姿态，判断是否存在指向差异。',
    evidence: [['方位角', '现场与工参对照', '方向一致'], ['下倾角', '机械与电子下倾', '数值可复核'], ['挂高朝向', '高度与道路关系', '覆盖方向合理']],
    mistake: '只看方位角，不检查下倾角、挂高和现场朝向。', correction: '将方位角、下倾角、挂高和现场照片联合核对。',
    output: '天线姿态核对表', question: '核对天线姿态需要哪组关键参数？',
    options: ['方位角、下倾角、高度和朝向', '下载速率与时延', '投诉人姓名', '设备序列号'], answer: '方位角、下倾角、高度和朝向',
    explanation: '天线姿态由多个空间参数共同决定，单看方位角不足以解释覆盖方向。', knowledgePoint: '天线姿态'
  }),
  createSamplePathNode({
    nodeId: 'P2T1-N03', projectId: 'P2', taskId: 'P2-T1', title: '场景与遮挡',
    headline: '信号变差时，怎样判断是否与现场遮挡有关？', subtitle: '把楼宇、树木、地形与轨迹上的信号变化逐点对应。',
    caseIntro: '测试轨迹经过高层楼宇和成片树木时RSRP下降。学生需要标注遮挡物位置，并与信号变化和路线方向对照，避免仅凭照片猜测原因。',
    evidence: [['遮挡对象', '楼宇与树木', '位置明确'], ['轨迹位置', '异常采样区间', '与遮挡对齐'], ['信号变化', 'RSRP下降区间', '支持场景判断']],
    mistake: '看到楼宇就直接认定它是弱覆盖原因。', correction: '对齐遮挡位置、测试轨迹和指标变化，再形成待复核判断。',
    output: '场景遮挡记录', question: '判断遮挡影响最需要哪类对应关系？',
    options: ['遮挡物位置与信号变化对应', '照片数量与文件大小对应', '车辆颜色与道路对应', '用户名与终端对应'], answer: '遮挡物位置与信号变化对应',
    explanation: '只有空间位置和指标变化同步出现，遮挡才构成可复核的场景证据。', knowledgePoint: '场景与遮挡'
  }),
  createSamplePathNode({
    nodeId: 'P2T1-N04', projectId: 'P2', taskId: 'P2-T1', title: '风险路线',
    headline: '怎样把高风险场景组织成一条可复测路线？', subtitle: '标出高风险点、路线顺序、业务条件和复测要求。',
    caseIntro: '园区存在转角、楼间通道和遮挡路段等多个风险点。学生需要按业务连续性和复测条件规划路线，确保后续测试能够稳定重现问题。',
    evidence: [['风险点位', '转角与楼间通道', '关键场景不遗漏'], ['路线顺序', '起点至终点', '移动过程连续'], ['复测条件', '时间、业务与速度', '前后条件一致']],
    mistake: '把风险点列成清单，但没有连接成连续测试路线。', correction: '按业务过程连接风险点，并固定时间、速度和业务条件。',
    output: '风险路线测试单', question: '风险路线能够复测的关键是什么？',
    options: ['高风险点、路线顺序与复测条件', '路线越短越好', '只测试一个静止点', '每次改变业务类型'], answer: '高风险点、路线顺序与复测条件',
    explanation: '固定风险点、顺序和条件，才能让多次测试结果具有可比性。', knowledgePoint: '风险路线'
  })
];

export const learningNodeExperiences: LearningNodeExperience[] = [
  ...sampleLearningNodeExperiences,
  ...authoredLearningNodeExperiences.filter((experience) => !sampleLearningNodeExperiences.some((sample) => sample.nodeId === experience.nodeId)),
  ...capabilityNodes
    .filter((node) => !sampleLearningNodeExperiences.some((experience) => experience.nodeId === node.id) && !authoredLearningNodeExperiences.some((experience) => experience.nodeId === node.id) && node.id !== 'P4T2-N04')
    .map(createGeneratedNodeExperience)
];

export function getLearningNodeExperience(nodeId: string) {
  return learningNodeExperiences.find((node) => node.nodeId === nodeId);
}

export const graphResourceLinks = [
  { id: 'R-P1T3-01', title: '投诉线索结构化卡', type: '学习单/互动', project: 'P1', task: 'P1-T3', node: 'P1T3-N01', output: '可验证投诉线索卡' },
  { id: 'R-P1T3-02', title: '投诉场景标注图', type: '图文资源', project: 'P1', task: 'P1-T3', node: 'P1T3-N01', output: '测试场景描述' },
  { id: 'R-P2T3-01', title: 'LOG导入导出流程', type: '动画脚本', project: 'P2', task: 'P2-T3', node: 'P2T3-N02', output: '导入导出流程记录' },
  { id: 'R-P2T3-02', title: '关键指标读法与边界表', type: '表格/术语', project: 'P2', task: 'P2-T3', node: 'P2T3-N03', output: '指标读法与边界表' },
  { id: 'R-P2T3-03', title: '测试数据分析报告模板', type: '报告模板', project: 'P2', task: 'P2-T3', node: 'P2T3-N08', output: '测试数据分析报告' },
  { id: 'R-P3T3-01', title: '告警参数关联表', type: '数据表/互动', project: 'P3', task: 'P3-T3', node: 'P3T3-N02', output: '管理异常证据链' },
  { id: 'R-P4T1-01', title: '优化实施记录与复测交接清单', type: '学习单', project: 'P4', task: 'P4-T1', node: 'P4T1-N06', output: '复测验证交接清单' },
  { id: 'R-P4T2-01', title: 'P4-T2学习任务页', type: '直接呈现页面', project: 'P4', task: 'P4-T2', node: 'P4T2-N01-P4T2-N08', output: '四段式验收结论' },
  { id: 'R-P4T2-02', title: '移动性指标表', type: '表格/互动', project: 'P4', task: 'P4-T2', node: 'P4T2-N04', output: '移动性验证流程' },
  { id: 'R-P4T2-03', title: '验收结论表达模板', type: '报告模板', project: 'P4', task: 'P4-T2', node: 'P4T2-N07', output: '验收结论段落' },
  { id: 'R-P4T3-01', title: '优化报告证据链清单', type: '报告素材', project: 'P4', task: 'P4-T3', node: 'P4T3-N02', output: '报告证据链清单' },
  { id: 'R-P5T3-01', title: '高峰性能对比表', type: '表格/互动', project: 'P5', task: 'P5-T3', node: 'P5T3-N02', output: '性能提升评估表' },
  { id: 'R-P5T3-02', title: '容量与体验评估清单', type: '学习单', project: 'P5', task: 'P5-T3', node: 'P5T3-N02', output: '高峰体验边界结论' },
  { id: 'R-P6T2-01', title: '信令消息序列卡', type: '流程图/互动', project: 'P6', task: 'P6-T2', node: 'P6T2-N03', output: '信令异常证据链' },
  { id: 'R-P6T2-02', title: '原因码解释表', type: '术语/表格', project: 'P6', task: 'P6-T2', node: 'P6T2-N03', output: '会话失败定位结论' },
  { id: 'R-ALL-02', title: '课程能力图谱数据', type: '结构化数据', project: '全书', task: '18个任务', node: 'CG-01-CG-07', output: '图谱节点与资源映射' }
];

export const graphRelations = [
  { type: '直接递进', from: 'P1T3-N01', to: 'P2T3-N03', text: '结构化投诉线索确定测试的时间、位置、业务与路径。' },
  { type: '直接递进', from: 'P2T3-N03', to: 'P2T3-N04', text: '覆盖异常判断依赖RSRP/SINR等指标读法。' },
  { type: '支撑判断', from: 'P2T3-N03', to: 'P4T2-N03', text: '结果验证时需要复用关键指标边界。' },
  { type: '支撑判断', from: 'P2T3-N05', to: 'P4T2-N04', text: '复测时需要验证切换或邻区配置调整效果。' },
  { type: '任务内递进', from: 'P4T1-N01', to: 'P4T1-N06', text: '明确实施边界后，汇总复测场景、指标与实施记录。' },
  { type: '直接递进', from: 'P4T1-N06', to: 'P4T2-N01', text: '复测交接清单进入结果验证任务。' },
  { type: '任务内递进', from: 'P4T2-N01', to: 'P4T2-N02', text: '明确验证场景后，区分单项改善与验收达标。' },
  { type: '任务内递进', from: 'P4T2-N02', to: 'P4T2-N03', text: '先明确达标边界，再读取覆盖类基础指标。' },
  { type: '任务内递进', from: 'P4T2-N03', to: 'P4T2-N04', text: '覆盖判断完成后，继续读取移动路径上的切换与重建证据。' },
  { type: '前置基础', from: 'P4T2-N04', to: 'P4T2-N03', text: '读移动性指标前，需要先理解基础覆盖指标和边界。' },
  { type: '任务内递进', from: 'P4T2-N04', to: 'P4T2-N05', text: '移动性证据需与体验、容量指标共同完成验证。' },
  { type: '任务内递进', from: 'P4T2-N05', to: 'P4T2-N06', text: '多维指标读取后，选择真正能够支撑验收的依据。' },
  { type: '直接递进', from: 'P4T2-N06', to: 'P4T2-N07', text: '依据分类结果进入验收结论表达。' },
  { type: '问题回流', from: 'P4T2-N07', to: 'P4T2-N06', text: '写结论时发现证据不足，应回到依据分类补证据。' },
  { type: '任务内递进', from: 'P4T2-N07', to: 'P4T2-N08', text: '验收结论完成后，修正职业表达并保留复核边界。' },
  { type: '直接递进', from: 'P4T2-N08', to: 'P4T3-N02', text: '职业化验收结论与证据材料进入优化报告输出。' },
  { type: '资源证据', from: 'R-P4T2-02', to: 'P4T2-N04', text: '移动性指标表支撑读切换、重建和掉线证据。' },
  { type: '支撑判断', from: 'P3T3-N02', to: 'P4T2-N04', text: '告警与参数变更信息可解释移动性异常的管理侧线索。' },
  { type: '直接递进', from: 'P4T2-N07', to: 'P5T3-N02', text: '验收结论会进入全网性能提升效果评估。' },
  { type: '深度诊断', from: 'P4T2-N04', to: 'P6T2-N03', text: '移动性异常无法闭环时，可进一步进入信令级分析。' }
];

export const p4NodeExperience = {
  nodeId: 'P4T2-N04',
  projectId: 'P4',
  taskId: 'P4-T2',
  projectTitle: '5G端到端网络优化',
  taskTitle: '5G网络优化结果验证',
  title: '读移动性指标',
  headline: '覆盖达标后，为什么移动中仍会断？',
  subtitle: '从移动路径、切换事件、重建次数和短掉线日志判断移动性是否真正闭环。',
  caseIntro: '某高校食堂区域完成覆盖优化后，静止点测试显示覆盖良好；但从电梯口走向食堂的路上，视频会议仍会短暂卡顿。现在需要判断：这是覆盖问题已经解决后的偶发现象，还是移动性指标仍未闭环？',
  terms: [
    { title: '切换成功率', desc: '终端从一个小区移动到另一个小区时，切换过程成功完成的比例。低于目标通常说明边界切换质量不足。' },
    { title: '重建次数', desc: '连接异常后终端重新建立连接的次数。重建偏多往往说明移动过程不稳定。' },
    { title: '短掉线日志', desc: '移动路径上发生的短时业务中断记录，用来定位体验卡顿与网络事件是否相关。' }
  ],
  route: [
    { place: '电梯口', signal: '信号波动', note: '投诉起点，覆盖已改善但仍需观察移动过程。' },
    { place: 'A-B边界', signal: '切换事件集中', note: '切换尝试集中，是定位移动中断的关键边界。' },
    { place: '食堂入口', signal: '短时中断', note: '视频会议卡顿发生在此段，需要查看重建和掉线日志。' },
    { place: '就餐区', signal: '信号波动', note: '业务恢复，说明问题不只看单点覆盖。' }
  ],
  evidence: [
    { label: '切换成功率', value: '94.5%', target: '目标 ≥ 98%', status: '未达标' },
    { label: '10次往返重建', value: '4次', target: '目标 ≤ 1次', status: '未达标' },
    { label: '短掉线日志', value: '1段', target: '需要复核', status: '待复核' }
  ],
  learningSteps: [
    { title: '案例导入', desc: '先确认投诉发生在移动路径，而不是静止点。' },
    { title: '术语解释', desc: '区分覆盖指标与移动性指标的判断边界。' },
    { title: '证据读取', desc: '同时读取切换成功率、重建次数和短掉线日志。' },
    { title: '结论表达', desc: '写出“覆盖改善，但移动性未闭环”的边界结论。' }
  ],
  practice: [
    {
      question: '判断投诉发生在静止点还是移动路径？',
      answer: '移动路径',
      reason: '用户在电梯口到食堂入口的移动过程中出现短时卡顿，因此不能只用静止点覆盖结果验收。'
    },
    {
      question: '哪一项最能说明移动性仍未闭环？',
      answer: '切换成功率低于目标并伴随重建次数偏多',
      reason: '切换失败和多次重建共同指向移动过程不稳定。'
    },
    {
      question: '一句边界结论应该怎么写？',
      answer: '覆盖指标已改善，但A-B边界切换成功率未达标、重建次数偏多，移动性体验仍需继续优化。',
      reason: '结论同时交代已改善部分、未闭环依据和后续动作。'
    }
  ],
  students: [
    { name: '陈一鸣', state: '正在整理移动路径证据。' },
    { name: '李若溪', state: '已提交边界结论。' },
    { name: '吴嘉宁', state: '尚未标注短掉线依据。' },
    { name: '赵欣然', state: '已选择切换成功率与重建次数。' },
    { name: '孙泽宇', state: '提交完成，等待讲评。' }
  ],
  teacherScript: [
    '先让学生确认：投诉不是静止点问题，而是移动路径体验问题。',
    '再强调覆盖达标不等于移动性闭环，必须同时看切换、重建和掉线。',
    '最后收束到职业表达：已改善的内容要写清，未闭环的依据也要写清。'
  ],
  outputs: ['移动性验证流程', '未闭环依据标注', '四段式验收结论'],
  rubric: ['能区分覆盖改善与移动性闭环', '能选择切换、重建、掉线作为关键依据', '能写出有边界的验收结论']
};

export const teacherSuggestions = [
  { title: '任务组织建议', desc: '先用投诉场景引出验证问题，再组织指标判断、依据分类和结论表达。' },
  { title: '课堂推进建议', desc: '按“覆盖改善是否足够、移动性是否闭环、证据是否完整”三个问题推进。' },
  { title: '讲评反馈建议', desc: '优先讲评切换成功率未达标、重建次数异常和短掉线日志漏读。' },
  { title: '专业复核建议', desc: '阈值、指标口径和验收结论需由通信专业教师或行业专家复核。' }
];

export const classroomTasks = [
  '判断投诉发生在静止点还是移动路径？',
  '标注一个未闭环依据，并说明证据来源。',
  '写一句边界结论，说明为什么还会断。'
];

export const projectTaskMap: Record<string, { id: string; title: string; desc: string; status: string }[]> = {
  P1: [
    { id: 'P1-T1', title: '室内环境信息采集', desc: '采集室内覆盖、设备和业务场景信息。', status: '课程任务' },
    { id: 'P1-T2', title: '室外环境信息采集', desc: '整理室外站点、道路和场景边界信息。', status: '课程任务' },
    { id: 'P1-T3', title: '投诉信息采集', desc: '将用户投诉转化为可验证的问题线索。', status: '课程任务' }
  ],
  P2: [
    { id: 'P2-T1', title: 'DT/CQT测试准备和执行', desc: '准备设备软件并执行路测与定点测试。', status: '证据输入' },
    { id: 'P2-T2', title: '5G网络测试问题处理', desc: '处理测试中断、定位异常和数据不可用问题。', status: '条件任务' },
    { id: 'P2-T3', title: '5G网络测试数据分析', desc: '形成覆盖、SINR、切换事件等分析结果。', status: '关键前置' }
  ],
  P3: [
    { id: 'P3-T1', title: '网管架构识别', desc: '理解网络信息管理对象与系统结构。', status: '课程任务' },
    { id: 'P3-T2', title: '运行状态监控', desc: '识别告警、状态和性能监控入口。', status: '课程任务' },
    { id: 'P3-T3', title: '参数检查与设置', desc: '检查关键参数并形成管理记录。', status: '课程任务' }
  ],
  P5: [
    { id: 'P5-T1', title: '性能问题归因', desc: '定位性能瓶颈与容量风险。', status: '后续节点' },
    { id: 'P5-T2', title: '全网性能提升方案', desc: '组合多维指标形成提升策略。', status: '后续节点' },
    { id: 'P5-T3', title: '提升效果评估', desc: '评估全网性能提升结果。', status: '后续节点' }
  ],
  P6: [
    { id: 'P6-T1', title: '信令流程识别', desc: '识别注册、切换、会话等关键信令流程。', status: '后续节点' },
    { id: 'P6-T2', title: '异常信令分析', desc: '从信令交互中定位异常原因。', status: '后续节点' },
    { id: 'P6-T3', title: '信令分析报告', desc: '形成可复核的信令分析结论。', status: '后续节点' }
  ]
};
