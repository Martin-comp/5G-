'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  readClassroomId,
  textbookApi,
  type ClassroomAnalyticsDTO,
  type ClassroomDiscussionMessageDTO,
  type ClassroomExitDTO,
  type ClassroomGroupResponseDTO,
  type ClassroomPollResultsDTO,
  type ClassroomSessionStateDTO,
  type ClassroomSubmissionDTO,
  type ClassroomToolStateDTO,
	 type AIStudyInsightDTO,
  type SelfStudyAnalyticsDTO
} from '@/lib/api';
import { CLASSROOM_REALTIME_EVENT } from '@/lib/classroom-realtime';
import { capabilityNodes, getLearningNodeExperience, p4TaskFlow } from '@/lib/textbook-data';
import { GuidedSelfStudy } from './GuidedSelfStudy';
import { ListeningTutorBar } from './ListeningTutorBar';
import { NodeActivityBoard } from './NodeActivityBoard';

type GenericExperienceMode = 'learn' | 'classroom' | 'teacher' | 'present';

const modeCopy: Record<GenericExperienceMode, { eyebrow: string; hint: string }> = {
  learn: { eyebrow: '学生端 · 自主学习', hint: '按案例、步骤、证据和练习完成本节点学习。' },
  classroom: { eyebrow: '学生端 · 听讲模式', hint: '接收教师同步，在受控状态下完成本页课堂作答。' },
  teacher: { eyebrow: '教师端 · 授课控制', hint: '同步学生端、推送练习并依据提交情况讲评。' },
  present: { eyebrow: '投屏端 · 大屏展示', hint: '只显示当前讲解的核心证据和结论。' }
};

const genericToolLabels = {
  poll: '随堂投票',
  discussion: '弹幕讨论',
  group: '小组任务',
  timer: '计时器'
} as const;

type GenericToolKey = keyof typeof genericToolLabels;

function defaultGenericToolState(nodeId: string): ClassroomToolStateDTO {
  return {
    classId: '通信2301班', nodeId, activeTool: '', pollOpen: false, discussionOpen: false,
    groupTaskOpen: false, timerRunning: false, timerSeconds: 300,
    prompt: '请围绕本节点的关键证据完成讨论。', pollOptions: [], updatedAt: 0
  };
}

function genericToolPrompt(nodeId: string, tool: GenericToolKey) {
  const node = getLearningNodeExperience(nodeId)!;
  if (tool === 'poll') {
    const options = [node.practice[0]?.answer ?? node.evidence[0]?.label, node.practice[1]?.answer ?? node.evidence[1]?.label, '仅凭单项指标直接下结论'].filter((item): item is string => Boolean(item));
    return { prompt: node.practice[0]?.question ?? node.headline, options };
  }
  if (tool === 'discussion') return { prompt: `请用一句话说明：${node.headline}`, options: [] };
  if (tool === 'group') return { prompt: '小组选择两项关键证据，写出一条有边界的判断。', options: [] };
  return { prompt: '限时 5 分钟完成本页任务并提交课堂作答。', options: [] };
}

export function GenericNodeExperience({ nodeId, mode }: { nodeId: string; mode: GenericExperienceMode }) {
  const node = getLearningNodeExperience(nodeId);
  if (!node) return <NodeUnavailable nodeId={nodeId} />;
  if (mode === 'present') return <GenericPresent nodeId={nodeId} />;

  return (
    <main className={`node-experience generic-node-experience ${mode === 'classroom' && (node.projectId === 'P1' || node.projectId === 'P2') ? 'with-listening-bar' : ''}`}>
      <header className="node-topbar">
        <Link className="node-brand" href={`/course?project=${node.projectId}`}>
          <span>5G</span><strong>5G网络优化（高级）</strong><em>数字教材</em>
        </Link>
        <nav aria-label="节点端侧导航">
          <Link className={mode === 'learn' ? 'is-active' : ''} href={`/learn/${node.nodeId}`}>自学</Link>
          <Link className={mode === 'classroom' ? 'is-active' : ''} href={`/classroom/${node.nodeId}`}>听讲模式</Link>
          <Link className={mode === 'teacher' ? 'is-active' : ''} href={`/teacher/sessions/${node.nodeId}`}>教师端</Link>
        </nav>
      </header>
      <section className="node-hero generic-node-hero">
        <div>
          <p className="eyebrow">{modeCopy[mode].eyebrow}</p>
          <h1>{node.taskId} {node.title}</h1>
          <h2>{node.headline}</h2>
          <p>{modeCopy[mode].hint}</p>
        </div>
        <aside><strong>{node.projectId} · {node.taskId}</strong><span>{node.subtitle}</span></aside>
      </section>
      <NodeTaskPath mode={mode} nodeId={nodeId} />
      {mode === 'learn' && <GenericLearn nodeId={nodeId} />}
      {mode === 'classroom' && <GenericClassroom nodeId={nodeId} />}
      {mode === 'teacher' && <GenericTeacher nodeId={nodeId} />}
    </main>
  );
}

