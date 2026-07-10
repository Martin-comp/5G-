import { p4NodeExperience } from './textbook-data';
import { readClassroomId, textbookApi, type ClassroomSessionStateDTO, type ClassroomToolStateDTO } from './api';

export type P4ClassroomSyncState = {
  classId: string;
  nodeId: string;
  slideId: string;
  synced: boolean;
  practicePushed: boolean;
  reviewMode: boolean;
  updatedAt: number;
  updatedBy: string;
};

export type P4ClassroomToolState = ClassroomToolStateDTO;

export const P4_CLASSROOM_SYNC_KEY = 'dgbook-p4-classroom-sync';
export const P4_CLASSROOM_SYNC_EVENT = 'dgbook-p4-classroom-sync-updated';

export const p4TeacherSlides = [
  { id: '1', title: '案例导入', desc: '食堂信号断续线索', thumb: '场景', focus: '先确认投诉发生在移动路径，而不是静止点。' },
  { id: '2', title: '覆盖达标不能直接验收', desc: '覆盖与体验边界', thumb: '指标', focus: '覆盖改善只能说明静止点质量，不能直接证明体验闭环。' },
  { id: '3', title: '移动性数据提示', desc: p4NodeExperience.headline, thumb: 'N04', focus: '同时读取切换成功率、重建次数和短掉线日志。' },
  { id: '4', title: '流程排序练习', desc: '移动性验证流程排序', thumb: '练习', focus: '按路径、指标、依据、结论的顺序完成验证流程。' },
  { id: '5', title: '结论修正讲评', desc: '形成验收结论', thumb: '讲评', focus: '写出“覆盖已改善，但移动性未闭环”的边界结论。' }
];

export const defaultP4SyncState: P4ClassroomSyncState = {
  classId: '通信2301班',
  nodeId: p4NodeExperience.nodeId,
  slideId: '3',
  synced: false,
  practicePushed: false,
  reviewMode: false,
  updatedAt: 0,
  updatedBy: 'system'
};

export const defaultP4ToolState: P4ClassroomToolState = {
  classId: '通信2301班',
  nodeId: p4NodeExperience.nodeId,
  activeTool: '',
  pollOpen: false,
  discussionOpen: false,
  groupTaskOpen: false,
  timerRunning: false,
  timerSeconds: 300,
  prompt: '请围绕移动路径、指标证据和验收结论完成讨论。',
  pollOptions: ['静止点覆盖不足', '移动路径切换过程', '终端单点故障'],
  updatedAt: 0
};

export function getP4TeacherSlide(slideId: string) {
  return p4TeacherSlides.find((slide) => slide.id === slideId) ?? p4TeacherSlides[2];
}

export function readP4ClassroomSync(): P4ClassroomSyncState {
  if (typeof window === 'undefined') return defaultP4SyncState;
  const raw = window.localStorage.getItem(P4_CLASSROOM_SYNC_KEY);
  if (!raw) return { ...defaultP4SyncState, classId: readClassroomId() };
  try {
    return { ...defaultP4SyncState, classId: readClassroomId(), ...JSON.parse(raw) };
  } catch {
    return { ...defaultP4SyncState, classId: readClassroomId() };
  }
}

export function writeP4ClassroomSync(nextState: P4ClassroomSyncState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(P4_CLASSROOM_SYNC_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new CustomEvent(P4_CLASSROOM_SYNC_EVENT, { detail: nextState }));
}

export async function fetchP4ClassroomSync(): Promise<P4ClassroomSyncState> {
  try {
    const remote = await textbookApi.classroomSession(p4NodeExperience.nodeId, readClassroomId());
    const merged = normalizeRemoteSync(remote);
    writeP4ClassroomSync(merged);
    return merged;
  } catch {
    return readP4ClassroomSync();
  }
}

export async function pushP4ClassroomSync(nextState: P4ClassroomSyncState): Promise<P4ClassroomSyncState> {
  writeP4ClassroomSync(nextState);
  try {
    const remote = await textbookApi.updateClassroomSession(nextState);
    const merged = normalizeRemoteSync(remote);
    writeP4ClassroomSync(merged);
    return merged;
  } catch {
    return nextState;
  }
}

export async function fetchP4ClassroomTools(): Promise<P4ClassroomToolState> {
  try {
    return { ...defaultP4ToolState, ...(await textbookApi.classroomTools(p4NodeExperience.nodeId, readClassroomId())) };
  } catch {
    return defaultP4ToolState;
  }
}

export async function pushP4ClassroomTools(nextState: P4ClassroomToolState): Promise<P4ClassroomToolState> {
  try {
    return { ...defaultP4ToolState, ...(await textbookApi.updateClassroomTools(nextState)) };
  } catch {
    return nextState;
  }
}

function normalizeRemoteSync(remote: ClassroomSessionStateDTO): P4ClassroomSyncState {
  return {
    ...defaultP4SyncState,
    ...remote,
    classId: remote.classId || readClassroomId(),
    nodeId: remote.nodeId || p4NodeExperience.nodeId,
    slideId: remote.slideId || defaultP4SyncState.slideId
  };
}
