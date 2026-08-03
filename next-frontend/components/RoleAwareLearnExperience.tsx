'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { readAuthRole } from './AuthGate';
import { GenericNodeExperience } from './GenericNodeExperience';
import { P4NodeExperience } from './P4NodeExperience';

export function RoleAwareLearnExperience({ nodeId, isP4 = false }: { nodeId: string; isP4?: boolean }) {
  const router = useRouter();
  const [studentReady, setStudentReady] = useState(false);

  useEffect(() => {
    if (readAuthRole() === 'teacher') {
      router.replace(`/teacher/sessions/${nodeId}`);
      return;
    }
    setStudentReady(true);
  }, [nodeId, router]);

  if (!studentReady) {
    return <main className="role-auth-page"><section><span className="auth-spinner" /><strong>正在进入对应端口</strong></section></main>;
  }

  return isP4 ? <P4NodeExperience mode="learn" /> : <GenericNodeExperience mode="learn" nodeId={nodeId} />;
}
