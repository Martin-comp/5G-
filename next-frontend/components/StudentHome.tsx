'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AuthBadge, readAuthName } from './AuthGate';
import { textbookApi, type ClassroomSessionStateDTO, type SelfStudyProgressDTO } from '@/lib/api';
import { CLASSROOM_REALTIME_EVENT } from '@/lib/classroom-realtime';
import { getLearningNodeExperience, projectLearningPaths, projects } from '@/lib/textbook-data';

function readStudentId() {
  const key = 'dgbook-generic-student-id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `student-${Date.now().toString(36)}`;
  window.localStorage.setItem(key, next);
  return next;
}

function nodeCompleted(record?: SelfStudyProgressDTO) {
  return Boolean(record && (record.completedSteps?.length ?? 0) >= 6 && record.practiceScore >= 100 && record.formalTestAttempts > 0 && record.outputSubmittedAt > 0);
}

function progressScore(record?: SelfStudyProgressDTO) {
  if (!record) return 0;
  const assessment = record.formalTestAttempts > 0 ? record.bestScore : record.practiceScore;
  const review = record.reviewStatus === '已认证' ? 100 : record.reviewStatus === '待审核' ? 70 : record.reviewStatus === '需修改' ? 40 : 0;
  return Math.round(record.abilityScore * .35 + assessment * .5 + review * .15);
}

function normalizeProgress(record: SelfStudyProgressDTO): SelfStudyProgressDTO {
  return {
    ...record,
    completedSteps: record.completedSteps ?? [],
    abilities: record.abilities ?? [],
    wrongKnowledgePoints: record.wrongKnowledgePoints ?? [],
    practiceAttempts: record.practiceAttempts ?? 0,
    practiceScore: record.practiceScore ?? 0,
    formalTestAttempts: record.formalTestAttempts ?? 0,
    bestScore: record.bestScore ?? 0,
    reviewStatus: record.reviewStatus ?? '',
    outputSubmittedAt: record.outputSubmittedAt ?? 0
  };
}

