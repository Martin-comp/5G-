import { AuthGate } from '@/components/AuthGate';
import { LegacyRouteRedirect } from '@/components/LegacyRouteRedirect';

export default function CoursePage() {
  return <AuthGate role={['student', 'teacher']}><LegacyRouteRedirect kind="course" /></AuthGate>;
}
