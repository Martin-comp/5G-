'use client';

import { projects } from '@/lib/textbook-data';

export function ContextPanel({ projectId }: { projectId: string }) {
  const project = projects.find((item) => item.id === projectId) ?? projects[3];
  const isP4 = project.id === 'P4';

  return (
    <aside className="context-panel" aria-label="学习上下文">
      <h2>学习上下文</h2>
      <article className="context-card primary-context">
        <span>当前项目</span>
        <strong>{project.id} {project.title}</strong>
        <p>{project.note}</p>
      </article>
      <article className="context-card">
        <span>{isP4 ? '当前推荐' : '学习定位'}</span>
        <strong>{isP4 ? 'P4-T2 5G网络优化结果验证' : `${project.id} 项目学习概览`}</strong>
        <p>{isP4 ? '基于验证方法与指标体系，评估优化效果，形成可靠结论。' : '当前以项目任务链、学生学习概览和教师组织建议方式接入。'}</p>
      </article>
      <article className="context-card">
        <span>能力图谱</span>
        <strong>{isP4 ? 'CG-05 结果验证' : '项目能力节点'}</strong>
        <p>{isP4 ? '当前关联能力：指标体系应用、数据分析、验证评估。' : '后续可继续补充资源卡、活动和评价产出挂接。'}</p>
      </article>
    </aside>
  );
}
