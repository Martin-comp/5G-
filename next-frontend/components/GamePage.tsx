'use client';

import { useEffect, useRef, useState } from 'react';
import { textbookApi, type AIChatMessage, type AIHintResult } from '@/lib/api';
import type { Navigate } from './types';

type StageStep = 'locate' | 'evidence' | 'conclusion';
type JudgementState = 'idle' | 'correct' | 'wrong';
type GameNode = { id: string; label: string; x: number; y: number; note: string; risk: boolean; diagnosis: string; action: string };
type EvidenceCard = { id: string; label: string; correct: boolean; detail: string };
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
    type: '线索采集配对',
    title: '投诉线索采集闯关',
    intro: '点击采集链路上的关键节点，选择能把投诉转化为可验证问题的材料。',
    correctNodeIds: ['complaint'],
    requiredEvidenceCount: 2,
    successText: '判断正确：投诉时间、位置和业务现象能把“感觉卡”转化为可验证的网络问题线索。',
    starterQuestions: ['投诉信息为什么要先问时间和位置？', '采集材料和后续测试有什么关系？'],
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
    type: '测试异常定位',
    title: 'DT/CQT测试数据闯关',
    intro: '在测试链路中定位数据异常段，并选择能证明测试有效性的证据。',
    correctNodeIds: ['route', 'sample'],
    requiredEvidenceCount: 2,
    successText: '判断正确：路线轨迹和采样完整率能说明测试数据是否可靠，异常点需要先复核采集过程。',
    starterQuestions: ['为什么测试轨迹比单个截图更重要？', '采样完整率低会影响什么判断？'],
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
    type: '参数巡检判断',
    title: '网管参数巡检闯关',
    intro: '在网管信息链中定位异常管理点，选择能说明运行状态的证据。',
    correctNodeIds: ['alarm', 'parameter'],
    requiredEvidenceCount: 2,
    successText: '判断正确：告警状态和关键参数能共同说明网络信息管理中的异常来源。',
    starterQuestions: ['告警和参数为什么要一起看？', '只看小区名称为什么不够？'],
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
    type: '移动性证据闭环',
    title: '移动性故障定位闯关',
    intro: '点击路线节点，选择支撑证据，判断“覆盖达标后为什么移动中仍会断”。',
    correctNodeIds: ['boundary', 'canteen'],
    requiredEvidenceCount: 2,
    successText: '判断正确：覆盖指标虽然改善，但切换成功率、重建次数与短掉线日志共同说明移动性未闭环。',
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
    type: '性能瓶颈归因',
    title: '全网性能瓶颈闯关',
    intro: '在性能提升链路中找到瓶颈节点，并选择能证明容量或体验受限的指标。',
    correctNodeIds: ['busy-cell', 'capacity'],
    requiredEvidenceCount: 2,
    successText: '判断正确：忙小区和容量利用率能共同说明性能瓶颈，体验指标用于验证用户感知影响。',
    starterQuestions: ['忙小区为什么会影响全网体验？', '性能提升要看哪些指标？'],
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
    type: '信令流程排序',
    title: '异常信令定位闯关',
    intro: '在信令流程中定位异常阶段，选择能说明交互失败的证据。',
    correctNodeIds: ['session', 'reject'],
    requiredEvidenceCount: 2,
    successText: '判断正确：会话建立阶段和拒绝原因码能说明信令异常位置，重传记录用于佐证交互失败。',
    starterQuestions: ['信令原因码为什么关键？', '重传和拒绝有什么区别？'],
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

const openMaicUrl = process.env.NEXT_PUBLIC_OPENMAIC_URL || '';

