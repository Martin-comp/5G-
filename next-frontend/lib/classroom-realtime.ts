'use client';

import { readClassroomId } from './api';

export const CLASSROOM_REALTIME_EVENT = 'dgbook-classroom-realtime';

export type ClassroomRealtimeEvent = {
  type: string;
  classId: string;
  nodeId?: string;
  updatedAt: number;
};

function websocketURL(classId: string, role: 'student' | 'teacher') {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const endpoint = new URL(apiBase);
  endpoint.protocol = endpoint.protocol === 'https:' ? 'wss:' : 'ws:';
  endpoint.pathname = '/api/classroom/ws';
  endpoint.searchParams.set('classId', classId);
  endpoint.searchParams.set('role', role);
  return endpoint.toString();
}

export function openClassroomRealtime(role: 'student' | 'teacher') {
  if (typeof window === 'undefined') return () => undefined;

  let socket: WebSocket | null = null;
  let retryTimer = 0;
  let closed = false;
  const classId = readClassroomId();

  function connect() {
    if (closed) return;
    try {
      socket = new WebSocket(websocketURL(classId, role));
      socket.onmessage = (event) => {
        try {
          const detail = JSON.parse(event.data) as ClassroomRealtimeEvent;
          window.dispatchEvent(new CustomEvent<ClassroomRealtimeEvent>(CLASSROOM_REALTIME_EVENT, { detail }));
        } catch {
          // Ignore malformed messages so a classroom page remains usable.
        }
      };
      socket.onclose = () => {
        if (!closed) retryTimer = window.setTimeout(connect, 1500);
      };
      socket.onerror = () => socket?.close();
    } catch {
      retryTimer = window.setTimeout(connect, 1500);
    }
  }

  connect();
  return () => {
    closed = true;
    window.clearTimeout(retryTimer);
    socket?.close();
  };
}
