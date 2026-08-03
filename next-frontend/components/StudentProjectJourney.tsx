'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AuthBadge, readAuthName } from './AuthGate';
import { textbookApi, type SelfStudyProgressDTO } from '@/lib/api';
import { projectTaskBlueprints, structuredDeliverables } from '@/lib/sample-parity-data';
import { projects } from '@/lib/textbook-data';

function readStudentId() {
  const key = 'dgbook-generic-student-id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `student-${Date.now().toString(36)}`;
  window.localStorage.setItem(key, next);
  return next;
}

function nodeComplete(record?: SelfStudyProgressDTO) {
  return Boolean(record && record.completedSteps?.length >= 6 && record.practiceScore >= 100 && record.formalTestAttempts > 0 && record.outputSubmittedAt > 0);
}

function nodeScore(record?: SelfStudyProgressDTO) {
  if (!record) return 0;
  const assessment = record.formalTestAttempts > 0 ? record.bestScore : record.practiceScore;
  const review = record.reviewStatus === '已认证' ? 100 : record.reviewStatus === '待审核' ? 70 : record.reviewStatus === '需修改' ? 40 : 0;
  return Math.round((record.abilityScore || 0) * .35 + assessment * .5 + review * .15);
}

function outputVersions(record?: SelfStudyProgressDTO) {
  if (!record) return [];
  if (record.outputVersions?.length) return record.outputVersions;
  if (!record.outputSubmittedAt || !record.studentOutput) return [];
  return [{
    version: 1, studentOutput: record.studentOutput, submittedAt: record.outputSubmittedAt,
    reviewStatus: record.reviewStatus, reviewComment: record.reviewComment, reviewedAt: record.certifiedAt
  }];
}

function taskReviewStatus(records: SelfStudyProgressDTO[], nodeCount: number) {
  if (records.length === nodeCount && records.every((record) => record.reviewStatus === '已认证')) return '已认证';
  if (records.some((record) => record.reviewStatus === '需修改')) return '需修改';
  if (records.some((record) => record.reviewStatus === '待审核')) return '待审核';
  return records.some((record) => outputVersions(record).length) ? '编辑中' : '未提交';
}

function scoreRubric(total: number, count: number) {
  const safeTotal = Math.max(0, Math.min(100, total));
  const base = Math.floor(safeTotal / count);
  const remainder = safeTotal - base * count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

function useProjectRecords(projectId: string) {
  const tasks = projectTaskBlueprints[projectId] ?? [];
  const nodeIds = useMemo(() => tasks.flatMap((task) => task.nodes.map((node) => node.nodeId)), [tasks]);
  const [records, setRecords] = useState<Record<string, SelfStudyProgressDTO>>({});
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    Promise.all(nodeIds.map(async (nodeId) => [nodeId, await textbookApi.selfStudyProgress(nodeId, readStudentId())] as const))
      .then((items) => { if (alive) { setRecords(Object.fromEntries(items)); setStatus('ready'); } })
      .catch(() => { if (alive) setStatus('error'); });
    return () => { alive = false; };
  }, [nodeIds]);
  return { tasks, records, status };
}

function ProjectHeader({ projectId, label }: { projectId: string; label: string }) {
  return <header className="project-journey-topbar">
    <div><Link className="project-journey-logo" href={`/student?project=${projectId}`}>5G</Link><div><strong>5G网络优化数字教材</strong><small>{label}</small></div></div>
    <nav><Link href={`/student?project=${projectId}`}>学习首页</Link><Link href={`/student/projects/${projectId}`}>项目任务</Link><Link href={`/student/projects/${projectId}/portfolio`}>成果包</Link><Link href={`/graph?project=${projectId}`}>能力图谱</Link><AuthBadge /></nav>
  </header>;
}

