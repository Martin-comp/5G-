'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { readAuthRole } from './AuthGate';

const supportedProjects = new Set(['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);

export function LegacyRouteRedirect({ kind }: { kind: 'course' | 'project' | 'task' }) {
  const router = useRouter();

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('project')?.toUpperCase() ?? 'P1';
    const projectId = supportedProjects.has(requested) ? requested : 'P1';
    const role = readAuthRole();
    if (role === 'teacher') {
      router.replace(`/teacher?project=${projectId}`);
      return;
    }
    if (kind === 'course') {
      router.replace(`/student?project=${projectId}`);
      return;
    }
    if (projectId === 'P1' || projectId === 'P2') {
      router.replace(`/student/projects/${projectId}`);
      return;
    }
    router.replace(`/graph?project=${projectId}`);
  }, [kind, router]);

  return <main className="role-auth-page"><section><span className="auth-spinner" /><strong>正在进入新版端侧页面</strong></section></main>;
}
