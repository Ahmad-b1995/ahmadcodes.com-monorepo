import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanTask } from './plan-task.entity';

export type GoalPriority = 'critical' | 'high' | 'medium' | 'low';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ name: 'description', type: 'text', default: '' })
  description!: string;

  @Column({ type: 'varchar', length: 16 })
  priority!: GoalPriority;

  @Column({ name: 'target_date', type: 'timestamptz', nullable: true })
  targetDate!: Date | null;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  metadata!: Record<string, unknown>;

  @OneToMany(() => PlanTask, (t) => t.goal)
  planTasks!: PlanTask[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
