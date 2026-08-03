import { AuthGate } from '@/components/AuthGate';
import { StudentProjectJourney } from '@/components/StudentProjectJourney';

export const dynamicParams = false;
export function generateStaticParams() { return [{ projectId: 'P1' }, { projectId: 'P2' }]; }

export default async function StudentProjectRoute({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <AuthGate role="student"><StudentProjectJourney projectId={projectId.toUpperCase()} /></AuthGate>;
}
