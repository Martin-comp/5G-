import { AuthGate } from '@/components/AuthGate';
import { DigitalTextbookApp } from '@/components/DigitalTextbookApp';

export default function GraphPage() {
  return <AuthGate role={['student', 'teacher']}><DigitalTextbookApp initialView="graph" /></AuthGate>;
}
