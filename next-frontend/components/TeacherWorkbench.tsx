'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  readClassroomId,
  textbookApi,
  type AIStudyInsightDTO,
  type ClassroomSessionStateDTO,
  type SelfStudyAnalyticsDTO,
  type SelfStudyProgressDTO
} from '@/lib/api';
import { CLASSROOM_REALTIME_EVENT } from '@/lib/classroom-realtime';
import {
  getLearningNodeExperience,
  projectLearningPaths,
  projects
} from '@/lib/textbook-data';
import type { Navigate } from './types';

type NodeAnalytics = {
  nodeId: string;
  title: string;
  analytics: SelfStudyAnalyticsDTO;
};

function recordScore(record: SelfStudyProgressDTO) {
  const assessment = record.formalTestAttempts > 0 ? record.bestScore : record.practiceScore;
  const review = record.reviewStatus === '已认证' ? 100 : record.reviewStatus === '待审核' ? 70 : record.reviewStatus === '需修改' ? 40 : 0;
  return Math.round(record.abilityScore * .35 + assessment * .5 + review * .15);
}

export function TeacherWorkbench({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const path = useMemo(() => projectLearningPaths[project.id] ?? [], [project.id]);
  const [items, setItems] = useState<NodeAnalytics[]>([]);
  const [activeSession, setActiveSession] = useState<ClassroomSessionStateDTO | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [studentInsight, setStudentInsight] = useState<AIStudyInsightDTO | null>(null);
  const [insightState, setInsightState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewState, setReviewState] = useState<'idle' | 'saving'>('idle');
  const [reviewMessage, setReviewMessage] = useState('');
  const [demoResetState, setDemoResetState] = useState<'idle' | 'saving'>('idle');
  const [demoResetMessage, setDemoResetMessage] = useState('');

  useEffect(() => {
    setSelectedStudentId('');
    setSelectedNodeId('');
    setStudentInsight(null);
    setInsightState('idle');
    setReviewComment('');
    setReviewMessage('');
  }, [project.id]);

  useEffect(() => {
    let alive = true;
    async function refresh() {
      if (!path.length) {
        setItems([]);
        setLoadState('ready');
        return;
      }
      try {
        const [analytics, session] = await Promise.all([
          Promise.all(path.map(async (node) => ({ ...node, analytics: await textbookApi.selfStudyAnalytics(node.nodeId) }))),
          textbookApi.activeClassroomSession().catch(() => null)
        ]);
        if (!alive) return;
        setItems(analytics);
        setActiveSession(session);
        setLoadState('ready');
      } catch {
        if (alive) setLoadState('error');
      }
    }
    setLoadState('loading');
    void refresh();
    const onRealtime = () => { void refresh(); };
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    const timer = window.setInterval(refresh, 15000);
    return () => {
      alive = false;
      window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
      window.clearInterval(timer);
    };
  }, [path]);

  const records = items.flatMap((item) => item.analytics.cards ?? []);
  const students = useMemo(() => Array.from(records.reduce((map, record) => {
    const current = map.get(record.studentId) ?? {
      id: record.studentId,
      name: record.studentName,
      scores: [] as number[],
      formalTests: 0,
      completedNodes: 0,
      pendingReviews: 0,
      needsRevision: false,
      duration: 0,
      lastNodeId: '',
      lastUpdatedAt: 0,
      records: [] as SelfStudyProgressDTO[],
      weakPoints: new Set<string>()
    };
    current.scores.push(recordScore(record));
    if (record.formalTestAttempts > 0) current.formalTests++;
    if ((record.completedSteps?.length ?? 0) >= 6) current.completedNodes++;
    if (record.reviewStatus === '待审核') current.pendingReviews++;
    if (record.reviewStatus === '需修改') current.needsRevision = true;
    current.duration += record.timeSpentSeconds;
    current.records.push(record);
    if (record.updatedAt >= current.lastUpdatedAt) {
      current.lastUpdatedAt = record.updatedAt;
      current.lastNodeId = record.nodeId;
    }
    record.wrongKnowledgePoints?.forEach((point) => current.weakPoints.add(point));
    map.set(record.studentId, current);
    return map;
  }, new Map<string, {
    id: string;
    name: string;
    scores: number[];
    formalTests: number;
    completedNodes: number;
    pendingReviews: number;
    needsRevision: boolean;
    duration: number;
    lastNodeId: string;
    lastUpdatedAt: number;
    records: SelfStudyProgressDTO[];
    weakPoints: Set<string>;
  }>()).values()).map((student) => ({
    ...student,
    weakPoints: Array.from(student.weakPoints),
    score: student.scores.length ? Math.round(student.scores.reduce((sum, score) => sum + score, 0) / student.scores.length) : 0
  })), [records]);

  const projectScore = students.length ? Math.round(students.reduce((sum, student) => sum + student.score, 0) / students.length) : 0;
  const testedStudents = students.filter((student) => student.formalTests > 0).length;
  const reachedStudents = students.filter((student) => student.score >= 60).length;
  const pendingReviews = students.reduce((sum, student) => sum + student.pendingReviews, 0);
  const highestNodeScore = Math.max(0, ...records.map((record) => record.formalTestAttempts > 0 ? record.bestScore : record.practiceScore));
  const activeNode = path.find((node) => node.nodeId === activeSession?.nodeId) ?? path.find((node) => {
    const analytics = items.find((item) => item.nodeId === node.nodeId)?.analytics;
    return analytics && analytics.completed < analytics.students;
  }) ?? path[0];
  const activeExperience = activeNode ? getLearningNodeExperience(activeNode.nodeId) : null;
  const commonErrors = items.flatMap((item) => item.analytics.typicalErrors ?? [])
    .reduce((map, error) => map.set(error.label, (map.get(error.label) ?? 0) + error.count), new Map<string, number>());
  const weakPoints = Array.from(commonErrors.entries()).sort((left, right) => right[1] - left[1]).slice(0, 3);
  const classroomLive = Boolean(activeSession?.synced && activeSession.nodeId);
  const priorityStudents = [...students].sort((left, right) => {
    if (left.pendingReviews !== right.pendingReviews) return right.pendingReviews - left.pendingReviews;
    if (left.needsRevision !== right.needsRevision) return left.needsRevision ? -1 : 1;
    if ((left.score < 60) !== (right.score < 60)) return left.score < 60 ? -1 : 1;
    return left.score - right.score || right.lastUpdatedAt - left.lastUpdatedAt;
  }).slice(0, 8);
  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const selectedRecord = selectedStudent?.records.find((record) => record.nodeId === selectedNodeId)
    ?? selectedStudent?.records.find((record) => record.nodeId === selectedStudent.lastNodeId)
    ?? selectedStudent?.records[0];

  useEffect(() => {
    setReviewComment(selectedRecord?.reviewComment ?? '');
  }, [selectedRecord?.nodeId, selectedRecord?.reviewComment, selectedRecord?.reviewStatus, selectedRecord?.studentId]);

  useEffect(() => {
    setReviewMessage('');
  }, [selectedRecord?.nodeId, selectedRecord?.outputSubmittedAt, selectedRecord?.studentId]);

  function openStudent(student: (typeof students)[number]) {
    setSelectedStudentId(student.id);
    setSelectedNodeId(student.lastNodeId || student.records[0]?.nodeId || '');
    setStudentInsight(null);
    setInsightState('idle');
    setReviewMessage('');
  }

  async function generateStudentInsight() {
    if (!selectedStudent || !selectedRecord) return;
    setInsightState('loading');
    setStudentInsight(null);
    try {
      const insight = await textbookApi.generateStudyInsight({
        classId: readClassroomId(),
        nodeId: selectedRecord.nodeId,
        studentId: selectedStudent.id
      });
      setStudentInsight(insight);
      setInsightState('idle');
    } catch {
      setInsightState('error');
    }
  }

  async function reviewSelected(status: '需修改' | '已认证') {
    if (!selectedRecord || reviewState === 'saving') return;
    const comment = reviewComment.trim();
    if (!selectedRecord.studentOutput || selectedRecord.outputSubmittedAt <= 0) {
      setReviewMessage('该生尚未提交学习产出，暂时不能审核。');
      return;
    }
    if (status === '需修改' && !comment) {
      setReviewMessage('退回修改前请填写具体审核意见。');
      return;
    }
    setReviewState('saving');
    setReviewMessage('');
    try {
      const saved = await textbookApi.reviewSelfStudyProgress({
        nodeId: selectedRecord.nodeId,
        studentId: selectedRecord.studentId,
        status,
        comment
      });
      setItems((current) => current.map((item) => item.nodeId === saved.nodeId
        ? {
            ...item,
            analytics: {
              ...item.analytics,
              cards: item.analytics.cards.map((record) => record.studentId === saved.studentId ? saved : record),
              updatedAt: saved.updatedAt
            }
          }
        : item));
      setReviewComment(saved.reviewComment);
      setReviewMessage(status === '已认证' ? '已认证，结果已实时回流学生端。' : '已退回，学生端会显示修改意见。');
    } catch {
      setReviewMessage('审核保存失败，请检查后端服务后重试。');
    } finally {
      setReviewState('idle');
    }
  }

  async function resetDemoStates() {
    if (demoResetState === 'saving') return;
    setDemoResetState('saving');
    setDemoResetMessage('');
    try {
      const summary = await textbookApi.resetDemoStudents(readClassroomId());
      setDemoResetMessage(`已重置 ${summary.resetStudents} 个演示账号，并生成 ${summary.seededRecords} 条可验收记录。`);
      window.dispatchEvent(new CustomEvent(CLASSROOM_REALTIME_EVENT, { detail: { type: 'demo-reset' } }));
    } catch {
      setDemoResetMessage('演示状态重置失败，请确认后端和 PostgreSQL 已连接。');
    } finally {
      setDemoResetState('idle');
    }
  }

  return (
    <div className="teacher-workbench">
      <section className="panel teacher-workbench-head">
        <div>
          <p className="eyebrow">教师工作台 · {readClassroomId()}</p>
          <h2>{project.id} {project.title}</h2>
          <p>从班级学习记录进入备课、授课和批阅，数据随学生自学与课堂提交实时更新。</p>
        </div>
        <div className={`teacher-live-state ${classroomLive ? 'is-live' : ''}`}>
          <span>{classroomLive ? '课堂进行中' : '课堂未同步'}</span>
          <strong>{classroomLive ? activeSession?.nodeId : '可开始备课'}</strong>
        </div>
      </section>

      <section className="teacher-demo-reset" aria-label="演示账号状态">
        <div><strong>三种演示学情</strong><span>student01 从零开始 · student02 退回修改 · student03 完整成果</span></div>
        {demoResetMessage ? <p aria-live="polite">{demoResetMessage}</p> : null}
        <button disabled={demoResetState === 'saving'} onClick={() => void resetDemoStates()} type="button">{demoResetState === 'saving' ? '正在重置…' : '重置演示状态'}</button>
      </section>

      {activeNode ? <section className="panel teacher-recent-class">
        <div>
          <p className="eyebrow">最近授课位置</p>
          <h3>{activeNode.nodeId} · {activeNode.title}</h3>
          <p>{activeExperience?.headline ?? '进入当前项目节点，继续组织讲解、同步和批阅。'}</p>
        </div>
        <div className="teacher-recent-actions">
          <Link className="primary-action" href={`/teacher/sessions/${activeNode.nodeId}`}>{classroomLive ? '继续授课' : '进入授课台'}</Link>
          <button className="secondary-action" onClick={() => onNavigate('graph')} type="button">课程能力图谱</button>
        </div>
      </section> : null}

      <section className="teacher-workbench-section">
        <header>
          <div><p className="eyebrow">实时班级概况</p><h3>学习、测试与审核状态</h3></div>
          <span>{loadState === 'loading' ? '正在读取 PostgreSQL 记录' : loadState === 'error' ? '数据服务暂时不可用' : `最近刷新 · ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`}</span>
        </header>
        <div className="teacher-workbench-metrics">
          <article><span>产生学习记录</span><strong>{students.length}</strong><small>名学生</small></article>
          <article><span>正式测试</span><strong>{testedStudents}/{students.length || 0}</strong><small>已产生测试成绩</small></article>
          <article><span>任务 / 项目均分</span><strong>{projectScore}</strong><small>按学生去重汇总</small></article>
          <article><span>节点最高分</span><strong>{highestNodeScore}</strong><small>微练习或正式测试</small></article>
          <article><span>达到项目标准</span><strong>{reachedStudents}</strong><small>综合分不低于 60</small></article>
          <article className={pendingReviews ? 'needs-attention' : ''}><span>待批阅产出</span><strong>{pendingReviews}</strong><small>{pendingReviews ? '进入节点授课台处理' : '当前没有待办'}</small></article>
        </div>
      </section>

      <section className="teacher-workbench-grid">
        <div className="panel teacher-node-overview">
          <header><div><p className="eyebrow">节点进度</p><h3>{project.id} 顺序学习路径</h3></div><span>{items.filter((item) => item.analytics.students > 0).length}/{path.length} 个节点产生数据</span></header>
          {path.length ? <div>
            {path.map((node, index) => {
              const analytics = items.find((item) => item.nodeId === node.nodeId)?.analytics;
              return <Link className={node.nodeId === activeNode?.nodeId ? 'is-current' : ''} href={`/teacher/sessions/${node.nodeId}`} key={node.nodeId}>
                <b>{index + 1}</b>
                <div><strong>{node.title}</strong><span>{node.nodeId}</span></div>
                <dl><div><dt>记录</dt><dd>{analytics?.students ?? 0}人</dd></div><div><dt>完成</dt><dd>{analytics?.completed ?? 0}人</dd></div><div><dt>正确率</dt><dd>{analytics?.averageAccuracy ?? 0}%</dd></div></dl>
              </Link>;
            })}
          </div> : <div className="teacher-workbench-empty">该项目暂未配置顺序学习样章。</div>}
        </div>

        <aside className="panel teacher-workbench-insight">
          <p className="eyebrow">讲评准备</p>
          <h3>今天优先处理</h3>
          {weakPoints.length ? <div className="teacher-weak-list">{weakPoints.map(([label, count], index) => <article key={label}><b>{index + 1}</b><div><strong>{label}</strong><span>{count} 次相关错误</span></div></article>)}</div> : <div className="teacher-workbench-empty">学生完成练习后，这里会汇总班级典型错误。</div>}
          <div className="teacher-workbench-suggestion">
            <strong>建议讲评顺序</strong>
            <p>{weakPoints.length ? `先回到“${weakPoints[0][0]}”对应的场景与证据，再让学生修正结论并重新提交。` : '先完成一次学生自学或课堂作答，再根据真实错误生成讲评重点。'}</p>
          </div>
          {activeNode ? <Link href={`/teacher/sessions/${activeNode.nodeId}`}>查看学情与批阅</Link> : null}
        </aside>
      </section>

      <section className="panel teacher-student-focus">
        <header>
          <div><p className="eyebrow">重点学生</p><h3>真实学习记录与处理入口</h3></div>
          <span>{students.length ? `按待批阅与薄弱程度排列 · ${students.length} 名学生` : '等待学生产生学习记录'}</span>
        </header>
        {priorityStudents.length ? <div className="teacher-student-table">
          <div className="teacher-student-table-head"><span>学生</span><span>节点进度</span><span>项目成绩</span><span>正式测试</span><span>学习时长</span><span>状态</span><span>处理</span></div>
          {priorityStudents.map((student) => {
            const needsSupport = student.needsRevision || student.score < 60;
            const status = student.pendingReviews > 0 ? '待批阅' : needsSupport ? '需支持' : student.completedNodes >= path.length ? '已达标' : '学习中';
            const statusKey = student.pendingReviews > 0 ? 'review' : needsSupport ? 'support' : student.completedNodes >= path.length ? 'reached' : 'learning';
            const targetNodeId = student.lastNodeId || activeNode?.nodeId;
            return <article className={selectedStudentId === student.id ? 'is-selected' : ''} key={student.id}>
              <div><strong>{student.name || student.id}</strong><small>{student.weakPoints.slice(0, 2).join('、') || '暂无错误知识点'}</small></div>
              <span>{student.completedNodes}/{path.length}</span>
              <b>{student.score}</b>
              <span>{student.formalTests}/{path.length}</span>
              <span>{Math.max(1, Math.round(student.duration / 60))} 分钟</span>
              <em className={`status-${statusKey}`}>{status}</em>
              {targetNodeId ? <button type="button" onClick={() => openStudent(student)}>详情</button> : <span>暂无</span>}
            </article>;
          })}
        </div> : <div className="teacher-workbench-empty teacher-student-empty">学生开始 P1/P2 自学后，这里会按真实成绩、错误知识点和审核状态形成教师待办。</div>}
        {selectedStudent && selectedRecord ? <section className="teacher-student-detail">
          <header>
            <div>
              <p className="eyebrow">学生详情</p>
              <h4>{selectedStudent.name || selectedStudent.id}</h4>
              <span>{selectedStudent.id} · 当前查看 {selectedRecord.nodeId}</span>
            </div>
            <button type="button" aria-label="关闭学生详情" onClick={() => setSelectedStudentId('')}>×</button>
          </header>
          <div className="teacher-student-detail-metrics">
            <article><span>完成阶段</span><strong>{selectedRecord.completedSteps.length}/6</strong></article>
            <article><span>能力数</span><strong>{selectedRecord.abilityScore}</strong></article>
            <article><span>正式测试</span><strong>{selectedRecord.formalTestAttempts ? selectedRecord.bestScore : '未测试'}</strong></article>
            <article><span>审核状态</span><strong>{selectedRecord.reviewStatus || '未提交'}</strong></article>
          </div>
          <div className="teacher-student-node-tabs" aria-label="选择学生学习节点">
            {[...selectedStudent.records]
              .sort((left, right) => path.findIndex((node) => node.nodeId === left.nodeId) - path.findIndex((node) => node.nodeId === right.nodeId))
              .map((record) => <button
                className={record.nodeId === selectedRecord.nodeId ? 'is-active' : ''}
                key={record.nodeId}
                type="button"
                onClick={() => {
                  setSelectedNodeId(record.nodeId);
                  setStudentInsight(null);
                  setInsightState('idle');
                  setReviewMessage('');
                }}
              >{record.nodeId}</button>)}
          </div>
          <div className="teacher-student-detail-grid">
            <div className="teacher-student-evidence">
              <h5>学习证据</h5>
              <dl>
                <div><dt>学习时长</dt><dd>{Math.max(1, Math.round(selectedRecord.timeSpentSeconds / 60))} 分钟</dd></div>
                <div><dt>微练习</dt><dd>{selectedRecord.practiceScore} 分 / {selectedRecord.practiceAttempts} 次</dd></div>
                <div><dt>正式测试</dt><dd>{selectedRecord.formalTestAttempts ? `${selectedRecord.firstScore} / ${selectedRecord.bestScore} / ${selectedRecord.latestScore}` : '尚未完成'}</dd></div>
                <div><dt>错误知识点</dt><dd>{selectedRecord.wrongKnowledgePoints.join('、') || '暂无记录'}</dd></div>
                <div><dt>学习产出</dt><dd>{selectedRecord.studentOutput || '尚未提交'}</dd></div>
                <div><dt>产出版本</dt><dd>{selectedRecord.outputVersions?.length ? `v${selectedRecord.outputVersions.length} · ${selectedRecord.outputVersions.length} 个快照已保留` : '尚未形成正式版本'}</dd></div>
                <div><dt>审核意见</dt><dd>{selectedRecord.reviewComment || '暂无意见'}</dd></div>
              </dl>
              <div className={`teacher-workbench-review ${selectedRecord.reviewStatus === '需修改' ? 'is-returned' : selectedRecord.reviewStatus === '已认证' ? 'is-certified' : ''}`}>
                <div><strong>直接审核</strong><span>{selectedRecord.reviewStatus || '未提交'}</span></div>
                <textarea
                  disabled={selectedRecord.reviewStatus === '已认证'}
                  maxLength={300}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="填写审核意见；退回修改时必填"
                  value={reviewComment}
                />
                <div className="teacher-workbench-review-actions">
                  <button
                    className="secondary"
                    disabled={reviewState === 'saving' || !selectedRecord.studentOutput || selectedRecord.reviewStatus === '已认证'}
                    onClick={() => void reviewSelected('需修改')}
                    type="button"
                  >退回修改</button>
                  <button
                    disabled={reviewState === 'saving' || !selectedRecord.studentOutput || selectedRecord.reviewStatus === '已认证'}
                    onClick={() => void reviewSelected('已认证')}
                    type="button"
                  >{selectedRecord.reviewStatus === '已认证' ? '已认证' : '认证通过'}</button>
                </div>
                {reviewMessage ? <p aria-live="polite">{reviewMessage}</p> : null}
              </div>
              <Link href={`/teacher/sessions/${selectedRecord.nodeId}`}>打开完整节点记录</Link>
            </div>
            <div className="teacher-student-ai">
              <div>
                <p className="eyebrow">AI 讲评建议</p>
                <h5>基于该生真实记录</h5>
              </div>
              {studentInsight ? <div className="teacher-student-ai-result">
                <article><span>学习概况</span><p>{studentInsight.summary}</p></article>
                <article><span>首要问题</span><p>{studentInsight.focus}</p></article>
                <article><span>建议动作</span><p>{studentInsight.action}</p></article>
                <small>{studentInsight.provider === 'DeepSeek' ? 'DeepSeek 实时生成' : '本地规则生成'} · 仅依据当前节点记录</small>
              </div> : <p className="teacher-student-ai-empty">{insightState === 'error' ? '暂时无法生成，请稍后重试。' : '生成后将给出个人学习概况、首要薄弱点和教师下一步动作。'}</p>}
              <button type="button" disabled={insightState === 'loading'} onClick={() => void generateStudentInsight()}>
                {insightState === 'loading' ? '正在分析…' : studentInsight ? '重新生成' : '生成 AI 讲评建议'}
              </button>
            </div>
          </div>
        </section> : null}
      </section>
    </div>
  );
}
