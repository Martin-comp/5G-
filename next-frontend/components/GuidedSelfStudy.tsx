'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { readClassroomId, textbookApi, type SelfStudyProgressDTO } from '@/lib/api';
import { getLearningNodeExperience } from '@/lib/textbook-data';
import { SelfStudyAbilityModel } from './SelfStudyAbilityModel';

const sectionOrder = ['case', 'evidence', 'practice', 'summary'] as const;

const defaultSectionMeta = [
  { title: '理解对象', subtitle: '先弄清本节要解决什么' },
  { title: '读取证据', subtitle: '找到能支撑判断的材料' },
  { title: '听讲与判断', subtitle: '用知识点完成一次判断' },
  { title: '形成记录', subtitle: '沉淀可交付的学习记录' }
] as const;

function studentId() {
  if (typeof window === 'undefined') return 'self-study-student';
  const key = 'dgbook-generic-student-id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `student-${Date.now().toString(36)}`;
  window.localStorage.setItem(key, next);
  return next;
}

function emptyProgress(nodeId: string): SelfStudyProgressDTO {
  return {
    classId: readClassroomId(), nodeId, studentId: studentId(), studentName: '学生端演示', completedSteps: [], abilityScore: 0,
    abilities: [
      { label: '场景理解', score: 0, status: '待开始' },
      { label: '证据判断', score: 0, status: '待开始' },
      { label: '结论表达', score: 0, status: '待开始' }
    ], startedAt: Date.now(), timeSpentSeconds: 0,
    updatedAt: 0
  };
}

