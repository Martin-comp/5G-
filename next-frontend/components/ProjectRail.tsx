'use client';

import { projects } from '@/lib/textbook-data';

export function ProjectRail({ activeProjectId, onProjectSelect }: { activeProjectId: string; onProjectSelect: (projectId: string) => void }) {
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];

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
        <strong>{activeProject.id} 学习主线</strong>
        <p>课程首页 → {activeProject.id} {activeProject.title} → 项目任务 → 节点学习 → 能力图谱 → 教师端</p>
      </div>
    </aside>
  );
}
