export type ViewKey = 'course' | 'project' | 'task' | 'graph' | 'teacher' | 'game';

export const courseStats = [
  { label: '课程项目', value: '6', note: '覆盖5G网优完整工作链' },
  { label: '学习任务', value: '18', note: '按项目任务组织学习' },
  { label: '重点路径', value: '2', note: '网络测试到优化验证' },
  { label: '完整任务', value: 'P4-T2', note: '结果验证闭环样章' }
];

export const projects = [
  { id: 'P1', title: '5G网络信息采集', status: '已完成', note: '信息采集 · 结构占位' },
  { id: 'P2', title: '5G网络测试', status: '已接入闭环', note: '测试数据 · 证据输入' },
  { id: 'P3', title: '5G网络信息管理', status: '已完成', note: '信息管理 · 结构占位' },
  { id: 'P4', title: '5G端到端网络优化', status: '进行中', note: '优化实施与结果验证' },
  { id: 'P5', title: '5G全网性能提升', status: '待学习', note: '性能提升 · 后续节点' },
  { id: 'P6', title: '5G信令分析', status: '待学习', note: '信令分析 · 后续节点' }
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
  { id: 'CG-01', title: '信息采集' },
  { id: 'CG-02', title: '网络测试' },
  { id: 'CG-03', title: '信息管理' },
  { id: 'CG-04', title: '优化实施' },
  { id: 'CG-05', title: '结果验证', active: true },
  { id: 'CG-06', title: '性能提升' },
  { id: 'CG-07', title: '信令分析' }
];

export const resourceCards = [
  { title: 'N04 学生自学页', desc: '图文讲解 · 步骤演示' },
  { title: 'N04 教师授课页', desc: '教学课件 · 重点提示' },
  { title: 'N04 投屏页', desc: '课堂投屏 · 关键步骤' },
  { title: '移动性指标表', desc: '参数说明 · 参考阈值' },
  { title: '路线示意图', desc: '移动轨迹 · 典型路径' }
];

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
