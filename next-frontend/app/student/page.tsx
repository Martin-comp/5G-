import { AuthGate } from '@/components/AuthGate';
import { StudentHome } from '@/components/StudentHome';

export default function StudentHomePage() {
  return <AuthGate role="student"><StudentHome /></AuthGate>;
}
