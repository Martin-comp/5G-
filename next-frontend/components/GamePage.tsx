'use client';

import { useEffect, useRef, useState } from 'react';
import { textbookApi, type AIChatMessage, type AIHintResult } from '@/lib/api';
import type { Navigate } from './types';

type StageStep = 'locate' | 'evidence' | 'conclusion';
type JudgementState = 'idle' | 'correct' | 'wrong';
type GameNode = { id: string; label: string; x: number; y: number; note: string; risk: boolean; diagnosis: string; action: string };
type EvidenceCard = { id: string; label: string; correct: boolean; detail: string };
type DeckCard = {
  id: string;
  title: string;
  kind: '路径卡' | '证据卡' | '干扰卡' | '结论卡';
  cost: number;
  power: number;
  detail: string;
  combo: string;
  nodeId?: string;
  evidenceId?: string;
};
type LearningCard = {
  id: string;
  title: string;
  category: string;
  detail: string;
};
type DeckQuestion = {
  id: string;
  title: string;
  prompt: string;
  answerIds: string[];
  explanation: string;
};
type ProjectDeck = {
  theme: string;
  cards: LearningCard[];
  questions: DeckQuestion[];
};
type ProjectGame = {
  projectId: string;
  taskId: string;
  type: string;
  title: string;
  intro: string;
  correctNodeIds: string[];
  requiredEvidenceCount: number;
  nodes: GameNode[];
  evidence: EvidenceCard[];
  successText: string;
  starterQuestions: string[];
};

