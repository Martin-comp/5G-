'use client';

import { readClassroomId } from './api';

export const CLASSROOM_REALTIME_EVENT = 'dgbook-classroom-realtime';

export type ClassroomRealtimeEvent = {
  type: string;
  classId: string;
  nodeId?: string;
  updatedAt: number;
};

export function emitClassroomRealtime(detail: ClassroomRealtimeEvent) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ClassroomRealtimeEvent>(CLASSROOM_REALTIME_EVENT, { detail }));
}

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
  let heartbeatTimer = 0;
  let reconnectDelay = 1500;
  let closed = false;
  const classId = readClassroomId();

  function clearTimers() {
    window.clearTimeout(retryTimer);
    window.clearInterval(heartbeatTimer);
    retryTimer = 0;
    heartbeatTimer = 0;
  }

  function scheduleReconnect() {
    if (closed || retryTimer) return;
    retryTimer = window.setTimeout(() => {
      retryTimer = 0;
      connect();
    }, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 15000);
  }

  function connect() {
    if (closed || socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
    try {
      const nextSocket = new WebSocket(websocketURL(classId, role));
      socket = nextSocket;
      nextSocket.onopen = () => {
        if (socket !== nextSocket) return;
        reconnectDelay = 1500;
        window.clearInterval(heartbeatTimer);
        // Keep Render/proxy connections alive without forcing page refreshes.
        heartbeatTimer = window.setInterval(() => {
          if (nextSocket.readyState === WebSocket.OPEN) nextSocket.send('heartbeat');
        }, 25000);
      };
      nextSocket.onmessage = (event) => {
        try {
          const detail = JSON.parse(event.data) as ClassroomRealtimeEvent;
          emitClassroomRealtime(detail);
        } catch {
          // Ignore malformed messages so a classroom page remains usable.
        }
      };
      nextSocket.onclose = () => {
        if (socket !== nextSocket) return;
        window.clearInterval(heartbeatTimer);
        heartbeatTimer = 0;
        socket = null;
        scheduleReconnect();
      };
      nextSocket.onerror = () => nextSocket.close();
    } catch {
      socket = null;
      scheduleReconnect();
    }
  }

  connect();
  return () => {
    closed = true;
    clearTimers();
    socket?.close();
    socket = null;
  };
}
