'use client';

import { useEffect, useMemo, useState } from 'react';
import { textbookApi, type ClassroomSubmissionDTO } from '@/lib/api';
import { CLASSROOM_REALTIME_EVENT } from '@/lib/classroom-realtime';
import { getLearningNodeExperience } from '@/lib/textbook-data';
import { readAuthName } from './AuthGate';

type ActivityId = 'scene' | 'output' | 'boundary';
type Audience = 'student' | 'teacher';

const activities: { id: ActivityId; label: string; action: string }[] = [
  { id: 'scene', label: '学习活动', action: '确认本节活动对象' },
  { id: 'output', label: '评价产出', action: '提交本节学习记录' },
  { id: 'boundary', label: '判断边界', action: '完成边界判断' }
];

function studentId() {
  if (typeof window === 'undefined') return 'generic-student-demo';
  const key = 'dgbook-generic-student-id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `student-${Date.now().toString(36)}`;
  window.localStorage.setItem(key, next);
  return next;
}

function activityTaskId(nodeId: string, activityId: ActivityId) {
  return `${nodeId}-activity-${activityId}`;
}

function activityOptions(projectId: string) {
  if (projectId === 'P1') return ['楼宇或站址位置', '覆盖区域或楼层', '现场人员与对象', '业务场景与时间'];
  if (projectId === 'P2') return ['测试轨迹与场景', '采样完整率', '指标图表', '原始日志或导出报告'];
  return ['任务对象与场景', '关键证据材料', '记录时间与位置', '后续复核条件'];
}

