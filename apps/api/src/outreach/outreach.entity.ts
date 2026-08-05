import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type OutreachSource =
  | 'warm'
  | 'cold'
  | 'linkedin'
  | 'event'
  | 'referral';

export type OutreachStatus =
  | 'queued'
  | 'contacted'
  | 'responded'
  | 'booked'
  | 'closed';

@Entity('outreach_contacts')
export class OutreachContact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 320 })
  name!: string;

  @Column({ type: 'varchar', length: 320, default: '' })
  company!: string;

  @Column({ type: 'varchar', length: 320, default: '' })
  role!: string;

  @Column({ type: 'varchar', length: 320, default: '' })
  email!: string;

  @Column({
    name: 'linkedin_url',
    type: 'varchar',
    length: 998,
    nullable: true,
  })
  linkedinUrl!: string | null;

  @Column({ type: 'varchar', length: 32 })
  source!: OutreachSource;

  @Column({ type: 'varchar', length: 32, default: 'queued' })
  status!: OutreachStatus;

  @Column({ name: 'last_contacted_at', type: 'timestamptz', nullable: true })
  lastContactedAt!: Date | null;

  @Column({ name: 'last_reply_at', type: 'timestamptz', nullable: true })
  lastReplyAt!: Date | null;

  @Column({ type: 'text', default: '' })
  notes!: string;

  @Column('text', { array: true, default: () => "'{}'" })
  tags!: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
