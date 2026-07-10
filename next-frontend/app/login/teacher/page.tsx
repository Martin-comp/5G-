import { Suspense } from 'react';
import { LoginPage } from '@/components/LoginPage';

export default function TeacherLoginRoutePage() {
  return (
    <Suspense fallback={<main className="login-page"><section className="login-shell login-loading">正在进入登录页...</section></main>}>
      <LoginPage initialRole="teacher" />
    </Suspense>
  );
}