function GenericLearn({ nodeId }: { nodeId: string }) {
  const node = getLearningNodeExperience(nodeId)!;
  return <>
    {(node.projectId === 'P1' || node.projectId === 'P2') && <GuidedSelfStudy nodeId={nodeId} />}
    <section className="node-section two-column">
      <article className="node-card"><p className="eyebrow">案例导入</p><h3>本节先解决什么问题？</h3><p>{node.caseIntro}</p></article>
      <article className="node-card"><p className="eyebrow">学习步骤</p><div className="step-list">{node.steps.map((step, index) => <div key={step.title}><b>{index + 1}</b><strong>{step.title}</strong><span>{step.desc}</span></div>)}</div></article>
    </section>
    {(node.projectId === 'P1' || node.projectId === 'P2') ? <NodeActivityBoard audience="student" nodeId={nodeId} /> : <EvidencePanel nodeId={nodeId} />}
    <LearningRecordPanel nodeId={nodeId} />
    <section className="node-section two-column">
      <article className="node-card"><p className="eyebrow">小结</p><h3>评价产出</h3><div className="generic-output-list">{node.outputs.map((item) => <span key={item}>{item}</span>)}</div></article>
      <article className="node-card"><p className="eyebrow">进入听讲</p><h3>完成后进入听讲模式</h3><p>教师同步后，学生端将受控进入本节点，完成统一的课堂任务与讲评。</p><Link className="node-primary-link" href={`/classroom/${node.nodeId}`}>进入听讲模式</Link></article>
    </section>
  </>;
}

