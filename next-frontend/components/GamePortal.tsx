'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthBadge, readAuthRole, type AuthRole } from './AuthGate';
import { GamePage } from './GamePage';
import { projects, type ViewKey } from '@/lib/textbook-data';

const projectIds = projects.map((project) => project.id);

export function GamePortal() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<AuthRole>('student');
  const requested = params.get('project')?.toUpperCase() ?? 'P1';
  const projectId = projectIds.includes(requested) ? requested : 'P1';
  const hasStudentSample = projectId === 'P1' || projectId === 'P2';

  useEffect(() => {
    setRole(readAuthRole() === 'teacher' ? 'teacher' : 'student');
  }, []);

  function navigate(view: ViewKey) {
    if (view === 'teacher') {
      router.push(`/teacher?project=${projectId}`);
      return;
    }
    if (view === 'graph') {
      router.push(`/graph?project=${projectId}`);
      return;
    }
    if (view === 'task') {
      router.push(role === 'teacher' ? `/teacher?project=${projectId}` : hasStudentSample ? `/student/projects/${projectId}` : `/graph?project=${projectId}`);
      return;
    }
    router.push(role === 'teacher' ? `/teacher?project=${projectId}` : `/student?project=${projectId}`);
  }

  const homeHref = role === 'teacher' ? `/teacher?project=${projectId}` : `/student?project=${projectId}`;
  return <main className="project-journey-page role-portal-page game-portal-page">
    <header className="project-journey-topbar">
      <div><Link className="project-journey-logo" href={homeHref}>5G</Link><div><strong>5G网络优化数字教材</strong><small>{role === 'teacher' ? '教师互动预览' : '学生互动学习'}</small></div></div>
      <nav>
        <Link href={homeHref}>{role === 'teacher' ? '教师工作台' : '学习首页'}</Link>
        {role === 'student' && hasStudentSample ? <Link href={`/student/projects/${projectId}`}>项目任务</Link> : null}
        <Link href={`/graph?project=${projectId}`}>能力图谱</Link>
        <Link className="active" href={`/game?project=${projectId}`}>卡牌互动</Link>
        <AuthBadge />
      </nav>
    </header>
    <section className="graph-portal-projects role-portal-projects">
      <div><span>互动项目</span><strong>{projectId} 游戏化学习</strong></div>
      <nav>{projects.map((project) => <Link className={project.id === projectId ? 'active' : ''} href={`/game?project=${project.id}`} key={project.id}><b>{project.id}</b><span>{project.title}</span></Link>)}</nav>
    </section>
    <section className="role-portal-workspace game-portal-workspace"><GamePage key={projectId} projectId={projectId} onNavigate={navigate} /></section>
  </main>;
}
