'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  P4_CLASSROOM_SYNC_EVENT,
  P4_CLASSROOM_SYNC_KEY,
  defaultP4ToolState,
  defaultP4SyncState,
  fetchP4ClassroomSync,
  fetchP4ClassroomTools,
  getP4TeacherSlide,
  p4TeacherSlides,
  type P4ClassroomToolState,
  type P4ClassroomSyncState
} from '@/lib/classroom-sync';
import { CLASSROOM_REALTIME_EVENT } from '@/lib/classroom-realtime';
import {
  textbookApi,
  type ClassroomSubmissionDTO,
  type ClassroomDiscussionMessageDTO,
  type ClassroomPollResultsDTO
} from '@/lib/api';
import { p4NodeExperience, p4TaskFlow, p4Tasks } from '@/lib/textbook-data';
import { readAuthName } from './AuthGate';

type ExperienceMode = 'learn' | 'classroom' | 'teacher' | 'present';

const modeCopy: Record<ExperienceMode, { eyebrow: string; title: string; desc: string }> = {
  learn: {
    eyebrow: '学生端 · 自主学习',
    title: '先自学，再进入课堂跟随',
    desc: '按案例、术语、证据、练习的顺序完成课前理解，并保留可讲评的学习记录。'
  },
  classroom: {
    eyebrow: '学生端 · 课堂跟随',
    title: '只跟随教师当前讲解',
    desc: '本页面向学生课堂使用：接收当前讲授内容，完成本页小任务，等待教师讲评。'
  },
  teacher: {
    eyebrow: '教师端 · 授课控制台',
    title: '组织讲解、同步学生、准备讲评',
    desc: '教师查看讲解脚本、学生状态和任务提交情况，并组织互动与讲评。'
  },
  present: {
    eyebrow: '投屏端 · 大屏展示',
    title: '投屏聚焦核心问题',
    desc: '大屏只保留移动路径、关键证据和讲评结论，避免课堂展示信息过载。'
  }
};

export function P4NodeExperience({ mode }: { mode: ExperienceMode }) {
  const data = p4NodeExperience;
  const copy = modeCopy[mode];

  if (mode === 'present') {
    return <PresentBody />;
  }

  return (
    <main className={`node-experience node-${mode}`}>
      <header className="node-topbar">
        <Link className="node-brand" href="/course?project=P4">
          <span>5G</span>
          <strong>5G网络优化（高级）</strong>
          <em>数字教材</em>
        </Link>
        <nav aria-label="P4节点端侧导航">
          <Link className={mode === 'learn' ? 'is-active' : ''} href={`/learn/${data.nodeId}`}>自学</Link>
          <Link className={mode === 'classroom' ? 'is-active' : ''} href={`/classroom/${data.nodeId}`}>课堂跟随</Link>
          <Link className={mode === 'teacher' ? 'is-active' : ''} href={`/teacher/sessions/${data.nodeId}`}>教师端</Link>
        </nav>
      </header>

      <section className="node-hero">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{data.taskId} {data.title}</h1>
          <h2>{data.headline}</h2>
          <p>{copy.desc}</p>
        </div>
        <aside>
          <strong>{copy.title}</strong>
          <span>{data.subtitle}</span>
        </aside>
      </section>

      <section className="node-task-path p4-n04-task-path" aria-label="P4任务路径">
        <div><p className="eyebrow">P4任务路径</p><strong>P4-T2 · 结果验证</strong><span>当前位于移动性指标节点，可向前复核覆盖判断，向后完成依据、结论与报告输出。</span></div>
        <nav>{p4Tasks.map((item) => <Link key={item.id} className={item.id === 'N04' ? 'is-active' : ''} href={`/learn/P4T2-${item.id}`}><b>{item.id}</b><span>{item.title}</span></Link>)}</nav>
        <div className="node-task-bridges">{p4TaskFlow.map((item) => <Link key={item.id} className={item.id === data.nodeId ? 'is-current' : ''} href={`/learn/${item.id}`}>{item.task} · {item.title}</Link>)}</div>
      </section>

      {mode === 'learn' && <LearnBody />}
      {mode === 'classroom' && <ClassroomBody />}
      {mode === 'teacher' && <TeacherBody />}
    </main>
  );
}

