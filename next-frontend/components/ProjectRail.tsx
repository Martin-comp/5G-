'use client';

import { projects } from '@/lib/textbook-data';
import type { Navigate } from './types';

export function ProjectRail({ activeProjectId, onProjectSelect }: { activeProjectId: string; onProjectSelect: (projectId: string) => void; onNavigate: Navigate }) {
  return (
    <aside className="project-rail" aria-label="课程项目链">
      <h2>课程项目链</h2>
      <div className="rail-list">
        {projects.map((project, index) => (
          <button key={project.id} className={project.id === activeProjectId ? 'rail-item active' : 'rail-item'} onClick={() => onProjectSelect(project.id)} type="button">
            <span className="rail-index">{index + 1}</span>
            <span>
              <strong>{project.id} {project.title}</strong>
              <small>{project.note}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="rail-tip">
        <strong>演示主线</strong>
        <p>课程首页 → 项目四 → P4-T2 → N04学习 → 图谱 → 教师端</p>
      </div>
    </aside>
  );
}
