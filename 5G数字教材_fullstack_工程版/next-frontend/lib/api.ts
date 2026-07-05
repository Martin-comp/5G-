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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

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
  })
};
