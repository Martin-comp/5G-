import type {
  courseStats,
  graphNodes,
  mobilityMetrics,
  projects,
  resourceCards,
  teacherSuggestions
} from './textbook-data';

export type CourseOverviewDTO = {
  title: string;
  subtitle: string;
  stats: typeof courseStats;
  projects: typeof projects;
  mainRoute: string[];
};

export type ProjectDetailDTO = {
  project: (typeof projects)[number];
  currentTask: string;
  tasks: { id: string; title: string; desc: string; active?: boolean }[];
  evidenceFlow: string[];
  nextProjectId: string;
};

export type TaskDetailDTO = {
  id: string;
  title: string;
  question: string;
  routePoints: string[];
  conclusion: string;
  metrics: typeof mobilityMetrics;
  classroomTasks: string[];
  resources: typeof resourceCards;
};

export type GraphDetailDTO = {
  nodes: typeof graphNodes;
  localTaskId: string;
  localNodes: { id: string; title: string; desc: string; active?: boolean }[];
  resourceCards: typeof resourceCards;
};

export type TeacherSuggestionsDTO = {
  project: (typeof projects)[number];
  suggestions: typeof teacherSuggestions;
};

export type SubmissionPayload = {
  taskId: string;
  studentId: string;
  answer: string;
  evidence?: string;
  conclusion?: string;
};

export type SubmissionResult = {
  id: string;
  status: string;
  message: string;
};

export type ClassroomSessionStateDTO = {
  classId: string;
  nodeId: string;
  slideId: string;
  synced: boolean;
  practicePushed: boolean;
  reviewMode: boolean;
  updatedAt: number;
  updatedBy: string;
};

export type ClassroomToolStateDTO = {
  classId: string;
  nodeId: string;
  activeTool: string;
  pollOpen: boolean;
  discussionOpen: boolean;
  groupTaskOpen: boolean;
  timerRunning: boolean;
  timerSeconds: number;
  prompt: string;
  pollOptions: string[];
  updatedAt: number;
};

export type ClassroomSubmissionPayload = {
  classId?: string;
  nodeId: string;
  taskId: string;
  studentId: string;
  studentName: string;
  answer: string;
  evidence: string[];
  conclusion: string;
  score: number;
  selectedEvidence: string[];
};

export type ClassroomSubmissionDTO = ClassroomSubmissionPayload & {
  id: string;
  tags: string[];
	createdAt: number;
};

export type ClassroomExitPayload = {
	classId?: string;
	nodeId: string;
	studentId: string;
	studentName: string;
};

export type ClassroomExitDTO = ClassroomExitPayload & {
	classId: string;
	id: string;
	createdAt: number;
};

export type ClassroomAnalyticsItemDTO = {
  label: string;
  count: number;
  level: string;
};

export type ClassroomAnalyticsDTO = {
  classId: string;
  nodeId: string;
  totalStudents: number;
  submitted: number;
  submitRate: string;
  averageScore: number;
  needsReview: number;
  commonMistakes: ClassroomAnalyticsItemDTO[];
  priorityItems: ClassroomAnalyticsItemDTO[];
  suggestedFocus: string[];
	updatedAt: number;
};

export type ClassroomNodePortfolioDTO = {
	nodeId: string;
	submitted: number;
	averageScore: number;
	needsReview: number;
	lastSubmittedAt: number;
};

export type ClassroomLearningPortfolioDTO = {
	classId: string;
	totalSubmissions: number;
	uniqueStudents: number;
	activeNodes: number;
	averageScore: number;
	nodes: ClassroomNodePortfolioDTO[];
	recent: ClassroomSubmissionDTO[];
	updatedAt: number;
};

export type SelfStudyAbilityDTO = {
	label: string;
	score: number;
	status: string;
};

export type SelfStudyProgressPayload = {
	classId?: string;
	nodeId: string;
	studentId: string;
	studentName: string;
	completedSteps: string[];
	startedAt?: number;
	timeSpentSeconds?: number;
	practiceAttempts?: number;
	practiceScore?: number;
	wrongKnowledgePoints?: string[];
	reviewStatus?: string;
};

export type SelfStudyProgressDTO = SelfStudyProgressPayload & {
	classId: string;
	abilityScore: number;
	abilities: SelfStudyAbilityDTO[];
	startedAt: number;
	timeSpentSeconds: number;
	practiceAttempts: number;
	practiceScore: number;
	wrongKnowledgePoints: string[];
	reviewStatus: string;
	updatedAt: number;
};

