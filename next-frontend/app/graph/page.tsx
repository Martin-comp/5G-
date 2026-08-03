import { AuthGate } from '@/components/AuthGate';
import { GraphPortal } from '@/components/GraphPortal';

export default function GraphPage() {
  return <AuthGate role={['student', 'teacher']}><GraphPortal /></AuthGate>;
}
