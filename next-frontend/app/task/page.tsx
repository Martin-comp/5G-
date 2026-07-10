import { AuthGate } from '@/components/AuthGate';
import { DigitalTextbookApp } from '@/components/DigitalTextbookApp';

export default function TaskPage() {
  return <AuthGate role="student"><DigitalTextbookApp initialView="task" /></AuthGate>;
}
