'use client';

import { useState } from 'react';
import Link from 'next/link';
import { textbookApi } from '@/lib/api';
import { classroomTasks, learningNodeExperiences, mobilityMetrics, projectTaskMap, projects } from '@/lib/textbook-data';
import type { Navigate } from './types';

export function StudentTaskPage({
  projectId,
  answer,
  setAnswer,
  onProjectSelect,
  onNavigate
}: {
  projectId: string;
  answer: string;
  setAnswer: (value: string) => void;
  onProjectSelect: (projectId: string) => void;
  onNavigate: Navigate;
}) {
  const project = projects.find((item) => item.id === projectId) ?? projects[3];

  return (
    <div className="view-stack">
      <section className="student-project-tabs panel">
        <div>
          <p className="eyebrow">学生学习入口</p>
          <h2>{project.id} {project.title}</h2>
        </div>
        <div className="student-tab-row">
          {projects.map((item) => (
            <button key={item.id} className={item.id === project.id ? 'active' : ''} onClick={() => onProjectSelect(item.id)} type="button">
              {item.id}
            </button>
          ))}
        </div>
      </section>

      {project.id === 'P4' ? (
        <P4StudentDeepPage answer={answer} setAnswer={setAnswer} onNavigate={onNavigate} />
      ) : (
        <ProjectStudentOverview projectId={project.id} onNavigate={onNavigate} />
      )}
    </div>
  );
}

function P4StudentDeepPage({ answer, setAnswer, onNavigate }: { answer: string; setAnswer: (value: string) => void; onNavigate: Navigate }) {
  const [status, setStatus] = useState('');

  async function submitAnswer() {
    setStatus('正在提交...');
    try {
      await textbookApi.submitClassroomWork({
        nodeId: 'P4T2-N04',
        taskId: 'P4T2-N04-student-task',
        studentId: getStudentTaskDemoId(),
        studentName: '学生端演示',
        answer,
        evidence: ['切换成功率', '重建次数', '短掉线日志'],
        conclusion: answer,
        score: answer.includes('未闭环') ? 85 : 60,
        selectedEvidence: ['切换成功率', '重建次数', '短掉线日志']
      });
      setStatus('已提交，教师端会自动刷新统计。');
    } catch {
      setStatus('提交失败：后端可能正在唤醒，请稍后重试。');
    }
  }

  return (
    <>
      <section className="student-workbench panel">
        <div className="lesson-board">
          <p className="tag">P4T2-N04 · 当前讲授</p>
          <h2>覆盖达标后，为什么移动中仍会断？</h2>
          <div className="mobility-path">
            {['电梯口', 'A-B边界', '食堂入口', '就餐区'].map((label, index) => (
              <div key={label} className="path-point">
                <span>{index + 1}</span>
                <strong>{label}</strong>
                <small>{index === 1 ? '切换事件集中' : index === 2 ? '短时中断' : '信号波动'}</small>
              </div>
            ))}
          </div>
          <div className="warning-banner">覆盖已改善，但移动性未闭环</div>
        </div>
        <div className="metric-column">
          <h3>当前要看的三项移动性证据</h3>
          {mobilityMetrics.map((metric) => (
            <article key={metric.label} className={`metric-card ${metric.tone}`}>
              <div><strong>{metric.label}</strong><span>{metric.target}</span></div>
              <b>{metric.value}</b>
              <em>{metric.status}</em>
            </article>
          ))}
          <a className="secondary-action full route-action-link" href="/learn/P4T2-N04">打开标准自学页</a>
          <a className="secondary-action full route-action-link" href="/classroom/P4T2-N04">进入课堂跟随页</a>
          <button className="secondary-action full" onClick={() => onNavigate('game')} type="button">进入互动闯关</button>
          <button className="secondary-action full" onClick={() => onNavigate('teacher')} type="button">切换教师授课端</button>
        </div>
      </section>
      <section className="answer-panel panel">
        <div className="mini-tasks">
          <h3>课堂小任务（本页）</h3>
          {classroomTasks.map((task, index) => <p key={task}><b>{index + 1}</b>{task}</p>)}
        </div>
        <label className="answer-box">
          我的边界结论
          <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="例如：覆盖指标已达标，但A-B边界切换成功率低、重建次数偏多，因此移动性体验未闭环。" />
        </label>
        <button className="primary-action submit-button" onClick={submitAnswer} type="button">提交作答</button>
        {status && <p className="submit-status">{status}</p>}
      </section>
    </>
  );
}

function ProjectStudentOverview({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const tasks = projectTaskMap[projectId] ?? [];
  const learningNode = learningNodeExperiences.find((item) => item.projectId === project.id);

  return (
    <>
      <section className="panel student-overview-hero">
        <div>
          <p className="tag">{project.id} · 学生学习概览</p>
          <h2>{project.title}</h2>
          <p>{project.note}。本项目已接入一条完整样章学习闭环，可从自学进入课堂跟随、互动卡牌和教师讲评。</p>
        </div>
        <div className="student-status-block">
          <span>学习状态</span>
          <strong>{project.status}</strong>
          <small>{project.id === 'P2' ? '该项目为P4-T2提供测试数据证据。' : '已接入学生学习路径。'}</small>
        </div>
      </section>
      <section className="student-learning-grid">
        {tasks.map((task, index) => (
          <article key={task.id} className="student-learning-card panel">
            <span>{index + 1}</span>
            <strong>{task.id} {task.title}</strong>
            <p>{task.desc}</p>
            <em>{task.status}</em>
          </article>
        ))}
      </section>
      <section className="panel student-next-panel">
        <h3>{project.id === 'P2' ? '学习结果如何进入P4-T2？' : '进入本项目完整学习闭环'}</h3>
        <p>{project.id === 'P2' ? 'P2-T3输出的测试数据分析结果，会作为P4-T2结果验证的前置证据，用来判断覆盖、移动性、体验和容量是否真正达标。' : '从案例、证据、课堂作答和讲评开始，再通过卡牌互动巩固本项目关键知识。'}</p>
        {learningNode ? <div className="student-loop-links"><Link className="primary-action route-action-link" href={`/learn/${learningNode.nodeId}`}>进入学生自学</Link><Link className="secondary-action route-action-link" href={`/classroom/${learningNode.nodeId}`}>进入课堂跟随</Link><button className="secondary-action" onClick={() => onNavigate('game')} type="button">进入卡牌互动</button></div> : <button className="primary-action" onClick={() => onNavigate('project')} type="button">查看项目任务结构</button>}
      </section>
    </>
  );
}

function getStudentTaskDemoId() {
  if (typeof window === 'undefined') return 'student-task-demo';
  const key = 'dgbook-student-task-demo-id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `student-task-${Date.now().toString(36)}`;
  window.localStorage.setItem(key, next);
  return next;
}
