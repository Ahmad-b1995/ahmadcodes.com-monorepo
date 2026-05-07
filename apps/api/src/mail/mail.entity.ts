import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type MailDirection = 'sent' | 'received';
export type MailStatus = 'queued' | 'sent' | 'failed' | 'received';

@Entity('mail_messages')
@Index('IDX_mail_messages_direction_created', ['direction', 'createdAt'])
export class MailMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 16 })
  direction!: MailDirection;

  @Column({ type: 'varchar', length: 16, default: 'queued' })
  status!: MailStatus;

  @Column({ name: 'from_address', type: 'varchar', length: 320 })
  fromAddress!: string;

  @Column({
    name: 'to_addresses',
    type: 'text',
    array: true,
    default: () => "'{}'",
  })
  toAddresses!: string[];

  @Column({
    name: 'cc_addresses',
    type: 'text',
    array: true,
    default: () => "'{}'",
  })
  ccAddresses!: string[];

  @Column({
    name: 'bcc_addresses',
    type: 'text',
    array: true,
    default: () => "'{}'",
  })
  bccAddresses!: string[];

  @Column({ type: 'varchar', length: 998 })
  subject!: string;

  @Column({ name: 'body_html', type: 'text', default: '' })
  bodyHtml!: string;

  @Column({ name: 'body_text', type: 'text', default: '' })
  bodyText!: string;

  /**
   * RFC 5322 Message-ID header, useful for threading and de-duplication.
   */
  @Index()
  @Column({ name: 'message_id', type: 'varchar', length: 998, nullable: true })
  messageId!: string | null;

  /**
   * The Message-ID this email is replying to, if any (`In-Reply-To` header).
   */
  @Column({ name: 'in_reply_to', type: 'varchar', length: 998, nullable: true })
  inReplyTo!: string | null;

  @Column({ type: 'text', nullable: true })
  error!: string | null;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt!: Date | null;

  @Column({ name: 'received_at', type: 'timestamptz', nullable: true })
  receivedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
