'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ViewKey } from '@/lib/textbook-data';
import { TopNav } from './TopNav';
import { ProjectRail } from './ProjectRail';
import { ContextPanel } from './ContextPanel';
import { CourseHome } from './CourseHome';
import { ProjectPage } from './ProjectPage';
import { StudentTaskPage } from './StudentTaskPage';
import { GraphPage } from './GraphPage';
import { TeacherPage } from './TeacherPage';
import { GamePage } from './GamePage';

const viewRoutes: Record<ViewKey, string> = {
  course: '/course',
  project: '/project',
  task: '/task',
  graph: '/graph',
  teacher: '/teacher',
  game: '/game'
};

const projectIds = new Set(['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);

export function DigitalTextbookApp({ initialView = 'course' }: { initialView?: ViewKey }) {
  const router = useRouter();
  const [view, setView] = useState<ViewKey>(initialView);
  const [selectedProjectId, setSelectedProjectId] = useState(initialView === 'teacher' ? 'P1' : 'P4');
  const [selectedTask, setSelectedTask] = useState('N04');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const project = new URLSearchParams(window.location.search).get('project');
    if (project && projectIds.has(project)) setSelectedProjectId(project);
  }, []);

  function routeFor(nextView: ViewKey, projectId = selectedProjectId) {
    return `${viewRoutes[nextView]}?project=${projectId}`;
  }

  function navigate(nextView: ViewKey) {
    setView(nextView);
    router.push(routeFor(nextView));
  }

  function selectProject(projectId: string) {
    setSelectedProjectId(projectId);
    setSelectedTask(projectId === 'P4' ? 'N04' : '');
    setAnswer('');
    const nextView = view;
    setView(nextView);
    router.push(routeFor(nextView, projectId));
  }

  function selectStudentProject(projectId: string) {
    setSelectedProjectId(projectId);
    setView('task');
    router.push(routeFor('task', projectId));
  }

  return (
    <main className={`digital-shell view-${view}`}>
      <TopNav view={view} onNavigate={navigate} />
      <section className="app-layout">
        <ProjectRail activeProjectId={selectedProjectId} onProjectSelect={selectProject} />
        <section className="workspace" aria-live="polite">
          {view === 'course' && <CourseHome projectId={selectedProjectId} onNavigate={navigate} />}
          {view === 'project' && <ProjectPage projectId={selectedProjectId} selectedTask={selectedTask} onSelectTask={setSelectedTask} onNavigate={navigate} />}
          {view === 'task' && <StudentTaskPage projectId={selectedProjectId} answer={answer} setAnswer={setAnswer} onProjectSelect={selectStudentProject} onNavigate={navigate} />}
          {view === 'graph' && <GraphPage projectId={selectedProjectId} onNavigate={navigate} />}
          {view === 'teacher' && <TeacherPage projectId={selectedProjectId} onNavigate={navigate} />}
          {view === 'game' && <GamePage key={selectedProjectId} projectId={selectedProjectId} onNavigate={navigate} />}
        </section>
        <ContextPanel projectId={selectedProjectId} />
      </section>
    </main>
  );
}
