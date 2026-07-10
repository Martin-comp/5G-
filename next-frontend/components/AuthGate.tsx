'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { textbookApi, type ClassroomSessionStateDTO } from '@/lib/api';
import { CLASSROOM_REALTIME_EVENT, openClassroomRealtime } from '@/lib/classroom-realtime';

export type AuthRole = 'student' | 'teacher';
type AuthRequirement = AuthRole | AuthRole[];

const roleLabels: Record<AuthRole, string> = {
  student: '学生端',
  teacher: '教师端'
};

function normalizeRoles(role: AuthRequirement) {
  return Array.isArray(role) ? role : [role];
}

function formatRoles(roles: AuthRole[]) {
  return roles.map((item) => roleLabels[item]).join(' / ');
}

export function readAuthRole(): AuthRole | '' {
  if (typeof window === 'undefined') return '';
  const role = window.localStorage.getItem('dgbook-auth-role');
  return role === 'student' || role === 'teacher' ? role : '';
}

export function AuthGate({ role, children }: { role: AuthRequirement; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<AuthRole | ''>('');
  const [checked, setChecked] = useState(false);
  const [activeClassroom, setActiveClassroom] = useState<ClassroomSessionStateDTO | null>(null);
  const allowedRoles = normalizeRoles(role);

  useEffect(() => {
    setCurrentRole(readAuthRole());
    setChecked(true);
  }, []);

  useEffect(() => {
    if (currentRole !== 'student') return;
    let alive = true;
    const refresh = () => {
      void textbookApi.activeClassroomSession().then((state) => {
        if (alive) setActiveClassroom(state);
      }).catch(() => undefined);
    };
    refresh();
    const onRealtime = () => refresh();
    window.addEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
    const timer = window.setInterval(refresh, 15000);
    return () => {
      alive = false;
      window.removeEventListener(CLASSROOM_REALTIME_EVENT, onRealtime);
      window.clearInterval(timer);
    };
  }, [currentRole]);

  useEffect(() => {
    if (!currentRole || !checked) return;
    return openClassroomRealtime(currentRole);
  }, [checked, currentRole]);

  useEffect(() => {
    if (currentRole !== 'student' || !activeClassroom?.synced || !activeClassroom.nodeId) return;
    const classroomPath = `/classroom/${activeClassroom.nodeId}`;
    const practicePath = `/game?project=${activeClassroom.nodeId.slice(0, 2)}`;
    const inControlledPage = pathname === classroomPath || (activeClassroom.practicePushed && pathname?.startsWith('/game'));
    if (!inControlledPage) router.replace(activeClassroom.practicePushed ? practicePath : classroomPath);
  }, [activeClassroom, currentRole, pathname, router]);

  if (!checked) {
    return (
      <main className="role-auth-page">
        <section>
          <span className="auth-spinner" />
          <strong>正在确认端侧身份</strong>
        </section>
      </main>
    );
  }

  if (!allowedRoles.includes(currentRole as AuthRole)) {
    const preferredRole = allowedRoles[0];
    const roleText = formatRoles(allowedRoles);
    const next = encodeURIComponent(pathname || (preferredRole === 'teacher' ? '/teacher' : '/course'));
    return (
      <main className="role-auth-page">
        <section>
          <p className="eyebrow">需要登录 {roleText}</p>
          <h1>请先进入对应端口</h1>
          <p>学生端和教师端已分开，当前页面需要使用对应账号登录后访问。</p>
          <Link href={`/login?role=${preferredRole}&next=${next}`}>去登录</Link>
        </section>
      </main>
    );
  }

  if (currentRole === 'student' && activeClassroom?.synced && activeClassroom.nodeId) {
    const classroomPath = `/classroom/${activeClassroom.nodeId}`;
    const onClassroomPage = pathname === classroomPath || (activeClassroom.practicePushed && pathname?.startsWith('/game'));
    if (!onClassroomPage) {
      return (
        <main className="role-auth-page classroom-control-wait">
          <section>
            <p className="eyebrow">课堂受控中</p>
            <h1>教师正在同步 {activeClassroom.nodeId}</h1>
            <p>学生端已锁定为课堂跟随模式，正在进入教师指定页面。</p>
          </section>
        </main>
      );
    }
  }

  return <>{children}</>;
}

export function AuthBadge() {
  const [role, setRole] = useState<AuthRole | ''>('');
  const [name, setName] = useState('');

  useEffect(() => {
    setRole(readAuthRole());
    setName(window.localStorage.getItem('dgbook-auth-name') || '');
  }, []);

  function logout() {
    window.localStorage.removeItem('dgbook-auth-role');
    window.localStorage.removeItem('dgbook-auth-name');
    window.location.href = '/login';
  }

  if (!role) {
    return <Link className="role-switch-link" href="/login">登录</Link>;
  }

  return (
    <div className="auth-badge">
      <span>{roleLabels[role]}</span>
      <strong>{name || roleLabels[role]}</strong>
      <button onClick={logout} type="button">退出</button>
    </div>
  );
}
