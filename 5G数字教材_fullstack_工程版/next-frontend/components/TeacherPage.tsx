'use client';

import { mobilityMetrics, projectTaskMap, projects, teacherSuggestions } from '@/lib/textbook-data';
import type { Navigate } from './types';

export function TeacherPage({ projectId, onNavigate }: { projectId: string; onNavigate: Navigate }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[3];
  const isP4 = project.id === 'P4';

  if (!isP4) {
    const tasks = projectTaskMap[project.id] ?? [];
    return (
      <div className="teacher-shell teacher-overview-shell">
        <section className="teacher-stage">
          <p className="eyebrow light">教师任务组织端</p>
          <h2>{project.id} {project.title}</h2>
          <div className="teacher-slide teacher-overview-slide">
            <h3>{project.note}</h3>
            <div className="teacher-task-list">
              {tasks.map((task) => (
                <article key={task.id}>
                  <strong>{task.id} {task.title}</strong>
                  <p>{task.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <aside className="teacher-panel">
          <h3>AI预生成组织建议</h3>
          <article><strong>任务组织建议</strong><p>先按项目目标组织任务链，再补充资源卡、活动和评价产出。</p></article>
          <article><strong>课堂推进建议</strong><p>围绕项目关键任务设置导入问题、证据读取和阶段反馈。</p></article>
          <article><strong>后续扩展建议</strong><p>该项目可继续扩展学生端、投屏端和图谱资源挂接。</p></article>
          <div className="teacher-actions">
            <button className="secondary-action dark" onClick={() => onNavigate('task')} type="button">同步学生端</button>
            <button className="primary-action" onClick={() => onNavigate('project')} type="button">查看项目结构</button>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="teacher-shell">
      <section className="teacher-stage">
        <p className="eyebrow light">教师授课控制台</p>
        <h2>移动性验证黄金切片</h2>
        <div className="teacher-slide">
          <h3>覆盖达标后，为什么移动中仍会中断？</h3>
          <div className="teacher-route"><span>1 电梯口</span><span>2 A-B边界</span><span>3 食堂入口</span><span>4 就餐区</span></div>
          <div className="teacher-metrics">{mobilityMetrics.map((metric) => <b key={metric.label}>{metric.label}<br />{metric.value}</b>)}</div>
        </div>
      </section>
      <aside className="teacher-panel">
        <h3>AI预生成任务组织</h3>
        {teacherSuggestions.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.desc}</p>
          </article>
        ))}
        <div className="teacher-actions">
          <button className="secondary-action dark" onClick={() => onNavigate('task')} type="button">同步学生端</button>
          <button className="primary-action" type="button">开始讲评</button>
        </div>
      </aside>
    </div>
  );
}