function LearnBody() {
  const data = p4NodeExperience;
  return (
    <>
      <section className="node-section two-column">
        <article className="node-card">
          <p className="eyebrow">案例导入</p>
          <h3>为什么不能只看覆盖？</h3>
          <p>{data.caseIntro}</p>
        </article>
        <article className="node-card">
          <p className="eyebrow">本页学习顺序</p>
          <div className="step-list">
            {data.learningSteps.map((step, index) => (
              <div key={step.title}><b>{index + 1}</b><strong>{step.title}</strong><span>{step.desc}</span></div>
            ))}
          </div>
        </article>
      </section>

      <section className="node-section">
        <div className="section-heading"><h3>术语解释</h3><span>先理解每个指标能说明什么，也要知道它不能单独证明什么。</span></div>
        <div className="term-grid">
          {data.terms.map((term) => (
            <article key={term.title}><strong>{term.title}</strong><p>{term.desc}</p></article>
          ))}
        </div>
      </section>

      <EvidenceRoute />

      <P4LearningRecord />

      <section className="node-section two-column">
        <article className="node-card">
          <p className="eyebrow">即时反馈</p>
          <h3>本页结论</h3>
          <p>覆盖指标可以说明静止点质量改善，但移动路径上仍有切换失败、重建偏多和短掉线日志，因此不能直接判定体验闭环。</p>
        </article>
        <article className="node-card">
          <p className="eyebrow">进入下一步</p>
          <h3>自学完成后进入课堂跟随</h3>
          <p>课堂中教师会同步当前页，集中讲评“哪些证据能支撑移动性未闭环”。</p>
          <Link className="node-primary-link" href={`/classroom/${data.nodeId}`}>进入课堂跟随</Link>
        </article>
      </section>
    </>
  );
}

function P4LearningRecord() {
  const [records, setRecords] = useState<ClassroomSubmissionDTO[]>([]);

  useEffect(() => {
    let alive = true;
    const refresh = () => textbookApi.classroomSubmissions(p4NodeExperience.nodeId).then((items) => {
      if (alive) setRecords(items.filter((item) => item.studentId === getDemoStudentId()));
    }).catch(() => undefined);
    void refresh();
    const onRealtime = () => refresh();
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    return () => { alive = false; window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime); };
  }, []);

  const latest = records[0];
  return <section className="node-section learning-record-panel">
    <div className="section-heading"><div><p className="eyebrow">学习记录</p><h3>本页移动性证据</h3></div><span>{latest ? `已保存 ${records.length} 次作答` : '完成课堂作答后会自动沉淀在这里。'}</span></div>
    {latest ? <div className="learning-record-grid"><article><strong>边界结论</strong><p>{latest.conclusion || latest.answer}</p></article><article><strong>关键依据</strong><p>{latest.selectedEvidence.join('、') || '未标注'}</p></article><article><strong>讲评得分</strong><b>{latest.score} 分</b><span>{new Date(latest.createdAt).toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span></article></div> : <div className="learning-record-empty"><strong>移动性验证流程</strong><span>尚未生成。进入课堂跟随页提交结论后，教师端即可查看并讲评。</span><Link href={`/classroom/${p4NodeExperience.nodeId}`}>去完成课堂任务</Link></div>}
  </section>;
}

function ClassroomBody() {
  const data = p4NodeExperience;
  return (
    <>
      <ClassroomSyncPanel />
      <EvidenceRoute />
      <section className="node-section two-column classroom-panel">
        <article className="node-card">
          <p className="eyebrow">课堂小任务</p>
          <h3>本页需要提交什么？</h3>
          <div className="practice-list">
            {data.practice.map((item, index) => (
              <div key={item.question}><b>{index + 1}</b><strong>{item.question}</strong><span>参考方向：{item.answer}</span></div>
            ))}
          </div>
        </article>
        <article className="node-card">
          <p className="eyebrow">学生状态</p>
          <h3>提交本页作答</h3>
          <ClassroomSubmissionForm />
        </article>
      </section>
    </>
  );
}

