import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { LinkedInPost } from '../linkedin-posts/linkedin-post.entity';
import { MailMessage } from '../mail/mail.entity';
import { OutreachService } from '../outreach/outreach.service';
import { OutreachContact } from '../outreach/outreach.entity';
import { addUtcDays, startOfUtcDay } from '../common/utc-boundaries';

export interface CareerSummaryResponse {
  today: {
    tasksDue: Task[];
    linkedInScheduled: LinkedInPost[];
    outreachOverdue: OutreachContact[];
    remindersDue: Task[];
  };
  thisWeek: {
    tasksDue: Task[];
    linkedInScheduled: LinkedInPost[];
    outreachOverdue: OutreachContact[];
    remindersDue: Task[];
  };
  last7Days: {
    linkedInPostedCount: number;
    tasksCompletedCount: number;
    mailSentCount: number;
    mailReceivedCount: number;
  };
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Task)
    private readonly tasks: Repository<Task>,
    @InjectRepository(LinkedInPost)
    private readonly linkedInPosts: Repository<LinkedInPost>,
    @InjectRepository(MailMessage)
    private readonly mail: Repository<MailMessage>,
    private readonly outreachService: OutreachService,
  ) {}

  async getCareerSummary(): Promise<CareerSummaryResponse> {
    const now = new Date();
    const todayStart = startOfUtcDay(now);
    const todayEnd = addUtcDays(todayStart, 1);
    const weekEnd = addUtcDays(todayStart, 7);
    const rollingFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const excludedStatuses = ['done', 'cancelled'];

    const tasksDueToday = await this.tasks
      .createQueryBuilder('t')
      .where('t.due_at IS NOT NULL')
      .andWhere('t.due_at >= :todayStart', { todayStart })
      .andWhere('t.due_at < :todayEnd', { todayEnd })
      .andWhere('t.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: excludedStatuses,
      })
      .andWhere('t.type <> :reminder', { reminder: 'reminder' })
      .orderBy('t.due_at', 'ASC')
      .getMany();

    const remindersDueToday = await this.tasks
      .createQueryBuilder('t')
      .where('t.type = :rtype', { rtype: 'reminder' })
      .andWhere('t.due_at IS NOT NULL')
      .andWhere('t.due_at >= :todayStart', { todayStart })
      .andWhere('t.due_at < :todayEnd', { todayEnd })
      .andWhere('t.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: excludedStatuses,
      })
      .orderBy('t.due_at', 'ASC')
      .getMany();

    const linkedInToday = await this.linkedInPosts
      .createQueryBuilder('p')
      .where('p.posted_at IS NULL')
      .andWhere('p.scheduled_at IS NOT NULL')
      .andWhere('p.scheduled_at >= :todayStart', { todayStart })
      .andWhere('p.scheduled_at < :todayEnd', { todayEnd })
      .orderBy('p.scheduled_at', 'ASC')
      .getMany();

    const outreachOverdue = await this.outreachService.findOverdue();

    const tasksDueWeek = await this.tasks
      .createQueryBuilder('t')
      .where('t.due_at IS NOT NULL')
      .andWhere('t.due_at >= :todayStart', { todayStart })
      .andWhere('t.due_at < :weekEnd', { weekEnd })
      .andWhere('t.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: excludedStatuses,
      })
      .andWhere('t.type <> :reminder', { reminder: 'reminder' })
      .orderBy('t.due_at', 'ASC')
      .getMany();

    const remindersDueWeek = await this.tasks
      .createQueryBuilder('t')
      .where('t.type = :rtype', { rtype: 'reminder' })
      .andWhere('t.due_at IS NOT NULL')
      .andWhere('t.due_at >= :todayStart', { todayStart })
      .andWhere('t.due_at < :weekEnd', { weekEnd })
      .andWhere('t.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: excludedStatuses,
      })
      .orderBy('t.due_at', 'ASC')
      .getMany();

    const linkedInWeek = await this.linkedInPosts
      .createQueryBuilder('p')
      .where('p.posted_at IS NULL')
      .andWhere('p.scheduled_at IS NOT NULL')
      .andWhere('p.scheduled_at >= :todayStart', { todayStart })
      .andWhere('p.scheduled_at < :weekEnd', { weekEnd })
      .orderBy('p.scheduled_at', 'ASC')
      .getMany();

    const linkedInPostedCount = await this.linkedInPosts
      .createQueryBuilder('p')
      .where('p.posted_at IS NOT NULL')
      .andWhere('p.posted_at >= :rollingFrom', { rollingFrom })
      .andWhere('p.posted_at <= :now', { now })
      .getCount();

    const tasksCompletedCount = await this.tasks
      .createQueryBuilder('t')
      .where('t.completed_at IS NOT NULL')
      .andWhere('t.completed_at >= :rollingFrom', { rollingFrom })
      .andWhere('t.completed_at <= :now', { now })
      .andWhere('t.status = :done', { done: 'done' })
      .getCount();

    const mailSentCount = await this.mail
      .createQueryBuilder('m')
      .where('m.direction = :dir', { dir: 'sent' })
      .andWhere('m.status = :st', { st: 'sent' })
      .andWhere('m.sent_at IS NOT NULL')
      .andWhere('m.sent_at >= :rollingFrom', { rollingFrom })
      .andWhere('m.sent_at <= :now', { now })
      .getCount();

    const mailReceivedCount = await this.mail
      .createQueryBuilder('m')
      .where('m.direction = :dir', { dir: 'received' })
      .andWhere('m.received_at IS NOT NULL')
      .andWhere('m.received_at >= :rollingFrom', { rollingFrom })
      .andWhere('m.received_at <= :now', { now })
      .getCount();

    return {
      today: {
        tasksDue: tasksDueToday,
        linkedInScheduled: linkedInToday,
        outreachOverdue,
        remindersDue: remindersDueToday,
      },
      thisWeek: {
        tasksDue: tasksDueWeek,
        linkedInScheduled: linkedInWeek,
        outreachOverdue,
        remindersDue: remindersDueWeek,
      },
      last7Days: {
        linkedInPostedCount,
        tasksCompletedCount,
        mailSentCount,
        mailReceivedCount,
      },
    };
  }
}
