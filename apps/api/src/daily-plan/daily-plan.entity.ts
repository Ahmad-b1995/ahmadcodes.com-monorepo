import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('daily_plans')
export class DailyPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'plan_date', type: 'date', unique: true })
  planDate!: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'text' })
  rationale!: string;

  @Column({ name: 'generated_at', type: 'timestamptz' })
  generatedAt!: Date;

  @Column({ name: 'llm_model', type: 'varchar', length: 64 })
  llmModel!: string;

  @Column({ name: 'llm_input_tokens', type: 'int' })
  llmInputTokens!: number;

  @Column({ name: 'llm_output_tokens', type: 'int' })
  llmOutputTokens!: number;

  @Column({ name: 'task_ids', type: 'int', array: true, default: () => "'{}'" })
  taskIds!: number[];

  @Column({ name: 'context_hash', type: 'varchar', length: 64 })
  contextHash!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
