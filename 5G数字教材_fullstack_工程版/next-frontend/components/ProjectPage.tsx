'use client';

import { p4Tasks, projectTaskMap, projects } from '@/lib/textbook-data';
import type { Navigate } from './types';

export function ProjectPage({ projectId, selectedTask, onSelectTask, onNavigate }: { projectId: string; selectedTask: string; onSelectTask: (id: string) => void; onNavigate: Navigate }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[3];

  if (project.id !== 'P4') {
    const tasks = projectTaskMap[project.id] ?? [];
    return (
      <div className="view-stack">
        <section className="panel page-head project-overview-head">
          <div>
            <p className="eyebrow">{project.id} · 课程项目</p>
            <h2>{project.title}</h2>
            <p>{project.note}。本页用于展示整书项目链中该章节的任务结构，后续可继续扩展为完整学习页。</p>
          </div>
          <div className="project-status-card">
            <span>当前状态</span>
            <strong>{project.status}</strong>
            <p>{project.id === 'P2' ? '该项目向P4-T2提供测试数据与证据输入。' : '已接入项目链导航，可继续补充深度任务内容。'}</p>
          </div>
        </section>
        <section className="task-grid overview-task-grid">
          {tasks.map((task) => (
            <article key={task.id} className="task-card readonly">
              <span>{task.id}</span>
              <strong>{task.title}</strong>
              <small>{task.desc}</small>
              <em>{task.status}</em>
            </article>
          ))}
        </section>
        <section className="panel evidence-panel">
          <h3>{project.id === 'P2' ? '与项目四的证据关系' : '后续扩展建议'}</h3>
          {project.id === 'P2' ? (
            <div className="evidence-flow">
              <article><strong>P2-T3 测试数据分析</strong></article>
              <article><strong>输出数据</strong><p>覆盖率、SINR、切换事件、投诉记录</p></article>
              <article><strong>进入P4-T2</strong><p>支撑结果验证与闭环判断</p></article>
              <article><strong>形成验收依据</strong></article>
            </div>
          ) : (
            <p className="muted-copy">当前先完成项目链可进入与章节概览。后续可以按老师要求，把该项目继续扩展成任务级学习页、资源卡和评价产出。</p>
          )}
          <button className="primary-action" onClick={() => onNavigate('task')} type="button">进入P4-T2核心样章</button>
        </section>
      </div>
    );
  }

  return (
    <div className="view-stack">
      <section className="panel page-head">
        <div>
          <p className="eyebrow">项目四 · 5G端到端网络优化</p>
          <h2>P4-T2 5G网络优化结果验证</h2>
          <p>通过优化前后多维KPI验证，判断优化是否真正达标并闭环，形成规范的验收结论。</p>
        </div>
        <div className="step-strip"><span>1 案例问题</span><span>2 指标解释</span><span>3 判断活动</span><span>4 结论表达</span><span>5 订正反馈</span></div>
      </section>
      <section className="task-grid">
        {p4Tasks.map((task) => (
          <button key={task.id} className={selectedTask === task.id ? 'task-card active' : 'task-card'} onClick={() => onSelectTask(task.id)} type="button">
            <span>{task.id}</span>
            <strong>{task.title}</strong>
            <small>{task.desc}</small>
          </button>
        ))}
      </section>
      <section className="panel evidence-panel">
        <h3>来自项目二 P2-T3 的证据输入</h3>
        <div className="evidence-flow">
          <article><strong>P2-T3 测试数据分析</strong></article>
          <article><strong>输出数据</strong><p>RSRP/RSRQ/SINR分布、切换事件、SMR数据</p></article>
          <article><strong>支撑验证维度</strong><p>覆盖质量、移动性稳定性、体验与容量</p></article>
          <article><strong>结果验证结论</strong></article>
        </div>
        <button className="primary-action" onClick={() => onNavigate('task')} type="button">进入N04读移动性指标</button>
      </section>
    </div>
  );
}
