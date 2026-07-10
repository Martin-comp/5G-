'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  classroomTasks,
  learningNodeExperiences,
  mobilityMetrics,
  p4NodeExperience,
  p4Tasks,
  projectTaskMap,
  projects,
  teacherSuggestions
} from '@/lib/textbook-data';
import {
  textbookApi,
  readClassroomId,
  type ClassroomAnalyticsDTO,
  type ClassroomDiscussionMessageDTO,
  type ClassroomGroupResponseDTO,
  type ClassroomLearningPortfolioDTO,
  type ClassroomPollResultsDTO,
  type ClassroomSubmissionDTO
} from '@/lib/api';
import {
  defaultP4ToolState,
  fetchP4ClassroomSync,
  fetchP4ClassroomTools,
  p4TeacherSlides,
  pushP4ClassroomSync,
  pushP4ClassroomTools,
  type P4ClassroomSyncState,
  type P4ClassroomToolState
} from '@/lib/classroom-sync';
import { CLASSROOM_REALTIME_EVENT } from '@/lib/classroom-realtime';
import type { Navigate } from './types';

type TeacherPanelTab = 'script' | 'question' | 'board' | 'answer';

const panelTabs: { key: TeacherPanelTab; label: string }[] = [
  { key: 'script', label: '讲解脚本' },
  { key: 'question', label: '课堂提问' },
  { key: 'board', label: '板书提示' },
  { key: 'answer', label: '典型答案' }
];

const commonMistakes = [
  { label: '把覆盖达标当成体验闭环', count: 18, level: '高' },
  { label: '忽略切换失败集中区', count: 14, level: '中' },
  { label: '未关联短掉线日志', count: 10, level: '低' }
];

const priorityItems = [
  { level: '高', title: '切换成功率未达标原因', count: 18 },
  { level: '中', title: '重建次数异常', count: 14 },
  { level: '低', title: '短掉线日志判读', count: 10 }
];

const toolButtons: {
  key: 'poll' | 'discussion' | 'group' | 'timer';
  label: string;
  prompt: string;
}[] = [
  { key: 'poll', label: '随堂投票', prompt: '请判断：当前投诉属于静止点问题还是移动路径问题？' },
  { key: 'discussion', label: '弹幕讨论', prompt: '请用一句话说明：覆盖达标为什么还不能直接验收？' },
  { key: 'group', label: '小组任务', prompt: '每组选择一项证据，说明它如何支撑“移动性未闭环”。' },
  { key: 'timer', label: '计时器', prompt: '限时 5 分钟完成课堂小任务并提交。' }
];

