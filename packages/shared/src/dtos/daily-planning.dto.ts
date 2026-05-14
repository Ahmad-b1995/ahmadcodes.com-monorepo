export type PlanningGoalPriority = 'critical' | 'high' | 'medium' | 'low';

export interface IPlanningGoal {
  id: number;
  title: string;
  description: string;
  priority: PlanningGoalPriority;
  targetDate: string | null;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePlanningGoalDto {
  title: string;
  description?: string;
  priority: PlanningGoalPriority;
  targetDate?: string;
  active?: boolean;
  metadata?: Record<string, unknown>;
}

export interface IUpdatePlanningGoalDto {
  title?: string;
  description?: string;
  priority?: PlanningGoalPriority;
  targetDate?: string | null;
  active?: boolean;
  metadata?: Record<string, unknown>;
}

export type PlanTaskType =
  | 'linkedin_post'
  | 'outreach'
  | 'article'
  | 'reminder'
  | 'learning'
  | 'admin'
  | 'application'
  | 'freelance'
  | 'other';

export type PlanTaskStatus =
  | 'todo'
  | 'in_progress'
  | 'done'
  | 'blocked'
  | 'cancelled'
  | 'deferred';

export type PlanTaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface IPlanTask {
  id: number;
  goalId: number | null;
  title: string;
  description: string;
  type: PlanTaskType;
  status: PlanTaskStatus;
  priority: PlanTaskPriority;
  scheduledFor: string | null;
  dueAt: string | null;
  estimatedMinutes: number | null;
  completedAt: string | null;
  actionable: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePlanTaskDto {
  goalId?: number | null;
  title: string;
  description?: string;
  type: PlanTaskType;
  status?: PlanTaskStatus;
  priority: PlanTaskPriority;
  scheduledFor?: string | null;
  dueAt?: string | null;
  estimatedMinutes?: number | null;
  completedAt?: string | null;
  actionable?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface IUpdatePlanTaskDto {
  goalId?: number | null;
  title?: string;
  description?: string;
  type?: PlanTaskType;
  status?: PlanTaskStatus;
  priority?: PlanTaskPriority;
  scheduledFor?: string | null;
  dueAt?: string | null;
  estimatedMinutes?: number | null;
  completedAt?: string | null;
  actionable?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface IPlanTaskListQuery {
  goalId?: number;
  status?: PlanTaskStatus;
}

export interface IDailyPlanRecord {
  id: number;
  planDate: string;
  summary: string;
  rationale: string;
  generatedAt: string;
  llmModel: string;
  llmInputTokens: number;
  llmOutputTokens: number;
  taskIds: number[];
  contextHash: string;
  availableMinutes: number;
  createdAt: string;
}

export interface IDailyPlanBundle {
  plan: IDailyPlanRecord;
  tasks: IPlanTask[];
}

export type DailyPlanFeedbackAction =
  | 'regenerate'
  | 'save-context'
  | 'complete-task'
  | 'defer-task'
  | 'delete-task-forever';

export interface IDailyPlanFeedbackDto {
  planId: number;
  freeText: string;
  action: DailyPlanFeedbackAction;
  taskId?: number;
}

export interface IMemoryNote {
  id: number;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateMemoryNoteDto {
  content: string;
  tags?: string[];
  pinned?: boolean;
}

export interface IUpdateMemoryNoteDto {
  content?: string;
  tags?: string[];
  pinned?: boolean;
}

export interface IMemoryNoteListQuery {
  page?: number;
  limit?: number;
  tag?: string;
  pinned?: boolean;
}
