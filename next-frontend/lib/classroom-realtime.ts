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

function realtimeIdentity(role: 'student' | 'teacher') {
  if (role === 'student') {
    const key = 'dgbook-generic-student-id';
    let deviceId = window.localStorage.getItem(key) || '';
    if (!deviceId) {
      deviceId = `student-${Date.now().toString(36)}`;
      window.localStorage.setItem(key, deviceId);
    }
    return { deviceId, name: window.sessionStorage.getItem('dgbook-auth-name') || '学生端演示' };
  }
  const name = window.sessionStorage.getItem('dgbook-auth-name') || '教师端';
  return { deviceId: `teacher-${name}`, name };
}

function currentClassroomNodeId() {
  const match = window.location.pathname.match(/\/classroom\/([^/]+)/);
  return match?.[1]?.toUpperCase() || '';
}

function websocketURL(classId: string, role: 'student' | 'teacher', deviceId: string, name: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const endpoint = new URL(apiBase);
  endpoint.protocol = endpoint.protocol === 'https:' ? 'wss:' : 'ws:';
  endpoint.pathname = '/api/classroom/ws';
  endpoint.searchParams.set('classId', classId);
  endpoint.searchParams.set('role', role);
  endpoint.searchParams.set('deviceId', deviceId);
  endpoint.searchParams.set('name', name);
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
  const identity = realtimeIdentity(role);

  function sendReceipt(nextSocket: WebSocket, nodeId: string, updatedAt = Date.now()) {
    if (role !== 'student' || !nodeId || nextSocket.readyState !== WebSocket.OPEN) return;
    nextSocket.send(JSON.stringify({ type: 'receipt', nodeId, updatedAt }));
  }

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
      const nextSocket = new WebSocket(websocketURL(classId, role, identity.deviceId, identity.name));
      socket = nextSocket;
      nextSocket.onopen = () => {
        if (socket !== nextSocket) return;
        reconnectDelay = 1500;
        sendReceipt(nextSocket, currentClassroomNodeId());
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
          if (detail.type === 'classroom-session' && detail.nodeId && currentClassroomNodeId() === detail.nodeId.toUpperCase()) {
            sendReceipt(nextSocket, detail.nodeId, detail.updatedAt);
          }
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
