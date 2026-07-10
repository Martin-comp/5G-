import { AuthGate } from '@/components/AuthGate';
import { DigitalTextbookApp } from '@/components/DigitalTextbookApp';

export default function CoursePage() {
  return <AuthGate role={['student', 'teacher']}><DigitalTextbookApp initialView="course" /></AuthGate>;
}
