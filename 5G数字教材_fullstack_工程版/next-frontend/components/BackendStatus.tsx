'use client';

import { useEffect, useState } from 'react';
import { textbookApi } from '@/lib/api';

type Status = 'checking' | 'connected' | 'offline';

export function BackendStatus() {
  const [status, setStatus] = useState<Status>('checking');
  const [serviceTime, setServiceTime] = useState('');

  useEffect(() => {
    let alive = true;

    textbookApi.health()
      .then((health) => {
        if (!alive) return;
        setStatus(health.status === 'ok' ? 'connected' : 'offline');
        setServiceTime(health.time || '');
      })
      .catch(() => {
        if (!alive) return;
        setStatus('offline');
      });

    return () => {
      alive = false;
    };
  }, []);

  const label = status === 'checking' ? '后端检测中' : status === 'connected' ? '后端已连接' : '本地演示数据';
  const title = status === 'connected' && serviceTime ? `Go API 正常：${serviceTime}` : 'Go API 未连接时，页面使用本地演示数据';

  return (
    <span className={`backend-status ${status}`} title={title} aria-live="polite">
      <i aria-hidden="true" />
      {label}
    </span>
  );
}
