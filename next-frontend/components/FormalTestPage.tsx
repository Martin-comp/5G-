'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { readAuthName } from './AuthGate';
import { readClassroomId, textbookApi, type SelfStudyProgressDTO } from '@/lib/api';
import { getLearningNodeExperience } from '@/lib/textbook-data';

const TEST_SECONDS = 15 * 60;

function shuffleOptions<T>(items: T[], seed: string) {
  if (items.length < 2) return items;
  let state = Array.from(seed).reduce((sum, character) => (sum * 31 + character.charCodeAt(0)) >>> 0, 2166136261);
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const target = state % (index + 1);
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  if (shuffled.every((item, index) => item === items[index])) {
    return [...shuffled.slice(1), shuffled[0]];
  }
  return shuffled;
}

function readStudentId() {
  const key = 'dgbook-generic-student-id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `student-${Date.now().toString(36)}`;
  window.localStorage.setItem(key, next);
  return next;
}

function emptyProgress(nodeId: string): SelfStudyProgressDTO {
  return {
    classId: readClassroomId(), nodeId, studentId: readStudentId(), studentName: readAuthName() || '学生端演示',
    completedSteps: [], abilityScore: 0, abilities: [], startedAt: Date.now(), timeSpentSeconds: 0,
    practiceAttempts: 0, practiceScore: 0, wrongKnowledgePoints: [], reviewStatus: '', formalTestAttempts: 0,
    firstScore: 0, bestScore: 0, latestScore: 0, testCompletedAt: 0, studentOutput: '', outputSubmittedAt: 0,
    reviewComment: '', certifiedAt: 0, outputVersions: [], formalTestVersions: [], updatedAt: 0
  };
}

