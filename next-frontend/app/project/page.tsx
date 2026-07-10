import { AuthGate } from '@/components/AuthGate';
import { DigitalTextbookApp } from '@/components/DigitalTextbookApp';

export default function ProjectPage() {
  return <AuthGate role={['student', 'teacher']}><DigitalTextbookApp initialView="project" /></AuthGate>;
}
