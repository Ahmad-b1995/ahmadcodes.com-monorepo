import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class DailyPlanDateQueryDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(60)
  @Max(24 * 60)
  availableMinutes?: number;
}

export type DailyPlanFeedbackAction =
  | 'regenerate'
  | 'save-context'
  | 'complete-task'
  | 'defer-task'
  | 'delete-task-forever';

const FEEDBACK_ACTIONS: DailyPlanFeedbackAction[] = [
  'regenerate',
  'save-context',
  'complete-task',
  'defer-task',
  'delete-task-forever',
];

export class DailyPlanFeedbackDto {
  @IsInt()
  planId!: number;

  @IsString()
  freeText!: string;

  @IsEnum(FEEDBACK_ACTIONS)
  action!: DailyPlanFeedbackAction;

  @ValidateIf((o: DailyPlanFeedbackDto) =>
    ['complete-task', 'defer-task', 'delete-task-forever'].includes(o.action),
  )
  @IsInt()
  taskId?: number;
}
