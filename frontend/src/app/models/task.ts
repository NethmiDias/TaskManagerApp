export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdAt: string; // ISO string
}

export interface TaskCreateRequest {
  title: string;
  description?: string | null;
  status: TaskStatus;
}

export interface TaskUpdateRequest {
  title: string;
  description?: string | null;
  status: TaskStatus;
}

