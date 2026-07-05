'use client';

import { courseStats, projectTaskMap, projects } from '@/lib/textbook-data';
import type { Navigate } from './types';

const projectGraphMap: Record<string, { id: string; title: string }> = {
  P1: { id: 'CG-01', title: '信息采集' },
  P2: { id: 'CG-02', title: '网络测试' },
  P3: { id: 'CG-03', title: '信息管理' },
  P4: { id: 'CG-05', title: '结果验证' },
  P5: { id: 'CG-06', title: '性能提升' },
  P6: { id: 'CG-07', title: '信令分析' }
};

export function CourseHome({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[3];
  const tasks = project.id === 'P4'
    ? [
        { id: 'P4-T1', title: '优化实施', desc: '完成参数调整与策略变更。' },
        { id: 'P4-T2', title: '结果验证', desc: '确认优化是否真正达标并闭环。', active: true },
        { id: 'P4-T3', title: '报告输出', desc: '整理验证结论并提出后续建议。' }
      ]
    : (projectTaskMap[project.id] ?? []).map((task) => ({ id: task.id, title: task.title, desc: task.desc }));
  const graph = projectGraphMap[project.id] ?? projectGraphMap.P4;
  const isP4 = project.id === 'P4';

  return (
    <div className="view-stack">
      <section className="course-hero panel">
        <div className="hero-copy">
          <p className="eyebrow">{isP4 ? '推荐学习路径' : '当前课程项目'}</p>
          <h2>{isP4 ? 'P4-T2 5G网络优化结果验证' : `${project.id} ${project.title}`}</h2>
          <p>{isP4 ? '在P4-T1优化实施的基础上，基于验证方法和指标体系，对优化效果进行全面评估与验证，形成可靠结论。' : `${project.note}。本页展示该项目在整书学习路径中的位置、任务链和能力图谱入口。`}</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => onNavigate(isP4 ? 'task' : 'project')} type="button">
              {isP4 ? '进入P4-T2任务学习' : `进入${project.id}项目任务`}
            </button>
            <button className="secondary-action" onClick={() => onNavigate('graph')} type="button">查看能力图谱</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="radar-card"><strong>{graph.id}</strong><span>{graph.title}</span></div>
        </div>
      </section>
      <section className="stat-grid">
        {courseStats.map((item, index) => (
          <article key={item.label} className="stat-card">
            <strong>{index === 3 ? (isP4 ? 'P4-T2' : project.status) : item.value}</strong>
            <span>{index === 3 ? (isP4 ? item.label : '项目状态') : item.label}</span>
            <p>{index === 3 ? (isP4 ? item.note : project.note) : item.note}</p>
          </article>
        ))}
      </section>
      <section className="panel flow-panel">
        <h3>{isP4 ? '任务链摘要' : `${project.id} 任务链摘要`}</h3>
        <div className="three-flow">
          {tasks.map((task, index) => (
            <article key={task.id} className={'active' in task && task.active ? 'active' : ''}>
              <small>{task.id}</small>
              <strong>{task.title}</strong>
              <p>{task.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