export function FormalTestPage({ nodeId }: { nodeId: string }) {
  const node = getLearningNodeExperience(nodeId)!;
  const baseQuestion = node.formalTest?.[0] ?? {
    prompt: node.practice[0]?.question ?? `怎样完成${node.title}判断？`,
    options: [node.practice[0]?.answer ?? node.title, ...node.evidence.map((item) => item.label)].slice(0, 4),
    correctOption: node.practice[0]?.answer ?? node.title,
    explanation: node.practice[0]?.reason ?? '判断必须回到本节点场景与证据。',
    knowledgePoint: node.title
  };
  const correctSequence = node.steps.map((item) => item.title);
  const sequenceOptions = shuffleOptions(correctSequence, `${nodeId}-sequence`);
  const correctEvidence = node.evidence.slice(0, 2).map((item) => item.label);
  const evidenceOptions = shuffleOptions([...node.evidence.map((item) => item.label), '无来源截图', '个人印象'].slice(0, 5), `${nodeId}-evidence`);
  const conclusionAnswers = ['任务对象', '关键证据', '判断边界', '后续动作'];
  const conclusionOptions = shuffleOptions(['任务对象', '关键证据', '判断边界', '后续动作', '绝对化结论', '无关材料'], `${nodeId}-conclusion`);
  const singleOptions = shuffleOptions(baseQuestion.options, `${nodeId}-single`);
  const versionId = `FORM-${nodeId}-2026.08-v1`;
  const [progress, setProgress] = useState<SelfStudyProgressDTO>(() => emptyProgress(nodeId));
  const [progressState, setProgressState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [remaining, setRemaining] = useState(TEST_SECONDS);
  const [single, setSingle] = useState('');
  const [sequence, setSequence] = useState<string[]>(() => correctSequence.map(() => ''));
  const [evidence, setEvidence] = useState<string[]>([]);
  const [conclusion, setConclusion] = useState<string[]>(() => conclusionAnswers.map(() => ''));
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    textbookApi.selfStudyProgress(nodeId, readStudentId())
      .then((value) => {
        if (!alive) return;
        if (value.studentId) setProgress(value);
        setProgressState('ready');
      })
      .catch(() => { if (alive) setProgressState('error'); });
    return () => { alive = false; };
  }, [nodeId]);

  useEffect(() => {
    if (progressState !== 'ready' || result !== null || remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [progressState, remaining, result]);

  const requiredSteps = ['problem', 'visual', 'steps', 'correction', 'exercise'];
  const testUnlocked = requiredSteps.every((step) => progress.completedSteps.includes(step)) && progress.practiceScore >= 100;

  const answered = Boolean(single)
    && sequence.every(Boolean)
    && evidence.length > 0
    && conclusion.every(Boolean);
  const attemptLimitReached = progress.formalTestAttempts >= 3;
  const timeText = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  const diagnosis = useMemo(() => {
    if (result === null) return [];
    return [
      { label: '概念判断', score: single === baseQuestion.correctOption ? 100 : 0 },
      { label: '流程执行', score: JSON.stringify(sequence) === JSON.stringify(correctSequence) ? 100 : 0 },
      { label: '证据选择', score: [...evidence].sort().join('|') === [...correctEvidence].sort().join('|') ? 100 : 0 },
      { label: '职业表达', score: JSON.stringify(conclusion) === JSON.stringify(conclusionAnswers) ? 100 : 0 }
    ];
  }, [baseQuestion.correctOption, conclusion, conclusionAnswers, correctEvidence, correctSequence, evidence, result, sequence, single]);

  async function submit() {
    if (!answered || saving || attemptLimitReached || remaining <= 0) return;
    const parts = [
      single === baseQuestion.correctOption,
      JSON.stringify(sequence) === JSON.stringify(correctSequence),
      [...evidence].sort().join('|') === [...correctEvidence].sort().join('|'),
      JSON.stringify(conclusion) === JSON.stringify(conclusionAnswers)
    ];
    const score = parts.filter(Boolean).length * 25;
    const wrong = [baseQuestion.knowledgePoint, '流程执行', '证据选择', '职业表达'].filter((_, index) => !parts[index]);
    const attempts = progress.formalTestAttempts + 1;
    const submittedAt = Date.now();
    const attemptDiagnosis = ['概念判断', '流程执行', '证据选择', '职业表达'].map((label, index) => ({
      label, score: parts[index] ? 100 : 0, status: parts[index] ? '已达成' : '待巩固'
    }));
    setSaving(true);
    try {
      const saved = await textbookApi.updateSelfStudyProgress({
        nodeId,
        studentId: progress.studentId || readStudentId(),
        studentName: progress.studentName || readAuthName() || '学生端演示',
        completedSteps: progress.completedSteps ?? [],
        startedAt: progress.startedAt || Date.now(),
        timeSpentSeconds: (progress.timeSpentSeconds || 0) + (TEST_SECONDS - remaining),
        practiceAttempts: progress.practiceAttempts || 0,
        practiceScore: progress.practiceScore || 0,
        wrongKnowledgePoints: wrong,
        reviewStatus: progress.reviewStatus || '',
        formalTestAttempts: attempts,
        firstScore: progress.formalTestAttempts === 0 ? score : progress.firstScore,
        bestScore: Math.max(progress.bestScore || 0, score),
        latestScore: score,
        testCompletedAt: submittedAt,
        studentOutput: progress.studentOutput || '',
        outputSubmittedAt: progress.outputSubmittedAt || 0,
        reviewComment: progress.reviewComment || '',
        formalTestSubmission: {
          versionId: `${versionId}-A${attempts}`,
          submittedAt,
          elapsedSeconds: TEST_SECONDS - remaining,
          score,
          singleAnswer: single,
          sequence,
          evidence,
          conclusion,
          wrongKnowledgePoints: wrong,
          diagnosis: attemptDiagnosis
        }
      });
      setProgress(saved);
      setResult(score);
      setMessage(score >= 80 ? '达到通过标准，成绩和能力诊断已保存。' : '暂未达到 80 分，请根据诊断复习后再次作答。');
      void textbookApi.createLearningEvent({
        nodeId, studentId: saved.studentId, studentName: saved.studentName,
        eventType: 'test-submit', sectionId: 'output', value: `${versionId}:${score}`,
        durationSeconds: TEST_SECONDS - remaining
      });
    } catch {
      setMessage('提交失败，请检查后端连接后重试。');
    } finally {
      setSaving(false);
    }
  }

  function resetAttempt() {
    setSingle('');
    setSequence(correctSequence.map(() => ''));
    setEvidence([]);
    setConclusion(conclusionAnswers.map(() => ''));
    setRemaining(TEST_SECONDS);
    setResult(null);
    setMessage('');
  }

  if (progressState === 'loading') return <main className="formal-test-page"><section className="formal-test-gate"><span className="auth-spinner" /><strong>正在核对测评资格</strong><p>读取六阶段学习记录与微练习成绩。</p></section></main>;

  if (progressState === 'error') return <main className="formal-test-page"><section className="formal-test-gate"><strong>暂时无法读取学习记录</strong><p>为了避免绕过学习过程，后端连接恢复后才能进入正式测试。</p><Link href={`/learn/${nodeId}`}>返回节点学习</Link></section></main>;

  if (!testUnlocked) return <main className="formal-test-page"><section className="formal-test-gate"><strong>正式测试尚未解锁</strong><p>请先完成“问题、看图、步骤、纠偏、练习”，并在微练习中达到 100 分。</p><Link href={`/learn/${nodeId}`}>继续节点学习</Link></section></main>;

  return <main className="formal-test-page">
    <header className="formal-test-topbar">
      <div><Link href={`/learn/${nodeId}`}>← 返回节点学习</Link><span>{nodeId} · 节点正式测试</span></div>
      <strong className={remaining < 180 ? 'is-warning' : ''}>{timeText}</strong>
    </header>
    <section className="formal-test-heading">
      <div><p className="eyebrow">独立测评 · {versionId}</p><h1>{node.title}正式测试</h1><p>提交后本次答卷不可修改；系统保留首次、最高和最近成绩。</p></div>
      <div><strong>{progress.bestScore || '--'}</strong><span>历史最高</span><small>{progress.formalTestAttempts}/3 次</small></div>
    </section>

    <section className="formal-test-shell">
      <article className="formal-question-card">
        <header><b>01</b><div><strong>单项选择</strong><span>概念与边界判断 · 25分</span></div></header>
        <h2>{baseQuestion.prompt}</h2>
        <div className="formal-options">{singleOptions.map((option) => <label className={single === option ? 'selected' : ''} key={option}><input checked={single === option} disabled={result !== null} name="single" onChange={() => setSingle(option)} type="radio" />{option}</label>)}</div>
      </article>

      <article className="formal-question-card">
        <header><b>02</b><div><strong>流程排序</strong><span>工作过程执行 · 25分</span></div></header>
        <h2>按正确顺序排列本节点工作过程</h2>
        <div className="formal-sequence">{sequence.map((value, index) => <label key={index}><span>{index + 1}</span><select disabled={result !== null} onChange={(event) => setSequence((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} value={value}><option value="">请选择步骤</option>{sequenceOptions.map((option) => <option disabled={sequence.some((item, itemIndex) => itemIndex !== index && item === option)} key={option}>{option}</option>)}</select></label>)}</div>
      </article>

      <article className="formal-question-card">
        <header><b>03</b><div><strong>多项选择</strong><span>证据充分性 · 25分</span></div></header>
        <h2>选择两项最能直接支撑本节点判断的证据</h2>
        <div className="formal-options multi">{evidenceOptions.map((option) => <label className={evidence.includes(option) ? 'selected' : ''} key={option}><input checked={evidence.includes(option)} disabled={result !== null || (!evidence.includes(option) && evidence.length >= 2)} onChange={(event) => setEvidence((current) => event.target.checked ? [...current, option] : current.filter((item) => item !== option))} type="checkbox" />{option}</label>)}</div>
      </article>

      <article className="formal-question-card">
        <header><b>04</b><div><strong>结构化结论</strong><span>职业表达 · 25分</span></div></header>
        <h2>选择四段式结论的正确组成顺序</h2>
        <div className="formal-conclusion">{conclusion.map((value, index) => <label key={index}><span>{index + 1}</span><select disabled={result !== null} onChange={(event) => setConclusion((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} value={value}><option value="">请选择</option>{conclusionOptions.map((option) => <option disabled={conclusion.some((item, itemIndex) => itemIndex !== index && item === option)} key={option}>{option}</option>)}</select></label>)}</div>
      </article>

      {result !== null ? <section className="formal-result" aria-live="polite">
        <div><p className="eyebrow">本次成绩</p><strong>{result}</strong><span>{result >= 80 ? '通过' : '需复习'}</span></div>
        <div><h3>能力维度诊断</h3>{diagnosis.map((item) => <article key={item.label}><span>{item.label}</span><i><b style={{ width: `${item.score}%` }} /></i><strong>{item.score}</strong></article>)}</div>
        <aside><strong>结果说明</strong><p>{message}</p><small>答卷版本：{versionId} · 第 {progress.formalTestAttempts} 次提交</small></aside>
      </section> : null}

      {progress.formalTestVersions.length > 0 ? <section className="formal-test-history">
        <header><div><p className="eyebrow">不可变答卷记录</p><h3>历次提交版本</h3></div><span>后续作答不会覆盖旧答卷</span></header>
        <div>{[...progress.formalTestVersions].reverse().map((attempt) => <article key={`${attempt.versionId}-${attempt.attempt}`}>
          <div><strong>第 {attempt.attempt} 次 · {attempt.score} 分</strong><span>{attempt.versionId}</span><small>{attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString('zh-CN') : '历史数据'} · 用时 {Math.max(0, attempt.elapsedSeconds || 0)} 秒</small></div>
          <dl><div><dt>概念答案</dt><dd>{attempt.singleAnswer || '旧数据未保留答案'}</dd></div><div><dt>流程顺序</dt><dd>{attempt.sequence?.join(' → ') || '旧数据未保留答案'}</dd></div><div><dt>证据选择</dt><dd>{attempt.evidence?.join('、') || '旧数据未保留答案'}</dd></div><div><dt>结构化结论</dt><dd>{attempt.conclusion?.join(' → ') || '旧数据未保留答案'}</dd></div></dl>
          <p>{attempt.wrongKnowledgePoints?.length ? `待巩固：${attempt.wrongKnowledgePoints.join('、')}` : '本次四个能力维度均已达成。'}</p>
        </article>)}</div>
      </section> : null}

      <footer className="formal-test-actions"><span>{message || (attemptLimitReached ? '已达到三次作答上限。' : remaining <= 0 ? '本次测试时间已结束。' : '四类题目完成后可以提交。')}</span>{result !== null && !attemptLimitReached ? <button onClick={resetAttempt} type="button">再次作答</button> : <button disabled={!answered || saving || attemptLimitReached || remaining <= 0} onClick={submit} type="button">{saving ? '正在提交' : '提交正式测试'}</button>}</footer>
    </section>
  </main>;
}
