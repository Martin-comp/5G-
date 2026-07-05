'use client';

import { graphNodes, p4Tasks, projectTaskMap, projects, resourceCards } from '@/lib/textbook-data';
import type { Navigate } from './types';

const projectToGraph: Record<string, string> = {
  P1: 'CG-01',
  P2: 'CG-02',
  P3: 'CG-03',
  P4: 'CG-05',
  P5: 'CG-06',
  P6: 'CG-07'
};

export function GraphPage({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[3];
  const activeGraphId = projectToGraph[project.id] ?? 'CG-05';
  const isP4 = project.id === 'P4';

  return (
    <div className="view-stack">
      <section className="graph-panel panel">
        <p className="eyebrow">{project.id} · {project.title}</p>
        <h2>课程能力图谱</h2>
        <div className="graph-chain">
          {graphNodes.map((node) => (
            <button key={node.id} className={node.id === activeGraphId ? 'graph-node active' : 'graph-node'} type="button">
              <span>{node.id}</span>
              <strong>{node.title}</strong>
            </button>
          ))}
        </div>
        {isP4 ? (
          <div className="local-map">
            <article className="current-map-node"><strong>P4-T2</strong><span>移动性验证路径</span></article>
            <div className="subnode-grid">
              {p4Tasks.map((task) => <span key={task.id} className={task.active ? 'active' : ''}>{task.id}<br />{task.title}</span>)}
            </div>
          </div>
        ) : (
          <div className="local-map project-local-map">
            <article className="current-map-node"><strong>{project.id}</strong><span>{project.title}</span></article>
            <div className="subnode-grid project-subnodes">
              {(projectTaskMap[project.id] ?? []).map((task) => <span key={task.id}>{task.id}<br />{task.title}</span>)}
            </div>
          </div>
        )}
      </section>
      <section className="panel resource-panel">
        <h3>{isP4 ? '关联资源（双向定位）' : `${project.id} 资源挂接概览`}</h3>
        <div className="resource-grid">
          {(isP4 ? resourceCards : [
            { title: `${project.id} 学生学习页`, desc: '项目任务 · 学习入口' },
            { title: `${project.id} 教师组织页`, desc: '任务组织 · 授课建议' },
            { title: `${project.id} 评价产出`, desc: '任务成果 · 评价记录' }
          ]).map((card) => (
            <button key={card.title} className="resource-card" onClick={card.title.includes('学生') ? () => onNavigate('task') : undefined} type="button">
              <strong>{card.title}</strong>
              <small>{card.desc}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
