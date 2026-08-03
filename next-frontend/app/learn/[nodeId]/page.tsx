import { AuthGate } from '@/components/AuthGate';
import { RoleAwareLearnExperience } from '@/components/RoleAwareLearnExperience';
import { learningNodeExperiences, p4NodeExperience } from '@/lib/textbook-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ nodeId: p4NodeExperience.nodeId }, ...learningNodeExperiences.map((node) => ({ nodeId: node.nodeId }))];
}

export default async function LearnNodePage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return <AuthGate role={['student', 'teacher']}><RoleAwareLearnExperience isP4={nodeId === p4NodeExperience.nodeId} nodeId={nodeId} /></AuthGate>;
}
