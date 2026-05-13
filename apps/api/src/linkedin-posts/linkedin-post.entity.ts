import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('linkedin_posts')
export class LinkedInPost {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'text', default: '' })
  body!: string;

  @Column('text', { array: true, default: () => "'{}'" })
  hashtags!: string[];

  @Column({ name: 'scheduled_at', type: 'timestamptz', nullable: true })
  scheduledAt!: Date | null;

  @Column({ name: 'posted_at', type: 'timestamptz', nullable: true })
  postedAt!: Date | null;

  @Column({ name: 'external_url', type: 'varchar', length: 998, nullable: true })
  externalUrl!: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 998, nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  engagement!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
