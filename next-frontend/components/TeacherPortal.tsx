'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthBadge } from './AuthGate';
import { TeacherPage } from './TeacherPage';
import { learningNodeExperiences, projects, type ViewKey } from '@/lib/textbook-data';

const projectIds = projects.map((project) => project.id);

export function TeacherPortal() {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get('project')?.toUpperCase() ?? 'P1';
  const projectId = projectIds.includes(requested) ? requested : 'P1';
  const firstNodeId = learningNodeExperiences.find((node) => node.projectId === projectId)?.nodeId;

  function navigate(view: ViewKey) {
    if (view === 'graph') {
      router.push(`/graph?project=${projectId}`);
      return;
    }
    if (view === 'game') {
      router.push(`/game?project=${projectId}`);
      return;
    }
    router.push(`/teacher?project=${projectId}`);
  }

  return <main className="project-journey-page role-portal-page">
    <header className="project-journey-topbar">
      <div><Link className="project-journey-logo" href={`/teacher?project=${projectId}`}>5G</Link><div><strong>5G网络优化数字教材</strong><small>教师教学工作台</small></div></div>
      <nav>
        <Link className="active" href={`/teacher?project=${projectId}`}>教师工作台</Link>
        {firstNodeId ? <Link href={`/teacher/sessions/${firstNodeId}`}>授课台</Link> : null}
        <Link href={`/graph?project=${projectId}`}>能力图谱</Link>
        <Link href={`/game?project=${projectId}`}>卡牌互动</Link>
        <AuthBadge />
      </nav>
    </header>
    <section className="graph-portal-projects role-portal-projects">
      <div><span>课程项目</span><strong>{projectId} 教师视图</strong></div>
      <nav>{projects.map((project) => <Link className={project.id === projectId ? 'active' : ''} href={`/teacher?project=${project.id}`} key={project.id}><b>{project.id}</b><span>{project.title}</span></Link>)}</nav>
    </section>
    <section className="role-portal-workspace"><TeacherPage projectId={projectId} onNavigate={navigate} /></section>
  </main>;
}
