import { AuthGate } from '@/components/AuthGate';
import { GamePortal } from '@/components/GamePortal';

export default function GameRoutePage() {
  return <AuthGate role={['student', 'teacher']}><GamePortal /></AuthGate>;
}
