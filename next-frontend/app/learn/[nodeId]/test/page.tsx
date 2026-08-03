import { AuthGate } from '@/components/AuthGate';
import { FormalTestPage } from '@/components/FormalTestPage';
import { notFound } from 'next/navigation';
import { learningNodeExperiences } from '@/lib/textbook-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return learningNodeExperiences.map((node) => ({ nodeId: node.nodeId }));
}

export default async function NodeFormalTestRoute({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  if (!learningNodeExperiences.some((node) => node.nodeId === nodeId)) notFound();
  return <AuthGate role="student"><FormalTestPage nodeId={nodeId} /></AuthGate>;
}
