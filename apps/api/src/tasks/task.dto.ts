import {
  IsDateString,
  IsEnum,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { TaskStatus, TaskType } from './task.entity';

const TASK_TYPES: TaskType[] = [
  'linkedin_post',
  'outreach',
  'article',
  'reminder',
  'other',
];

const TASK_STATUSES: TaskStatus[] = [
  'draft',
  'scheduled',
  'active',
  'done',
  'cancelled',
];

export class CreateTaskDto {
  @IsEnum(TASK_TYPES)
  type!: TaskType;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TASK_STATUSES)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsEnum(TASK_TYPES)
  type?: TaskType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TASK_STATUSES)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export type TaskDueFilter = 'overdue' | 'today' | 'this_week' | 'all';

export class ListTasksQueryDto {
  @IsOptional()
  @IsEnum(TASK_TYPES)
  type?: TaskType;

  @IsOptional()
  @IsEnum(TASK_STATUSES)
  status?: TaskStatus;

  @IsOptional()
  @IsIn(['overdue', 'today', 'this_week', 'all'])
  due?: TaskDueFilter;
}
