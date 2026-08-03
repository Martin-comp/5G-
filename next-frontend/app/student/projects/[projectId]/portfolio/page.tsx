import { AuthGate } from '@/components/AuthGate';
import { StudentProjectPortfolio } from '@/components/StudentProjectJourney';

export const dynamicParams = false;
export function generateStaticParams() { return [{ projectId: 'P1' }, { projectId: 'P2' }]; }

export default async function StudentPortfolioRoute({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <AuthGate role="student"><StudentProjectPortfolio projectId={projectId.toUpperCase()} /></AuthGate>;
}