const projectGames: Record<string, ProjectGame> = {
  P1: {
    projectId: 'P1',
    taskId: 'P1-T3',
    type: 'Deck-building 线索构筑',
    title: '投诉线索采集卡牌闯关',
    intro: '通过时间、位置、业务现象等线索卡，把模糊投诉构筑成可复现、可测试的问题输入。',
    correctNodeIds: ['complaint'],
    requiredEvidenceCount: 2,
    successText: '构筑成功：时间 + 位置 + 业务现象 + 频次 + 用户原话，形成可复现的投诉线索链。',
    starterQuestions: ['投诉信息为什么要先问时间和位置？', '哪些线索能交给 P2 做测试任务？'],
    nodes: [
      { id: 'scene', label: '场景', x: 0.14, y: 0.52, note: '食堂/楼层', risk: false, diagnosis: '场景能帮助定位范围，但还不足以形成可验证问题。', action: '继续采集投诉发生的时间、位置和业务现象。' },
      { id: 'complaint', label: '投诉', x: 0.38, y: 0.42, note: '卡顿描述', risk: true, diagnosis: '投诉原话是问题入口，需要转成时间、位置、业务、终端等结构化线索。', action: '选择投诉时间和业务现象作为关键证据。' },
      { id: 'terminal', label: '终端', x: 0.64, y: 0.56, note: '机型/套餐', risk: false, diagnosis: '终端信息用于排除个体设备问题，但不是本题主线索。', action: '作为补充信息，不能替代投诉结构化记录。' },
      { id: 'archive', label: '归档', x: 0.86, y: 0.47, note: '记录入库', risk: false, diagnosis: '归档是后续动作，必须先保证采集信息完整。', action: '回到投诉节点补齐可验证字段。' }
    ],
    evidence: [
      { id: 'time', label: '投诉发生时间', correct: true, detail: '用于和测试日志、业务峰值进行对齐。' },
      { id: 'business', label: '视频会议卡顿现象', correct: true, detail: '业务现象能转化为速率、时延或掉线验证目标。' },
      { id: 'weather', label: '当天气温', correct: false, detail: '与室内5G投诉验证关系弱。' },
      { id: 'nickname', label: '用户昵称', correct: false, detail: '不能支撑网络验证。' }
    ]
  },
  P2: {
    projectId: 'P2',
    taskId: 'P2-T3',
    type: 'Deck-building 测试证据构筑',
    title: 'DT/CQT测试数据卡牌闯关',
    intro: '通过轨迹、采样、指标和原始日志卡，构筑可交付给后续优化验证的数据证据链。',
    correctNodeIds: ['route', 'sample'],
    requiredEvidenceCount: 2,
    successText: '构筑成功：测试轨迹 + 采样完整率 + 原始日志 + 终端状态 + 点位地图，证明数据可靠。',
    starterQuestions: ['为什么测试轨迹比单个截图更重要？', '哪些测试材料适合交给 P4 做结果验证？'],
    nodes: [
      { id: 'prepare', label: '准备', x: 0.12, y: 0.52, note: '设备校准', risk: false, diagnosis: '准备阶段影响测试基础，但当前空洞更可能出现在采集路线中。', action: '继续查看路线轨迹和采样点。' },
      { id: 'route', label: '路线', x: 0.36, y: 0.43, note: '轨迹断点', risk: true, diagnosis: '路线轨迹断点会造成数据空洞，是判断测试有效性的关键位置。', action: '选择轨迹连续性和采样完整率。' },
      { id: 'sample', label: '采样', x: 0.62, y: 0.57, note: '点位缺失', risk: true, diagnosis: '采样点缺失会影响后续覆盖、SINR和切换判断。', action: '补充异常点截图或原始log。' },
      { id: 'report', label: '报告', x: 0.85, y: 0.48, note: '输出图表', risk: false, diagnosis: '报告是结果，不能直接证明数据采集是否可靠。', action: '先回到测试过程复核证据。' }
    ],
    evidence: [
      { id: 'track', label: '测试轨迹连续性', correct: true, detail: '能证明路线是否真实覆盖投诉区域。' },
      { id: 'sampling', label: '采样完整率', correct: true, detail: '能判断数据空洞是否影响分析可靠性。' },
      { id: 'template', label: '报告模板颜色', correct: false, detail: '不影响测试数据有效性。' },
      { id: 'cover', label: '封面标题', correct: false, detail: '不是测试证据。' }
    ]
  },
  P3: {
    projectId: 'P3',
    taskId: 'P3-T3',
    type: 'Deck-building 网管证据构筑',
    title: '网管信息管理卡牌闯关',
    intro: '通过对象、告警、参数、变更和阈值卡，构筑能支撑巡检判断的网管证据链。',
    correctNodeIds: ['alarm', 'parameter'],
    requiredEvidenceCount: 2,
    successText: '构筑成功：小区对象 + 当前告警 + 关键参数 + 变更记录 + 时间对齐，形成异常来源链。',
    starterQuestions: ['告警和参数为什么要一起看？', '邻区关系为什么会影响移动性体验？'],
    nodes: [
      { id: 'cell', label: '小区', x: 0.13, y: 0.54, note: '对象识别', risk: false, diagnosis: '小区对象是入口，但不能单独说明异常原因。', action: '继续查看告警和参数状态。' },
      { id: 'alarm', label: '告警', x: 0.38, y: 0.42, note: '状态异常', risk: true, diagnosis: '告警能直接指向运行异常，是网管巡检的优先节点。', action: '选择当前告警和发生时间。' },
      { id: 'parameter', label: '参数', x: 0.63, y: 0.56, note: '配置变更', risk: true, diagnosis: '参数变更可能导致覆盖、切换或接入异常，需要和告警交叉验证。', action: '选择关键参数变更记录。' },
      { id: 'export', label: '导出', x: 0.86, y: 0.47, note: '表格输出', risk: false, diagnosis: '导出只是整理动作，不能替代异常判断。', action: '先确认告警和参数。' }
    ],
    evidence: [
      { id: 'alarm-log', label: '当前告警记录', correct: true, detail: '直接说明运行状态异常。' },
      { id: 'param-change', label: '关键参数变更', correct: true, detail: '用于解释异常是否由配置引起。' },
      { id: 'icon', label: '系统图标样式', correct: false, detail: '不属于网络管理证据。' },
      { id: 'operator', label: '操作员头像', correct: false, detail: '不能证明网络异常。' }
    ]
  },
  P4: {
    projectId: 'P4',
    taskId: 'P4T2-N04',
    type: 'Deck-building 证据构筑',
    title: '移动性指标卡牌闯关',
    intro: '通过抽取路径卡、证据卡与结论卡，组合出“覆盖改善但移动性未闭环”的判断链。',
    correctNodeIds: ['boundary', 'canteen'],
    requiredEvidenceCount: 3,
    successText: '构筑成功：A-B边界定位 + 切换成功率 + 重建次数 + 短掉线日志，形成移动性未闭环的证据链。',
    starterQuestions: ['本节里覆盖达标了，为什么还会断？', '切换成功率和重建次数怎么配合判断？'],
    nodes: [
      { id: 'elevator', label: '电梯口', x: 0.13, y: 0.54, note: '投诉起点，信号波动', risk: false, diagnosis: '这里是投诉起点，适合观察现象，但不是判断移动性未闭环的主要故障点。', action: '继续沿路径查看 A-B边界 的切换事件。' },
      { id: 'boundary', label: 'A-B边界', x: 0.38, y: 0.42, note: '切换事件集中', risk: true, diagnosis: '这里发生小区切换，最容易暴露切换成功率不足和重建异常，是优先判断点。', action: '建议选择“切换成功率”和“10次往返重建”作为核心证据。' },
      { id: 'canteen', label: '食堂入口', x: 0.63, y: 0.56, note: '短时中断', risk: true, diagnosis: '这里靠近短时中断现象，适合用短掉线日志验证移动路径上的业务中断。', action: '建议补充“短掉线日志”，并回看前一段切换质量。' },
      { id: 'dining', label: '就餐区', x: 0.86, y: 0.47, note: '业务恢复', risk: false, diagnosis: '这里业务已经恢复，更适合做结果对照，不适合作为主要故障根因点。', action: '返回边界或食堂入口，定位中断发生前后的关键证据。' }
    ],
    evidence: [
      { id: 'handover', label: '切换成功率 94.5%', correct: true, detail: '低于目标 98%，说明边界切换质量不足。' },
      { id: 'rebuild', label: '10次往返重建 4次', correct: true, detail: '重建次数偏多，指向移动性未闭环。' },
      { id: 'drop', label: '短掉线日志 1段', correct: true, detail: '日志需要复核，用于定位短时中断。' },
      { id: 'coverage', label: '覆盖率 97.5%', correct: false, detail: '覆盖已达标，不是本关的主要矛盾。' }
    ]
  },
  P5: {
    projectId: 'P5',
    taskId: 'P5-T1',
    type: 'Deck-building 性能瓶颈构筑',
    title: '全网性能提升卡牌闯关',
    intro: '通过忙小区、PRB、速率、时延和优化方案卡，构筑容量瓶颈与体验下降的判断链。',
    correctNodeIds: ['busy-cell', 'capacity'],
    requiredEvidenceCount: 2,
    successText: '构筑成功：忙小区 + PRB利用率 + 用户峰值 + 体验指标 + 优化方案，支撑性能提升建议。',
    starterQuestions: ['忙小区为什么会影响全网体验？', '容量瓶颈和覆盖问题怎么区分？'],
    nodes: [
      { id: 'overview', label: '总览', x: 0.12, y: 0.52, note: 'KPI下降', risk: false, diagnosis: '总览能发现问题，但不能定位瓶颈。', action: '继续下钻到忙小区和容量维度。' },
      { id: 'busy-cell', label: '忙小区', x: 0.38, y: 0.42, note: '负载高', risk: true, diagnosis: '忙小区是性能瓶颈的典型入口，会影响速率和时延。', action: '选择PRB利用率和用户数峰值。' },
      { id: 'capacity', label: '容量', x: 0.63, y: 0.56, note: '资源受限', risk: true, diagnosis: '容量受限会导致吞吐下降，是全网性能提升的核心诊断点。', action: '结合下行速率和PRB利用率判断。' },
      { id: 'summary', label: '汇总', x: 0.86, y: 0.47, note: '输出建议', risk: false, diagnosis: '汇总应建立在瓶颈证据之后。', action: '先补齐容量和体验证据。' }
    ],
    evidence: [
      { id: 'prb', label: 'PRB利用率 92%', correct: true, detail: '说明无线资源紧张。' },
      { id: 'throughput', label: '下行速率下降', correct: true, detail: '说明用户体验受到影响。' },
      { id: 'logo', label: '运营商品牌色', correct: false, detail: '不是性能瓶颈证据。' },
      { id: 'meeting', label: '会议纪要标题', correct: false, detail: '不能证明容量受限。' }
    ]
  },
  P6: {
    projectId: 'P6',
    taskId: 'P6-T2',
    type: 'Deck-building 信令链路构筑',
    title: '信令分析卡牌闯关',
    intro: '通过注册、会话、拒绝、重传和消息序列卡，构筑业务会话失败的信令分析链。',
    correctNodeIds: ['session', 'reject'],
    requiredEvidenceCount: 2,
    successText: '构筑成功：PDU会话 + 拒绝原因码 + 重传记录 + 消息序列 + 核心网响应，定位信令失败。',
    starterQuestions: ['信令原因码为什么关键？', '消息序列为什么比单条消息更可靠？'],
    nodes: [
      { id: 'register', label: '注册', x: 0.13, y: 0.54, note: '接入网络', risk: false, diagnosis: '注册成功只说明终端能入网，不一定解释会话失败。', action: '继续检查PDU会话建立阶段。' },
      { id: 'session', label: '会话', x: 0.38, y: 0.42, note: '建立失败', risk: true, diagnosis: 'PDU会话建立失败直接对应业务不可用，是优先定位阶段。', action: '选择拒绝原因码和重传记录。' },
      { id: 'reject', label: '拒绝', x: 0.63, y: 0.56, note: '原因码', risk: true, diagnosis: '拒绝原因码能解释失败类型，是信令分析最关键的证据之一。', action: '结合上下文消息序列判断。' },
      { id: 'release', label: '释放', x: 0.86, y: 0.47, note: '流程结束', risk: false, diagnosis: '释放是结果动作，不能单独解释失败来源。', action: '回看会话建立和拒绝原因。' }
    ],
    evidence: [
      { id: 'cause', label: '拒绝原因码', correct: true, detail: '用于判断失败类型和网络侧原因。' },
      { id: 'retry', label: '信令重传记录', correct: true, detail: '说明交互过程存在异常。' },
      { id: 'phone', label: '手机壁纸', correct: false, detail: '与信令失败无关。' },
      { id: 'font', label: '报告字体', correct: false, detail: '不是信令证据。' }
    ]
  }
};

