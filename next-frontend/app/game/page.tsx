import { AuthGate } from '@/components/AuthGate';
import { DigitalTextbookApp } from '@/components/DigitalTextbookApp';

export default function GameRoutePage() {
  return <AuthGate role="student"><DigitalTextbookApp initialView="game" /></AuthGate>;
}
