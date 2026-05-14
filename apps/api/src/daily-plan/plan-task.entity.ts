import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Goal } from './goal.entity';

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

/** Stored in jsonb; validated with zod when produced by the LLM. */
export type PlanTaskActionable = Record<string, unknown>;

@Entity('plan_tasks')
export class PlanTask {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'goal_id', type: 'int', nullable: true })
  goalId!: number | null;

  @ManyToOne(() => Goal, (g) => g.planTasks, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'goal_id' })
  goal!: Goal | null;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ name: 'description', type: 'text', default: '' })
  description!: string;

  @Column({ type: 'varchar', length: 32 })
  type!: PlanTaskType;

  @Column({ type: 'varchar', length: 32, default: 'todo' })
  status!: PlanTaskStatus;

  @Column({ type: 'varchar', length: 16 })
  priority!: PlanTaskPriority;

  @Column({ name: 'scheduled_for', type: 'date', nullable: true })
  scheduledFor!: string | null;

  @Column({ name: 'due_at', type: 'timestamptz', nullable: true })
  dueAt!: Date | null;

  @Column({ name: 'estimated_minutes', type: 'int', nullable: true })
  estimatedMinutes!: number | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt!: Date | null;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  actionable!: PlanTaskActionable;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