export function StudentProjectJourney({ projectId }: { projectId: string }) {
  const { tasks, records, status } = useProjectRecords(projectId);
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const taskStates = tasks.map((task) => {
    const completed = task.nodes.filter((node) => nodeComplete(records[node.nodeId])).length;
    const score = task.nodes.length ? Math.round(task.nodes.reduce((sum, node) => sum + nodeScore(records[node.nodeId]), 0) / task.nodes.length) : 0;
    return { ...task, completed, complete: completed === task.nodes.length, score };
  });
  const projectComplete = taskStates.length > 0 && taskStates.every((task) => task.complete);
  const projectScore = taskStates.length ? Math.round(taskStates.reduce((sum, task) => sum + task.score, 0) / taskStates.length) : 0;

  return <main className="project-journey-page">
    <ProjectHeader label="学生项目任务" projectId={projectId} />
    <section className="project-journey-shell">
      <header className="project-journey-heading">
        <div><p className="eyebrow">项目学习链 · 顺序解锁</p><h1>{projectId} {project.title}</h1><p>{project.note}。按真实工作任务完成节点学习、正式测试和职业产出。</p></div>
        <div><strong>{taskStates.filter((task) => task.complete).length}/{taskStates.length}</strong><span>任务完成</span><small>项目成绩 {projectScore}</small></div>
      </header>

      <section className="project-task-chain" aria-label="项目任务链">
        {taskStates.map((task, index) => {
          const unlocked = index === 0 || taskStates[index - 1]?.complete;
          const firstIncomplete = task.nodes.find((node) => !nodeComplete(records[node.nodeId])) ?? task.nodes[task.nodes.length - 1];
          return <article className={`${task.complete ? 'is-complete' : ''} ${!unlocked ? 'is-locked' : ''}`} key={task.id}>
            <header><span>{task.id}</span><em>{task.complete ? '已完成' : unlocked ? '进行中' : '待解锁'}</em></header>
            <h2>{task.title}</h2><p>{task.subtitle}</p>
            <div className="task-node-list">{task.nodes.map((node, nodeIndex) => {
              const complete = nodeComplete(records[node.nodeId]);
              const nodeUnlocked = unlocked && (nodeIndex === 0 || nodeComplete(records[task.nodes[nodeIndex - 1]?.nodeId]));
              return nodeUnlocked
                ? <Link className={complete ? 'is-complete' : ''} href={`/learn/${node.nodeId}`} key={node.nodeId}><b>{complete ? '✓' : nodeIndex + 1}</b><span><strong>{node.title}</strong><small>{node.criterion}</small></span><em>{node.nodeId}</em></Link>
                : <div className="is-locked" key={node.nodeId}><b>{nodeIndex + 1}</b><span><strong>{node.title}</strong><small>完成前置节点后解锁</small></span><em>锁定</em></div>;
            })}</div>
            <footer><div><span>节点进度</span><strong>{task.completed}/{task.nodes.length}</strong><i><b style={{ width: `${task.completed / Math.max(task.nodes.length, 1) * 100}%` }} /></i></div>{unlocked && firstIncomplete ? <Link href={`/learn/${firstIncomplete.nodeId}`}>{task.complete ? '回顾任务' : '继续任务'} →</Link> : <span>完成上一任务后开放</span>}</footer>
          </article>;
        })}
      </section>

      <section className="project-output-summary">
        <div><p className="eyebrow">项目最终产出</p><h2>{project.title}成果包</h2><p>共 {taskStates.length} 项任务产出通过教师审核后，系统以不可变版本引用形成项目成果包，并保留修改、退回和认证记录。</p></div>
        <div className="project-output-actions"><span className={projectComplete ? 'is-ready' : ''}>{projectComplete ? '成果包已生成' : '成果包生成中'}</span><Link href={`/student/projects/${projectId}/portfolio`}>{projectComplete ? '查看成果包' : '查看当前版本'}</Link></div>
      </section>
      {status === 'error' ? <p className="project-data-notice">暂时无法读取后端学习记录，页面已保留任务结构。</p> : null}
    </section>
  </main>;
}

