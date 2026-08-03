'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthBadge, readAuthRole, type AuthRole } from './AuthGate';
import { GraphPage } from './GraphPage';
import { learningNodeExperiences, projects, type ViewKey } from '@/lib/textbook-data';

const projectIds = projects.map((project) => project.id);

export function GraphPortal() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<AuthRole>('student');
  const requestedProject = params.get('project')?.toUpperCase() ?? 'P1';
  const projectId = projectIds.includes(requestedProject) ? requestedProject : 'P1';
  const hasStudentSample = projectId === 'P1' || projectId === 'P2';
  const firstNodeId = learningNodeExperiences.find((node) => node.projectId === projectId)?.nodeId;

  useEffect(() => {
    setRole(readAuthRole() === 'teacher' ? 'teacher' : 'student');
  }, []);

  function navigate(view: ViewKey) {
    if (view === 'task' && role === 'student' && hasStudentSample) {
      router.push(`/student/projects/${projectId}`);
      return;
    }
    if (view === 'teacher' || (view === 'task' && role === 'teacher')) {
      router.push(`/teacher?project=${projectId}`);
      return;
    }
    router.push(`/${view}?project=${projectId}`);
  }

  return <main className="project-journey-page graph-portal-page">
    <header className="project-journey-topbar">
      <div><Link className="project-journey-logo" href={role === 'teacher' ? `/teacher?project=${projectId}` : `/student?project=${projectId}`}>5G</Link><div><strong>5G网络优化数字教材</strong><small>{role === 'teacher' ? '教师能力图谱' : '学生能力图谱'}</small></div></div>
      <nav>
        {role === 'student' ? <>
          <Link href={`/student?project=${projectId}`}>学习首页</Link>
          <Link href={hasStudentSample ? `/student/projects/${projectId}` : `/graph?project=${projectId}`}>{hasStudentSample ? '项目任务' : '项目图谱'}</Link>
          {hasStudentSample ? <Link href={`/student/projects/${projectId}/portfolio`}>成果包</Link> : null}
        </> : <>
          <Link href={`/teacher?project=${projectId}`}>教师工作台</Link>
          {firstNodeId ? <Link href={`/teacher/sessions/${firstNodeId}`}>授课台</Link> : null}
        </>}
        <Link className="active" href={`/graph?project=${projectId}`}>能力图谱</Link>
        <AuthBadge />
      </nav>
    </header>
    <section className="graph-portal-projects" aria-label="选择图谱项目">
      <strong>课程项目</strong>
      <nav>{projects.map((project) => <Link className={project.id === projectId ? 'active' : ''} href={`/graph?project=${project.id}`} key={project.id}>{project.id}<span>{project.title}</span></Link>)}</nav>
    </section>
    <section className="project-journey-shell graph-portal-shell">
      <GraphPage audience={role} onNavigate={navigate} projectId={projectId} />
    </section>
  </main>;
}
