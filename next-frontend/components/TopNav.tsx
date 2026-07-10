'use client';

import { useEffect, useState } from 'react';
import type { ViewKey } from '@/lib/textbook-data';
import type { Navigate } from './types';
import { BackendStatus } from './BackendStatus';
import { AuthBadge, readAuthRole, type AuthRole } from './AuthGate';

const studentTabs: { key: ViewKey; label: string }[] = [
  { key: 'course', label: '课程' },
  { key: 'project', label: '项目' },
  { key: 'task', label: '学生学习' },
  { key: 'graph', label: '图谱' },
  { key: 'game', label: '互动' }
];

const teacherTabs: { key: ViewKey; label: string }[] = [
  { key: 'course', label: '课程' },
  { key: 'project', label: '项目' },
  { key: 'graph', label: '图谱' },
  { key: 'teacher', label: '教师' }
];

export function TopNav({ view, onNavigate }: { view: ViewKey; onNavigate: Navigate }) {
  const [role, setRole] = useState<AuthRole | ''>('');

  useEffect(() => {
    setRole(readAuthRole());
  }, []);

  const tabs = role === 'teacher' ? teacherTabs : studentTabs;

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-logo">5G</div>
        <div>
          <h1>5G网络优化教材（高级）</h1>
          <p>数字教材 · 项目任务导学 · 课程能力图谱</p>
        </div>
      </div>
      <nav className="main-tabs" aria-label="主导航">
        {tabs.map((tab) => (
          <button key={tab.key} className={view === tab.key ? 'active' : ''} onClick={() => onNavigate(tab.key)} type="button">
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="topbar-actions">
        <BackendStatus />
        <AuthBadge />
        <a className="example-link" href="/example/index.html" target="_blank" rel="noreferrer">原始example</a>
      </div>
    </header>
  );
}