export function StudentProjectPortfolio({ projectId }: { projectId: string }) {
  const { tasks, records } = useProjectRecords(projectId);
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const taskStates = tasks.map((task) => {
    const taskRecords = task.nodes.map((node) => records[node.nodeId]).filter(Boolean);
    const completed = task.nodes.filter((node) => nodeComplete(records[node.nodeId])).length;
    const score = task.nodes.length ? Math.round(task.nodes.reduce((sum, node) => sum + nodeScore(records[node.nodeId]), 0) / task.nodes.length) : 0;
    const latest = [...taskRecords].sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))[0];
    const versionCount = Math.max(0, ...taskRecords.map((record) => outputVersions(record).length));
    const reviewStatus = taskReviewStatus(taskRecords, task.nodes.length);
    const version = versionCount ? `v${versionCount}` : '草稿';
    return { ...task, completed, score, latest, version, versionCount, reviewStatus, complete: completed === task.nodes.length };
  });
  const projectScore = taskStates.length ? Math.round(taskStates.reduce((sum, task) => sum + task.score, 0) / taskStates.length) : 0;

  return <main className="project-portfolio-page">
    <ProjectHeader label="项目成果包" projectId={projectId} />
    <section className="project-portfolio-shell">
      <header className="portfolio-hero"><div><p className="eyebrow">项目成果包 · 不复制原始内容</p><h1>{projectId} {project.title}成果包</h1><p>成果包引用各任务最近一次已认证版本；历史版本、证据来源与教师审核记录保持可追溯。</p></div><div><strong>{projectScore}</strong><span>项目成绩</span><small>{taskStates.length}项任务综合</small></div></header>
      <section className="portfolio-version-note"><b>版本规则</b><span>草稿可修改，提交后形成 v1；教师退回再提交形成 v2；已认证版本进入项目成果包后不可覆盖。</span></section>
      <section className="portfolio-task-list">{taskStates.map((task) => <article key={task.id}>
        <header><span>{task.id}</span><div><strong>{task.title}</strong><small>{task.output}</small></div><em className={task.reviewStatus === '已认证' ? 'is-certified' : ''}>{task.reviewStatus}</em></header>
        <div className="portfolio-task-metrics"><span>引用版本<b>{task.version}</b></span><span>节点进度<b>{task.completed}/{task.nodes.length}</b></span><span>任务成绩<b>{task.score}</b></span><span>教师反馈<b>{task.latest?.reviewComment || '暂无'}</b></span></div>
        <footer><small>{task.latest?.updatedAt ? `最近更新 ${new Date(task.latest.updatedAt).toLocaleString('zh-CN')}` : '尚未形成可引用版本'}</small><Link href={`/student/projects/${projectId}/portfolio/${task.id}`}>查看版本与证据 →</Link></footer>
      </article>)}</section>
      <Link className="portfolio-back-link" href={`/student/projects/${projectId}`}>← 返回项目任务链</Link>
    </section>
  </main>;
}