export type SelfStudyAnalyticsDTO = {
	classId: string;
	nodeId: string;
	students: number;
	completed: number;
	averageAbility: number;
	averageAccuracy: number;
	averageDurationSeconds: number;
	totalRetries: number;
	needsSupport: number;
	typicalErrors: ClassroomAnalyticsItemDTO[];
	weakAbilities: ClassroomAnalyticsItemDTO[];
	cards: SelfStudyProgressDTO[];
	updatedAt: number;
};

export type AIStudyInsightPayload = {
	classId?: string;
	nodeId: string;
};

export type AIStudyInsightDTO = {
	provider: string;
	mode: string;
	summary: string;
	focus: string;
	action: string;
};

export type ClassroomPollResponsePayload = {
  classId?: string;
  nodeId: string;
  studentId: string;
  studentName: string;
  option: string;
};

export type ClassroomPollResponseDTO = ClassroomPollResponsePayload & {
  id: string;
  createdAt: number;
};

export type ClassroomPollResultsDTO = {
  classId: string;
  nodeId: string;
  prompt: string;
  options: { label: string; count: number }[];
  submitted: number;
  totalPeople: number;
  responses: ClassroomPollResponseDTO[];
  updatedAt: number;
};

export type ClassroomDiscussionPayload = {
  classId?: string;
  nodeId: string;
  studentId: string;
  studentName: string;
  content: string;
};

export type ClassroomDiscussionMessageDTO = ClassroomDiscussionPayload & {
  id: string;
  createdAt: number;
};

export type ClassroomGroupResponsePayload = {
  classId?: string;
  nodeId: string;
  studentId: string;
  studentName: string;
  evidence: string[];
  conclusion: string;
};

export type ClassroomGroupResponseDTO = ClassroomGroupResponsePayload & {
  id: string;
  createdAt: number;
};

export type AIHintPayload = {
  projectId: string;
  taskId: string;
  step: string;
  selectedNode: string;
  selectedEvidence: string[];
  score: number;
};

export type AIHintResult = {
  provider: string;
  mode: string;
  hint: string;
  next: string;
  tags: string[];
};

export type AIChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AIChatPayload = {
  projectId: string;
  taskId: string;
  question: string;
  selectedNode: string;
  selectedEvidence: string[];
  score: number;
  history: AIChatMessage[];
};

export type AIChatResult = {
  provider: string;
  mode: string;
  answer: string;
};

export type TTSPayload = {
  text: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const DEFAULT_CLASSROOM_ID = '通信2301班';

export function readClassroomId() {
  if (typeof window === 'undefined') return DEFAULT_CLASSROOM_ID;
  return window.sessionStorage.getItem('dgbook-classroom-id')?.trim()
    || window.localStorage.getItem('dgbook-classroom-id')?.trim()
    || DEFAULT_CLASSROOM_ID;
}

function classroomQuery(nodeId: string, classId = readClassroomId()) {
  return `classId=${encodeURIComponent(classId)}&nodeId=${encodeURIComponent(nodeId)}`;
}

function withClassroomId<T extends { classId?: string }>(payload: T): T & { classId: string } {
  return { ...payload, classId: payload.classId || readClassroomId() };
}

async function requestJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API ${response.status}: ${message}`);
  }

  return response.json() as Promise<T>;
}

async function requestBlob(path: string, init?: RequestInit): Promise<Blob> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API ${response.status}: ${message}`);
  }

  return response.blob();
}