export function StudentHome() {
  const [projectId, setProjectId] = useState('P1');
  const [studentName, setStudentName] = useState('同学');
  const [records, setRecords] = useState<Record<string, SelfStudyProgressDTO>>({});
  const [session, setSession] = useState<ClassroomSessionStateDTO | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const path = useMemo(() => projectLearningPaths[projectId] ?? [], [projectId]);
  const project = projects.find((item) => item.id === projectId) ?? projects[0];

  useEffect(() => {
    setStudentName(readAuthName() || '同学');
  }, []);

  useEffect(() => {
    let alive = true;
    async function refresh() {
      try {
        const studentId = readStudentId();
        const [progress, activeSession] = await Promise.all([
          Promise.all(path.map(async (node) => [node.nodeId, await textbookApi.selfStudyProgress(node.nodeId, studentId)] as const)),
          textbookApi.activeClassroomSession().catch(() => null)
        ]);
        if (!alive) return;
        setRecords(Object.fromEntries(progress.map(([nodeId, record]) => [nodeId, normalizeProgress(record)])));
        setSession(activeSession);
        setLoadState('ready');
      } catch {
        if (alive) setLoadState('error');
      }
    }
    setLoadState('loading');
    void refresh();
    const onRealtime = () => { void refresh(); };
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    return () => {
      alive = false;
      window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    };
  }, [path]);

  const currentNode = path.find((node) => !nodeCompleted(records[node.nodeId])) ?? path[path.length - 1];
  const currentExperience = currentNode ? getLearningNodeExperience(currentNode.nodeId) : null;
  const currentRecord = currentNode ? records[currentNode.nodeId] : undefined;
  const completedNodes = path.filter((node) => nodeCompleted(records[node.nodeId])).length;
  const projectCompleted = path.length > 0 && completedNodes === path.length;
  const projectScore = path.length ? Math.round(path.reduce((sum, node) => sum + progressScore(records[node.nodeId]), 0) / path.length) : 0;
  const taskScore = currentRecord ? progressScore(currentRecord) : projectScore;
  const classroomAvailable = Boolean(session?.synced && session.nodeId);

  return (
    <main className="student-home">
      <header className="student-home-topbar">
        <div><span className="student-home-logo">5G</span><div><strong>5G网络优化数字教材</strong><small>学生学习工作台</small></div></div>
        <nav><Link href={`/course?project=${projectId}`}>课程</Link><Link href={`/graph?project=${projectId}`}>能力图谱</Link><AuthBadge /></nav>
      </header>

      <div className="student-home-shell">
        <section className="student-home-heading">
          <div><p className="eyebrow">{studentName} · 我的学习首页</p><h1>继续完成当前学习任务</h1><p>系统根据已保存的阶段、练习、测试和产出记录定位下一步。</p></div>
          <div className="student-project-switch" aria-label="选择学习项目">
            {['P1', 'P2'].map((id) => <button className={projectId === id ? 'active' : ''} key={id} onClick={() => setProjectId(id)} type="button">{id}</button>)}
          </div>
        </section>

        <section className="panel student-current-learning">
          <div className="student-current-copy">
            <p className="eyebrow">正在学习 · {project.id} {project.title}</p>
            <h2>{currentNode?.nodeId ?? project.id} · {currentNode?.title ?? '等待配置学习节点'}</h2>
            <p>{currentExperience?.headline ?? project.note}</p>
            <div className="student-learning-facts">
              <article><span>为什么学</span><strong>{currentExperience?.caseIntro ?? '完成当前项目的关键工作过程。'}</strong></article>
              <article><span>完成标准</span><strong>六阶段完成、练习通过、正式测试并提交产出</strong></article>
              <article><span>下一步</span><strong>{projectCompleted ? '回顾已完成节点或进入课堂' : currentRecord?.completedSteps?.length ? `继续第 ${Math.min(6, currentRecord.completedSteps.length + 1)} 阶段` : '从问题阶段开始'}</strong></article>
            </div>
            {currentNode ? <Link className="primary-action" href={`/learn/${currentNode.nodeId}`}>{projectCompleted ? '回顾学习' : '继续自学'}</Link> : null}
          </div>
          <div className="student-current-progress">
            <div><strong>{Math.round(completedNodes / Math.max(path.length, 1) * 100)}%</strong><span>项目节点进度</span></div>
            <p>{completedNodes}/{path.length} 个节点已完成</p>
            <i><b style={{ width: `${completedNodes / Math.max(path.length, 1) * 100}%` }} /></i>
          </div>
        </section>

        {classroomAvailable ? <section className="student-classroom-card">
          <div><p className="eyebrow">当前课堂正在进行</p><h3>教师正在讲评 {session?.nodeId}</h3><p>加入后进入受控听讲；退出听讲后仍保留当前学习页。</p></div>
          <Link href={`/classroom/${session?.nodeId}`}>查看课堂</Link>
        </section> : null}

        <section className="student-home-metrics">
          <article><span>学习进度</span><strong>{completedNodes}/{path.length}</strong><small>完成节点</small></article>
          <article><span>当前节点能力数</span><strong>{currentRecord?.abilityScore ?? 0}</strong><small>{currentRecord?.completedSteps?.length ?? 0}/6 阶段</small></article>
          <article><span>任务成绩</span><strong>{taskScore}</strong><small>能力、测试与审核综合</small></article>
          <article><span>项目成绩</span><strong>{projectScore}</strong><small>按节点汇总</small></article>
        </section>

        <section className="student-home-grid">
          <div className="panel student-path-card">
            <header><div><p className="eyebrow">顺序学习</p><h3>{project.id} 节点路径</h3></div><span>{loadState === 'loading' ? '正在读取学习记录' : loadState === 'error' ? '数据服务暂时不可用' : '进度已保存'}</span></header>
            <div>{path.map((node, index) => {
              const completed = nodeCompleted(records[node.nodeId]);
              const current = node.nodeId === currentNode?.nodeId;
              const unlocked = index === 0 || nodeCompleted(records[path[index - 1]?.nodeId]);
              const content = <><b>{completed ? '✓' : index + 1}</b><div><strong>{node.title}</strong><span>{node.nodeId}</span></div><em>{completed ? '已完成' : current ? '继续学习' : unlocked ? '可以学习' : '待解锁'}</em></>;
              return unlocked
                ? <Link className={completed ? 'is-complete' : current ? 'is-current' : ''} href={`/learn/${node.nodeId}`} key={node.nodeId}>{content}</Link>
                : <article aria-label={`${node.title}，完成前置节点后解锁`} className="is-locked" key={node.nodeId}>{content}</article>;
            })}</div>
          </div>
          <aside className="panel student-output-card">
            <p className="eyebrow">本节点学习产出</p>
            <h3>{currentExperience?.outputs[0] ?? '学习记录'}</h3>
            <p>完成自学后形成可保存、可审核并可进入后续任务的职业化学习证据。</p>
            <dl><div><dt>提交状态</dt><dd>{currentRecord?.reviewStatus || '未提交'}</dd></div><div><dt>正式测试</dt><dd>{currentRecord?.formalTestAttempts ? `最高 ${currentRecord.bestScore} 分` : '尚未完成'}</dd></div><div><dt>练习尝试</dt><dd>{currentRecord?.practiceAttempts ?? 0} 次</dd></div></dl>
            {currentNode ? <Link href={`/learn/${currentNode.nodeId}`}>查看本节点详情</Link> : null}
          </aside>
        </section>
      </div>
    </main>
  );
}
