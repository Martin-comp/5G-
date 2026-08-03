import { AuthGate } from '@/components/AuthGate';
import { TeacherPortal } from '@/components/TeacherPortal';

export default function TeacherPage() {
  return <AuthGate role="teacher"><TeacherPortal /></AuthGate>;
}
