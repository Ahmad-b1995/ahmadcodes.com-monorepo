export type TaskType =
  | 'linkedin_post'
  | 'outreach'
  | 'article'
  | 'reminder'
  | 'other';

export type TaskStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'done'
  | 'cancelled';

export type TaskDueFilter = 'overdue' | 'today' | 'this_week' | 'all';

export interface ITask {
  id: number;
  type: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  scheduledAt: string | null;
  dueAt: string | null;
  completedAt: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTaskDto {
  type: TaskType;
  title: string;
  description?: string;
  status?: TaskStatus;
  scheduledAt?: string;
  dueAt?: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface IUpdateTaskDto {
  type?: TaskType;
  title?: string;
  description?: string;
  status?: TaskStatus;
  scheduledAt?: string;
  dueAt?: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ITaskListQuery {
  type?: TaskType;
  status?: TaskStatus;
  due?: TaskDueFilter;
}
