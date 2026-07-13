'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { readClassroomId, textbookApi, type SelfStudyProgressDTO } from '@/lib/api';
import { getLearningNodeExperience, projectLearningPaths } from '@/lib/textbook-data';
import { readAuthName } from './AuthGate';
import { SelfStudyAbilityModel } from './SelfStudyAbilityModel';

const sectionOrder = ['problem', 'visual', 'steps', 'correction', 'exercise', 'output'] as const;
type SectionId = (typeof sectionOrder)[number];

const sectionMeta: { id: SectionId; title: string; subtitle: string }[] = [
  { id: 'problem', title: '问题', subtitle: '从真实任务明确本节要解决什么' },
  { id: 'visual', title: '看图', subtitle: '读取对象、参数和现场证据' },
  { id: 'steps', title: '步骤', subtitle: '按工作过程完成判断' },
  { id: 'correction', title: '纠偏', subtitle: '识别常见错误并修正' },
  { id: 'exercise', title: '练习', subtitle: '答对本节点专属微练习' },
  { id: 'output', title: '产出', subtitle: '形成可保存、可审核的记录' }
];

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
    classId: readClassroomId(), nodeId, studentId: studentId(), studentName: readAuthName() || '学生端演示',
    completedSteps: [], abilityScore: 0,
    abilities: [
      { label: '场景理解', score: 0, status: '待开始' },
      { label: '流程执行', score: 0, status: '待开始' },
      { label: '证据判断', score: 0, status: '待开始' },
      { label: '结论表达', score: 0, status: '待开始' }
    ],
    startedAt: Date.now(), timeSpentSeconds: 0, practiceAttempts: 0, practiceScore: 0,
    wrongKnowledgePoints: [], reviewStatus: '', updatedAt: 0
  };
}

function normalizeProgress(value: SelfStudyProgressDTO, nodeId: string): SelfStudyProgressDTO {
  const fallback = emptyProgress(nodeId);
  const completedSteps = (value.completedSteps ?? []).filter((step): step is SectionId => sectionOrder.includes(step as SectionId));
  return {
    ...fallback,
    ...value,
    nodeId,
    completedSteps,
    abilities: value.abilities?.length ? value.abilities : fallback.abilities,
    practiceAttempts: value.practiceAttempts ?? 0,
    practiceScore: value.practiceScore ?? 0,
    wrongKnowledgePoints: value.wrongKnowledgePoints ?? [],
    reviewStatus: value.reviewStatus ?? ''
  };
}

function nodeIsComplete(progress?: SelfStudyProgressDTO) {
  return Boolean(progress && progress.completedSteps.length >= sectionOrder.length && progress.practiceScore >= 100);
}

