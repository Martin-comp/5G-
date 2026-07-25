'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { textbookApi, type ClassroomSessionStateDTO } from '@/lib/api';
import { CLASSROOM_REALTIME_EVENT, openClassroomRealtime, type ClassroomRealtimeEvent } from '@/lib/classroom-realtime';

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

function classroomStudentId() {
  const key = 'dgbook-generic-student-id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `student-${Date.now().toString(36)}`;
  window.localStorage.setItem(key, next);
  return next;
}

export function readAuthRole(): AuthRole | '' {
  if (typeof window === 'undefined') return '';
  const role = window.sessionStorage.getItem('dgbook-auth-role') || window.localStorage.getItem('dgbook-auth-role');
  return role === 'student' || role === 'teacher' ? role : '';
}

export function readAuthName() {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem('dgbook-auth-name') || window.localStorage.getItem('dgbook-auth-name') || '';
}

export function AuthGate({ role, children }: { role: AuthRequirement; children: ReactNode }) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<AuthRole | ''>('');
  const [checked, setChecked] = useState(false);
  const [activeClassroom, setActiveClassroom] = useState<ClassroomSessionStateDTO | null>(null);
  const [pausedSyncAt, setPausedSyncAt] = useState('');
  const [joinedSyncAt, setJoinedSyncAt] = useState('');
  const allowedRoles = normalizeRoles(role);

  useEffect(() => {
    setCurrentRole(readAuthRole());
    setPausedSyncAt(window.sessionStorage.getItem('dgbook-paused-classroom-sync') || '');
    setJoinedSyncAt(window.sessionStorage.getItem('dgbook-joined-classroom-sync') || '');
    setChecked(true);
  }, []);

  const isClassroomPaused = Boolean(activeClassroom?.updatedAt) && pausedSyncAt === String(activeClassroom?.updatedAt ?? '');
  const hasJoinedClassroom = Boolean(activeClassroom?.updatedAt) && joinedSyncAt === String(activeClassroom?.updatedAt ?? '');

  useEffect(() => {
    if (currentRole !== 'student') return;
    let alive = true;
    const refresh = (joinRealtimeSession = false) => {
      void textbookApi.activeClassroomSession().then((state) => {
        if (!alive) return;
        setActiveClassroom(state);
        if (joinRealtimeSession && state.synced && state.updatedAt) {
          const syncAt = String(state.updatedAt);
          window.sessionStorage.setItem('dgbook-joined-classroom-sync', syncAt);
          window.sessionStorage.removeItem('dgbook-paused-classroom-sync');
          setJoinedSyncAt(syncAt);
          setPausedSyncAt('');
        }
      }).catch(() => undefined);
    };
    refresh();
    const onRealtime = (event: Event) => {
      const detail = (event as CustomEvent<ClassroomRealtimeEvent>).detail;
      refresh(detail?.type === 'classroom-session');
    };
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
    if (currentRole !== 'student' || isClassroomPaused || !hasJoinedClassroom || !activeClassroom?.synced || !activeClassroom.nodeId) return;
    const classroomPath = `/classroom/${activeClassroom.nodeId}`;
    const classroomTarget = `${classroomPath}/`;
    const normalizedPath = pathname?.replace(/\/+$/, '') || '/';
    const inControlledPage = normalizedPath === classroomPath;
    if (!inControlledPage) {
      // A full location change is deliberate: a student tab may be sitting on a
      // different static route when the teacher starts the classroom session.
      window.location.assign(classroomTarget);
    }
  }, [activeClassroom, currentRole, hasJoinedClassroom, isClassroomPaused, pathname]);

  function joinCurrentClassroom() {
    if (!activeClassroom?.updatedAt || !activeClassroom.nodeId) return;
    const syncAt = String(activeClassroom.updatedAt);
    window.sessionStorage.setItem('dgbook-joined-classroom-sync', syncAt);
    window.sessionStorage.removeItem('dgbook-paused-classroom-sync');
    setJoinedSyncAt(syncAt);
    setPausedSyncAt('');
    window.location.assign(`/classroom/${activeClassroom.nodeId}/`);
  }

  function pauseCurrentClassroom() {
    if (!activeClassroom?.updatedAt) return;
    const syncAt = String(activeClassroom.updatedAt);
    void textbookApi.leaveClassroom({
      nodeId: activeClassroom.nodeId,
      studentId: classroomStudentId(),
      studentName: readAuthName() || '学生端演示'
    });
    window.sessionStorage.setItem('dgbook-paused-classroom-sync', syncAt);
    window.sessionStorage.removeItem('dgbook-joined-classroom-sync');
    setPausedSyncAt(syncAt);
    setJoinedSyncAt('');
    window.location.assign(`/classroom/${activeClassroom.nodeId}/`);
  }

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
    const next = encodeURIComponent(pathname || (preferredRole === 'teacher' ? '/teacher?project=P1' : '/student'));
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

  if (currentRole === 'student' && !isClassroomPaused && hasJoinedClassroom && activeClassroom?.synced && activeClassroom.nodeId) {
    const classroomPath = `/classroom/${activeClassroom.nodeId}`;
    const normalizedPath = pathname?.replace(/\/+$/, '') || '/';
    const onClassroomPage = normalizedPath === classroomPath;
    if (!onClassroomPage) {
      return (
        <main className="role-auth-page classroom-control-wait">
          <section>
            <p className="eyebrow">课堂受控中</p>
            <h1>教师正在同步 {activeClassroom.nodeId}</h1>
            <p>学生端已锁定为课堂跟随模式，正在进入教师指定页面。</p>
            <button className="classroom-exit-button" onClick={pauseCurrentClassroom} type="button">退出本次听讲，保留当前内容</button>
          </section>
        </main>
      );
    }
  }

  const canJoinActiveClassroom = currentRole === 'student'
    && !isClassroomPaused
    && !hasJoinedClassroom
    && activeClassroom?.synced
    && activeClassroom.nodeId;

  return <>
    {canJoinActiveClassroom && (
      <aside className="classroom-join-notice" aria-live="polite">
        <div>
          <span>正在讲评</span>
          <strong>{activeClassroom.nodeId}</strong>
          <small>教师课堂已经开始，你可以自主加入当前听讲。</small>
        </div>
        <button onClick={joinCurrentClassroom} type="button">加入</button>
      </aside>
    )}
    {children}
  </>;
}

export function AuthBadge() {
  const [role, setRole] = useState<AuthRole | ''>('');
  const [name, setName] = useState('');

  useEffect(() => {
    setRole(readAuthRole());
    setName(readAuthName());
  }, []);

  function logout() {
    window.sessionStorage.removeItem('dgbook-auth-role');
    window.sessionStorage.removeItem('dgbook-auth-name');
    window.sessionStorage.removeItem('dgbook-classroom-id');
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
