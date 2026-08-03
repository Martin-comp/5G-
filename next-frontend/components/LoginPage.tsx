'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import type { AuthRole } from './AuthGate';

type DemoAccount = { username: string; password: string; name: string; role: AuthRole; defaultPath: string; state: string };

const demoAccounts: DemoAccount[] = [
  { username: 'student01', password: '123456', name: '李同学', role: 'student', defaultPath: '/student', state: '从零开始' },
  { username: 'student02', password: '123456', name: '陈同学', role: 'student', defaultPath: '/student', state: '退回修改' },
  { username: 'student03', password: '123456', name: '王同学', role: 'student', defaultPath: '/student', state: '完整成果' },
  { username: 'teacher01', password: '123456', name: '张老师', role: 'teacher', defaultPath: '/teacher?project=P1', state: '教师工作台' },
  // Preserve the original prototype credentials for existing local sessions.
  { username: 'student', password: '123456', name: '学生端', role: 'student', defaultPath: '/student', state: '兼容账号' },
  { username: 'teacher', password: '123456', name: '张老师', role: 'teacher', defaultPath: '/teacher?project=P1', state: '兼容账号' }
];

const defaultAccounts: Record<AuthRole, DemoAccount> = {
  student: demoAccounts[0],
  teacher: demoAccounts[3]
};

const roleCopy: Record<AuthRole, { title: string; desc: string; points: string[] }> = {
  student: {
    title: '学生端',
    desc: '用于自主学习、课堂跟随、互动闯关和提交学习证据。',
    points: ['进入课程首页和项目学习', '跟随教师当前讲解页', '完成互动游戏与自学任务']
  },
  teacher: {
    title: '教师端',
    desc: '用于组织课堂、查看学生状态和进行讲评。',
    points: ['进入授课控制台', '同步课堂跟随页', '查看学生提交与讲评建议']
  }
};

function normalizeRole(value: string | null): AuthRole {
  return value === 'teacher' ? 'teacher' : 'student';
}

function canEnterAfterLogin(role: AuthRole, path: string) {
  const teacherOnly = ['/teacher', '/teacher/sessions'];
  const studentOnly = ['/classroom'];
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

  const selected = defaultAccounts[role];
  const copy = roleCopy[role];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const account = demoAccounts.find((item) => item.username === username.trim() && item.password === password);
    if (!account) {
      setError('账号或密码不正确。可以点击下方演示账号快速填入。');
      return;
    }
    const destination = (() => {
      const requested = params.get('next');
      if (requested && requested.startsWith('/') && canEnterAfterLogin(account.role, requested)) return requested;
      return account.defaultPath;
    })();
    window.sessionStorage.setItem('dgbook-auth-role', account.role);
    window.sessionStorage.setItem('dgbook-auth-name', account.name);
    if (account.role === 'student') window.localStorage.setItem('dgbook-generic-student-id', account.username);
    window.sessionStorage.setItem('dgbook-classroom-id', classId.trim() || '通信2301班');
    window.localStorage.setItem('dgbook-classroom-id', classId.trim() || '通信2301班');
    router.push(destination);
  }

  function quickFill(account: DemoAccount) {
    setRole(account.role);
    setUsername(account.username);
    setPassword(account.password);
    setError('');
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-intro">
          <div className="login-logo">5G</div>
          <p className="eyebrow">DGBook · 端侧登录</p>
          <h1>5G网络优化数字教材</h1>
          <p>学生端和教师端分开进入：学生专注学习、跟随和作答；教师负责授课控制和讲评。</p>
          <div className="login-role-cards">
            {(['student', 'teacher'] as AuthRole[]).map((item) => (
              <button key={item} className={role === item ? 'is-active' : ''} onClick={() => quickFill(defaultAccounts[item])} type="button">
                <strong>{roleCopy[item].title}</strong>
                <span>{roleCopy[item].desc}</span>
              </button>
            ))}
          </div>
        </div>

        <form className="login-card" onSubmit={submit}>
          <p className="eyebrow">统一登录 · 自动识别身份</p>
          <h2>进入数字教材</h2>
          <p>系统根据账号自动进入学生端或教师端，无需提前选择角色。</p>
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
          <button className="primary-action" type="submit">登录并进入对应端</button>
          <div className="login-demo-account">
            <strong>演示账号 · 密码均为 123456</strong>
            <div className="login-demo-grid">{demoAccounts.slice(0, 4).map((account) => <button key={account.username} onClick={() => quickFill(account)} type="button"><b>{account.username}</b><span>{account.state}</span></button>)}</div>
          </div>
          <Link className="login-platform-link" href="/platform">查看公开平台总览 →</Link>
        </form>
      </section>
    </main>
  );
}