export function GuidedSelfStudy({ nodeId }: { nodeId: string }) {
  const node = getLearningNodeExperience(nodeId)!;
  const path = projectLearningPaths[node.projectId] ?? [{ nodeId, title: node.title }];
  const pathIndex = Math.max(0, path.findIndex((item) => item.nodeId === nodeId));
  const [progress, setProgress] = useState<SelfStudyProgressDTO>(() => emptyProgress(nodeId));
  const [pathProgress, setPathProgress] = useState<Record<string, SelfStudyProgressDTO>>({});
  const [pathLoaded, setPathLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [exerciseMessage, setExerciseMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('请从“问题”开始，六个阶段完成后会点亮本节点。');
  const trackingStartedAt = useRef(Date.now());
  const persistedSeconds = useRef(0);
  const completedCount = sectionOrder.filter((step) => progress.completedSteps.includes(step)).length;
  const percentage = Math.round(completedCount / sectionOrder.length * 100);
  const nextSection = sectionMeta[Math.min(completedCount, sectionMeta.length - 1)];
  const displayedSection = sectionMeta[activeIndex];
  const exercisePassed = progress.practiceScore >= 100;
  const canAdvance = activeIndex === completedCount && completedCount < sectionOrder.length && (displayedSection.id !== 'exercise' || exercisePassed);
  const nodeUnlocked = !pathLoaded || pathIndex === 0 || nodeIsComplete(pathProgress[path[pathIndex - 1]?.nodeId]);

  useEffect(() => {
    let alive = true;
    setPathLoaded(false);
    const currentStudentId = studentId();
    Promise.all(path.map((item) => textbookApi.selfStudyProgress(item.nodeId, currentStudentId).catch(() => emptyProgress(item.nodeId))))
      .then((items) => {
        if (!alive) return;
        const byNode = Object.fromEntries(items.map((item, index) => {
          const id = path[index].nodeId;
          return [id, normalizeProgress(item, id)];
        }));
        const current = byNode[nodeId] ?? emptyProgress(nodeId);
        setPathProgress(byNode);
        setProgress(current);
        persistedSeconds.current = current.timeSpentSeconds || 0;
        trackingStartedAt.current = Date.now();
        const nextIndex = Math.min(current.completedSteps.length, sectionMeta.length - 1);
        setActiveIndex(nextIndex);
        if (nodeIsComplete(current)) setNotice('本节点已点亮，练习成绩和学习记录已同步到教师端。');
        setPathLoaded(true);
      });
    return () => { alive = false; };
  }, [nodeId]);

  const detail = useMemo(() => {
    if (displayedSection.id === 'problem') return <>
      <p className="guided-lead">{node.caseIntro}</p>
      <div className="guided-insight-grid"><article><strong>本节问题</strong><span>{node.headline}</span></article><article><strong>判断目标</strong><span>{node.subtitle}</span></article></div>
    </>;
    if (displayedSection.id === 'visual') return <>
      <p className="guided-lead">把现场对象、记录与判断边界放在一起读，避免脱离场景只看单一信息。</p>
      <div className="guided-evidence-grid">{node.evidence.map((item, index) => <article key={item.label}><b>{index + 1}</b><strong>{item.label}</strong><span>{item.value}</span><small>{item.target}</small></article>)}</div>
    </>;
    if (displayedSection.id === 'steps') return <>
      <p className="guided-lead">按岗位工作过程推进，每一步都要留下能够进入下一步的依据。</p>
      <div className="guided-step-flow">{node.steps.map((step, index) => <article key={step.title}><b>{index + 1}</b><div><strong>{step.title}</strong><span>{step.desc}</span></div></article>)}</div>
    </>;
    if (displayedSection.id === 'correction') return <>
      <p className="guided-lead">先看容易出现的错误，再用证据把判断修正到可复核的边界。</p>
      <div className="guided-correction-list">{(node.correction ?? node.rubric.map((item) => ({ mistake: `只写“${item}”，没有给出对应证据。`, correction: `补充与“${item}”直接对应的对象、记录和判断边界。` }))).map((item) => <article key={item.mistake}><div><strong>常见错误</strong><span>{item.mistake}</span></div><div><strong>正确做法</strong><span>{item.correction}</span></div></article>)}</div>
    </>;
    if (displayedSection.id === 'exercise') {
      const exercise = node.microExercise ?? {
        prompt: node.practice[0]?.question ?? '本节点最关键的判断依据是什么？',
        options: [node.practice[0]?.answer ?? node.title, ...node.evidence.slice(0, 3).map((item) => item.label)].filter((item, index, values) => values.indexOf(item) === index),
        correctOption: node.practice[0]?.answer ?? node.title,
        explanation: node.practice[0]?.reason ?? '答案必须回到本节点的场景与证据。',
        knowledgePoint: node.title
      };
      return <>
        <p className="guided-lead">{exercise.prompt}</p>
        <div className="guided-exercise-options">{exercise.options.map((option) => <button className={selectedAnswer === option ? 'selected' : ''} disabled={exercisePassed || saving} key={option} onClick={() => { setSelectedAnswer(option); setExerciseMessage(''); }} type="button"><span>{option}</span></button>)}</div>
        <div className={`guided-exercise-feedback ${exercisePassed ? 'correct' : exerciseMessage ? 'wrong' : ''}`}><span>{exerciseMessage || '选择一个答案并提交。答对后才能完成本阶段。'}</span><button disabled={!selectedAnswer || exercisePassed || saving} onClick={() => submitExercise(exercise.correctOption, exercise.explanation, exercise.knowledgePoint)} type="button">{exercisePassed ? '已通过' : '提交答案'}</button></div>
      </>;
    }
    return <>
      <p className="guided-lead">学习产出会与练习成绩一起保存，教师端可以查看完成度、用时、错误点和审核状态。</p>
      <div className="guided-insight-grid output">{node.outputs.map((item) => <article key={item}><strong>{item}</strong><span>纳入本节点学习证据</span></article>)}</div>
    </>;
  }, [displayedSection.id, exerciseMessage, exercisePassed, node, saving, selectedAnswer]);

  function elapsedSeconds() {
    return persistedSeconds.current + Math.max(1, Math.round((Date.now() - trackingStartedAt.current) / 1000));
  }

  async function saveProgress(overrides: Partial<SelfStudyProgressDTO>) {
    const saved = await textbookApi.updateSelfStudyProgress({
      nodeId,
      studentId: studentId(),
      studentName: readAuthName() || '学生端演示',
      completedSteps: overrides.completedSteps ?? progress.completedSteps,
      startedAt: progress.startedAt || trackingStartedAt.current,
      timeSpentSeconds: elapsedSeconds(),
      practiceAttempts: overrides.practiceAttempts ?? progress.practiceAttempts,
      practiceScore: overrides.practiceScore ?? progress.practiceScore,
      wrongKnowledgePoints: overrides.wrongKnowledgePoints ?? progress.wrongKnowledgePoints,
      reviewStatus: overrides.reviewStatus ?? progress.reviewStatus
    });
    const normalized = normalizeProgress(saved, nodeId);
    setProgress(normalized);
    setPathProgress((current) => ({ ...current, [nodeId]: normalized }));
    persistedSeconds.current = normalized.timeSpentSeconds;
    trackingStartedAt.current = Date.now();
    return normalized;
  }

  async function submitExercise(correctOption: string, explanation: string, knowledgePoint: string) {
    if (!selectedAnswer || saving) return;
    const correct = selectedAnswer === correctOption;
    const wrongKnowledgePoints = correct ? progress.wrongKnowledgePoints : Array.from(new Set([...progress.wrongKnowledgePoints, knowledgePoint]));
    setSaving(true);
    try {
      await saveProgress({
        practiceAttempts: progress.practiceAttempts + 1,
        practiceScore: correct ? 100 : progress.practiceScore,
        wrongKnowledgePoints
      });
      setExerciseMessage(correct ? `回答正确。${explanation}` : `回答不正确，请回看“纠偏”和“看图”后再试。`);
    } catch {
      setExerciseMessage('答案保存失败，后端可能正在唤醒，请稍后再试。');
    } finally {
      setSaving(false);
    }
  }

  async function completeAndContinue() {
    if (!canAdvance || saving) return;
    const completedSteps = [...progress.completedSteps, sectionOrder[activeIndex]];
    const isFinished = completedSteps.length === sectionOrder.length;
    setSaving(true);
    try {
      await saveProgress({ completedSteps, reviewStatus: isFinished ? '待审核' : progress.reviewStatus });
      setNotice(isFinished ? '本节点已点亮，成绩、用时与错误知识点已同步到教师端。' : `${displayedSection.title}已保存，已解锁“${sectionMeta[activeIndex + 1].title}”。`);
      if (!isFinished) setActiveIndex(activeIndex + 1);
    } catch {
      setNotice('保存失败：后端可能正在唤醒，请稍后再试。');
    } finally {
      setSaving(false);
    }
  }

  function selectSection(index: number) {
    if (index <= completedCount && nodeUnlocked) setActiveIndex(index);
  }

  return <section className="guided-self-study" aria-label="六阶段章节自学">
    <header className="guided-study-head">
      <div><p>{node.nodeId}</p><h2>{node.title}</h2><span>{node.subtitle}</span></div>
      <div className="guided-mastery"><strong>{progress.abilityScore || percentage}%</strong><span>技能掌握度</span></div>
    </header>
    <div className="guided-progress"><i style={{ width: `${percentage}%` }} /></div>
    <nav className="guided-node-path" aria-label={`${node.projectId}学习路径`}>
      {path.map((item, index) => {
        const done = nodeIsComplete(pathProgress[item.nodeId]);
        const unlocked = index === 0 || nodeIsComplete(pathProgress[path[index - 1]?.nodeId]);
        const active = item.nodeId === nodeId;
        const content = <><b>{done ? '✓' : index + 1}</b><span><small>{item.nodeId}</small><strong>{item.title}</strong></span><em>{done ? '已点亮' : unlocked ? '可学习' : '前置锁定'}</em></>;
        return unlocked ? <Link className={`${active ? 'active' : ''} ${done ? 'done' : ''}`} href={`/learn/${item.nodeId}`} key={item.nodeId}>{content}</Link> : <span className="locked" key={item.nodeId}>{content}</span>;
      })}
    </nav>
    {!nodeUnlocked ? <div className="guided-node-locked"><strong>本节点尚未解锁</strong><span>请先完成上一节点的六阶段学习并答对微练习。</span><Link href={`/learn/${path[pathIndex - 1].nodeId}`}>返回上一节点</Link></div> : <div className="guided-study-layout">
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
                {isDone ? <span>本阶段已完成，可以回看内容或继续下一阶段。</span> : displayedSection.id === 'exercise' && !exercisePassed ? <span>必须答对本节点微练习后才能继续。</span> : <button className="guided-complete-button" disabled={!canAdvance || saving} onClick={completeAndContinue} type="button">{saving ? '正在保存' : `完成“${section.title}”并继续`}</button>}
              </div>
            </div>}
          </article>;
        })}
      </div>
      <aside className="guided-study-side">
        <SelfStudyAbilityModel score={progress.abilityScore || percentage} />
        <div className="guided-side-copy"><strong>能力数 {progress.abilityScore || percentage}</strong><span>{nextSection.title} · {completedCount}/6 阶段已完成</span></div>
        <div className="guided-ability-chips">{progress.abilities.map((item) => <span key={item.label}>{item.label}<b>{item.score}</b></span>)}</div>
        <div className="guided-practice-summary"><span>微练习 <b>{progress.practiceScore}分</b></span><span>尝试 <b>{progress.practiceAttempts}次</b></span><span>审核 <b>{progress.reviewStatus || '未提交'}</b></span></div>
      </aside>
    </div>}
    <footer className="guided-study-footer"><span>{notice}</span>{nodeIsComplete(progress) ? <Link className="node-primary-link" href={`/classroom/${nodeId}`}>进入听讲模式</Link> : null}</footer>
  </section>;
}