export function NodeActivityBoard({ nodeId, audience, enabled = true }: { nodeId: string; audience: Audience; enabled?: boolean }) {
  const node = getLearningNodeExperience(nodeId)!;
  const [active, setActive] = useState<ActivityId>('scene');
  const [submissions, setSubmissions] = useState<ClassroomSubmissionDTO[]>([]);
  const [currentStudentId, setCurrentStudentId] = useState('');
  const [selectedScene, setSelectedScene] = useState<string[]>([]);
  const [record, setRecord] = useState('');
  const [boundary, setBoundary] = useState('');
  const [notice, setNotice] = useState('点击一张卡片，完成对应活动并保存。');
  const [saving, setSaving] = useState(false);
  const choices = useMemo(() => [
    node.evidence[2]?.value ?? '结论需要保留判断边界',
    `只依据${node.evidence[0]?.label ?? '单项现象'}即可直接下结论`,
    '无需保留场景、时间和原始记录'
  ], [node]);

  useEffect(() => {
    if (audience === 'student') setCurrentStudentId(studentId());
  }, [audience]);

  useEffect(() => {
    let alive = true;
    const refresh = () => {
      void textbookApi.classroomSubmissions(nodeId).then((items) => {
        if (alive) setSubmissions(items.filter((item) => activities.some((activity) => item.taskId === activityTaskId(nodeId, activity.id))));
      }).catch(() => undefined);
    };
    refresh();
    window.addEventListener(CLASSROOM_REALTIME_EVENT, refresh);
    return () => { alive = false; window.removeEventListener(CLASSROOM_REALTIME_EVENT, refresh); };
  }, [nodeId]);

  const completedFor = (activityId: ActivityId) => submissions.filter((item) => item.taskId === activityTaskId(nodeId, activityId));
  const isComplete = (activityId: ActivityId) => completedFor(activityId).some((item) => item.studentId === currentStudentId);
  const activeMeta = activities.find((item) => item.id === active)!;
  const activeEvidence = node.evidence[activities.findIndex((item) => item.id === active)];
  const activeCompleted = audience === 'student' && isComplete(active);

  function toggleScene(value: string) {
    setSelectedScene((items) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
  }

  async function submitActivity() {
    if (!enabled) return setNotice('教师尚未推送本页练习，暂时只能查看活动要求。');
    if (!currentStudentId) return;
    if (activeCompleted) return setNotice(`${activeMeta.label}已提交，不能重复提交。`);
    let answer = '';
    let evidence: string[] = [];
    let conclusion = '';
    let score = 0;
    if (active === 'scene') {
      if (selectedScene.length < 2) return setNotice('请至少选择两项场景信息。');
      answer = `本次活动确认：${selectedScene.join('、')}。`;
      evidence = selectedScene;
      conclusion = `已明确${node.title}的活动对象与场景。`;
      score = 100;
    }
    if (active === 'output') {
      if (record.trim().length < 12) return setNotice('请用至少 12 个字写出可供教师讲评的记录。');
      answer = record.trim();
      evidence = node.evidence.map((item) => item.label);
      conclusion = node.outputs[0];
      score = 100;
    }
    if (active === 'boundary') {
      if (!boundary) return setNotice('请先选择一项判断。');
      answer = boundary;
      evidence = [node.evidence[2]?.label ?? '判断边界'];
      conclusion = boundary;
      score = boundary === choices[0] ? 100 : 0;
    }
    setSaving(true);
    try {
      await textbookApi.submitClassroomWork({
        nodeId,
        taskId: activityTaskId(nodeId, active),
        studentId: currentStudentId,
        studentName: readAuthName() || '学生端演示',
        answer,
        evidence,
        conclusion,
        score,
        selectedEvidence: evidence
      });
      const latest = await textbookApi.classroomSubmissions(nodeId);
      setSubmissions(latest.filter((item) => activities.some((activity) => item.taskId === activityTaskId(nodeId, activity.id))));
      setNotice(score === 100 ? `${activeMeta.label}已保存，教师端可以查看完成情况。` : '已保存本次判断，教师端会看到需要讲评的记录。');
    } catch {
      setNotice('保存失败：后端可能正在唤醒，请稍后重试。');
    } finally {
      setSaving(false);
    }
  }

  return <section className={`node-activity-board ${audience === 'teacher' ? 'teacher-view' : ''}`} aria-label="节点学习活动">
    <div className="section-heading"><div><p className="eyebrow">关键证据活动</p><h3>{audience === 'teacher' ? '查看学生的活动与作业完成情况' : '选择一张卡片，完成本节活动与作业'}</h3></div><span>{audience === 'teacher' ? '各项完成记录会实时更新。' : enabled ? '每项完成后都会保存到教师端。' : '教师尚未推送练习，可先查看活动要求。'}</span></div>
    <div className="activity-card-grid">{activities.map((activity, index) => {
      const items = completedFor(activity.id);
      const finished = audience === 'teacher' ? new Set(items.map((item) => item.studentId)).size : isComplete(activity.id);
      const locked = audience === 'student' && !enabled;
      return <button className={`${active === activity.id ? 'active' : ''} ${finished ? 'done' : ''} ${locked ? 'locked' : ''}`} disabled={locked} key={activity.id} onClick={() => setActive(activity.id)} type="button"><small>{activity.label}</small><strong>{node.evidence[index]?.value}</strong><span>{audience === 'teacher' ? `${finished} 人已完成` : activity.action}</span><em>{audience === 'teacher' ? (finished ? '查看完成情况' : '暂无提交') : locked ? '等待推送' : (finished ? '已完成' : '去完成')}</em></button>;
    })}</div>
    {audience === 'student' && !enabled ? <article className="activity-workspace activity-workspace-locked">
      <strong>课堂练习尚未开放</strong>
      <span>请先跟随教师讲解。教师点击“推送练习”后，三项活动才会解锁。</span>
    </article> : <article className="activity-workspace">
      <div className="activity-workspace-head"><div><p>{activeMeta.label}</p><h4>{activeEvidence?.value}</h4><span>{activeEvidence?.target}</span></div>{audience === 'teacher' ? <b>{new Set(completedFor(active).map((item) => item.studentId)).size} 人完成</b> : <b>{isComplete(active) ? '已保存' : '待完成'}</b>}</div>
      {audience === 'teacher' ? <TeacherActivityDetail items={completedFor(active)} /> : <>
        {active === 'scene' && <div className="activity-option-list">{activityOptions(node.projectId).map((item) => <label key={item}><input checked={selectedScene.includes(item)} disabled={!enabled || activeCompleted} onChange={() => toggleScene(item)} type="checkbox" />{item}</label>)}</div>}
        {active === 'output' && <label className="activity-record-input">请写出本次“{node.outputs[0]}”的核心记录<textarea disabled={!enabled || activeCompleted} maxLength={180} onChange={(event) => setRecord(event.target.value)} placeholder="写明对象、场景、证据或后续复核条件。" value={record} /></label>}
        {active === 'boundary' && <div className="activity-option-list single">{choices.map((item) => <label key={item}><input checked={boundary === item} disabled={!enabled || activeCompleted} name={`boundary-${nodeId}`} onChange={() => setBoundary(item)} type="radio" />{item}</label>)}</div>}
        <div className="activity-workspace-footer"><span>{notice}</span><button className="primary-action" disabled={!enabled || saving || activeCompleted} onClick={submitActivity} type="button">{activeCompleted ? '已提交' : saving ? '正在保存' : enabled ? `提交${activeMeta.label}` : '等待教师推送练习'}</button></div>
      </>}
    </article>}
  </section>;
}

function TeacherActivityDetail({ items }: { items: ClassroomSubmissionDTO[] }) {
  if (!items.length) return <div className="activity-teacher-empty"><strong>暂未收到学生提交</strong><span>学生完成本项活动后，会在这里显示姓名、得分和提交内容。</span></div>;
  return <div className="activity-teacher-list">{items.slice(0, 5).map((item) => <article key={item.id}><div><strong>{item.studentName}</strong><span>{item.answer || item.conclusion}</span></div><b>{item.score} 分</b></article>)}</div>;
}