function GenericClassroom({ nodeId }: { nodeId: string }) {
  const node = getLearningNodeExperience(nodeId)!;
  const [session, setSession] = useState<Pick<ClassroomSessionStateDTO, 'slideId' | 'synced' | 'practicePushed' | 'reviewMode' | 'updatedAt'>>({ slideId: '1', synced: false, practicePushed: false, reviewMode: false, updatedAt: 0 });
  const [locallyExited, setLocallyExited] = useState(false);
  const [showExitNotice, setShowExitNotice] = useState(false);
  const [toolState, setToolState] = useState<ClassroomToolStateDTO>(() => defaultGenericToolState(nodeId));
  const [evidence, setEvidence] = useState(node.evidence.slice(0, 2).map((item) => item.label));
  const [answer, setAnswer] = useState(`我选择${node.evidence.slice(0, 2).map((item) => item.label).join('、')}作为依据，${node.headline}`);
  const [status, setStatus] = useState('');
  const slideTotal = Math.max(node.teacherScript.length, 1);
  const slideNumber = Math.min(Math.max(Number(session.slideId) || 1, 1), slideTotal);
  const currentScript = node.teacherScript[slideNumber - 1] ?? node.headline;
  const classroomActive = session.synced && !locallyExited;

  useEffect(() => {
    if (!showExitNotice) return;
    const timer = window.setTimeout(() => setShowExitNotice(false), 3000);
    return () => window.clearTimeout(timer);
  }, [showExitNotice]);

  useEffect(() => {
    let alive = true;
    const refresh = () => Promise.all([textbookApi.classroomSession(nodeId), textbookApi.classroomTools(nodeId)]).then(([nextSession, nextTools]) => {
      if (!alive) return;
      setSession(nextSession);
      const pausedAt = window.sessionStorage.getItem('dgbook-paused-classroom-sync');
      setLocallyExited(Boolean(nextSession.updatedAt) && pausedAt === String(nextSession.updatedAt));
      setToolState(nextTools);
    }).catch(() => undefined);
    void refresh();
    const onRealtime = () => refresh();
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    const timer = window.setInterval(refresh, 15000);
    return () => { alive = false; window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime); window.clearInterval(timer); };
  }, [nodeId]);

  async function submit() {
    setStatus('正在提交...');
    try {
      const result = await textbookApi.submitClassroomWork({
        nodeId, taskId: `${node.taskId}-classroom`, studentId: getGenericStudentId(), studentName: '学生端演示', answer,
        evidence, conclusion: answer, score: Math.min(100, 50 + evidence.length * 20), selectedEvidence: evidence
      });
      setStatus(`已提交：${result.score}分，教师端会自动更新。`);
    } catch { setStatus('提交失败：后端可能正在唤醒，请稍后重试。'); }
  }

  function toggle(item: string) { setEvidence((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item]); }

  function leaveListening() {
    if (!session.updatedAt) return;
    const syncAt = String(session.updatedAt);
    void textbookApi.leaveClassroom({
      nodeId,
      studentId: getGenericStudentId(),
      studentName: window.localStorage.getItem('dgbook-auth-name') || '学生端演示'
    });
    window.sessionStorage.setItem('dgbook-paused-classroom-sync', syncAt);
    setLocallyExited(true);
    setShowExitNotice(true);
  }

  return <>
    <section className="node-section classroom-sync-panel">
      <div className="classroom-sync-head"><div><p className="eyebrow">课堂同步</p><h3>{classroomActive ? `正在跟随教师讲解 · 第 ${slideNumber} / ${slideTotal} 页` : locallyExited ? (showExitNotice ? '已退出本次听讲' : '当前内容回看') : '等待教师同步当前页'}</h3><p>{classroomActive ? currentScript : locallyExited ? '当前页面不会再接收教师控制或课堂作业推送。' : '教师同步后，学生端才会进入本节点的课堂内容与任务。'}</p></div><div className="classroom-sync-actions">{classroomActive ? <><span className="is-live">已同步</span><button onClick={leaveListening} type="button">退出听讲</button></> : showExitNotice ? <span>已退出</span> : !locallyExited ? <span>待同步</span> : null}</div></div>
      {classroomActive ? <div className="classroom-guided-slide"><strong>教师当前讲解</strong><p>{currentScript}</p><div>{node.teacherScript.map((_, index) => <i className={index + 1 === slideNumber ? 'active' : ''} key={index}>{index + 1}</i>)}</div></div> : locallyExited ? <div className="classroom-exited-message"><strong>你已退出本次听讲</strong><span>当前内容仍可浏览；教师再次同步后会自动恢复跟随。</span></div> : <div className="classroom-locked-message"><strong>当前为受控听讲模式</strong><span>请等待教师在授课控制台同步本页。同步后可跟随讲解，教师推送练习后才能作答。</span></div>}
      {classroomActive && session.practicePushed && <div className="classroom-practice-live"><strong>教师已推送练习</strong><span>请选取证据并提交本页结论。</span></div>}
      {classroomActive && toolState.activeTool && <><div className="classroom-tool-live"><strong>课堂工具已开启：{genericToolLabels[toolState.activeTool as GenericToolKey] ?? '课堂工具'}</strong><span>{toolState.prompt}</span></div><GenericClassroomLiveTool nodeId={nodeId} toolState={toolState} /></>}
      {classroomActive && session.reviewMode && <div className="classroom-tool-live review"><strong>教师正在讲评</strong><span>请对照自己的依据是否完整、结论是否有边界。</span></div>}
    </section>
    {session.synced ? <>
      {(node.projectId === 'P1' || node.projectId === 'P2') ? <NodeActivityBoard audience="student" enabled={classroomActive && session.practicePushed} nodeId={nodeId} /> : <EvidencePanel nodeId={nodeId} />}
      {classroomActive && session.practicePushed ? <section className="node-section generic-classroom-task">
        <article className="node-card"><p className="eyebrow">课堂小任务</p><h3>选择依据，形成一句判断</h3><div className="practice-list">{node.practice.map((item, index) => <div key={item.question}><b>{index + 1}</b><strong>{item.question}</strong><span>参考方向：{item.answer}</span></div>)}</div></article>
        <article className="node-card classroom-submit-form"><label>选择关键依据<div className="evidence-choice-row">{node.evidence.map((item) => <button key={item.label} className={evidence.includes(item.label) ? 'active' : ''} onClick={() => toggle(item.label)} type="button">{item.label}</button>)}</div></label><label>我的判断<textarea value={answer} onChange={(event) => setAnswer(event.target.value)} /></label><button className="primary-action full" onClick={submit} type="button">提交课堂作答</button>{status && <p className="submit-status">{status}</p>}</article>
      </section> : <section className="node-section classroom-await-practice"><p className="eyebrow">{locallyExited ? '已退出听讲' : '跟随听讲'}</p><h3>{locallyExited ? '当前内容可回看，课堂作业已暂停' : '教师正在讲解当前页'}</h3><p>{locallyExited ? '你已主动退出本次课堂同步，仍可停留在本页阅读内容；教师再次同步后会自动恢复跟随。' : '本页证据已同步。请先跟随听讲助教和教师讲解，等待教师推送练习后再提交自己的判断。'}</p></section>}
    </> : null}
    {(node.projectId === 'P1' || node.projectId === 'P2') && <ListeningTutorBar nodeId={nodeId} />}
  </>;
}