export function GuidedSelfStudy({ nodeId }: { nodeId: string }) {
  const node = getLearningNodeExperience(nodeId)!;
  const sectionMeta = sectionOrder.map((id, index) => ({
    id,
    title: node.steps[index]?.title ?? defaultSectionMeta[index].title,
    subtitle: node.steps[index]?.desc ?? defaultSectionMeta[index].subtitle
  }));
  const [progress, setProgress] = useState<SelfStudyProgressDTO>(() => emptyProgress(nodeId));
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('请从第一个知识点开始学习，完成后会自动解锁下一节。');
  const trackingStartedAt = useRef(Date.now());
  const persistedSeconds = useRef(0);
  const completedCount = progress.completedSteps.length;
  const percentage = Math.round(completedCount / sectionOrder.length * 100);
  const nextSection = sectionMeta[Math.min(completedCount, sectionMeta.length - 1)];
  const displayedSection = sectionMeta[activeIndex];
  const canAdvance = activeIndex === completedCount && completedCount < sectionOrder.length;

  useEffect(() => {
    let alive = true;
    textbookApi.selfStudyProgress(nodeId, studentId()).then((remote) => {
      if (!alive || !remote.studentId) return;
      setProgress(remote);
      persistedSeconds.current = remote.timeSpentSeconds || 0;
      trackingStartedAt.current = Date.now();
      setActiveIndex(Math.min(remote.completedSteps.length, sectionMeta.length - 1));
      if (remote.completedSteps.length === sectionOrder.length) setNotice('本节点自学已完成，能力数与学习记录已保存。');
    }).catch(() => undefined);
    return () => { alive = false; };
  }, [nodeId]);

  const detail = useMemo(() => {
    if (displayedSection.id === 'case') return <>
      <p className="guided-lead">{node.caseIntro}</p>
      <div className="guided-insight-grid">{node.steps.slice(0, 2).map((step) => <article key={step.title}><strong>{step.title}</strong><span>{step.desc}</span></article>)}</div>
    </>;
    if (displayedSection.id === 'evidence') return <>
      <p className="guided-lead">判断不能凭印象，需要让现场对象、数据记录和后续结论相互对应。</p>
      <div className="guided-evidence-grid">{node.evidence.map((item, index) => <article key={item.label}><b>{index + 1}</b><strong>{item.label}</strong><span>{item.value}</span><small>{item.target}</small></article>)}</div>
    </>;
    if (displayedSection.id === 'practice') return <>
      <p className="guided-lead">先阅读判断方向，再用自己的话确认本节重点，避免只记住名词而不知道它为什么重要。</p>
      <div className="guided-practice-list">{node.practice.map((item, index) => <article key={item.question}><b>{index + 1}</b><div><strong>{item.question}</strong><span>判断方向：{item.answer}</span><small>{item.reason}</small></div></article>)}</div>
    </>;
    return <>
      <p className="guided-lead">完成后会生成可被教师查看的自学记录，并作为进入听讲模式时的学习基础。</p>
      <div className="guided-insight-grid output">{node.outputs.map((item) => <article key={item}><strong>{item}</strong><span>已纳入本节点学习产出</span></article>)}</div>
    </>;
  }, [displayedSection.id, node]);

  async function completeAndContinue() {
    if (!canAdvance) return;
    const completedSteps = [...progress.completedSteps, sectionOrder[activeIndex]];
    const timeSpentSeconds = persistedSeconds.current + Math.max(1, Math.round((Date.now() - trackingStartedAt.current) / 1000));
    setSaving(true);
    try {
      const saved = await textbookApi.updateSelfStudyProgress({
        nodeId,
        studentId: studentId(),
        studentName: window.localStorage.getItem('dgbook-auth-name') || '学生端演示',
        completedSteps,
        startedAt: progress.startedAt || trackingStartedAt.current,
        timeSpentSeconds
      });
      setProgress(saved);
      persistedSeconds.current = saved.timeSpentSeconds;
      trackingStartedAt.current = Date.now();
      const isFinished = completedSteps.length === sectionOrder.length;
      setNotice(isFinished ? '本节点自学已完成，能力数和学习记录已同步到教师端。' : `${displayedSection.title}已保存，已解锁${sectionMeta[activeIndex + 1].title}。`);
      if (!isFinished) setActiveIndex(activeIndex + 1);
    } catch {
      setNotice('保存失败：后端可能正在唤醒，请稍后再试。');
    } finally {
      setSaving(false);
    }
  }

  function selectSection(index: number) {
    if (index <= completedCount) setActiveIndex(index);
  }

  return <section className="guided-self-study" aria-label="章节式自学">
    <header className="guided-study-head">
      <div><p>{node.nodeId}</p><h2>{node.title}</h2><span>{node.subtitle}</span></div>
      <div className="guided-mastery"><strong>{progress.abilityScore || percentage}%</strong><span>技能掌握度</span></div>
    </header>
    <div className="guided-progress"><i style={{ width: `${percentage}%` }} /></div>
    <div className="guided-study-layout">
      <div className="guided-sections">
        {sectionMeta.map((section, index) => {
          const isDone = progress.completedSteps.includes(section.id);
          const locked = index > completedCount;
          const open = activeIndex === index;
          return <article key={section.id} className={`${open ? 'open' : ''} ${isDone ? 'done' : ''} ${locked ? 'locked' : ''}`}>
            <button aria-expanded={open} disabled={locked} onClick={() => selectSection(index)} type="button"><b>{isDone ? '✓' : index + 1}</b><span><strong>{section.title}</strong><small>{section.subtitle}</small></span><em>{locked ? '锁定' : open ? '收起' : '展开'}</em></button>
            {open && <div className="guided-section-content">
              {detail}
              <div className="guided-section-action">
                {isDone ? <span>本节已完成，可以回看内容或继续下一节。</span> : <button className="guided-complete-button" disabled={!canAdvance || saving} onClick={completeAndContinue} type="button">{saving ? '正在保存' : `完成${section.title}并继续`}</button>}
              </div>
            </div>}
          </article>;
        })}
      </div>
      <aside className="guided-study-side">
        <SelfStudyAbilityModel score={progress.abilityScore || percentage} />
        <div className="guided-side-copy"><strong>能力数 {progress.abilityScore || percentage}</strong><span>{nextSection.title} · {completedCount}/4 节已完成</span></div>
        <div className="guided-ability-chips">{progress.abilities.map((item) => <span key={item.label}>{item.label}<b>{item.score}</b></span>)}</div>
      </aside>
    </div>
    <footer className="guided-study-footer"><span>{notice}</span>{completedCount === sectionOrder.length ? <Link className="node-primary-link" href={`/classroom/${nodeId}`}>进入听讲模式</Link> : null}</footer>
  </section>;
}
