import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MailService } from '../mail/mail.service';
import { TaskService } from '../tasks/task.service';
import { LinkedInPostService } from '../linkedin-posts/linkedin-post.service';
import { OutreachService } from '../outreach/outreach.service';
import type { LinkedInPost } from '../linkedin-posts/linkedin-post.entity';
import type { Task } from '../tasks/task.entity';
import type { OutreachContact } from '../outreach/outreach.entity';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

@Injectable()
export class DigestService {
  private readonly logger = new Logger(DigestService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly taskService: TaskService,
    private readonly linkedInPostService: LinkedInPostService,
    private readonly outreachService: OutreachService,
  ) {}

  @Cron('0 6 * * *')
  async sendDailyDigest(): Promise<void> {
    const to = process.env.DIGEST_TO?.trim() || 'contact@ahmadcodes.com';

    let posts: LinkedInPost[] = [];
    let overdue: OutreachContact[] = [];
    let reminders: Task[] = [];

    try {
      posts = await this.linkedInPostService.findScheduledTodayUtc();
      overdue = await this.outreachService.findOverdue();
      reminders = await this.taskService.findRemindersDueWithinDaysFromToday(3);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Digest query failed: ${message}`, err as Error);
      return;
    }

    if (posts.length === 0 && overdue.length === 0 && reminders.length === 0) {
      return;
    }

    const now = new Date();
    const dayLabel = now.toISOString().slice(0, 10);
    const subject = `Daily digest — ${dayLabel}`;
    const bodyHtml = this.renderDigestHtml({
      posts,
      overdue,
      reminders,
      dayLabel,
    });

    try {
      await this.mailService.send({
        to: [to],
        subject,
        bodyHtml,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Digest send failed: ${message}`, err as Error);
    }
  }

  private renderDigestHtml(payload: {
    posts: LinkedInPost[];
    overdue: OutreachContact[];
    reminders: Task[];
    dayLabel: string;
  }): string {
    const { posts, overdue, reminders, dayLabel } = payload;
    const wrap = (inner: string) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Daily digest</title>
</head>
<body style="margin:0;padding:24px;background:#f8fafc;color:#0f172a;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.65;">
  <div style="max-width:42rem;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px 32px;">
    <p style="margin:0 0 16px;font-size:14px;color:#64748b;">${escapeHtml(dayLabel)}</p>
    <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#0f172a;">Daily digest</h1>
    ${inner}
    <p style="margin-top:32px;font-size:13px;color:#94a3b8;">Sent automatically from your CMS backend.</p>
  </div>
</body>
</html>`;

    const sections: string[] = [];

    if (posts.length > 0) {
      const items = posts
        .map(
          (p) =>
            `<li style="margin:0 0 8px;"><strong>${escapeHtml(p.title)}</strong>${p.scheduledAt ? ` · scheduled ${escapeHtml(p.scheduledAt.toISOString())}` : ''}</li>`,
        )
        .join('');
      sections.push(
        `<h2 style="font-size:18px;margin:24px 0 12px;color:#0f172a;">LinkedIn scheduled today</h2><ul style="margin:0;padding-left:20px;">${items}</ul>`,
      );
    }

    if (overdue.length > 0) {
      const items = overdue
        .map(
          (c) =>
            `<li style="margin:0 0 8px;"><strong>${escapeHtml(c.name)}</strong>${c.company ? ` · ${escapeHtml(c.company)}` : ''}${c.lastContactedAt ? ` · last contact ${escapeHtml(c.lastContactedAt.toISOString())}` : ''}</li>`,
        )
        .join('');
      sections.push(
        `<h2 style="font-size:18px;margin:24px 0 12px;color:#0f172a;">Outreach follow-ups (48h+ since contact, no reply)</h2><ul style="margin:0;padding-left:20px;">${items}</ul>`,
      );
    }

    if (reminders.length > 0) {
      const items = reminders
        .map(
          (t) =>
            `<li style="margin:0 0 8px;"><strong>${escapeHtml(t.title)}</strong>${t.dueAt ? ` · due ${escapeHtml(t.dueAt.toISOString())}` : ''}</li>`,
        )
        .join('');
      sections.push(
        `<h2 style="font-size:18px;margin:24px 0 12px;color:#0f172a;">Reminders due in the next 3 days</h2><ul style="margin:0;padding-left:20px;">${items}</ul>`,
      );
    }

    return wrap(sections.join(''));
  }
}