function GenericClassroomLiveTool({ nodeId, toolState }: { nodeId: string; toolState: ClassroomToolStateDTO }) {
  const node = getLearningNodeExperience(nodeId)!;
  const studentId = getGenericStudentId();
  const [poll, setPoll] = useState<ClassroomPollResultsDTO | null>(null);
  const [choice, setChoice] = useState('');
  const [messages, setMessages] = useState<ClassroomDiscussionMessageDTO[]>([]);
  const [message, setMessage] = useState('');
  const [groupEvidence, setGroupEvidence] = useState<string[]>(node.evidence.slice(0, 1).map((item) => item.label));
  const [groupConclusion, setGroupConclusion] = useState(node.headline);
  const [status, setStatus] = useState('');
  const remaining = useGenericRemainingSeconds(toolState);

  useEffect(() => {
    let alive = true;
    const refresh = () => {
      if (toolState.activeTool === 'poll') void textbookApi.classroomPoll(nodeId).then((result) => { if (alive) setPoll(result); }).catch(() => undefined);
      if (toolState.activeTool === 'discussion') void textbookApi.classroomDiscussion(nodeId).then((result) => { if (alive) setMessages(result); }).catch(() => undefined);
    };
    refresh();
    const onRealtime = () => refresh();
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    return () => { alive = false; window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime); };
  }, [nodeId, toolState.activeTool]);

  async function submitPoll() {
    if (!choice) return setStatus('请先选择一项判断。');
    try {
      await textbookApi.submitPollResponse({ nodeId, studentId, studentName: '学生端演示', option: choice });
      setPoll(await textbookApi.classroomPoll(nodeId));
      setStatus('投票已提交，教师端会立即更新。');
    } catch { setStatus('投票提交失败，请稍后再试。'); }
  }

  async function postMessage() {
    if (!message.trim()) return setStatus('请先写下一句话观点。');
    try {
      await textbookApi.postClassroomDiscussion({ nodeId, studentId, studentName: '学生端演示', content: message.trim() });
      setMessage('');
      setMessages(await textbookApi.classroomDiscussion(nodeId));
      setStatus('观点已发送。');
    } catch { setStatus('发送失败，请稍后再试。'); }
  }

  async function submitGroup() {
    if (!groupEvidence.length) return setStatus('至少选择一项关键证据。');
    try {
      await textbookApi.submitClassroomGroup({ nodeId, studentId, studentName: '学生端演示', evidence: groupEvidence, conclusion: groupConclusion });
      setStatus('小组结论已提交，等待教师讲评。');
    } catch { setStatus('小组任务提交失败，请稍后再试。'); }
  }

  const options = poll?.options ?? toolState.pollOptions.map((label) => ({ label, count: 0 }));
  if (toolState.activeTool === 'poll') {
    const total = Math.max(poll?.submitted ?? 0, 1);
    return <div className="live-tool-card"><div className="live-tool-heading"><span>随堂投票</span><small>{poll?.submitted ?? 0}/42 人已作答</small></div><div className="live-poll-options">{options.map((item) => <button key={item.label} className={choice === item.label ? 'active' : ''} onClick={() => setChoice(item.label)} type="button"><span>{item.label}</span><em>{item.count}票</em><i style={{ width: `${Math.round(item.count / total * 100)}%` }} /></button>)}</div><button className="primary-action" onClick={submitPoll} type="button">提交投票</button>{status && <p className="live-tool-status">{status}</p>}</div>;
  }
  if (toolState.activeTool === 'discussion') {
    return <div className="live-tool-card"><div className="live-tool-heading"><span>弹幕讨论</span><small>{messages.length} 条课堂观点</small></div><div className="live-message-list">{messages.length ? messages.slice(0, 4).map((item) => <div key={item.id}><strong>{item.studentName}</strong><span>{item.content}</span></div>) : <p>还没有同学发言，先说出你的判断。</p>}</div><div className="live-tool-composer"><input value={message} maxLength={80} onChange={(event) => setMessage(event.target.value)} placeholder="用一句话写出你的判断" /><button className="primary-action" onClick={postMessage} type="button">发送</button></div>{status && <p className="live-tool-status">{status}</p>}</div>;
  }
  if (toolState.activeTool === 'group') {
    return <div className="live-tool-card"><div className="live-tool-heading"><span>小组任务</span><small>选择证据并形成一句结论</small></div><div className="evidence-choice-row compact">{node.evidence.map((item) => <button key={item.label} className={groupEvidence.includes(item.label) ? 'active' : ''} onClick={() => setGroupEvidence((items) => items.includes(item.label) ? items.filter((value) => value !== item.label) : [...items, item.label])} type="button">{item.label}</button>)}</div><textarea value={groupConclusion} maxLength={120} onChange={(event) => setGroupConclusion(event.target.value)} /><button className="primary-action" onClick={submitGroup} type="button">提交小组证据</button>{status && <p className="live-tool-status">{status}</p>}</div>;
  }
  return <div className="live-tool-card timer-card"><div className="live-tool-heading"><span>课堂计时器</span><small>{toolState.timerRunning ? '教师正在计时' : '计时已暂停'}</small></div><strong>{formatGenericSeconds(remaining)}</strong><p>{remaining > 0 ? '请在倒计时结束前完成本页任务并提交。' : '倒计时结束，请等待教师下一步安排。'}</p></div>;
}