export function GamePage({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const game = projectGames[projectId] ?? projectGames.P4;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
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

  const selectedCorrectCount = selectedEvidence.filter((id) => game.evidence.find((card) => card.id === id)?.correct).length;
  const hasRiskNode = game.correctNodeIds.includes(selectedNode);
  const hasWrongEvidence = selectedEvidence.some((id) => game.evidence.find((card) => card.id === id)?.correct === false);
  const passed = hasRiskNode && selectedCorrectCount >= game.requiredEvidenceCount && !hasWrongEvidence;
  const score = passed ? 100 : 0;

  useEffect(() => {
    setSelectedNode('');
    setSelectedEvidence([]);
    setStep('locate');
    setJudgement('idle');
    setChatMessages([{
      role: 'assistant',
      content: `你好，我是 ${game.projectId} 的课程助教。这个互动是“${game.type}”，你可以问我节点、证据或判断方法。`
    }]);
  }, [game.projectId, game.type]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);

    drawStage(ctx, rect.width, rect.height, selectedNode, game.nodes);
  }, [game.nodes, selectedNode, step]);

  function handleCanvasClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = game.nodes.find((node) => {
      const nx = node.x * rect.width;
      const ny = node.y * rect.height;
      return Math.hypot(x - nx, y - ny) < 44;
    });
    if (hit) {
      setSelectedNode(hit.id);
      setStep('evidence');
      setJudgement('idle');
    }
  }

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
    setStep('locate');
    setJudgement('idle');
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
      selectedEvidence,
      score,
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
      selectedEvidence,
      score
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
  }, [game.projectId, game.taskId, score, selectedEvidence, selectedNode, step]);

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

  return (
    <div className="view-stack game-view">
      <section className="panel game-head">
        <div>
          <p className="eyebrow">{game.projectId} · {game.type}</p>
          <h2>{game.title}</h2>
          <p>{game.intro}</p>
        </div>
        <div className="game-score">
          <span>当前得分</span>
          <strong>{score}</strong>
          <small>{passed ? '已形成闭环判断' : '继续选择关键证据'}</small>
        </div>
      </section>

      <section className="game-layout">
        <div className="panel game-stage-panel">
          <div className="game-toolbar">
            <span className={step === 'locate' ? 'active' : ''}>1 定位风险节点</span>
            <span className={step === 'evidence' ? 'active' : ''}>2 选择证据</span>
            <span className={step === 'conclusion' ? 'active' : ''}>3 形成结论</span>
          </div>
          <canvas ref={canvasRef} className="pixel-stage" onClick={handleCanvasClick} />
          <div className="game-hint">
            {node ? <strong>已选择：{node.label}，{node.note}</strong> : <strong>点击路线上的圆点，先定位最可能的故障位置。</strong>}
          </div>
          <div className={`node-diagnosis ${node?.risk ? 'risk' : ''}`}>
            <span>{node ? `${node.label}节点诊断` : '节点诊断'}</span>
            <p>{node ? node.diagnosis : '点击任意路线节点后，这里会显示该点在移动性验证中的作用。'}</p>
            <small>{node ? node.action : '先观察路径，再提交你的判断。'}</small>
          </div>
          <div className={`judgement-card ${judgement}`}>
            <div>
              <span>{judgementTitle}</span>
              <p>{judgementText}</p>
            </div>
            <strong>{judgement === 'idle' ? `${selectedEvidence.length}/${game.requiredEvidenceCount} 证据` : `${score} 分`}</strong>
          </div>
        </div>

        <aside className="panel evidence-game-panel">
          <div className="course-assistant">
            <div className="assistant-head">
              <div className="assistant-icon">5G</div>
              <div>
                <h3>课程助教</h3>
                <p>随堂问答 · 课堂伙伴</p>
              </div>
            </div>
            <div className="assistant-intro">
              当前是 {game.projectId} 的“{game.type}”。你可以问我节点为什么选、证据怎么判断、怎样拿到满分。
            </div>
            <div className="assistant-thread">
              {chatMessages.map((message, index) => (
                <div className={`assistant-row ${message.role}`} key={`${message.role}-${index}`}>
                  <span>{message.role === 'user' ? '我' : '课程助教'}</span>
                  <p>{message.content}</p>
                </div>
              ))}
              {chatLoading ? (
                <div className="assistant-row assistant">
                  <span>课程助教</span>
                  <p>正在思考你的问题...</p>
                </div>
              ) : null}
            </div>
            <div className="assistant-status">
              {aiLoading ? '正在读取当前闯关状态...' : `${aiHint?.provider || 'DeepSeek'} · ${aiHint?.mode === 'remote' ? '真实AI' : '本地降级'}`}
            </div>
            <div className="starter-list">
              <strong>继续追问</strong>
              {game.starterQuestions.map((question) => (
                <button key={question} type="button" onClick={() => askAssistant(question)}>{question}</button>
              ))}
            </div>
            <form className="assistant-input" onSubmit={(event) => {
              event.preventDefault();
              askAssistant(chatInput);
            }}>
              <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="问我任何问题..." />
              <button type="submit" disabled={chatLoading || !chatInput.trim()}>发送</button>
            </form>
            {openMaicUrl ? <a className="assistant-open-link" href={openMaicUrl} target="_blank" rel="noreferrer">打开完整 OpenMAIC</a> : null}
          </div>
          <h3>选择判断依据</h3>
          <div className="evidence-card-list">
            {game.evidence.map((card) => (
              <button key={card.id} className={selectedEvidence.includes(card.id) ? 'selected' : ''} onClick={() => toggleEvidence(card.id)} type="button">
                <strong>{card.label}</strong>
                <small>{selectedEvidence.includes(card.id) ? card.detail : '点击选择或取消'}</small>
              </button>
            ))}
          </div>
          <button className="primary-action full-game-action" onClick={submitJudgement} type="button">
            提交判断
          </button>
          {judgement !== 'idle' ? (
            <button className="secondary-action full-game-action retry-action" onClick={resetChallenge} type="button">重新挑战</button>
          ) : null}
        </aside>
      </section>

      <section className="panel game-result-panel">
        <h3>闯关反馈</h3>
        <p>{judgementText}</p>
        <div className="game-actions">
          <button className="secondary-action" onClick={() => onNavigate('task')} type="button">返回学生学习页</button>
          <button className="secondary-action" onClick={() => onNavigate('teacher')} type="button">查看教师讲评</button>
        </div>
      </section>
    </div>
  );
}

function drawStage(ctx: CanvasRenderingContext2D, width: number, height: number, selectedNode: string, nodes: GameNode[]) {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3faf7');
  gradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = gradient;
  roundRect(ctx, 0, 0, width, height, 24);
  ctx.fill();

  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#15917e';
  ctx.beginPath();
  nodes.forEach((node, index) => {
    const x = node.x * width;
    const y = node.y * height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  nodes.forEach((node, index) => {
    const x = node.x * width;
    const y = node.y * height;
    const isSelected = selectedNode === node.id;
    ctx.beginPath();
    ctx.fillStyle = isSelected ? '#f0b429' : node.risk ? '#1aa38b' : '#ffffff';
    ctx.strokeStyle = isSelected ? '#9a6a1f' : '#b9dfd2';
    ctx.lineWidth = 7;
    ctx.arc(x, y, isSelected ? 38 : 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = node.risk || isSelected ? '#ffffff' : '#15917e';
    ctx.font = '800 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(index + 1), x, y);

    ctx.fillStyle = '#14232a';
    ctx.font = '700 15px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(node.label, x, y + 58);

    if (node.risk) {
      ctx.fillStyle = '#d74f4f';
      ctx.font = '700 12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('风险', x, y - 52);
    }
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