const p4DeckCards: DeckCard[] = [
  {
    id: 'route-boundary',
    title: 'A-B边界定位',
    kind: '路径卡',
    cost: 1,
    power: 20,
    detail: '切换事件集中，是移动性判断的优先位置。',
    combo: '开启“边界切换”连锁',
    nodeId: 'boundary'
  },
  {
    id: 'handover-card',
    title: '切换成功率 94.5%',
    kind: '证据卡',
    cost: 2,
    power: 28,
    detail: '低于目标 98%，说明切换质量不足。',
    combo: '与重建次数连锁',
    evidenceId: 'handover'
  },
  {
    id: 'rebuild-card',
    title: '10次往返重建 4次',
    kind: '证据卡',
    cost: 2,
    power: 26,
    detail: '重建偏多，指向移动路径不稳定。',
    combo: '与短掉线日志连锁',
    evidenceId: 'rebuild'
  },
  {
    id: 'drop-card',
    title: '短掉线日志 1段',
    kind: '证据卡',
    cost: 1,
    power: 22,
    detail: '用于确认业务短时中断发生在移动路径上。',
    combo: '闭合“体验中断”链路',
    evidenceId: 'drop'
  },
  {
    id: 'coverage-card',
    title: '覆盖率 97.5%',
    kind: '干扰卡',
    cost: 1,
    power: -18,
    detail: '覆盖已经达标，不能单独解释移动中断。',
    combo: '会打断移动性闭环',
    evidenceId: 'coverage'
  },
  {
    id: 'conclusion-card',
    title: '移动性未闭环',
    kind: '结论卡',
    cost: 3,
    power: 34,
    detail: '只有在路径与三项证据齐备时才成立。',
    combo: '终局卡：输出讲评'
  }
];