function useGenericRemainingSeconds(toolState: ClassroomToolStateDTO) {
  const [remaining, setRemaining] = useState(toolState.timerSeconds);
  useEffect(() => {
    const update = () => {
      if (!toolState.timerRunning) return setRemaining(toolState.timerSeconds);
      const elapsed = Math.floor((Date.now() - toolState.updatedAt) / 1000);
      setRemaining(Math.max(0, toolState.timerSeconds - elapsed));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [toolState]);
  return remaining;
}

function formatGenericSeconds(value: number) {
  return `${String(Math.floor(Math.max(value, 0) / 60)).padStart(2, '0')}:${String(Math.max(value, 0) % 60).padStart(2, '0')}`;
}

function GenericTeacher({ nodeId }: { nodeId: string }) {
  const node = getLearningNodeExperience(nodeId)!;
  const [session, setSession] = useState<ClassroomSessionStateDTO>({ classId: '通信2301班', nodeId, slideId: '1', synced: false, practicePushed: false, reviewMode: false, updatedAt: 0, updatedBy: 'teacher' });
  const [classroomId, setClassroomId] = useState('通信2301班');
  const [analytics, setAnalytics] = useState<ClassroomAnalyticsDTO | null>(null);
  const [selfStudyAnalytics, setSelfStudyAnalytics] = useState<SelfStudyAnalyticsDTO | null>(null);
  const [submissions, setSubmissions] = useState<ClassroomSubmissionDTO[]>([]);
  const [toolState, setToolState] = useState<ClassroomToolStateDTO>(() => defaultGenericToolState(nodeId));
  const [poll, setPoll] = useState<ClassroomPollResultsDTO | null>(null);
  const [messages, setMessages] = useState<ClassroomDiscussionMessageDTO[]>([]);
  const [groups, setGroups] = useState<ClassroomGroupResponseDTO[]>([]);
  const [exits, setExits] = useState<ClassroomExitDTO[]>([]);
  const slideTotal = Math.max(node.teacherScript.length, 1);
  const slideNumber = Math.min(Math.max(Number(session.slideId) || 1, 1), slideTotal);

  useEffect(() => {
    setClassroomId(readClassroomId());
    let alive = true;
    async function refresh() {
      try {
        const [nextSession, nextAnalytics, nextSubmissions, nextTools, nextPoll, nextMessages, nextGroups, nextSelfStudy, nextExits] = await Promise.all([
          textbookApi.classroomSession(nodeId), textbookApi.classroomAnalytics(nodeId), textbookApi.classroomSubmissions(nodeId),
          textbookApi.classroomTools(nodeId), textbookApi.classroomPoll(nodeId), textbookApi.classroomDiscussion(nodeId), textbookApi.classroomGroups(nodeId), textbookApi.selfStudyAnalytics(nodeId), textbookApi.classroomExits(nodeId)
        ]);
        if (!alive) return;
        setSession(nextSession); setAnalytics(nextAnalytics); setSubmissions(nextSubmissions); setToolState(nextTools); setPoll(nextPoll); setMessages(nextMessages); setGroups(nextGroups); setSelfStudyAnalytics(nextSelfStudy); setExits(nextExits);
      } catch { /* Keep the template visible while the service wakes. */ }
    }
    void refresh();
    const onRealtime = () => refresh();
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    const timer = window.setInterval(refresh, 15000);
    return () => { alive = false; window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime); window.clearInterval(timer); };
  }, [nodeId]);

  function publish(overrides: Partial<typeof session>) {
    const next = { ...session, ...overrides, classId: readClassroomId(), nodeId, updatedAt: Date.now(), updatedBy: 'teacher' };
    setSession(next);
    void textbookApi.updateClassroomSession(next);
  }

  function changeSlide(delta: number) {
    const nextSlide = Math.min(Math.max(slideNumber + delta, 1), slideTotal);
    publish({ synced: true, slideId: String(nextSlide), practicePushed: false, reviewMode: false });
  }

  function toggleTool(tool: GenericToolKey) {
    const shouldClose = toolState.activeTool === tool;
    const config = genericToolPrompt(nodeId, tool);
    const next: ClassroomToolStateDTO = {
      ...defaultGenericToolState(nodeId), ...toolState, classId: readClassroomId(), nodeId,
      activeTool: shouldClose ? '' : tool,
      pollOpen: !shouldClose && tool === 'poll',
      discussionOpen: !shouldClose && tool === 'discussion',
      groupTaskOpen: !shouldClose && tool === 'group',
      timerRunning: !shouldClose && tool === 'timer',
      timerSeconds: tool === 'timer' && !shouldClose ? 300 : toolState.timerSeconds,
      prompt: shouldClose ? defaultGenericToolState(nodeId).prompt : config.prompt,
      pollOptions: tool === 'poll' && !shouldClose ? config.options : toolState.pollOptions,
      updatedAt: Date.now()
    };
    setToolState(next);
    void textbookApi.updateClassroomTools(next);
  }

  return <>
    <section className="generic-teacher-top panel"><div><p className="eyebrow">教师授课控制台</p><h2>{node.taskId} · {node.title}</h2><p>{node.headline}</p></div><div><span>班级：{classroomId}</span><strong className={session.synced ? 'is-live' : ''}>学生端：{session.synced ? '已同步' : '待同步'}</strong></div></section>
    <section className="generic-teacher-grid">
      <article className="panel generic-teacher-stage"><p className="eyebrow">讲解脚本</p><h3>{node.headline}</h3><div className="teacher-script-list">{node.teacherScript.map((item, index) => <article key={item}><b>{index + 1}</b><p>{item}</p></article>)}</div>{node.projectId === 'P1' || node.projectId === 'P2' ? <NodeActivityBoard audience="teacher" nodeId={nodeId} /> : <EvidencePanel nodeId={nodeId} />}</article>
      <aside className="panel generic-teacher-side">
        <h3>课堂控制</h3>
        <div className="teacher-slide-control"><span>讲解页 {slideNumber} / {slideTotal}</span><button aria-label="上一讲解页" disabled={slideNumber === 1} onClick={() => changeSlide(-1)} type="button">上一页</button><button aria-label="下一讲解页" disabled={slideNumber === slideTotal} onClick={() => changeSlide(1)} type="button">下一页</button></div>
        <button className="secondary-action full" onClick={() => publish({ synced: true, slideId: String(slideNumber) })} type="button">{session.synced ? '学生端已同步' : '同步学生端'}</button>
        <button className="secondary-action full" onClick={() => publish({ synced: true, practicePushed: true })} type="button">{session.practicePushed ? '练习已推送' : '推送练习'}</button>
        <button className="primary-action full" onClick={() => publish({ synced: true, reviewMode: true })} type="button">{session.reviewMode ? '正在讲评' : '开始讲评'}</button>
        <div className="generic-tool-grid">{(Object.keys(genericToolLabels) as GenericToolKey[]).map((tool) => <button key={tool} className={toolState.activeTool === tool ? 'active' : ''} onClick={() => toggleTool(tool)} type="button">{genericToolLabels[tool]}</button>)}</div>
        <div className="generic-tool-status"><strong>{toolState.activeTool ? `已开启：${genericToolLabels[toolState.activeTool as GenericToolKey]}` : '互动工具待开启'}</strong><span>{toolState.prompt}</span></div>
        <GenericTeacherToolMonitor toolState={toolState} poll={poll} messages={messages} groups={groups} />
        <TeacherExitTips exits={exits} />
        <button className="text-action full" onClick={() => publish({ synced: false, practicePushed: false, reviewMode: false })} type="button">解除课堂控制</button>
        <Link className="secondary-action full route-action-link" href={`/game?project=${node.projectId}`}>进入卡牌互动</Link>
      </aside>
    </section>
    <section className="generic-teacher-data">
      <SelfStudyInsightPanel analytics={selfStudyAnalytics} nodeId={nodeId} />
      <article className="panel"><h3>学生学习证据</h3><strong>{analytics?.submitted ?? 0} / {analytics?.totalStudents ?? 42} 人</strong><p>提交率 {analytics?.submitRate ?? '0%'}，平均分 {analytics?.averageScore ?? 0}。</p></article>
      <article className="panel"><h3>讲评优先级</h3>{(analytics?.priorityItems ?? []).slice(0, 3).map((item) => <p key={item.label}><b>{item.level}</b>{item.label} · {item.count}人</p>)}{!analytics && <p>学生提交后会显示需讲评的证据缺口。</p>}</article>
      <article className="panel"><h3>最新提交</h3>{submissions.length ? submissions.slice(0, 3).map((item) => <p key={item.id}><b>{item.studentName}</b>{item.conclusion || item.answer}</p>) : <p>暂未收到真实提交。</p>}</article>
    </section>
  </>;
}

function TeacherExitTips({ exits }: { exits: ClassroomExitDTO[] }) {
  if (!exits.length) return <div className="teacher-exit-tips empty"><strong>学生退出提示</strong><span>当前还没有学生退出听讲。</span></div>;
  return <div className="teacher-exit-tips"><strong>学生退出提示</strong>{exits.slice(0, 3).map((item) => <span key={item.id}><b>{item.studentName}</b> 已退出听讲 · {new Date(item.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>)}</div>;
}

function SelfStudyInsightPanel({ analytics, nodeId }: { analytics: SelfStudyAnalyticsDTO | null; nodeId: string }) {
  const supportCard = analytics?.cards.find((item) => item.abilityScore < 60) ?? analytics?.cards.find((item) => item.completedSteps.length < 4);
  const [insight, setInsight] = useState<AIStudyInsightDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const suggestion = supportCard
    ? `优先让 ${supportCard.studentName} 回看“${supportCard.abilities.find((ability) => ability.score < 100)?.label ?? '结论表达'}”并完成未解锁小节。`
    : analytics?.students
      ? '本节点自学完成度较好，可在听讲阶段重点追问证据之间的关联。'
      : '学生保存自学进度后，系统会生成能力数、薄弱点和教师建议。';

  async function generateInsight() {
    setLoading(true);
    setError('');
    try {
      setInsight(await textbookApi.generateStudyInsight({ nodeId }));
    } catch {
      setError('AI 解读暂时不可用，请稍后重试。');
    } finally {
      setLoading(false);
    }
  }

  return <article className="panel generic-ai-learning-card generic-ai-insight-panel">
    <div className="ai-learning-head"><div><p className="eyebrow">AI 学情卡 · 自学模式</p><h3>{analytics?.students ? `${analytics.students} 名学生已产生自学数据` : '等待学生保存自学进度'}</h3></div><span>分析依据：学习小节、能力数、完成时间</span></div>
    <div className="ai-learning-metrics"><article><strong>{analytics?.averageAbility ?? 0}</strong><span>平均能力数</span></article><article><strong>{analytics?.completed ?? 0}</strong><span>完成本节点</span></article><article><strong>{analytics?.needsSupport ?? 0}</strong><span>需要支持</span></article></div>
    {analytics?.cards.length ? <div className="ai-learning-student-list">{analytics.cards.slice(0, 4).map((item) => <article key={item.studentId}><div><strong>{item.studentName}</strong><span>完成 {item.completedSteps.length}/4 节</span></div><b>{item.abilityScore}</b><div className="ai-ability-bars">{item.abilities.map((ability) => <span key={ability.label}><i style={{ width: `${ability.score}%` }} /><em>{ability.label}</em></span>)}</div></article>)}</div> : null}
    <div className="ai-learning-suggestion"><div><strong>{insight ? 'AI 学情解读' : '规则预判'}</strong><button className="text-action" disabled={!analytics?.students || loading} onClick={generateInsight} type="button">{loading ? '正在生成' : insight ? '重新生成' : '生成 AI 学情解读'}</button></div>{insight ? <><p>{insight.summary}</p><p><b>讲评重点：</b>{insight.focus}</p><p><b>下一步：</b>{insight.action}</p><small>{insight.provider} · {insight.mode === 'remote' ? '真实 AI' : '本地回退'}</small></> : <p>{suggestion}</p>}{error && <small>{error}</small>}</div>
  </article>;
}

function GenericTeacherToolMonitor({
  toolState,
  poll,
  messages,
  groups
}: {
  toolState: ClassroomToolStateDTO;
  poll: ClassroomPollResultsDTO | null;
  messages: ClassroomDiscussionMessageDTO[];
  groups: ClassroomGroupResponseDTO[];
}) {
  if (!toolState.activeTool) return <div className="generic-tool-monitor"><span>选择一个互动工具后，可在这里实时查看学生反馈。</span></div>;
  if (toolState.activeTool === 'poll') return <div className="generic-tool-monitor"><strong>投票回收 {poll?.submitted ?? 0}/42</strong>{(poll?.options ?? []).map((item) => <span key={item.label}>{item.label} · {item.count}票</span>)}</div>;
  if (toolState.activeTool === 'discussion') return <div className="generic-tool-monitor"><strong>最新讨论</strong>{messages.length ? messages.slice(0, 2).map((item) => <span key={item.id}>{item.studentName}：{item.content}</span>) : <span>暂未收到观点。</span>}</div>;
  if (toolState.activeTool === 'group') return <div className="generic-tool-monitor"><strong>小组提交 {groups.length} 份</strong>{groups.length ? groups.slice(0, 2).map((item) => <span key={item.id}>{item.studentName}：{item.conclusion}</span>) : <span>等待小组提交关键证据。</span>}</div>;
  return <div className="generic-tool-monitor"><strong>课堂计时</strong><span>{toolState.timerRunning ? `剩余 ${formatGenericSeconds(toolState.timerSeconds)}，学生端倒计时已同步。` : '计时已暂停。'}</span></div>;
}

function GenericPresent({ nodeId }: { nodeId: string }) {
  const node = getLearningNodeExperience(nodeId)!;
  const [session, setSession] = useState({ synced: false, practicePushed: false, reviewMode: false });
  const [toolState, setToolState] = useState<ClassroomToolStateDTO>(() => defaultGenericToolState(nodeId));
  useEffect(() => {
    let alive = true;
    const refresh = () => Promise.all([textbookApi.classroomSession(nodeId), textbookApi.classroomTools(nodeId)]).then(([nextSession, nextTools]) => {
      if (!alive) return;
      setSession(nextSession);
      setToolState(nextTools);
    }).catch(() => undefined);
    void refresh();
    const onRealtime = () => refresh();
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    const timer = window.setInterval(refresh, 15000);
    return () => { alive = false; window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime); window.clearInterval(timer); };
  }, [nodeId]);
  return <main className="node-present-page generic-present-page"><header className="present-top"><span>{node.nodeId} · {node.title}</span><strong>{session.synced ? '课堂同步中' : '投屏待命'}</strong></header><section className="present-slide-focus"><p>{modeCopy.present.eyebrow}</p><h1>{node.headline}</h1>{session.practicePushed && <em>练习已推送到学生端</em>}{session.reviewMode && <em>正在讲评学生提交</em>}</section><EvidencePanel nodeId={nodeId} />{toolState.activeTool && <GenericPresentTool nodeId={nodeId} toolState={toolState} />}<section className="present-review-card">{node.outputs.map((item) => <span key={item}>{item}</span>)}</section><footer className="present-conclusion">{node.subtitle}</footer></main>;
}

function GenericPresentTool({ nodeId, toolState }: { nodeId: string; toolState: ClassroomToolStateDTO }) {
  const [poll, setPoll] = useState<ClassroomPollResultsDTO | null>(null);
  const [messages, setMessages] = useState<ClassroomDiscussionMessageDTO[]>([]);
  const remaining = useGenericRemainingSeconds(toolState);
  useEffect(() => {
    let alive = true;
    const refresh = () => {
      if (toolState.activeTool === 'poll') void textbookApi.classroomPoll(nodeId).then((result) => { if (alive) setPoll(result); }).catch(() => undefined);
      if (toolState.activeTool === 'discussion') void textbookApi.classroomDiscussion(nodeId).then((result) => { if (alive) setMessages(result); }).catch(() => undefined);
    };
    refresh();
    const onRealtime = () => refresh();
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    return () => { alive = false; window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime); };
  }, [nodeId, toolState.activeTool]);
  if (toolState.activeTool === 'poll') return <section className="present-live-tool"><strong>随堂投票 · {poll?.submitted ?? 0}/42</strong>{(poll?.options ?? []).map((item) => <span key={item.label}>{item.label}<b>{item.count}票</b></span>)}</section>;
  if (toolState.activeTool === 'discussion') return <section className="present-live-tool"><strong>弹幕讨论</strong>{messages.length ? messages.slice(0, 3).map((item) => <span key={item.id}>{item.studentName}：{item.content}</span>) : <span>等待第一条课堂观点。</span>}</section>;
  if (toolState.activeTool === 'group') return <section className="present-live-tool"><strong>小组任务</strong><span>{toolState.prompt}</span></section>;
  return <section className="present-live-tool timer"><strong>{formatGenericSeconds(remaining)}</strong><span>{toolState.prompt}</span></section>;
}

function NodeTaskPath({ nodeId, mode }: { nodeId: string; mode: Exclude<GenericExperienceMode, 'present'> }) {
  const node = getLearningNodeExperience(nodeId)!;
  const routePrefix = mode === 'classroom' ? '/classroom' : mode === 'teacher' ? '/teacher/sessions' : '/learn';
  const taskNodes = capabilityNodes
    .filter((item) => item.project === node.projectId && item.task === node.taskId && (item.id === 'P4T2-N04' || Boolean(getLearningNodeExperience(item.id))))
    .sort((left, right) => left.id.localeCompare(right.id));
  const p4Flow = node.projectId === 'P4' ? p4TaskFlow : [];

  return <section className="node-task-path" aria-label="任务节点路径">
    <div><p className="eyebrow">任务路径</p><strong>{node.taskId}</strong><span>{node.projectId === 'P4' ? '实施、验证、报告之间可直接切换，任务内节点按顺序学习。' : '当前项目样章已接入自学、课堂与教师端。'}</span></div>
    <nav>
      {taskNodes.map((item) => <Link key={item.id} className={item.id === nodeId ? 'is-active' : ''} href={`${routePrefix}/${item.id}/`}><b>{item.id.slice(-3)}</b><span>{item.label}</span></Link>)}
    </nav>
    {p4Flow.length > 0 && <div className="node-task-bridges">{p4Flow.map((item) => <Link key={item.id} className={item.id === nodeId ? 'is-current' : ''} href={`${routePrefix}/${item.id}/`}>{item.task} · {item.title}</Link>)}</div>}
  </section>;
}

function LearningRecordPanel({ nodeId }: { nodeId: string }) {
  const [records, setRecords] = useState<ClassroomSubmissionDTO[]>([]);
  const node = getLearningNodeExperience(nodeId)!;

  useEffect(() => {
    let alive = true;
    const refresh = () => textbookApi.classroomSubmissions(nodeId).then((items) => {
      if (alive) setRecords(items.filter((item) => item.studentId === getGenericStudentId()));
    }).catch(() => undefined);
    void refresh();
    const onRealtime = () => refresh();
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    return () => { alive = false; window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime); };
  }, [nodeId]);

  const latest = records[0];
  return <section className="node-section learning-record-panel">
    <div className="section-heading"><div><p className="eyebrow">学习记录</p><h3>本节点的可讲评证据</h3></div><span>{latest ? `已保存 ${records.length} 次课堂作答` : '完成课堂任务后会自动沉淀在这里。'}</span></div>
    {latest ? <div className="learning-record-grid"><article><strong>最近结论</strong><p>{latest.conclusion || latest.answer}</p></article><article><strong>已选证据</strong><p>{latest.selectedEvidence.join('、') || '未标注'}</p></article><article><strong>课堂得分</strong><b>{latest.score} 分</b><span>{new Date(latest.createdAt).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span></article></div> : <div className="learning-record-empty"><strong>{node.outputs[0]}</strong><span>尚未产生。进入课堂跟随页提交一次作答即可形成学习记录。</span><Link href={`/classroom/${nodeId}`}>去完成课堂任务</Link></div>}
  </section>;
}

function EvidencePanel({ nodeId }: { nodeId: string }) {
  const node = getLearningNodeExperience(nodeId)!;
  return <section className="node-section generic-evidence-panel"><div className="section-heading"><h3>关键证据</h3><span>每项指标都要回到场景与判断边界。</span></div><div className="node-evidence-grid">{node.evidence.map((item) => <article key={item.label}><strong>{item.label}</strong><b>{item.value}</b><span>{item.target}</span><em>{item.status}</em></article>)}</div></section>;
}

function NodeUnavailable({ nodeId }: { nodeId: string }) {
  return <main className="node-experience"><section className="node-hero"><div><p className="eyebrow">数字教材节点</p><h1>节点正在建设中</h1><p>{nodeId} 还没有对应的深度学习数据。</p></div><aside><strong>返回项目链</strong><Link className="node-primary-link" href="/course">返回课程</Link></aside></section></main>;
}

function getGenericStudentId() {
  if (typeof window === 'undefined') return 'generic-student-demo';
  const key = 'dgbook-generic-student-id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `student-${Date.now().toString(36)}`;
  window.localStorage.setItem(key, next);
  return next;
}
