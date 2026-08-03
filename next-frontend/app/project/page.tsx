import { AuthGate } from '@/components/AuthGate';
import { LegacyRouteRedirect } from '@/components/LegacyRouteRedirect';

export default function ProjectPage() {
  return <AuthGate role={['student', 'teacher']}><LegacyRouteRedirect kind="project" /></AuthGate>;
}
