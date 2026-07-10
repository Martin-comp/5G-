'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import type { AuthRole } from './AuthGate';

const accounts: Record<AuthRole, { username: string; password: string; name: string; defaultPath: string }> = {
  student: { username: 'student', password: '123456', name: '学生端', defaultPath: '/course' },
  teacher: { username: 'teacher', password: '123456', name: '张老师', defaultPath: '/teacher' }
};

const roleCopy: Record<AuthRole, { title: string; desc: string; points: string[] }> = {
  student: {
    title: '学生端',
    desc: '用于自主学习、课堂跟随、互动闯关和提交学习证据。',
    points: ['进入课程首页和项目学习', '跟随教师当前讲解页', '完成互动游戏与自学任务']
  },
  teacher: {
    title: '教师端',
    desc: '用于组织课堂、控制投屏、查看学生状态和进行讲评。',
    points: ['进入授课控制台', '打开投屏和课堂跟随页', '查看学生提交与讲评建议']
  }
};

function normalizeRole(value: string | null): AuthRole {
  return value === 'teacher' ? 'teacher' : 'student';
}

function canEnterAfterLogin(role: AuthRole, path: string) {
  const teacherOnly = ['/teacher', '/present', '/teacher/sessions'];
  const studentOnly = ['/task', '/game', '/learn', '/classroom'];
  if (role === 'student' && teacherOnly.some((prefix) => path.startsWith(prefix))) return false;
  if (role === 'teacher' && studentOnly.some((prefix) => path.startsWith(prefix))) return false;
  return true;
}

export function LoginPage({ initialRole = 'student' }: { initialRole?: AuthRole }) {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<AuthRole>(() => params.get('role') ? normalizeRole(params.get('role')) : initialRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [classId, setClassId] = useState('通信2301班');
  const [error, setError] = useState('');

  const selected = accounts[role];
  const copy = roleCopy[role];
  const nextPath = useMemo(() => {
    const next = params.get('next');
    if (next && next.startsWith('/') && canEnterAfterLogin(role, next)) return next;
    return selected.defaultPath;
  }, [params, role, selected.defaultPath]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username.trim() !== selected.username || password !== selected.password) {
      setError(`账号或密码不正确。演示账号：${selected.username} / ${selected.password}`);
      return;
    }
    window.localStorage.setItem('dgbook-auth-role', role);
    window.localStorage.setItem('dgbook-auth-name', selected.name);
    window.localStorage.setItem('dgbook-classroom-id', classId.trim() || '通信2301班');
    router.push(nextPath);
  }

  function quickFill(nextRole: AuthRole) {
    setRole(nextRole);
    setUsername(accounts[nextRole].username);
    setPassword(accounts[nextRole].password);
    setError('');
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-intro">
          <div className="login-logo">5G</div>
          <p className="eyebrow">DGBook · 端侧登录</p>
          <h1>5G网络优化数字教材</h1>
          <p>学生端和教师端分开进入：学生专注学习、跟随和作答；教师负责授课控制、投屏和讲评。</p>
          <div className="login-role-cards">
            {(['student', 'teacher'] as AuthRole[]).map((item) => (
              <button key={item} className={role === item ? 'is-active' : ''} onClick={() => quickFill(item)} type="button">
                <strong>{roleCopy[item].title}</strong>
                <span>{roleCopy[item].desc}</span>
              </button>
            ))}
          </div>
        </div>

        <form className="login-card" onSubmit={submit}>
          <p className="eyebrow">当前选择</p>
          <h2>{copy.title}</h2>
          <p>{copy.desc}</p>
          <div className="login-points">
            {copy.points.map((point) => <span key={point}>{point}</span>)}
          </div>
          <label>
            账号
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder={selected.username} />
          </label>
          <label>
            密码
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="请输入密码" type="password" />
          </label>
          <label>
            班级编号
            <input value={classId} onChange={(event) => setClassId(event.target.value)} placeholder="例如：通信2301班" />
          </label>
          <small className="login-class-note">师生登录时填写同一个班级编号，教师同步后会实时控制该班学生端。</small>
          {error && <div className="login-error">{error}</div>}
          <button className="primary-action" type="submit">登录并进入{copy.title}</button>
          <div className="login-demo-account">
            <strong>演示账号</strong>
            <span>学生：student / 123456</span>
            <span>教师：teacher / 123456</span>
          </div>
        </form>
      </section>
    </main>
  );
}
