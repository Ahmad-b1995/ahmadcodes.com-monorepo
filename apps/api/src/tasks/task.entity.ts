import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 32 })
  type!: TaskType;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ name: 'description', type: 'text', default: '' })
  description!: string;

  @Column({ type: 'varchar', length: 32, default: 'draft' })
  status!: TaskStatus;

  @Column({ name: 'scheduled_at', type: 'timestamptz', nullable: true })
  scheduledAt!: Date | null;

  @Column({ name: 'due_at', type: 'timestamptz', nullable: true })
  dueAt!: Date | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt!: Date | null;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