export function TeacherPage({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[3];
  const isP4 = project.id === 'P4';

  if (!isP4) {
    return <TeacherProjectOverview projectId={project.id} onNavigate={onNavigate} />;
  }

  return <P4TeacherConsole onNavigate={onNavigate} />;
}

function TeacherProjectOverview({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[3];
  const tasks = projectTaskMap[project.id] ?? [];
  const learningNode = learningNodeExperiences.find((item) => item.projectId === project.id);

  return (
    <div className="teacher-overview-v2">
      <section className="teacher-overview-hero panel">
        <div>
          <p className="eyebrow">教师端 · 项目备课</p>
          <h2>{project.id} {project.title}</h2>
          <p>{project.note}。该项目已接入案例讲解、课堂跟随、教师讲评、投屏与卡牌互动的一条样章闭环。</p>
        </div>
        <button className="primary-action" onClick={() => onNavigate('project')} type="button">查看项目结构</button>
      </section>

      <section className="teacher-prep-grid">
        {tasks.map((task) => (
          <article key={task.id} className="panel teacher-prep-card">
            <span>{task.id}</span>
            <strong>{task.title}</strong>
            <p>{task.desc}</p>
            <em>{task.status}</em>
          </article>
        ))}
      </section>

      <section className="panel teacher-next-template">
        <h3>本项目端侧学习闭环</h3>
        <div>
          {learningNode ? <>
            <Link href={`/learn/${learningNode.nodeId}`}>学生自学页</Link>
            <Link href={`/classroom/${learningNode.nodeId}`}>学生课堂页</Link>
            <Link href={`/teacher/sessions/${learningNode.nodeId}`}>教师授课页</Link>
            <Link href={`/present/${learningNode.nodeId}`}>课堂投屏页</Link>
            <Link href={`/game?project=${project.id}`}>卡牌互动与讲评</Link>
          </> : <span>正在补充端侧学习数据</span>}
        </div>
      </section>
    </div>
  );
}

function P4TeacherConsole({ onNavigate }: { onNavigate: Navigate }) {
  const [activeSlide, setActiveSlide] = useState('3');
  const [activeTab, setActiveTab] = useState<TeacherPanelTab>('script');
  const [synced, setSynced] = useState(false);
  const [practicePushed, setPracticePushed] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [toolState, setToolState] = useState<P4ClassroomToolState>(defaultP4ToolState);
  const [analytics, setAnalytics] = useState<ClassroomAnalyticsDTO | null>(null);
  const [portfolio, setPortfolio] = useState<ClassroomLearningPortfolioDTO | null>(null);
  const [submissions, setSubmissions] = useState<ClassroomSubmissionDTO[]>([]);
  const [poll, setPoll] = useState<ClassroomPollResultsDTO | null>(null);
  const [discussionMessages, setDiscussionMessages] = useState<ClassroomDiscussionMessageDTO[]>([]);
  const [groupResponses, setGroupResponses] = useState<ClassroomGroupResponseDTO[]>([]);
  const [classroomId, setClassroomId] = useState('通信2301班');
  const page = p4TeacherSlides.find((item) => item.id === activeSlide) ?? p4TeacherSlides[2];
  const progress = useMemo(() => `${activeSlide} / ${p4TeacherSlides.length}`, [activeSlide]);
  const commonMistakeItems = analytics?.commonMistakes ?? commonMistakes;
  const priorityItemList = analytics?.priorityItems ?? priorityItems.map((item) => ({ label: item.title, count: item.count, level: item.level }));
  const submitted = analytics?.submitted ?? 36;
  const totalStudents = analytics?.totalStudents ?? 42;
  const submitRate = analytics?.submitRate ?? '85.7%';

  useEffect(() => {
    setClassroomId(readClassroomId());
    let alive = true;
    async function hydrateClassroom() {
      const [session, tools] = await Promise.all([
        fetchP4ClassroomSync(),
        fetchP4ClassroomTools()
      ]);
      if (!alive) return;
      setActiveSlide(session.slideId);
      setSynced(session.synced);
      setPracticePushed(session.practicePushed);
      setReviewMode(session.reviewMode);
      setToolState(tools);
    }
    void hydrateClassroom();
    const onRealtime = () => { void hydrateClassroom(); };
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    return () => {
      alive = false;
      window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    async function refreshDashboard() {
      try {
        const [nextAnalytics, nextSubmissions, nextTools, nextPoll, nextDiscussion, nextGroups, nextPortfolio] = await Promise.all([
          textbookApi.classroomAnalytics(p4NodeExperience.nodeId),
          textbookApi.classroomSubmissions(p4NodeExperience.nodeId),
          fetchP4ClassroomTools(),
          textbookApi.classroomPoll(p4NodeExperience.nodeId),
          textbookApi.classroomDiscussion(p4NodeExperience.nodeId),
          textbookApi.classroomGroups(p4NodeExperience.nodeId),
          textbookApi.classroomPortfolio()
        ]);
        if (!alive) return;
        setAnalytics(nextAnalytics);
        setSubmissions(nextSubmissions);
        setToolState(nextTools);
        setPoll(nextPoll);
        setDiscussionMessages(nextDiscussion);
        setGroupResponses(nextGroups);
        setPortfolio(nextPortfolio);
      } catch {
        // Keep the demo fallback visible when the backend is waking up.
      }
    }
    void refreshDashboard();
    const onRealtime = () => { void refreshDashboard(); };
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    const timer = window.setInterval(refreshDashboard, 15000);
    return () => {
      alive = false;
      window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
      window.clearInterval(timer);
    };
  }, []);

  function publishSession(overrides: Partial<P4ClassroomSyncState> = {}) {
    const next: P4ClassroomSyncState = {
      classId: readClassroomId(),
      nodeId: p4NodeExperience.nodeId,
      slideId: overrides.slideId ?? activeSlide,
      synced: overrides.synced ?? synced,
      practicePushed: overrides.practicePushed ?? practicePushed,
      reviewMode: overrides.reviewMode ?? reviewMode,
      updatedAt: Date.now(),
      updatedBy: overrides.updatedBy ?? 'teacher'
    };
    setActiveSlide(next.slideId);
    setSynced(next.synced);
    setPracticePushed(next.practicePushed);
    setReviewMode(next.reviewMode);
    void pushP4ClassroomSync(next);
  }

  function selectSlide(slideId: string) {
    publishSession({ slideId });
  }

  function moveSlide(delta: number) {
    const next = Math.max(1, Math.min(p4TeacherSlides.length, Number(activeSlide) + delta));
    publishSession({ slideId: String(next) });
  }

  function toggleTool(toolKey: (typeof toolButtons)[number]['key']) {
    const tool = toolButtons.find((item) => item.key === toolKey);
    const shouldClose = toolState.activeTool === toolKey;
    const next: P4ClassroomToolState = {
      ...defaultP4ToolState,
      ...toolState,
      classId: readClassroomId(),
      nodeId: p4NodeExperience.nodeId,
      activeTool: shouldClose ? '' : toolKey,
      pollOpen: !shouldClose && toolKey === 'poll',
      discussionOpen: !shouldClose && toolKey === 'discussion',
      groupTaskOpen: !shouldClose && toolKey === 'group',
      timerRunning: !shouldClose && toolKey === 'timer',
      timerSeconds: toolKey === 'timer' && !shouldClose ? 300 : toolState.timerSeconds,
      prompt: shouldClose ? defaultP4ToolState.prompt : (tool?.prompt ?? defaultP4ToolState.prompt),
      updatedAt: Date.now()
    };
    setToolState(next);
    void pushP4ClassroomTools(next);
  }

  return (
    <div className="teacher-console-v2">
      <section className="teacher-classbar panel">
        <div>
          <p className="eyebrow">教师授课控制台</p>
          <h2>5G网络优化结果验证 · P4T2-N04</h2>
        </div>
        <div className="teacher-class-meta">
          <span>班级：{classroomId}</span>
          <span>课时：第18课时</span>
          <span className={synced ? 'is-live' : ''}>学生端：{synced ? '已同步' : '待同步'}</span>
        </div>
      </section>

      <section className="teacher-console-grid">
        <aside className="teacher-slide-rail panel">
          <div className="teacher-rail-head">
            <strong>课件页</strong>
            <span>{progress}</span>
          </div>
          <div className="teacher-slide-list">
            {p4TeacherSlides.map((slide) => (
              <button key={slide.id} className={activeSlide === slide.id ? 'active' : ''} onClick={() => selectSlide(slide.id)} type="button">
                <b>{slide.id}</b>
                <span>{slide.thumb}</span>
                <strong>{slide.title}</strong>
                <small>{slide.desc}</small>
              </button>
            ))}
          </div>
          <div className="teacher-rail-actions">
            <button className="secondary-action" type="button">新建页</button>
            <button className="secondary-action" type="button">导入PPT</button>
          </div>
        </aside>

        <main className="teacher-stage-v2 panel">
          <div className="teacher-stage-head">
            <span>{p4NodeExperience.nodeId}</span>
            <strong>{page.title}</strong>
            <button className="secondary-action" type="button">适应宽度</button>
          </div>
          <section className="teacher-main-slide">
            <p className="eyebrow">当前讲授</p>
            <h3>{p4NodeExperience.headline}</h3>
            <p>{p4NodeExperience.subtitle}</p>
            <div className="teacher-route-v2">
              {p4NodeExperience.route.map((item, index) => (
                <article key={item.place}>
                  <b>{index + 1}</b>
                  <strong>{item.place}</strong>
                  <span>{item.signal}</span>
                </article>
              ))}
            </div>
            <div className="teacher-evidence-v2">
              {mobilityMetrics.map((metric) => (
                <article key={metric.label} className={metric.tone}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.target}</small>
                  <em>{metric.status}</em>
                </article>
              ))}
            </div>
            <div className="teacher-conclusion-v2">覆盖改善，但移动性未闭环</div>
          </section>
        </main>

        <aside className="teacher-control-v2 panel">
          <div className="teacher-panel-tabs">
            {panelTabs.map((tab) => (
              <button key={tab.key} className={activeTab === tab.key ? 'active' : ''} onClick={() => setActiveTab(tab.key)} type="button">
                {tab.label}
              </button>
            ))}
          </div>
          <TeacherPanelContent activeTab={activeTab} />
          <div className="teacher-tool-grid">
            {toolButtons.map((tool) => (
              <button key={tool.key} className={toolState.activeTool === tool.key ? 'active' : ''} onClick={() => toggleTool(tool.key)} type="button">
                {tool.label}
              </button>
            ))}
          </div>
          <div className="teacher-tool-status">
            <strong>{toolState.activeTool ? '工具已开启' : '工具待开启'}</strong>
            <span>{toolState.prompt}</span>
          </div>
          <TeacherToolMonitor toolState={toolState} poll={poll} messages={discussionMessages} groups={groupResponses} />
        </aside>
      </section>

      <section className="teacher-bottom-grid">
        <article className="panel teacher-student-overview">
          <h3>学生学习证据概览</h3>
          <div className="teacher-donut">
            <strong>{submitted}</strong>
            <span>/ {totalStudents}人</span>
          </div>
          <p>提交率 {submitRate}，{analytics ? `平均分 ${analytics.averageScore}，需重点讲评 ${analytics.needsReview} 人。` : '仍有 6 人未完成本页证据标注。'}</p>
        </article>

        <article className="panel teacher-error-list">
          <h3>常见错误 Top 3</h3>
          {commonMistakeItems.slice(0, 3).map((item, index) => (
            <div key={item.label}>
              <b>{index + 1}</b>
              <span>{item.label}</span>
              <em>{item.count}人</em>
            </div>
          ))}
        </article>

        <article className="panel teacher-priority-list">
          <h3>讲评优先级建议</h3>
          {priorityItemList.slice(0, 3).map((item) => (
            <div key={item.label} className={`level-${item.level}`}>
              <b>{item.level}</b>
              <span>{item.label}</span>
              <em>{item.count}人</em>
            </div>
          ))}
        </article>

        <article className="panel teacher-submission-stream">
          <h3>最新学生提交</h3>
          {submissions.length === 0 ? (
            <p>暂无真实提交，当前显示样张统计。学生在课堂跟随页提交后，这里会自动刷新。</p>
          ) : submissions.slice(0, 3).map((item) => (
            <div key={item.id}>
              <strong>{item.studentName}</strong>
              <span>{item.conclusion || item.answer}</span>
              <em>{item.score}分</em>
            </div>
          ))}
        </article>
      </section>

      <ClassroomPortfolio portfolio={portfolio} />

      <footer className="teacher-action-bar">
        <button className="secondary-action dark" onClick={() => moveSlide(-1)} type="button">上一页</button>
        <button className="secondary-action dark" onClick={() => moveSlide(1)} type="button">下一页</button>
        <Link className="secondary-action dark route-action-link" href="/present/P4T2-N04">打开投屏</Link>
        <button className="secondary-action dark" onClick={() => publishSession({ synced: true })} type="button">{synced ? '学生端已同步' : '同步学生端'}</button>
        <button className="secondary-action dark" onClick={() => publishSession({ practicePushed: true, synced: true })} type="button">{practicePushed ? '练习已推送' : '推送练习'}</button>
        <button className="primary-action" onClick={() => { setActiveTab('answer'); publishSession({ reviewMode: true, synced: true }); }} type="button">{reviewMode ? '正在讲评' : '开始讲评'}</button>
        <button className="secondary-action dark" onClick={() => publishSession({ synced: false, practicePushed: false, reviewMode: false })} type="button">解除课堂控制</button>
      </footer>
    </div>
  );
}

function ClassroomPortfolio({ portfolio }: { portfolio: ClassroomLearningPortfolioDTO | null }) {
  const nodeTitle = (nodeId: string) => {
    if (nodeId === p4NodeExperience.nodeId) return '读移动性指标';
    return learningNodeExperiences.find((item) => item.nodeId === nodeId)?.title ?? nodeId;
  };

  return (
    <section className="teacher-learning-portfolio panel">
      <div className="portfolio-heading">
        <div><p className="eyebrow">班级学习档案</p><h3>跨节点学习证据</h3></div>
        <span>{portfolio ? `${portfolio.classId} · 自动汇总课堂作答` : '正在读取课堂记录'}</span>
      </div>
      {!portfolio || portfolio.totalSubmissions === 0 ? (
        <div className="portfolio-empty"><strong>还没有跨节点学习记录</strong><p>学生提交任一课堂任务后，这里会汇总节点、得分与待讲评情况。</p></div>
      ) : <>
        <div className="portfolio-metrics">
          <article><strong>{portfolio.totalSubmissions}</strong><span>课堂作答</span></article>
          <article><strong>{portfolio.uniqueStudents}</strong><span>参与学生</span></article>
          <article><strong>{portfolio.activeNodes}</strong><span>已覆盖节点</span></article>
          <article><strong>{portfolio.averageScore}</strong><span>平均得分</span></article>
        </div>
        <div className="portfolio-grid">
          <div className="portfolio-node-list">
            {portfolio.nodes.slice(0, 5).map((node) => <article key={node.nodeId}>
              <div><strong>{nodeTitle(node.nodeId)}</strong><span>{node.nodeId}</span></div>
              <b>{node.submitted} 份</b><em>均分 {node.averageScore} · 待讲评 {node.needsReview}</em>
            </article>)}
          </div>
          <div className="portfolio-recent-list">
            <strong>最新证据</strong>
            {portfolio.recent.slice(0, 3).map((item) => <article key={item.id}><b>{item.studentName}</b><span>{item.conclusion || item.answer}</span><em>{item.score}分</em></article>)}
          </div>
        </div>
      </>}
    </section>
  );
}

function TeacherToolMonitor({
  toolState,
  poll,
  messages,
  groups
}: {
  toolState: P4ClassroomToolState;
  poll: ClassroomPollResultsDTO | null;
  messages: ClassroomDiscussionMessageDTO[];
  groups: ClassroomGroupResponseDTO[];
}) {
  if (!toolState.activeTool) {
    return <div className="teacher-live-monitor empty"><span>选择一个课堂工具后，可在这里查看学生实时反馈。</span></div>;
  }

  if (toolState.activeTool === 'poll') {
    const leading = poll?.options.reduce((result, item) => item.count > result.count ? item : result, poll.options[0]);
    return (
      <div className="teacher-live-monitor">
        <strong>投票实时结果</strong>
        <span>{poll?.submitted ?? 0}/42 人已作答</span>
        <p>{leading?.count ? `当前最多：${leading.label}（${leading.count}票）` : '等待第一位同学作答。'}</p>
      </div>
    );
  }

  if (toolState.activeTool === 'discussion') {
    return <div className="teacher-live-monitor"><strong>讨论区</strong><span>已收到 {messages.length} 条观点</span><p>{messages[0]?.content ?? '等待学生的一句话判断。'}</p></div>;
  }

  if (toolState.activeTool === 'group') {
    return <div className="teacher-live-monitor"><strong>小组任务</strong><span>已提交 {groups.length} 组证据</span><p>{groups[0]?.conclusion ?? '等待小组形成证据链结论。'}</p></div>;
  }

  return <div className="teacher-live-monitor"><strong>计时器进行中</strong><span>{formatTeacherTimer(toolState)} 剩余</span><p>学生端会同步倒计时；教师再次点击可停止计时。</p></div>;
}

function formatTeacherTimer(toolState: P4ClassroomToolState) {
  const elapsed = toolState.timerRunning ? Math.floor((Date.now() - toolState.updatedAt) / 1000) : 0;
  const remaining = Math.max(0, toolState.timerSeconds - elapsed);
  return `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
}

function TeacherPanelContent({ activeTab }: { activeTab: TeacherPanelTab }) {
  if (activeTab === 'question') {
    return (
      <div className="teacher-side-content">
        {classroomTasks.map((task, index) => (
          <article key={task}>
            <b>{index + 1}</b>
            <strong>{task}</strong>
            <p>提示学生围绕移动路径、指标证据和结论边界作答。</p>
          </article>
        ))}
      </div>
    );
  }

  if (activeTab === 'board') {
    return (
      <div className="teacher-side-content">
        {p4Tasks.slice(1, 7).map((task) => (
          <article key={task.id}>
            <b>{task.id.replace('N0', '')}</b>
            <strong>{task.title}</strong>
            <p>{task.desc}</p>
          </article>
        ))}
      </div>
    );
  }

  if (activeTab === 'answer') {
    return (
      <div className="teacher-side-content">
        {p4NodeExperience.practice.map((item, index) => (
          <article key={item.question}>
            <b>{index + 1}</b>
            <strong>{item.answer}</strong>
            <p>{item.reason}</p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="teacher-side-content">
      {teacherSuggestions.map((item, index) => (
        <article key={item.title}>
          <b>{index + 1}</b>
          <strong>{item.title}</strong>
          <p>{item.desc}</p>
        </article>
      ))}
    </div>
  );
}