const projectDecks: Record<string, ProjectDeck> = {
  P1: {
    theme: '投诉线索采集',
    cards: [
      { id: 'p1-time', title: '发生时间', category: '线索', detail: '记录投诉出现的具体时间段，用于和日志、话务峰值对齐。' },
      { id: 'p1-place', title: '发生位置', category: '线索', detail: '明确楼层、区域和移动路径，缩小验证范围。' },
      { id: 'p1-service', title: '业务现象', category: '线索', detail: '描述视频卡顿、掉线、速率慢等用户感知。' },
      { id: 'p1-terminal', title: '终端信息', category: '补充', detail: '记录机型、卡槽、网络制式，用于排除个体问题。' },
      { id: 'p1-frequency', title: '发生频次', category: '线索', detail: '判断问题是偶发还是稳定复现。' },
      { id: 'p1-userquote', title: '用户原话', category: '材料', detail: '保留投诉原始描述，便于转译为验证目标。' },
      { id: 'p1-weather', title: '天气记录', category: '背景', detail: '可能作为外部背景，但不直接证明室内网络问题。' },
      { id: 'p1-photo', title: '现场照片', category: '材料', detail: '帮助识别场景遮挡、楼层结构和测试点位。' },
      { id: 'p1-history', title: '历史投诉', category: '对照', detail: '判断该区域是否长期存在类似问题。' },
      { id: 'p1-owner', title: '处理人姓名', category: '流程', detail: '用于工单流转，不直接支撑技术判断。' },
      { id: 'p1-priority', title: '投诉优先级', category: '流程', detail: '影响处理顺序，但不是网络验证证据。' },
      { id: 'p1-template', title: '记录模板', category: '流程', detail: '保证信息完整，但本身不是问题证据。' }
    ],
    questions: [
      { id: 'p1-q1', title: '把“食堂视频卡”转成可验证问题', prompt: '要让后续测试能复现投诉，应该优先保留哪些线索？', answerIds: ['p1-time', 'p1-place', 'p1-service', 'p1-frequency', 'p1-userquote'], explanation: '时间、位置、业务现象、发生频次和用户原话能把模糊投诉变成可复现问题。' },
      { id: 'p1-q2', title: '定位投诉区域', prompt: '要缩小排查范围，哪些材料最有帮助？', answerIds: ['p1-place', 'p1-photo', 'p1-history', 'p1-time', 'p1-service'], explanation: '位置、现场照片、历史投诉、时间和业务现象共同限定测试范围。' },
      { id: 'p1-q3', title: '排除个体终端问题', prompt: '判断是否可能是单个用户设备问题，应该选哪些牌？', answerIds: ['p1-terminal', 'p1-history', 'p1-frequency', 'p1-service', 'p1-time'], explanation: '终端信息结合历史、频次、业务和时间，可以判断是否为个体异常。' },
      { id: 'p1-q4', title: '形成测试任务输入', prompt: '给 P2 测试环节提供输入，哪些牌最关键？', answerIds: ['p1-time', 'p1-place', 'p1-service', 'p1-photo', 'p1-userquote'], explanation: '测试需要明确时间、地点、业务、现场和原始诉求。' },
      { id: 'p1-q5', title: '判断投诉是否稳定复现', prompt: '要判断问题是否稳定复现，应该选择哪些信息？', answerIds: ['p1-frequency', 'p1-time', 'p1-place', 'p1-history', 'p1-service'], explanation: '频次、时间、位置、历史和业务现象能支持复现判断。' }
    ]
  },
  P2: {
    theme: '网络测试验证',
    cards: [
      { id: 'p2-track', title: '测试轨迹', category: '采集', detail: '确认测试路线是否覆盖投诉区域。' },
      { id: 'p2-sample', title: '采样完整率', category: '采集', detail: '判断数据是否存在空洞或缺口。' },
      { id: 'p2-rsrp', title: 'RSRP 数据', category: '指标', detail: '反映参考信号接收功率。' },
      { id: 'p2-sinr', title: 'SINR 数据', category: '指标', detail: '反映信号质量和干扰情况。' },
      { id: 'p2-throughput', title: '吞吐速率', category: '体验', detail: '反映数据业务体验。' },
      { id: 'p2-log', title: '原始日志', category: '证据', detail: '用于复核异常事件和时间点。' },
      { id: 'p2-device', title: '测试终端状态', category: '采集', detail: '确认终端、卡和软件状态正常。' },
      { id: 'p2-map', title: '点位地图', category: '场景', detail: '将测试点与区域位置对应。' },
      { id: 'p2-template', title: '报告模板', category: '流程', detail: '规范输出格式，但不是测试有效性证据。' },
      { id: 'p2-cover', title: '封面信息', category: '流程', detail: '便于归档，不证明测试质量。' },
      { id: 'p2-weather', title: '天气背景', category: '背景', detail: '多数室内 CQT 场景不是核心证据。' },
      { id: 'p2-owner', title: '测试人员', category: '流程', detail: '用于责任追踪，不直接说明网络状态。' }
    ],
    questions: [
      { id: 'p2-q1', title: '判断测试数据是否可靠', prompt: '哪些牌能证明测试数据本身可靠？', answerIds: ['p2-track', 'p2-sample', 'p2-log', 'p2-device', 'p2-map'], explanation: '轨迹、采样、日志、终端和地图能证明采集过程可靠。' },
      { id: 'p2-q2', title: '识别覆盖问题', prompt: '如果要判断覆盖是否异常，应选哪些牌？', answerIds: ['p2-track', 'p2-rsrp', 'p2-sinr', 'p2-map', 'p2-log'], explanation: '覆盖判断需要轨迹、RSRP、SINR、点位地图和日志交叉验证。' },
      { id: 'p2-q3', title: '验证业务体验下降', prompt: '判断业务体验是否变差，哪些牌更关键？', answerIds: ['p2-throughput', 'p2-sinr', 'p2-log', 'p2-track', 'p2-sample'], explanation: '速率、质量、日志、轨迹和采样共同支撑体验判断。' },
      { id: 'p2-q4', title: '复核异常点', prompt: '发现异常点后，哪些牌能帮助复核？', answerIds: ['p2-log', 'p2-map', 'p2-track', 'p2-device', 'p2-sample'], explanation: '异常复核要看日志、点位、轨迹、设备和采样完整性。' },
      { id: 'p2-q5', title: '给优化验证提供输入', prompt: '哪些测试材料最适合交给 P4 做结果验证？', answerIds: ['p2-rsrp', 'p2-sinr', 'p2-throughput', 'p2-log', 'p2-track'], explanation: '结果验证需要关键指标、日志和路径数据。' }
    ]
  },
  P3: {
    theme: '网管信息管理',
    cards: [
      { id: 'p3-cell', title: '小区对象', category: '对象', detail: '明确要巡检的小区和扇区。' },
      { id: 'p3-alarm', title: '当前告警', category: '状态', detail: '反映运行中的异常状态。' },
      { id: 'p3-param', title: '关键参数', category: '配置', detail: '用于判断配置是否影响业务。' },
      { id: 'p3-change', title: '参数变更记录', category: '配置', detail: '追溯近期调整和异常的关系。' },
      { id: 'p3-neighbor', title: '邻区关系', category: '配置', detail: '影响切换和移动性体验。' },
      { id: 'p3-kpi', title: 'KPI 趋势', category: '指标', detail: '判断问题是否持续存在。' },
      { id: 'p3-export', title: '导出表格', category: '流程', detail: '整理材料，不等于异常证据。' },
      { id: 'p3-user', title: '操作账号', category: '流程', detail: '用于审计，不直接说明网络异常。' },
      { id: 'p3-time', title: '告警时间', category: '状态', detail: '用于和投诉、测试时间对齐。' },
      { id: 'p3-version', title: '网管版本', category: '背景', detail: '平台背景信息，通常不是本题核心。' },
      { id: 'p3-location', title: '站点位置', category: '对象', detail: '辅助判断影响范围。' },
      { id: 'p3-threshold', title: '阈值配置', category: '规则', detail: '用于判断告警和指标是否达标。' }
    ],
    questions: [
      { id: 'p3-q1', title: '判断网管异常来源', prompt: '哪些牌最能说明异常来源？', answerIds: ['p3-cell', 'p3-alarm', 'p3-param', 'p3-change', 'p3-time'], explanation: '对象、告警、参数、变更和时间能形成异常来源链。' },
      { id: 'p3-q2', title: '排查切换类问题', prompt: '若怀疑切换异常，应优先看哪些网管信息？', answerIds: ['p3-neighbor', 'p3-param', 'p3-change', 'p3-kpi', 'p3-cell'], explanation: '切换问题重点看邻区、参数、变更、KPI 和对象。' },
      { id: 'p3-q3', title: '复盘配置变更影响', prompt: '判断近期配置是否引发问题，需要哪些牌？', answerIds: ['p3-change', 'p3-param', 'p3-time', 'p3-kpi', 'p3-alarm'], explanation: '变更、参数、时间、KPI 和告警能支撑变更影响判断。' },
      { id: 'p3-q4', title: '确认影响范围', prompt: '要判断问题影响哪些区域，应选哪些牌？', answerIds: ['p3-cell', 'p3-location', 'p3-kpi', 'p3-alarm', 'p3-threshold'], explanation: '对象、位置、KPI、告警和阈值可判断影响范围。' },
      { id: 'p3-q5', title: '形成巡检结论', prompt: '输出巡检结论时，哪些牌最有支撑力？', answerIds: ['p3-alarm', 'p3-param', 'p3-change', 'p3-kpi', 'p3-threshold'], explanation: '告警、参数、变更、KPI 和阈值构成巡检结论依据。' }
    ]
  },
  P4: {
    theme: '结果验证与移动性闭环',
    cards: [
      { id: 'p4-boundary', title: 'A-B边界', category: '路径', detail: '切换事件集中，适合定位移动中断。' },
      { id: 'p4-handover', title: '切换成功率', category: '指标', detail: '低于目标时说明切换质量不足。' },
      { id: 'p4-rebuild', title: '重建次数', category: '指标', detail: '重建偏多说明连接稳定性不足。' },
      { id: 'p4-drop', title: '短掉线日志', category: '日志', detail: '验证移动路径上的短时业务中断。' },
      { id: 'p4-conclusion', title: '移动性未闭环', category: '结论', detail: '用于表达覆盖改善但移动体验仍未稳定。' },
      { id: 'p4-coverage', title: '覆盖率达标', category: '指标', detail: '说明覆盖改善，但不能单独解释移动中断。' },
      { id: 'p4-rsrp', title: 'RSRP 改善', category: '覆盖', detail: '证明静态覆盖改善。' },
      { id: 'p4-sinr', title: 'SINR 改善', category: '覆盖', detail: '证明信号质量改善。' },
      { id: 'p4-static', title: '静态验收通过', category: '验收', detail: '说明静止点体验较好。' },
      { id: 'p4-terminal', title: '终端型号正常', category: '排除', detail: '排除单终端异常。' },
      { id: 'p4-report', title: '报告封面', category: '流程', detail: '归档信息，不是技术证据。' },
      { id: 'p4-owner', title: '任务负责人', category: '流程', detail: '用于协同，不直接证明问题。' }
    ],
    questions: [
      { id: 'p4-q1', title: '覆盖达标后为什么移动中仍会断？', prompt: '请选择能证明“移动性未闭环”的 5 张关键牌。', answerIds: ['p4-boundary', 'p4-handover', 'p4-rebuild', 'p4-drop', 'p4-conclusion'], explanation: '边界定位加三项移动性证据，最终形成移动性未闭环结论。' },
      { id: 'p4-q2', title: '判断切换失败风险', prompt: '要说明问题集中在切换过程，应选哪些牌？', answerIds: ['p4-boundary', 'p4-handover', 'p4-rebuild', 'p4-drop', 'p4-terminal'], explanation: '边界、切换、重建、掉线和终端排除能证明切换风险。' },
      { id: 'p4-q3', title: '区分覆盖改善与体验改善', prompt: '要说明“覆盖好不等于体验稳定”，应选哪些牌？', answerIds: ['p4-coverage', 'p4-rsrp', 'p4-handover', 'p4-rebuild', 'p4-conclusion'], explanation: '覆盖相关牌与移动性异常牌对照，能说明二者不是同一件事。' },
      { id: 'p4-q4', title: '定位短时中断证据', prompt: '要证明移动路径上确实发生短时中断，应选哪些牌？', answerIds: ['p4-boundary', 'p4-drop', 'p4-handover', 'p4-rebuild', 'p4-static'], explanation: '路径、日志、切换、重建和静态对照能定位短时中断。' },
      { id: 'p4-q5', title: '形成验收结论', prompt: '要写出完整验收结论，哪些牌最关键？', answerIds: ['p4-coverage', 'p4-handover', 'p4-rebuild', 'p4-drop', 'p4-conclusion'], explanation: '验收结论需要同时交代覆盖改善和移动性未闭环。' }
    ]
  },
  P5: {
    theme: '全网性能提升',
    cards: [
      { id: 'p5-busy', title: '忙小区', category: '对象', detail: '负载高、体验下降的重点分析对象。' },
      { id: 'p5-prb', title: 'PRB 利用率', category: '容量', detail: '衡量无线资源占用情况。' },
      { id: 'p5-throughput', title: '下行速率', category: '体验', detail: '反映用户数据体验。' },
      { id: 'p5-users', title: '用户数峰值', category: '负载', detail: '说明容量压力来源。' },
      { id: 'p5-latency', title: '时延指标', category: '体验', detail: '影响业务响应和交互。' },
      { id: 'p5-backhaul', title: '传输链路', category: '资源', detail: '可能造成端到端瓶颈。' },
      { id: 'p5-cover', title: '覆盖指标', category: '覆盖', detail: '辅助判断弱覆盖是否导致体验差。' },
      { id: 'p5-interfere', title: '干扰水平', category: '质量', detail: '干扰高会影响速率和稳定性。' },
      { id: 'p5-plan', title: '扩容方案', category: '优化', detail: '用于解决容量瓶颈。' },
      { id: 'p5-logo', title: '品牌标识', category: '展示', detail: '展示元素，不是性能证据。' },
      { id: 'p5-meeting', title: '会议标题', category: '流程', detail: '协同信息，不证明瓶颈。' },
      { id: 'p5-owner', title: '责任人', category: '流程', detail: '用于派单，不是性能指标。' }
    ],
    questions: [
      { id: 'p5-q1', title: '判断容量瓶颈', prompt: '哪些牌能证明性能问题来自容量不足？', answerIds: ['p5-busy', 'p5-prb', 'p5-users', 'p5-throughput', 'p5-plan'], explanation: '忙小区、PRB、用户峰值、速率和扩容方案能支撑容量瓶颈判断。' },
      { id: 'p5-q2', title: '判断体验下降', prompt: '要说明用户体验下降，应选哪些牌？', answerIds: ['p5-throughput', 'p5-latency', 'p5-interfere', 'p5-prb', 'p5-busy'], explanation: '速率、时延、干扰、资源和忙小区共同说明体验下降。' },
      { id: 'p5-q3', title: '区分覆盖与容量问题', prompt: '如何区分覆盖问题和容量问题？', answerIds: ['p5-cover', 'p5-prb', 'p5-users', 'p5-throughput', 'p5-interfere'], explanation: '覆盖、资源、用户、速率和干扰可用于区分问题类型。' },
      { id: 'p5-q4', title: '判断传输瓶颈', prompt: '若怀疑端到端瓶颈，应选哪些牌？', answerIds: ['p5-backhaul', 'p5-throughput', 'p5-latency', 'p5-busy', 'p5-prb'], explanation: '传输、速率、时延、忙小区和资源一起判断端到端瓶颈。' },
      { id: 'p5-q5', title: '提出性能优化建议', prompt: '要形成优化建议，哪些牌最关键？', answerIds: ['p5-busy', 'p5-prb', 'p5-users', 'p5-interfere', 'p5-plan'], explanation: '对象、资源、负载、干扰和方案构成优化建议依据。' }
    ]
  },
  P6: {
    theme: '信令分析',
    cards: [
      { id: 'p6-register', title: '注册流程', category: '流程', detail: '判断终端是否正常入网。' },
      { id: 'p6-session', title: 'PDU 会话', category: '流程', detail: '判断业务承载是否建立。' },
      { id: 'p6-reject', title: '拒绝原因码', category: '原因', detail: '解释网络侧拒绝的具体类型。' },
      { id: 'p6-retry', title: '重传记录', category: '异常', detail: '说明交互过程可能失败或不稳定。' },
      { id: 'p6-release', title: '释放消息', category: '流程', detail: '说明连接被释放的阶段。' },
      { id: 'p6-timer', title: '定时器超时', category: '异常', detail: '可能指向流程等待失败。' },
      { id: 'p6-sequence', title: '消息序列', category: '证据', detail: '用于还原信令发生顺序。' },
      { id: 'p6-terminal', title: '终端能力', category: '排除', detail: '判断终端是否支持相关能力。' },
      { id: 'p6-core', title: '核心网响应', category: '网络', detail: '判断网络侧响应是否正常。' },
      { id: 'p6-wallpaper', title: '手机壁纸', category: '背景', detail: '与信令流程无关。' },
      { id: 'p6-font', title: '报告字体', category: '展示', detail: '展示格式，不是信令证据。' },
      { id: 'p6-owner', title: '分析人员', category: '流程', detail: '用于协作，不说明失败原因。' }
    ],
    questions: [
      { id: 'p6-q1', title: '定位会话建立失败', prompt: '哪些牌能说明业务会话建立失败？', answerIds: ['p6-session', 'p6-reject', 'p6-retry', 'p6-sequence', 'p6-core'], explanation: '会话、拒绝、重传、序列和核心网响应能定位会话失败。' },
      { id: 'p6-q2', title: '判断注册是否正常', prompt: '要判断终端是否正常入网，应选哪些牌？', answerIds: ['p6-register', 'p6-sequence', 'p6-terminal', 'p6-core', 'p6-timer'], explanation: '注册、序列、终端、核心网和定时器能判断入网过程。' },
      { id: 'p6-q3', title: '分析拒绝原因', prompt: '若要解释被拒绝的原因，应选哪些牌？', answerIds: ['p6-reject', 'p6-session', 'p6-core', 'p6-sequence', 'p6-terminal'], explanation: '原因码必须结合会话、核心网、序列和终端能力。' },
      { id: 'p6-q4', title: '判断流程超时', prompt: '要说明流程可能超时，应选哪些牌？', answerIds: ['p6-timer', 'p6-retry', 'p6-sequence', 'p6-core', 'p6-session'], explanation: '定时器、重传、序列、核心网和会话共同说明超时。' },
      { id: 'p6-q5', title: '形成信令分析结论', prompt: '输出信令结论时，哪些牌最关键？', answerIds: ['p6-sequence', 'p6-reject', 'p6-retry', 'p6-session', 'p6-release'], explanation: '消息序列、拒绝、重传、会话和释放构成完整信令结论。' }
    ]
  }
};

