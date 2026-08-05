import {
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import type {
  PlanTaskPriority,
  PlanTaskStatus,
  PlanTaskType,
} from './plan-task.entity';

const PLAN_TASK_TYPES: PlanTaskType[] = [
  'linkedin_post',
  'outreach',
  'article',
  'reminder',
  'learning',
  'admin',
  'application',
  'freelance',
  'other',
];

const PLAN_TASK_STATUSES: PlanTaskStatus[] = [
  'todo',
  'in_progress',
  'done',
  'blocked',
  'cancelled',
  'deferred',
];

const PLAN_TASK_PRIORITIES: PlanTaskPriority[] = [
  'critical',
  'high',
  'medium',
  'low',
];

export class CreatePlanTaskDto {
  @IsOptional()
  @IsInt()
  goalId?: number | null;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PLAN_TASK_TYPES)
  type!: PlanTaskType;

  @IsOptional()
  @IsEnum(PLAN_TASK_STATUSES)
  status?: PlanTaskStatus;

  @IsEnum(PLAN_TASK_PRIORITIES)
  priority!: PlanTaskPriority;

  @IsOptional()
  @IsDateString()
  scheduledFor?: string | null;

  @IsOptional()
  @IsDateString()
  dueAt?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24 * 60)
  estimatedMinutes?: number | null;

  @IsOptional()
  @IsDateString()
  completedAt?: string | null;

  @IsOptional()
  @IsObject()
  actionable?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdatePlanTaskDto {
  @IsOptional()
  @IsInt()
  goalId?: number | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PLAN_TASK_TYPES)
  type?: PlanTaskType;

  @IsOptional()
  @IsEnum(PLAN_TASK_STATUSES)
  status?: PlanTaskStatus;

  @IsOptional()
  @IsEnum(PLAN_TASK_PRIORITIES)
  priority?: PlanTaskPriority;

  @IsOptional()
  @IsDateString()
  scheduledFor?: string | null;

  @IsOptional()
  @IsDateString()
  dueAt?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24 * 60)
  estimatedMinutes?: number | null;

  @IsOptional()
  @IsDateString()
  completedAt?: string | null;

  @IsOptional()
  @IsObject()
  actionable?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class ListPlanTasksQueryDto {
  @IsOptional()
  @IsInt()
  goalId?: number;

  @IsOptional()
  @IsEnum(PLAN_TASK_STATUSES)
  status?: PlanTaskStatus;
}