function ClassroomSubmissionForm() {
  const data = p4NodeExperience;
  const [answer, setAnswer] = useState('覆盖已改善，但移动性未闭环，需要继续复核切换成功率、重建次数和短掉线日志。');
  const [conclusion, setConclusion] = useState('覆盖改善，但移动性未闭环');
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>(['切换成功率', '重建次数']);
  const [status, setStatus] = useState('');
  const evidenceOptions = ['切换成功率', '重建次数', '短掉线日志', 'A-B边界', '食堂入口'];

  function toggleEvidence(item: string) {
    setSelectedEvidence((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  async function submitWork() {
    setStatus('正在提交...');
    const score = Math.min(100, selectedEvidence.length * 15 + (conclusion.includes('未闭环') ? 25 : 0));
    try {
      const result = await textbookApi.submitClassroomWork({
        nodeId: data.nodeId,
        taskId: `${data.nodeId}-classroom`,
        studentId: getDemoStudentId(),
        studentName: readAuthName() || '学生端演示',
        answer,
        evidence: selectedEvidence,
        conclusion,
        score,
        selectedEvidence
      });
      setStatus(`已提交：${result.score}分，等待教师讲评。`);
    } catch {
      setStatus('提交失败：后端可能正在唤醒，请稍后再试。');
    }
  }

  return (
    <div className="classroom-submit-form">
      <label>
        选择依据
        <div className="evidence-choice-row">
          {evidenceOptions.map((item) => (
            <button key={item} className={selectedEvidence.includes(item) ? 'active' : ''} onClick={() => toggleEvidence(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </label>
      <label>
        边界结论
        <input value={conclusion} onChange={(event) => setConclusion(event.target.value)} />
      </label>
      <label>
        说明依据
        <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} />
      </label>
      <button className="primary-action full" onClick={submitWork} type="button">提交课堂作答</button>
      {status && <p className="submit-status">{status}</p>}
    </div>
  );
}

function ClassroomSyncPanel() {
  const [syncState, setSyncState] = useState<P4ClassroomSyncState>(defaultP4SyncState);
  const [toolState, setToolState] = useState<P4ClassroomToolState>(defaultP4ToolState);
  const slide = useMemo(() => getP4TeacherSlide(syncState.slideId), [syncState.slideId]);
  const updatedAt = syncState.updatedAt ? new Date(syncState.updatedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '待同步';

  useEffect(() => {
    async function refresh() {
      const [nextSync, nextTools] = await Promise.all([
        fetchP4ClassroomSync(),
        fetchP4ClassroomTools()
      ]);
      setSyncState(nextSync);
      setToolState(nextTools);
    }

    function refreshFromStorage(event: StorageEvent) {
      if (event.key === P4_CLASSROOM_SYNC_KEY) void refresh();
    }

    function refreshFromLocalEvent() {
      void refresh();
    }

    void refresh();
    window.addEventListener(P4_CLASSROOM_SYNC_EVENT, refreshFromLocalEvent);
    window.addEventListener(CLASSROOM_REALTIME_EVENT, refreshFromLocalEvent);
    window.addEventListener('storage', refreshFromStorage);
    const timer = window.setInterval(refresh, 15000);
    return () => {
      window.removeEventListener(P4_CLASSROOM_SYNC_EVENT, refreshFromLocalEvent);
      window.removeEventListener(CLASSROOM_REALTIME_EVENT, refreshFromLocalEvent);
      window.removeEventListener('storage', refreshFromStorage);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section className="node-section classroom-sync-panel">
      <div className="classroom-sync-head">
        <div>
          <p className="eyebrow">课堂同步</p>
          <h3>{syncState.synced ? `正在跟随教师：第 ${slide.id} 页` : '等待教师同步当前页'}</h3>
          <p>{syncState.synced ? slide.focus : '教师点击“同步学生端”后，本页会切换为当前讲解内容。'}</p>
        </div>
        <span className={syncState.synced ? 'is-live' : ''}>{syncState.synced ? '已同步' : '待同步'}</span>
      </div>

      <div className="classroom-sync-current">
        <strong>{slide.title}</strong>
        <span>{slide.desc}</span>
        <small>更新时间：{updatedAt}</small>
      </div>

      <div className="classroom-sync-steps">
        {p4TeacherSlides.map((item) => (
          <span key={item.id} className={item.id === slide.id ? 'active' : ''}>{item.id}. {item.title}</span>
        ))}
      </div>

      {syncState.practicePushed && (
        <div className="classroom-practice-live">
          <strong>教师已推送练习</strong>
          <span>请完成本页课堂小任务，提交后等待教师讲评。</span>
        </div>
      )}

      {toolState.activeTool && (
        <>
          <div className="classroom-tool-live">
            <strong>课堂工具已开启：{toolLabel(toolState.activeTool)}</strong>
            <span>{toolState.prompt}</span>
          </div>
          <ClassroomLiveTool toolState={toolState} />
        </>
      )}

      {syncState.reviewMode && (
        <div className="classroom-tool-live review">
          <strong>教师正在讲评</strong>
          <span>请对照自己的作答，关注移动性证据链是否完整。</span>
        </div>
      )}
    </section>
  );
}

function PresentBody() {
  const data = p4NodeExperience;
  const [syncState, setSyncState] = useState<P4ClassroomSyncState>(defaultP4SyncState);
  const [toolState, setToolState] = useState<P4ClassroomToolState>(defaultP4ToolState);
  const slide = useMemo(() => getP4TeacherSlide(syncState.slideId), [syncState.slideId]);

  useEffect(() => {
    let alive = true;
    async function refresh() {
      const [next, nextTools] = await Promise.all([fetchP4ClassroomSync(), fetchP4ClassroomTools()]);
      if (!alive) return;
      setSyncState(next);
      setToolState(nextTools);
    }
    void refresh();
    const onRealtime = () => { void refresh(); };
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    const timer = window.setInterval(refresh, 15000);
    return () => {
      alive = false;
      window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <main className="node-present-page">
      <header className="present-top">
        <span>{data.nodeId} · {slide.title}</span>
        <strong>{slide.id} / {p4TeacherSlides.length}</strong>
      </header>
      <section className="present-slide-focus">
        <p>{slide.desc}</p>
        <h1>{slide.focus}</h1>
        {syncState.practicePushed && <em>练习已推送到学生端</em>}
        {syncState.reviewMode && <em>正在讲评学生提交</em>}
      </section>
      {slide.id === '1' && (
        <section className="present-case-card">
          <strong>案例线索</strong>
          <p>{data.caseIntro}</p>
        </section>
      )}
      {(slide.id === '2' || slide.id === '3') && (
        <>
          <section className="present-route">
            {data.route.map((item, index) => (
              <article key={item.place}>
                <b>{index + 1}</b>
                <strong>{item.place}</strong>
                <span>{item.signal}</span>
              </article>
            ))}
          </section>
          <section className="present-evidence">
            {data.evidence.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <em>{item.status}</em>
              </article>
            ))}
          </section>
        </>
      )}
      {slide.id === '4' && (
        <section className="present-practice-card">
          {data.practice.map((item, index) => (
            <article key={item.question}><b>{index + 1}</b><strong>{item.question}</strong><span>{item.answer}</span></article>
          ))}
        </section>
      )}
      {slide.id === '5' && (
        <section className="present-review-card">
          {data.outputs.map((item) => <span key={item}>{item}</span>)}
        </section>
      )}
      {toolState.activeTool && <PresentLiveTool toolState={toolState} />}
      <footer className="present-conclusion">覆盖已改善，但移动性未闭环：还需要继续复核 A-B 边界切换质量和重建原因。</footer>
    </main>
  );
}

function ClassroomLiveTool({ toolState }: { toolState: P4ClassroomToolState }) {
  const nodeId = p4NodeExperience.nodeId;
  const studentId = getDemoStudentId();
  const [poll, setPoll] = useState<ClassroomPollResultsDTO | null>(null);
  const [selectedPoll, setSelectedPoll] = useState('');
  const [messages, setMessages] = useState<ClassroomDiscussionMessageDTO[]>([]);
  const [message, setMessage] = useState('');
  const [groupEvidence, setGroupEvidence] = useState<string[]>(['切换成功率']);
  const [groupConclusion, setGroupConclusion] = useState('切换成功率未达标，说明移动路径上的切换质量仍需复核。');
  const [status, setStatus] = useState('');
  const remaining = useRemainingSeconds(toolState);

  useEffect(() => {
    let alive = true;
    async function refresh() {
      try {
        if (toolState.activeTool === 'poll') {
          const next = await textbookApi.classroomPoll(nodeId);
          if (alive) setPoll(next);
        }
        if (toolState.activeTool === 'discussion') {
          const next = await textbookApi.classroomDiscussion(nodeId);
          if (alive) setMessages(next);
        }
      } catch {
        // The outer classroom still works through the local sync fallback.
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 2500);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [nodeId, toolState.activeTool]);

  async function submitPoll() {
    if (!selectedPoll) {
      setStatus('请先选择一个判断。');
      return;
    }
    try {
      await textbookApi.submitPollResponse({ nodeId, studentId, studentName: readAuthName() || '学生端演示', option: selectedPoll });
      setPoll(await textbookApi.classroomPoll(nodeId));
      setStatus('投票已提交，结果会同步给教师端。');
    } catch {
      setStatus('投票提交失败，请稍后再试。');
    }
  }

  async function submitMessage() {
    if (!message.trim()) {
      setStatus('请先写下一句话观点。');
      return;
    }
    try {
      await textbookApi.postClassroomDiscussion({ nodeId, studentId, studentName: readAuthName() || '学生端演示', content: message.trim() });
      setMessage('');
      setMessages(await textbookApi.classroomDiscussion(nodeId));
      setStatus('观点已发送到课堂讨论区。');
    } catch {
      setStatus('发送失败，请稍后再试。');
    }
  }

  async function submitGroupTask() {
    try {
      await textbookApi.submitClassroomGroup({
        nodeId,
        studentId,
        studentName: readAuthName() || '学生端演示',
        evidence: groupEvidence,
        conclusion: groupConclusion
      });
      setStatus('小组证据已提交，教师端会收到本组结论。');
    } catch {
      setStatus('小组任务提交失败，请稍后再试。');
    }
  }

  function toggleGroupEvidence(item: string) {
    setGroupEvidence((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  if (toolState.activeTool === 'poll') {
    const total = Math.max(poll?.submitted ?? 0, 1);
    const options = poll?.options ?? [
      { label: '静止点覆盖不足', count: 0 },
      { label: '移动路径切换过程', count: 0 },
      { label: '终端单点故障', count: 0 }
    ];
    return (
      <div className="live-tool-card">
        <div className="live-tool-heading"><span>随堂投票</span><small>{poll?.submitted ?? 0}/42 人已作答</small></div>
        <div className="live-poll-options">
          {options.map((item) => (
            <button key={item.label} className={selectedPoll === item.label ? 'active' : ''} onClick={() => setSelectedPoll(item.label)} type="button">
              <span>{item.label}</span><em>{item.count}票</em><i style={{ width: `${Math.round(item.count / total * 100)}%` }} />
            </button>
          ))}
        </div>
        <button className="primary-action" onClick={submitPoll} type="button">提交投票</button>
        {status && <p className="live-tool-status">{status}</p>}
      </div>
    );
  }

  if (toolState.activeTool === 'discussion') {
    return (
      <div className="live-tool-card">
        <div className="live-tool-heading"><span>弹幕讨论</span><small>{messages.length} 条课堂观点</small></div>
        <div className="live-message-list">
          {messages.length === 0 ? <p>还没有同学发言，先说出你的判断。</p> : messages.slice(0, 4).map((item) => <div key={item.id}><strong>{item.studentName}</strong><span>{item.content}</span></div>)}
        </div>
        <div className="live-tool-composer">
          <input value={message} maxLength={80} onChange={(event) => setMessage(event.target.value)} placeholder="用一句话写出你的判断" />
          <button className="primary-action" onClick={submitMessage} type="button">发送</button>
        </div>
        {status && <p className="live-tool-status">{status}</p>}
      </div>
    );
  }

  if (toolState.activeTool === 'group') {
    const evidence = ['A-B边界', '切换成功率', '重建次数', '短掉线日志'];
    return (
      <div className="live-tool-card">
        <div className="live-tool-heading"><span>小组任务</span><small>选择证据并形成一句结论</small></div>
        <div className="evidence-choice-row compact">
          {evidence.map((item) => <button key={item} className={groupEvidence.includes(item) ? 'active' : ''} onClick={() => toggleGroupEvidence(item)} type="button">{item}</button>)}
        </div>
        <textarea value={groupConclusion} maxLength={120} onChange={(event) => setGroupConclusion(event.target.value)} />
        <button className="primary-action" onClick={submitGroupTask} type="button">提交小组证据</button>
        {status && <p className="live-tool-status">{status}</p>}
      </div>
    );
  }

  return (
    <div className="live-tool-card timer-card">
      <div className="live-tool-heading"><span>课堂计时器</span><small>{toolState.timerRunning ? '教师正在计时' : '计时已暂停'}</small></div>
      <strong>{formatSeconds(remaining)}</strong>
      <p>{remaining > 0 ? '请在倒计时结束前完成本页小任务并提交。' : '倒计时结束，请等待教师下一步安排。'}</p>
    </div>
  );
}

function PresentLiveTool({ toolState }: { toolState: P4ClassroomToolState }) {
  const nodeId = p4NodeExperience.nodeId;
  const [poll, setPoll] = useState<ClassroomPollResultsDTO | null>(null);
  const [messages, setMessages] = useState<ClassroomDiscussionMessageDTO[]>([]);
  const remaining = useRemainingSeconds(toolState);

  useEffect(() => {
    let alive = true;
    async function refresh() {
      try {
        if (toolState.activeTool === 'poll') {
          const next = await textbookApi.classroomPoll(nodeId);
          if (alive) setPoll(next);
        }
        if (toolState.activeTool === 'discussion') {
          const next = await textbookApi.classroomDiscussion(nodeId);
          if (alive) setMessages(next);
        }
      } catch {
        // Projection stays usable even when the remote service is waking up.
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 2500);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [nodeId, toolState.activeTool]);

  if (toolState.activeTool === 'poll') {
    return <section className="present-live-tool"><p>随堂投票 · {poll?.submitted ?? 0}/42 人已作答</p><div>{(poll?.options ?? []).map((item) => <span key={item.label}><b>{item.count}</b>{item.label}</span>)}</div></section>;
  }
  if (toolState.activeTool === 'discussion') {
    return <section className="present-live-tool"><p>弹幕讨论</p><div>{messages.slice(0, 3).map((item) => <span key={item.id}>{item.content}</span>)}</div></section>;
  }
  if (toolState.activeTool === 'group') {
    return <section className="present-live-tool"><p>小组任务进行中</p><div><span>{toolState.prompt}</span></div></section>;
  }
  return <section className="present-live-tool timer"><p>课堂计时</p><strong>{formatSeconds(remaining)}</strong></section>;
}

function useRemainingSeconds(toolState: P4ClassroomToolState) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!toolState.timerRunning) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [toolState.timerRunning]);
  if (!toolState.timerRunning) return toolState.timerSeconds;
  const elapsed = Math.floor((now - toolState.updatedAt) / 1000);
  return Math.max(0, toolState.timerSeconds - elapsed);
}

function formatSeconds(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

function TeacherBody() {
  const data = p4NodeExperience;
  return (
    <section className="teacher-session-layout">
      <div className="teacher-session-main">
        <EvidenceRoute />
        <section className="node-section">
          <div className="section-heading"><h3>讲解脚本</h3><span>教师可以按这三步组织课堂。</span></div>
          <div className="teacher-script-list">
            {data.teacherScript.map((item, index) => <article key={item}><b>{index + 1}</b><p>{item}</p></article>)}
          </div>
        </section>
      </div>
      <aside className="teacher-session-side">
        <h3>课堂控制</h3>
        <Link href={`/classroom/${data.nodeId}`}>同步学生跟随页</Link>
        <Link href="/game/?project=P4">进入互动闯关</Link>
        <div className="teacher-side-block">
          <strong>评价产出</strong>
          {data.outputs.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="teacher-side-block">
          <strong>评价标准</strong>
          {data.rubric.map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    </section>
  );
}

function EvidenceRoute() {
  const data = p4NodeExperience;
  return (
    <section className="node-section">
      <div className="section-heading"><h3>证据读取</h3><span>把移动路径和三项移动性证据放在一起看。</span></div>
      <div className="node-route">
        {data.route.map((item, index) => (
          <article key={item.place}>
            <b>{index + 1}</b>
            <strong>{item.place}</strong>
            <span>{item.signal}</span>
            <small>{item.note}</small>
          </article>
        ))}
      </div>
      <div className="node-evidence-grid">
        {data.evidence.map((item) => (
          <article key={item.label}>
            <strong>{item.label}</strong>
            <b>{item.value}</b>
            <span>{item.target}</span>
            <em>{item.status}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

function toolLabel(activeTool: string) {
  const labels: Record<string, string> = {
    poll: '随堂投票',
    discussion: '弹幕讨论',
    group: '小组任务',
    timer: '计时器'
  };
  return labels[activeTool] ?? activeTool;
}

function getDemoStudentId() {
  if (typeof window === 'undefined') return 'student-demo';
  const key = 'dgbook-demo-student-id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `student-${Date.now().toString(36)}`;
  window.localStorage.setItem(key, next);
  return next;
}
