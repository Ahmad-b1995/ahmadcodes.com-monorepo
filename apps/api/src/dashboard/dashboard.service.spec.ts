import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardService } from './dashboard.service';
import { Task } from '../tasks/task.entity';
import { LinkedInPost } from '../linkedin-posts/linkedin-post.entity';
import { MailMessage } from '../mail/mail.entity';
import { OutreachService } from '../outreach/outreach.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
    };
    const mockRepo = {
      createQueryBuilder: jest.fn(() => qb),
    };
    const outreach = { findOverdue: jest.fn().mockResolvedValue([]) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(Task), useValue: mockRepo },
        { provide: getRepositoryToken(LinkedInPost), useValue: mockRepo },
        { provide: getRepositoryToken(MailMessage), useValue: mockRepo },
        { provide: OutreachService, useValue: outreach },
      ],
    }).compile();

    service = module.get(DashboardService);
  });

  it('returns career summary shape', async () => {
    const res = await service.getCareerSummary();
    expect(res.today.tasksDue).toEqual([]);
    expect(res.today.linkedInScheduled).toEqual([]);
    expect(res.today.outreachOverdue).toEqual([]);
    expect(res.today.remindersDue).toEqual([]);
    expect(res.thisWeek.tasksDue).toEqual([]);
    expect(res.last7Days.linkedInPostedCount).toBe(0);
    expect(res.last7Days.tasksCompletedCount).toBe(0);
    expect(res.last7Days.mailSentCount).toBe(0);
    expect(res.last7Days.mailReceivedCount).toBe(0);
  });
});