export function StudentPortfolioDetail({ projectId, taskId }: { projectId: string; taskId: string }) {
  const { tasks, records } = useProjectRecords(projectId);
  const task = tasks.find((item) => item.id === taskId) ?? tasks[0];
  const taskRecords = task?.nodes.map((node) => records[node.nodeId]).filter(Boolean) ?? [];
  const latest = [...taskRecords].sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0))[0];
  const versionCount = Math.max(0, ...taskRecords.map((record) => outputVersions(record).length));
  const reviewStatus = taskReviewStatus(taskRecords, task?.nodes.length ?? 0);
  const version = versionCount ? `v${versionCount}` : '草稿';
  const score = task?.nodes.length ? Math.round(task.nodes.reduce((sum, node) => sum + nodeScore(records[node.nodeId]), 0) / task.nodes.length) : 0;
  const snapshots = Array.from({ length: versionCount }, (_, index) => index + 1).reverse().map((versionNumber) => {
    const fields = task?.nodes.map((node) => {
      const record = records[node.nodeId];
      const versions = outputVersions(record);
      const selected = [...versions].reverse().find((item) => item.version <= versionNumber);
      return { node, selected };
    }) ?? [];
    const submittedAt = Math.max(0, ...fields.map((field) => field.selected?.submittedAt ?? 0));
    const statuses = fields.map((field) => field.selected?.reviewStatus).filter(Boolean);
    const status = statuses.length === fields.length && statuses.every((item) => item === '已认证') ? '已认证' : statuses.includes('需修改') ? '需修改' : statuses.includes('待审核') ? '待审核' : '形成中';
    return { versionNumber, fields, submittedAt, status };
  });
  const latestSnapshot = snapshots[0];
  const previousSnapshot = snapshots[1];
  const changedFields = previousSnapshot ? latestSnapshot.fields.filter((field, index) => field.selected?.studentOutput !== previousSnapshot.fields[index]?.selected?.studentOutput) : [];
  const reviewComments = Array.from(new Set(taskRecords.map((record) => record.reviewComment).filter(Boolean)));
  const testAttempts = taskRecords.flatMap((record) => (record.formalTestVersions ?? []).map((attempt) => ({ nodeId: record.nodeId, ...attempt })))
    .sort((left, right) => right.submittedAt - left.submittedAt);
  const structuredDeliverable = structuredDeliverables[`${projectId}:${taskId}`];
  const taskTestScore = testAttempts.length ? Math.round(testAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / testAttempts.length) : 0;
  const rubricScores = structuredDeliverable ? scoreRubric(taskTestScore, structuredDeliverable.rubric.length) : [];
  const structuredVersions = structuredDeliverable ? snapshots.map((snapshot) => snapshot.versionNumber) : [];
  const structuredChanges = structuredDeliverable && structuredVersions.length > 1
    ? structuredDeliverable.fields.filter((field) => field.versions[structuredVersions[0]]?.value !== field.versions[structuredVersions[1]]?.value)
    : [];
  const reviewEvents = Array.from({ length: versionCount }, (_, index) => index + 1).map((versionNumber) => {
    const versionReviews = taskRecords.flatMap((record) => outputVersions(record))
      .filter((item) => item.version === versionNumber);
    const status = versionReviews.some((item) => item.reviewStatus === '需修改')
      ? '需修改'
      : versionReviews.some((item) => item.reviewStatus === '待审核')
        ? '待审核'
        : versionReviews.length && versionReviews.every((item) => item.reviewStatus === '已认证')
          ? '已认证'
          : '待审核';
    const comments = Array.from(new Set(versionReviews
      .filter((item) => (item.reviewStatus || '待审核') === status)
      .map((item) => item.reviewComment)
      .filter(Boolean)));
    return {
      key: `version-${versionNumber}`,
      version: versionNumber,
      status,
      comment: comments.join('；') || '教师尚未填写审核意见。',
      time: Math.max(0, ...versionReviews.map((item) => item.reviewedAt || item.submittedAt || 0))
    };
  });

  return <main className="portfolio-detail-page">
    <ProjectHeader label="成果版本详情" projectId={projectId} />
    <section className="portfolio-detail-shell">
      <header className="portfolio-detail-heading"><div><p className="eyebrow">{projectId} / {task?.id} / {version}</p><h1>{task?.title}</h1><p>{task?.output} · 版本、字段、证据和审核动作只读展示。</p></div><div><strong>{score}</strong><span>任务成绩</span><em>{reviewStatus}</em></div></header>
      <section className="portfolio-detail-grid">
        <div className="portfolio-version-timeline"><h2>不可变版本链</h2>{snapshots.map((snapshot, index) => <article className={index === 0 ? 'is-current' : ''} key={snapshot.versionNumber}><b>v{snapshot.versionNumber}</b><div><strong>{snapshot.status === '已认证' ? '教师认证版本' : '学生正式提交'}</strong><span>{snapshot.fields.filter((field) => field.selected).length}/{snapshot.fields.length} 个节点字段已封存{snapshot.submittedAt ? ` · ${new Date(snapshot.submittedAt).toLocaleString('zh-CN')}` : ''}</span></div><em>{index === 0 ? '当前引用' : snapshot.status}</em></article>)}<article><b>草稿</b><div><strong>节点学习记录</strong><span>由六阶段学习、微练习和正式测试逐步形成。</span></div><em>可修改</em></article></div>
        <aside className="portfolio-audit-card"><h2>审核与审计</h2><dl><div><dt>提交人</dt><dd>{latest?.studentName || readAuthName() || '当前学生'}</dd></div><div><dt>审核状态</dt><dd>{reviewStatus}</dd></div><div><dt>教师意见</dt><dd>{reviewComments.join('；') || '暂无审核意见'}</dd></div><div><dt>正式测试</dt><dd>{latest?.formalTestAttempts ? `最高 ${latest.bestScore} 分 / ${latest.formalTestAttempts} 次` : '尚未完成'}</dd></div><div><dt>版本标识</dt><dd>{`${projectId}-${task?.id}-${version}`}</dd></div></dl></aside>
      </section>
      <section className="portfolio-evidence-table"><header><div><p className="eyebrow">字段级证据</p><h2>任务产出与节点来源</h2></div><span>每个字段均可回到原学习节点</span></header>{task?.nodes.map((node) => {
        const record = records[node.nodeId];
        return <article key={node.nodeId}><div><strong>{node.title}</strong><small>{node.criterion}</small></div><p>{record?.studentOutput || '该字段尚未填写正式产出。'}</p><div><span>{record?.reviewStatus || '未提交'}</span><Link href={`/learn/${node.nodeId}`}>回到 {node.nodeId}</Link></div></article>;
      })}</section>
      {structuredDeliverable && structuredVersions.length ? <section className="structured-deliverable"><header><div><p className="eyebrow">职业交付物 · 字段级封存</p><h2>{structuredDeliverable.title}</h2><p>{structuredDeliverable.summary}</p></div><span>{structuredDeliverable.fields.length} 个专业字段</span></header>
        <div className="structured-version-list">{structuredVersions.map((versionNumber, versionIndex) => <article className="structured-version" key={versionNumber}>
          <header><div><b>v{versionNumber}</b><span>{versionIndex === 0 ? '当前引用版本' : '历史封存版本'}</span></div><em>{snapshots.find((item) => item.versionNumber === versionNumber)?.status || '已封存'}</em></header>
          <div className="structured-field-list">{structuredDeliverable.fields.map((field) => {
            const fieldVersion = field.versions[versionNumber] ?? field.versions[Math.max(...Object.keys(field.versions).map(Number))];
            const changed = versionIndex === 0 && structuredVersions.length > 1 && structuredChanges.some((item) => item.id === field.id);
            return <section className={changed ? 'is-changed' : ''} key={`${versionNumber}-${field.id}`}>
              <header><div><strong>{field.label}</strong><small>{field.id}</small></div><Link href={`/learn/${field.nodeId}`}>来源 {field.nodeId} →</Link></header>
              <p>{fieldVersion.value}</p>
              {fieldVersion.evidence.length ? <div className="structured-evidence-grid">{fieldVersion.evidence.map((evidence) => <figure key={`${field.id}-${evidence.src}`}><img src={evidence.src} alt={evidence.alt} /><figcaption>{evidence.caption}</figcaption></figure>)}</div> : <div className="structured-missing-evidence">本版本未绑定证据，已列入补采清单。</div>}
            </section>;
          })}</div>
        </article>)}</div>
      </section> : null}
      {structuredDeliverable && testAttempts.length ? <section className="task-rubric-summary"><header><div><p className="eyebrow">任务正式测试</p><h2>四维诊断与题卷版本</h2></div><strong>{taskTestScore}<small>/100</small></strong></header><div>{structuredDeliverable.rubric.map((item, index) => <article key={item.label}><span>{item.label}</span><b>{rubricScores[index]}<small>/25</small></b><i><em style={{ width: `${rubricScores[index] / 25 * 100}%` }} /></i><p>{item.description}</p></article>)}</div><footer><span>共 {testAttempts.length} 份不可变答卷</span><span>最近题卷 {testAttempts[0]?.versionId}</span><span>最近提交 {testAttempts[0]?.submittedAt ? new Date(testAttempts[0].submittedAt).toLocaleString('zh-CN') : '历史记录'}</span></footer></section> : null}
      <section className="portfolio-test-diagnosis"><header><div><p className="eyebrow">正式测试诊断</p><h2>不可变答卷证据</h2></div><span>{testAttempts.length} 份历史答卷</span></header>{testAttempts.length ? <div>{testAttempts.map((attempt) => <article key={`${attempt.nodeId}-${attempt.versionId}`}><div><strong>{attempt.nodeId} · 第 {attempt.attempt} 次</strong><span>{attempt.versionId}</span><small>{attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString('zh-CN') : '历史数据'}</small></div><b>{attempt.score}</b><dl>{(attempt.diagnosis ?? []).map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.score} · {item.status}</dd></div>)}</dl><p>{attempt.wrongKnowledgePoints?.length ? `待巩固：${attempt.wrongKnowledgePoints.join('、')}` : '本次未记录错误知识点。'}</p></article>)}</div> : <p>完成节点正式测试后，这里会保留每次答卷版本、能力诊断和错误知识点。</p>}</section>
      {reviewEvents.length ? <section className="portfolio-review-timeline"><header><div><p className="eyebrow">教师审核轨迹</p><h2>退回、修订与认证</h2></div><span>{reviewEvents.length} 次可追溯动作</span></header><div>{reviewEvents.map((event) => <article key={event.key}><b>v{event.version}</b><div><strong>{event.status}</strong><p>{event.comment}</p><small>{event.time ? new Date(event.time).toLocaleString('zh-CN') : '历史记录'}</small></div></article>)}</div></section> : null}
      <section className="portfolio-diff-card"><div><p className="eyebrow">版本差异摘要</p><h2>{previousSnapshot ? `v${previousSnapshot.versionNumber} → v${latestSnapshot.versionNumber}` : '首次版本'}</h2></div>{previousSnapshot ? <ul>{changedFields.length ? changedFields.map((field) => <li key={field.node.nodeId}>{field.node.nodeId} “{field.node.title}”字段已修改，旧版本仍保留。</li>) : <li>本次版本未更改已提交字段，仅更新审核状态。</li>}</ul> : <ul><li>{versionCount ? '已形成首次正式提交快照，修改后再次提交将自动生成差异。' : '尚未形成正式版本，请先完成节点学习产出。'}</li></ul>}</section>
      <Link className="portfolio-back-link" href={`/student/projects/${projectId}/portfolio`}>← 返回项目成果包</Link>
    </section>
  </main>;
}
