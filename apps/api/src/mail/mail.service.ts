import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  PayloadTooLargeException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import smtpConfig from '../config/smtp.config';
import { MailMessage } from './mail.entity';
import { InboundMailDto, ListMailQueryDto, SendMailDto } from './mail.dto';
import {
  INBOUND_MAX_BODY_LENGTH,
  INBOUND_MAX_SUBJECT_LENGTH,
} from './mail-inbound.constants';

@Injectable()
export class MailService implements OnModuleDestroy {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    @Inject(smtpConfig.KEY)
    private readonly smtp: ConfigType<typeof smtpConfig>,
    @InjectRepository(MailMessage)
    private readonly mailRepo: Repository<MailMessage>,
  ) {}

  onModuleDestroy(): void {
    this.transporter?.close();
    this.transporter = null;
  }

  /**
   * Persist an inbound message (Email Worker, etc.). Enforces size caps;
   * de-duplicates by RFC Message-ID when provided.
   */
  async receiveInbound(dto: InboundMailDto): Promise<MailMessage> {
    const subjectLen = dto.subject.length;
    if (subjectLen > INBOUND_MAX_SUBJECT_LENGTH) {
      throw new PayloadTooLargeException(
        `subject exceeds ${INBOUND_MAX_SUBJECT_LENGTH} characters`,
      );
    }

    const bodyHtml = dto.bodyHtml ?? '';
    const bodyText = dto.bodyText ?? '';
    if (bodyHtml.length > INBOUND_MAX_BODY_LENGTH) {
      throw new PayloadTooLargeException(
        `bodyHtml exceeds ${INBOUND_MAX_BODY_LENGTH} bytes`,
      );
    }
    if (bodyText.length > INBOUND_MAX_BODY_LENGTH) {
      throw new PayloadTooLargeException(
        `bodyText exceeds ${INBOUND_MAX_BODY_LENGTH} bytes`,
      );
    }

    const messageId =
      dto.messageId && dto.messageId.trim().length > 0
        ? dto.messageId.trim()
        : null;

    if (messageId) {
      const existing = await this.mailRepo.findOne({
        where: { messageId },
      });
      if (existing) {
        return existing;
      }
    }

    const now = new Date();
    const record = this.mailRepo.create({
      direction: 'received',
      status: 'received',
      fromAddress: dto.fromAddress,
      toAddresses: dto.toAddresses,
      ccAddresses: dto.ccAddresses ?? [],
      bccAddresses: dto.bccAddresses ?? [],
      subject: dto.subject,
      bodyHtml,
      bodyText,
      messageId,
      inReplyTo: dto.inReplyTo?.trim().length ? dto.inReplyTo.trim() : null,
      error: null,
      sentAt: null,
      receivedAt: now,
    });

    return this.mailRepo.save(record);
  }

  async send(dto: SendMailDto): Promise<MailMessage> {
    if (!this.smtp.host || !this.smtp.user) {
      throw new BadRequestException(
        'SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD env vars.',
      );
    }

    const fromAddress = this.smtp.fromAddress;
    const fromHeader = this.smtp.fromName
      ? `${this.smtp.fromName} <${fromAddress}>`
      : fromAddress;

    const record = this.mailRepo.create({
      direction: 'sent',
      status: 'queued',
      fromAddress,
      toAddresses: dto.to,
      ccAddresses: dto.cc ?? [],
      bccAddresses: dto.bcc ?? [],
      subject: dto.subject,
      bodyHtml: dto.bodyHtml,
      bodyText: dto.bodyText ?? this.htmlToPlainText(dto.bodyHtml),
      inReplyTo: dto.inReplyTo ?? null,
      messageId: null,
      error: null,
      sentAt: null,
      receivedAt: null,
    });
    await this.mailRepo.save(record);

    try {
      const transporter = this.getTransporter();
      /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- nodemailer sendMail */
      const info = await transporter.sendMail({
        from: fromHeader,
        to: dto.to,
        cc: dto.cc?.length ? dto.cc : undefined,
        bcc: dto.bcc?.length ? dto.bcc : undefined,
        subject: dto.subject,
        html: dto.bodyHtml,
        text: record.bodyText,
        inReplyTo: dto.inReplyTo,
        references: dto.inReplyTo,
        headers: {
          'List-Unsubscribe': `<mailto:${fromAddress}?subject=unsubscribe>`,
        },
      });

      record.status = 'sent';
      record.messageId = info.messageId ?? null;
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
      record.sentAt = new Date();
      return await this.mailRepo.save(record);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to send mail: ${message}`, err as Error);
      record.status = 'failed';
      record.error = message.slice(0, 4000);
      await this.mailRepo.save(record);
      throw err;
    }
  }

  async list(
    options: IPaginationOptions,
    query: ListMailQueryDto,
  ): Promise<Pagination<MailMessage>> {
    const qb = this.mailRepo.createQueryBuilder('m');
    if (query.direction) {
      qb.andWhere('m.direction = :direction', { direction: query.direction });
    }
    if (query.status) {
      qb.andWhere('m.status = :status', { status: query.status });
    }
    qb.orderBy('m.createdAt', 'DESC');
    return paginate<MailMessage>(qb, options);
  }

  async findOne(id: number): Promise<MailMessage> {
    const message = await this.mailRepo.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Mail message ${id} not found`);
    }
    return message;
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.mailRepo.remove(message);
  }

  /**
   * Verify the SMTP transporter can connect and authenticate.
   * Useful for a Settings → "Test SMTP" button in the CMS.
   */
  async verify(): Promise<{ ok: true; host: string }> {
    const transporter = this.getTransporter();
    await transporter.verify();
    return { ok: true, host: this.smtp.host };
  }

  private getTransporter(): nodemailer.Transporter {
    if (this.transporter) return this.transporter;

    this.transporter = nodemailer.createTransport({
      host: this.smtp.host,
      port: this.smtp.port,
      secure: this.smtp.secure,
      auth: {
        user: this.smtp.user,
        pass: this.smtp.password,
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
    });

    return this.transporter;
  }

  /**
   * Naive HTML → plain text conversion good enough for fallback bodies.
   * Strips tags, decodes a few common entities, collapses whitespace.
   */
  private htmlToPlainText(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<\/(p|div|li|h\d|tr|br)>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
