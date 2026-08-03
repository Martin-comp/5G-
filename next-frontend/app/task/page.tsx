import { AuthGate } from '@/components/AuthGate';
import { LegacyRouteRedirect } from '@/components/LegacyRouteRedirect';

export default function TaskPage() {
  return <AuthGate role={['student', 'teacher']}><LegacyRouteRedirect kind="task" /></AuthGate>;
}