export const textbookApi = {
  health: () => requestJSON<{ status: string; service: string; time: string }>('/api/health'),
  courseOverview: () => requestJSON<CourseOverviewDTO>('/api/course/overview'),
  project: (projectId: string) => requestJSON<ProjectDetailDTO>(`/api/projects/${projectId}`),
  task: (taskId = 'P4T2-N04') => requestJSON<TaskDetailDTO>(`/api/tasks/${taskId}`),
  graph: (projectId = 'P4') => requestJSON<GraphDetailDTO>(`/api/graph/course?project=${projectId}`),
  teacherSuggestions: (projectId = 'P4') => requestJSON<TeacherSuggestionsDTO>(`/api/teacher/suggestions?project=${projectId}`),
  submitAnswer: (payload: SubmissionPayload) => requestJSON<SubmissionResult>('/api/submissions', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  classroomSession: (nodeId = 'P4T2-N04', classId = readClassroomId()) => requestJSON<ClassroomSessionStateDTO>(`/api/classroom/session?${classroomQuery(nodeId, classId)}`),
  activeClassroomSession: (classId = readClassroomId()) => requestJSON<ClassroomSessionStateDTO>(`/api/classroom/active?classId=${encodeURIComponent(classId)}`),
  updateClassroomSession: (payload: ClassroomSessionStateDTO) => requestJSON<ClassroomSessionStateDTO>('/api/classroom/session', {
    method: 'POST',
    body: JSON.stringify(withClassroomId(payload))
  }),
  classroomTools: (nodeId = 'P4T2-N04', classId = readClassroomId()) => requestJSON<ClassroomToolStateDTO>(`/api/classroom/tools?${classroomQuery(nodeId, classId)}`),
  updateClassroomTools: (payload: ClassroomToolStateDTO) => requestJSON<ClassroomToolStateDTO>('/api/classroom/tools', {
    method: 'POST',
    body: JSON.stringify(withClassroomId(payload))
  }),
  classroomSubmissions: (nodeId = 'P4T2-N04', classId = readClassroomId()) => requestJSON<ClassroomSubmissionDTO[]>(`/api/classroom/submissions?${classroomQuery(nodeId, classId)}`),
  submitClassroomWork: (payload: ClassroomSubmissionPayload) => requestJSON<ClassroomSubmissionDTO>('/api/classroom/submissions', {
    method: 'POST',
    body: JSON.stringify(withClassroomId(payload))
  }),
  classroomExits: (nodeId = 'P4T2-N04', classId = readClassroomId()) => requestJSON<ClassroomExitDTO[]>(`/api/classroom/exits?${classroomQuery(nodeId, classId)}`),
  leaveClassroom: (payload: ClassroomExitPayload) => requestJSON<ClassroomExitDTO>('/api/classroom/exits', {
    method: 'POST',
    keepalive: true,
    body: JSON.stringify(withClassroomId(payload))
  }),
  classroomAnalytics: (nodeId = 'P4T2-N04', classId = readClassroomId()) => requestJSON<ClassroomAnalyticsDTO>(`/api/classroom/analytics?${classroomQuery(nodeId, classId)}`),
  classroomPortfolio: (classId = readClassroomId()) => requestJSON<ClassroomLearningPortfolioDTO>(`/api/classroom/portfolio?classId=${encodeURIComponent(classId)}`),
  selfStudyProgress: (nodeId: string, studentId: string, classId = readClassroomId()) => requestJSON<SelfStudyProgressDTO>(`/api/self-study/progress?classId=${encodeURIComponent(classId)}&nodeId=${encodeURIComponent(nodeId)}&studentId=${encodeURIComponent(studentId)}`),
  updateSelfStudyProgress: (payload: SelfStudyProgressPayload) => requestJSON<SelfStudyProgressDTO>('/api/self-study/progress', {
    method: 'POST',
    body: JSON.stringify(withClassroomId(payload))
  }),
  selfStudyAnalytics: (nodeId: string, classId = readClassroomId()) => requestJSON<SelfStudyAnalyticsDTO>(`/api/self-study/analytics?classId=${encodeURIComponent(classId)}&nodeId=${encodeURIComponent(nodeId)}`),
	generateStudyInsight: (payload: AIStudyInsightPayload) => requestJSON<AIStudyInsightDTO>('/api/ai/study-insight', {
		method: 'POST',
		body: JSON.stringify(withClassroomId(payload))
	}),
  classroomPoll: (nodeId = 'P4T2-N04', classId = readClassroomId()) => requestJSON<ClassroomPollResultsDTO>(`/api/classroom/poll?${classroomQuery(nodeId, classId)}`),
  submitPollResponse: (payload: ClassroomPollResponsePayload) => requestJSON<ClassroomPollResponseDTO>('/api/classroom/poll', {
    method: 'POST',
    body: JSON.stringify(withClassroomId(payload))
  }),
  classroomDiscussion: (nodeId = 'P4T2-N04', classId = readClassroomId()) => requestJSON<ClassroomDiscussionMessageDTO[]>(`/api/classroom/discussion?${classroomQuery(nodeId, classId)}`),
  postClassroomDiscussion: (payload: ClassroomDiscussionPayload) => requestJSON<ClassroomDiscussionMessageDTO>('/api/classroom/discussion', {
    method: 'POST',
    body: JSON.stringify(withClassroomId(payload))
  }),
  classroomGroups: (nodeId = 'P4T2-N04', classId = readClassroomId()) => requestJSON<ClassroomGroupResponseDTO[]>(`/api/classroom/groups?${classroomQuery(nodeId, classId)}`),
  submitClassroomGroup: (payload: ClassroomGroupResponsePayload) => requestJSON<ClassroomGroupResponseDTO>('/api/classroom/groups', {
    method: 'POST',
    body: JSON.stringify(withClassroomId(payload))
  }),
  aiHint: (payload: AIHintPayload) => requestJSON<AIHintResult>('/api/ai/hint', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  aiChat: (payload: AIChatPayload) => requestJSON<AIChatResult>('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  tts: (payload: TTSPayload) => requestBlob('/api/tts', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
