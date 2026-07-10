import { AuthGate } from '@/components/AuthGate';
import { DigitalTextbookApp } from '@/components/DigitalTextbookApp';

export default function TeacherPage() {
  return <AuthGate role="teacher"><DigitalTextbookApp initialView="teacher" /></AuthGate>;
}
