import { AuthGate } from '@/components/AuthGate';
import { StudentPortfolioDetail } from '@/components/StudentProjectJourney';

export const dynamicParams = false;
export function generateStaticParams() {
  return [
    { projectId: 'P1', taskId: 'P01' }, { projectId: 'P1', taskId: 'P02' }, { projectId: 'P1', taskId: 'P03' },
    { projectId: 'P2', taskId: 'P01' }
  ];
}

export default async function StudentPortfolioDetailRoute({ params }: { params: Promise<{ projectId: string; taskId: string }> }) {
  const { projectId, taskId } = await params;
  return <AuthGate role="student"><StudentPortfolioDetail projectId={projectId.toUpperCase()} taskId={taskId.toUpperCase()} /></AuthGate>;
}