const openMaicUrl = process.env.NEXT_PUBLIC_OPENMAIC_URL || '';

function isChineseVoice(voice: SpeechSynthesisVoice) {
  return /^(zh|cmn|yue)/i.test(voice.lang)
    || /chinese|mandarin|普通话|中文|国语/i.test(voice.name);
}

function isChineseMaleVoice(voice: SpeechSynthesisVoice) {
  return isChineseVoice(voice)
    && /male|男|yunxi|yunjian|yunyang|kangkang|xiaobei|xiaoyi/i.test(voice.name);
}

function pickPreferredChineseVoice(voices: SpeechSynthesisVoice[]) {
  return voices.find(isChineseMaleVoice)
    || voices.find((voice) => /zh-CN|cmn-Hans-CN/i.test(voice.lang))
    || voices[0]
    || null;
}

export function GamePage({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const game = projectGames[projectId] ?? projectGames.P4;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef('');
  const [selectedNode, setSelectedNode] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [playedCards, setPlayedCards] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundPickIds, setRoundPickIds] = useState<string[]>([]);
  const [lockedPickIds, setLockedPickIds] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [step, setStep] = useState<StageStep>('locate');
  const [aiHint, setAiHint] = useState<AIHintResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [judgement, setJudgement] = useState<JudgementState>('idle');
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content: `你好，我是 ${game.projectId} 的课程助教。这个互动是“${game.type}”，你可以问我节点、证据或判断方法。`
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');

  const selectedCorrectCount = selectedEvidence.filter((id) => game.evidence.find((card) => card.id === id)?.correct).length;
  const hasRiskNode = game.correctNodeIds.includes(selectedNode);
  const hasWrongEvidence = selectedEvidence.some((id) => game.evidence.find((card) => card.id === id)?.correct === false);
  const evidencePassed = hasRiskNode && selectedCorrectCount >= game.requiredEvidenceCount && !hasWrongEvidence;
  const passed = game.projectId === 'P4' ? evidencePassed && playedCards.includes('conclusion-card') : evidencePassed;
  const score = passed ? 100 : 0;
  const deckGame = projectDecks[game.projectId] ?? projectDecks.P4;
  const activeQuestion = deckGame.questions[questionIndex] ?? deckGame.questions[0];
  const answerSet = new Set(activeQuestion.answerIds);
  const allPickedIds = [...lockedPickIds, ...roundPickIds];
  const currentRoundCards = deckGame.cards.slice(currentRound * 3, currentRound * 3 + 3);
  const isDeckFinished = currentRound >= 4;
  const energyUsed = allPickedIds.length * 5;
  const energyLeft = 30 - energyUsed;
  const correctPickedIds = allPickedIds.filter((id) => answerSet.has(id));
  const wrongPickedIds = allPickedIds.filter((id) => !answerSet.has(id));
  const deckScore = isDeckFinished ? Math.max(0, Math.min(100, correctPickedIds.length * 20 - wrongPickedIds.length * 20)) : 0;
  const deckPassed = isDeckFinished && deckScore === 100;
  const assistantScore = isDeckFinished ? deckScore : Math.min(100, correctPickedIds.length * 20);
  const assistantEvidence = allPickedIds.length > 0 ? allPickedIds : selectedEvidence;
  const assistantEvidenceKey = assistantEvidence.join('|');
  const deckBriefing = isDeckFinished
    ? `${deckPassed ? '讲评：本轮证据选择完整。' : '讲评：这轮还有取舍问题。'}${activeQuestion.explanation}`
    : `第 ${currentRound + 1} 轮：从这 3 张牌中选择 0-3 张，也可以跳过。总能量 30，每张牌消耗 5 点，最多选 6 张。`;
  const latestGeneratedReply = chatMessages
    .slice(1)
    .reverse()
    .find((message) => message.role === 'assistant')?.content;
  const speechText = latestGeneratedReply || deckBriefing;

  useEffect(() => {
    setSelectedNode('');
    setSelectedEvidence([]);
    setPlayedCards([]);
    setCurrentRound(0);
    setRoundPickIds([]);
    setLockedPickIds([]);
    setQuestionIndex(Math.floor(Math.random() * (projectDecks[game.projectId] ?? projectDecks.P4).questions.length));
    setStep('locate');
    setJudgement('idle');
    setChatMessages([{
      role: 'assistant',
      content: `你好，我是 ${game.projectId} 的课程助教。这个互动是“${game.type}”，你可以问我节点、证据或判断方法。`
    }]);
    stopSpeaking();
  }, [game.projectId, game.type]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const chineseVoices = window.speechSynthesis.getVoices().filter(isChineseVoice);
      setSpeechVoices(chineseVoices);
      setSelectedVoiceURI((current) => {
        if (current && chineseVoices.some((voice) => voice.voiceURI === current)) return current;
        return pickPreferredChineseVoice(chineseVoices)?.voiceURI || '';
      });
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis.onvoiceschanged === loadVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  function toggleEvidence(id: string) {
    setSelectedEvidence((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setJudgement('idle');
  }

  function submitJudgement() {
    setStep('conclusion');
    setJudgement(passed ? 'correct' : 'wrong');
  }

  function resetChallenge() {
    setSelectedNode('');
    setSelectedEvidence([]);
    setPlayedCards([]);
    setCurrentRound(0);
    setRoundPickIds([]);
    setLockedPickIds([]);
    setQuestionIndex(Math.floor(Math.random() * deckGame.questions.length));
    setStep('locate');
    setJudgement('idle');
  }

  function toggleLearningCard(cardId: string) {
    if (isDeckFinished) return;
    setRoundPickIds((current) => {
      if (current.includes(cardId)) {
        return current.filter((id) => id !== cardId);
      }
      if (lockedPickIds.length + current.length >= 6) {
        return current;
      }
      return [...current, cardId];
    });
    setJudgement('idle');
  }

  function confirmRound() {
    const nextLocked = [...lockedPickIds, ...roundPickIds];
    setLockedPickIds(nextLocked);
    setRoundPickIds([]);
    if (currentRound >= 3) {
      const nextCorrect = nextLocked.filter((id) => answerSet.has(id)).length;
      const nextWrong = nextLocked.filter((id) => !answerSet.has(id)).length;
      const nextScore = Math.max(0, Math.min(100, nextCorrect * 20 - nextWrong * 20));
      setCurrentRound(4);
      setStep('conclusion');
      setJudgement(nextScore === 100 ? 'correct' : 'wrong');
      return;
    }
    setCurrentRound((round) => round + 1);
    setStep('evidence');
  }

  function toggleDeckCard(card: DeckCard) {
    setPlayedCards((current) => current.includes(card.id) ? current.filter((item) => item !== card.id) : [...current, card.id]);
    if (card.nodeId) {
      setSelectedNode((current) => current === card.nodeId ? '' : card.nodeId || '');
      setStep('evidence');
    }
    if (card.evidenceId) {
      toggleEvidence(card.evidenceId);
    } else {
      setJudgement('idle');
    }
  }

  function speakWithBrowserVoice(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const cleanText = text.trim();
    if (!cleanText) return;

    const speak = () => {
      const freshChineseVoices = window.speechSynthesis.getVoices().filter(isChineseVoice);
      const availableVoices = speechVoices.length > 0 ? speechVoices : freshChineseVoices;
      const selectedVoice = availableVoices.find((voice) => voice.voiceURI === selectedVoiceURI);
      const chineseVoice = selectedVoice || pickPreferredChineseVoice(availableVoices);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (chineseVoice) {
        utterance.voice = chineseVoice;
        utterance.lang = chineseVoice.lang || 'zh-CN';
      } else {
        utterance.lang = 'zh-CN';
      }
      utterance.rate = 1;
      utterance.pitch = 0.78;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.setTimeout(() => {
        if (!window.speechSynthesis.speaking) speak();
      }, 250);
      return;
    }

    speak();
  }

  async function speakBriefing(text: string) {
    const cleanText = text.trim();
    if (!cleanText) return;
    stopSpeaking();

    try {
      const audioBlob = await textbookApi.tts({ text: cleanText });
      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        speakWithBrowserVoice(cleanText);
      };
      await audio.play();
    } catch {
      speakWithBrowserVoice(cleanText);
    }
  }

  function stopSpeaking() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = '';
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }

  function askAssistant(question: string) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || chatLoading) return;

    const nextMessages: AIChatMessage[] = [...chatMessages, { role: 'user', content: cleanQuestion }];
    setChatMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);

    textbookApi.aiChat({
      projectId: game.projectId,
      taskId: game.taskId,
      question: cleanQuestion,
      selectedNode,
      selectedEvidence: assistantEvidence,
      score: assistantScore,
      history: chatMessages.slice(-8)
    })
      .then((result) => {
        setChatMessages((current) => [...current, { role: 'assistant', content: result.answer }]);
      })
      .catch(() => {
        setChatMessages((current) => [...current, {
          role: 'assistant',
          content: `助教连接暂时不稳定。先从 ${game.projectId} 的“${game.type}”入手：点击高风险节点，再选择 ${game.requiredEvidenceCount} 个能支撑判断的证据。`
        }]);
      })
      .finally(() => setChatLoading(false));
  }

  useEffect(() => {
    let alive = true;
    setAiLoading(true);
    textbookApi.aiHint({
      projectId: game.projectId,
      taskId: game.taskId,
      step,
      selectedNode,
      selectedEvidence: assistantEvidence,
      score: assistantScore
    })
      .then((hint) => {
        if (!alive) return;
        setAiHint(hint);
      })
      .catch(() => {
        if (!alive) return;
        setAiHint({
          provider: 'OpenMAIC-adapter',
          mode: 'browser-fallback',
          hint: `OpenMAIC 助教暂未连接。先完成 ${game.projectId} 的节点定位，再选择本关关键证据。`,
          next: '继续完成节点定位和证据选择。',
          tags: ['本地提示']
        });
      })
      .finally(() => {
        if (alive) setAiLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [assistantEvidenceKey, assistantScore, game.projectId, game.taskId, selectedNode, step]);

  const node = game.nodes.find((item) => item.id === selectedNode);
  const judgementTitle = judgement === 'correct' ? '判断正确' : judgement === 'wrong' ? '判断还不完整' : '等待提交判断';
  const judgementText = judgement === 'correct'
    ? game.successText
    : judgement === 'wrong'
      ? [
        !selectedNode ? '请先点击路线上的一个节点，定位你认为最关键的位置。' : '',
        !hasRiskNode ? '当前节点不是本关最关键判断点，请回到高风险节点。' : '',
        selectedCorrectCount < game.requiredEvidenceCount ? `至少需要选择 ${game.requiredEvidenceCount} 个正确证据。` : '',
        hasWrongEvidence ? '你选择了干扰项证据，请去掉和本关目标无关的材料。' : ''
      ].filter(Boolean).join(' ')
      : '点击路线节点会显示诊断提示。你可以随时提交，系统会判断还缺哪一步。';

  const answerCards = activeQuestion.answerIds
    .map((id) => deckGame.cards.find((card) => card.id === id))
    .filter((card): card is LearningCard => Boolean(card));

  return (
    <div className="view-stack game-view deck-demo-view">
      <section className="panel deck-hero">
        <div className="avatar-broadcast">
          <div className={`cartoon-avatar ${isSpeaking ? 'talking' : ''}`} aria-label="5G数字课程助教">
            <img className="avatar-frame frame-closed" src="/avatars/5g-tutor-mouth-closed.png" alt="5G数字课程助教" />
            <img className="avatar-mouth-patch patch-small" src="/avatars/5g-tutor-mouth-replace-small.png" alt="" aria-hidden="true" />
            <img className="avatar-mouth-patch patch-open" src="/avatars/5g-tutor-mouth-replace-open.png" alt="" aria-hidden="true" />
          </div>
          <div>
            <p className="eyebrow">OpenMAIC 播报样稿 · TTS · 4轮卡牌取舍</p>
            <h2>{game.projectId} {deckGame.theme}卡牌闯关</h2>
            <p>{activeQuestion.prompt}</p>
            <div className="deck-clear-goal">
              <strong>本局题目：{activeQuestion.title}</strong>
              <span>4 轮，每轮 3 张牌；可选 0-3 张或跳过。总能量 30，每张消耗 5，最多选 6 张。4 轮结束后自动结算。</span>
            </div>
            <div className="deck-hero-actions">
              <button type="button" className="primary-action" onClick={() => speakBriefing(speechText)}>{isSpeaking ? '云端播报中' : '云端男声播报'}</button>
              <button type="button" className="secondary-action" onClick={stopSpeaking} disabled={!isSpeaking}>停止播报</button>
              <button type="button" className="secondary-action" onClick={() => askAssistant(`请作为课程助教解释这道题：${activeQuestion.title}`)}>生成助教讲评</button>
              <label className="voice-select">
                <span>本机兜底</span>
                <select value={selectedVoiceURI} onChange={(event) => setSelectedVoiceURI(event.target.value)}>
                  {speechVoices.length > 0 ? speechVoices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} · {voice.lang}
                    </option>
                  )) : (
                    <option value="">未检测到中文声音</option>
                  )}
                </select>
              </label>
            </div>
          </div>
        </div>
        <div className="deck-scoreboard">
          <span>{isDeckFinished ? '最终得分' : `第 ${currentRound + 1} / 4 轮`}</span>
          <strong>{isDeckFinished ? deckScore : energyLeft}</strong>
          <small>{isDeckFinished ? `对 ${correctPickedIds.length} 张 / 错 ${wrongPickedIds.length} 张` : `剩余能量 · 已选 ${allPickedIds.length}/6`}</small>
        </div>
      </section>

        <section className="deck-board">
          <div className="panel deck-table">
          <div className="deck-question-panel">
            <div>
              <span>本局题目</span>
              <h3>{activeQuestion.title}</h3>
              <p>{activeQuestion.prompt}</p>
            </div>
            <div className="deck-question-meta">
              <strong>{game.projectId} · {deckGame.theme}</strong>
              <small>4轮后结算 · 正确牌 +20 · 错误牌 -20 · 最多选6张</small>
            </div>
          </div>

          <div className="deck-section-title">
            <h3>{isDeckFinished ? '本局结算' : `第 ${currentRound + 1} 轮手牌`}</h3>
            <p>{isDeckFinished ? '查看标准答案和选牌理由。' : '点击卡牌选择，再确认进入下一轮。'}</p>
          </div>

          {!isDeckFinished ? (
            <LearningCardTable
              cards={currentRoundCards}
              selectedIds={roundPickIds}
              energyFull={allPickedIds.length >= 6}
              onToggle={toggleLearningCard}
            />
          ) : (
            <div className="deck-result-grid">
              <div className="answer-card-list">
                <h3>应该选的 5 张牌</h3>
                {answerCards.map((card) => (
                  <p key={card.id}>
                    <span>{card.title}</span>
                  </p>
                ))}
              </div>
              <div className="answer-explain">
                <h3>为什么选这 5 张</h3>
                <p>{activeQuestion.explanation}</p>
                <ul>
                  {answerCards.map((card) => (
                    <li key={card.id}>
                      <strong>{card.title}</strong>
                      <span>{card.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="combo-zone">
            <div>
              <span>已锁定</span>
              <strong>{lockedPickIds.length} 张</strong>
              <p>{lockedPickIds.length
                ? lockedPickIds.map((id) => deckGame.cards.find((card) => card.id === id)?.title).filter(Boolean).join(' / ')
                : isDeckFinished ? '本局未选择卡牌。' : '还没有进入下一轮。'}</p>
            </div>
            <div>
              <span>本轮暂选</span>
              <strong>{roundPickIds.length} 张</strong>
              <p>{roundPickIds.length
                ? roundPickIds.map((id) => deckGame.cards.find((card) => card.id === id)?.title).filter(Boolean).join(' / ')
                : isDeckFinished ? '四轮选择均已锁定。' : '本轮可以不选。'}</p>
            </div>
            <div className={isDeckFinished ? 'complete' : ''}>
              <span>状态</span>
              <strong>{isDeckFinished ? '已结算' : '未完成'}</strong>
              <p>{isDeckFinished ? activeQuestion.explanation : '不能提前提交，必须完成 4 轮。'}</p>
            </div>
          </div>

          <div className={`judgement-card ${judgement}`}>
            <div>
              <span>{isDeckFinished ? (deckPassed ? '满分通过' : '已完成结算') : '等待四轮完成'}</span>
              <p>{deckBriefing}</p>
            </div>
            <strong>{isDeckFinished ? `${deckScore} 分` : `${energyLeft} 能量`}</strong>
          </div>
        </div>

        <aside className="panel deck-assistant-panel">
          <div className="course-assistant">
            <div className="assistant-head">
              <div className="assistant-icon">AI</div>
              <div>
                <h3>OpenMAIC 课程助教</h3>
                <p>播报 · 提问 · 讲评</p>
              </div>
            </div>
            <div className="assistant-intro">{deckBriefing}</div>
            <div className="deck-answer-hint">
              <strong>本局隐藏答案：</strong>
              <span>{isDeckFinished ? activeQuestion.answerIds.map((id) => deckGame.cards.find((card) => card.id === id)?.title).filter(Boolean).join(' → ') : '完成 4 轮后显示。'}</span>
            </div>
            <div className="assistant-thread">
              {chatMessages.map((message, index) => (
                <div className={`assistant-row ${message.role}`} key={`${message.role}-${index}`}>
                  <span>{message.role === 'user' ? '我' : '助教'}</span>
                  <p>{message.content}</p>
                </div>
              ))}
              {chatLoading ? (
                <div className="assistant-row assistant">
                  <span>助教</span>
                  <p>正在生成课堂讲评...</p>
                </div>
              ) : null}
            </div>
            <div className="assistant-status">
              {aiLoading ? '正在读取构筑状态...' : `${aiHint?.provider || 'DeepSeek'} · ${aiHint?.mode === 'remote' ? '真实AI' : 'OpenMAIC预留'}`}
            </div>
            <form className="assistant-input" onSubmit={(event) => {
              event.preventDefault();
              askAssistant(chatInput);
            }}>
              <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="问助教为什么这张牌该选..." />
              <button type="submit" disabled={chatLoading || !chatInput.trim()}>发送</button>
            </form>
            {openMaicUrl ? <a className="assistant-open-link" href={openMaicUrl} target="_blank" rel="noreferrer">打开完整 OpenMAIC</a> : null}
          </div>
          {!isDeckFinished ? (
            <button className="primary-action full-game-action" onClick={confirmRound} type="button">
              {currentRound >= 3 ? '确认第4轮并结算' : '确认本轮，进入下一轮'}
            </button>
          ) : null}
          <p className="deck-submit-note">{isDeckFinished ? '可以重新开始，系统会随机换一道题。' : '确认后本轮选择不可修改。'}</p>
          <button className="secondary-action full-game-action retry-action" onClick={resetChallenge} type="button">重新开始</button>
        </aside>
      </section>

      <section className="panel game-result-panel">
        <h3>玩法说明</h3>
        <p>每个项目都有 5 道题和 12 张知识卡。每局随机 1 道题，12 张牌分 4 轮出现；玩家用 30 点能量做取舍，四轮后由系统和 AI 助教给出解析。</p>
        <div className="game-actions">
          <button className="secondary-action" onClick={() => onNavigate('teacher')} type="button">查看教师讲评</button>
        </div>
      </section>
    </div>
  );

}

function LearningCardTable({
  cards,
  selectedIds,
  energyFull,
  onToggle
}: {
  cards: LearningCard[];
  selectedIds: string[];
  energyFull: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="deck-hand deck-card-fallback" aria-label="卡牌选择区">
      {cards.map((card) => {
        const selected = selectedIds.includes(card.id);
        const disabled = !selected && energyFull;
        return (
          <button
            key={card.id}
            className={`deck-card ${selected ? 'played' : ''}`}
            disabled={disabled}
            onClick={() => onToggle(card.id)}
            type="button"
          >
            <span>{card.category}</span>
            <strong>{card.title}</strong>
            <p>{card.detail}</p>
            <small>消耗 5 能量</small>
            <em>{selected ? '本轮已选，点击取消' : disabled ? '已达到 6 张上限' : '点击选择'}</em>
          </button>
        );
      })}
    </div>
  );
}
