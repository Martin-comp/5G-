import { AuthGate } from '@/components/AuthGate';
import { GenericNodeExperience } from '@/components/GenericNodeExperience';
import { P4NodeExperience } from '@/components/P4NodeExperience';
import { learningNodeExperiences, p4NodeExperience } from '@/lib/textbook-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ nodeId: p4NodeExperience.nodeId }, ...learningNodeExperiences.map((node) => ({ nodeId: node.nodeId }))];
}

export default async function ClassroomNodePage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  if (nodeId !== p4NodeExperience.nodeId) return <AuthGate role="student"><GenericNodeExperience nodeId={nodeId} mode="classroom" /></AuthGate>;
  return <AuthGate role="student"><P4NodeExperience mode="classroom" /></AuthGate>;
}
