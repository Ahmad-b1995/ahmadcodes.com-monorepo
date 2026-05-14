import { Logger } from '@nestjs/common';
import { AppDataSource } from '../data-source';
import { Goal } from '../daily-plan/goal.entity';
import { MemoryNote } from '../daily-plan/memory-note.entity';
import { PlanTask } from '../daily-plan/plan-task.entity';
import type { GoalPriority } from '../daily-plan/goal.entity';
import type {
  PlanTaskPriority,
  PlanTaskType,
} from '../daily-plan/plan-task.entity';

const logger = new Logger('SeedGoals');

type SubTaskSeed = {
  title: string;
  type: PlanTaskType;
  priority: PlanTaskPriority;
};

type GoalSeed = {
  title: string;
  description: string;
  priority: GoalPriority;
  /** YYYY-MM-DD interpreted as UTC noon */
  targetDate: string | null;
  subTasks?: SubTaskSeed[];
};

/** Edit this list to adjust seeded goals; re-run is idempotent by title. */
export const INITIAL_GOALS: GoalSeed[] = [
  {
    title: 'Italy + Germany university application',
    description:
      'Documents, IELTS, CIMEA, motivation letters, pre-inquiries for competitive programs.',
    priority: 'critical',
    targetDate: '2027-07-31',
    subTasks: [
      {
        title: 'Gather certified transcripts & diplomas',
        type: 'application',
        priority: 'critical',
      },
      {
        title: 'IELTS Academic booking & prep block',
        type: 'learning',
        priority: 'high',
      },
      {
        title: 'CIMEA / qualification recognition steps',
        type: 'admin',
        priority: 'high',
      },
      {
        title: 'Draft motivation letters (per program)',
        type: 'application',
        priority: 'high',
      },
      {
        title: 'Send pre-inquiry emails to shortlist programs',
        type: 'outreach',
        priority: 'medium',
      },
    ],
  },
  {
    title: 'IELTS Academic certification',
    description: 'Minimum band 7.0 overall; schedule exam and structured prep.',
    priority: 'high',
    targetDate: '2026-07-15',
  },
  {
    title: 'Italian language to A2',
    description: 'Daily practice + structured course toward A2 certificate.',
    priority: 'high',
    targetDate: '2027-06-30',
  },
  {
    title: 'German language to B1 (Ahmad), B2 (Fatemeh)',
    description: 'Parallel tracks; integrate weekly speaking practice.',
    priority: 'high',
    targetDate: '2027-06-30',
  },
  {
    title: 'Freelance income: $1500/month minimum',
    description: 'Pipeline: outreach, retainers, productized offers.',
    priority: 'critical',
    targetDate: '2026-09-30',
  },
  {
    title: 'netsuite-restlet-typescript live test + npm v0.1.0',
    description: 'Ship runnable examples and publish v0.1.0 to npm.',
    priority: 'high',
    targetDate: '2026-06-30',
  },
  {
    title: 'Weekly NetSuite-themed LinkedIn post',
    description: 'Recurring visibility; batch topics monthly.',
    priority: 'medium',
    targetDate: null,
  },
  {
    title: 'Daily Italian + German practice 30min each',
    description: 'Non-negotiable daily blocks on calendar.',
    priority: 'medium',
    targetDate: null,
  },
  {
    title: 'Move from Turkey to Armenia (Yerevan) ~May 27 with car',
    description: 'Logistics, border paperwork, housing, car import rules.',
    priority: 'critical',
    targetDate: '2026-05-27',
  },
  {
    title: 'Iran trip + document collection',
    description: 'Embassy-related originals and copies for applications.',
    priority: 'critical',
    targetDate: '2026-05-27',
  },
];

export const INITIAL_PINNED_MEMORY: { content: string; tags: string[] }[] = [
  {
    content: 'I have ~$10k cash. I burn ~$1200/month.',
    tags: ['finance', 'pinned-seed'],
  },
  {
    content:
      "I'm Iranian passport. Stripe / PayPal not directly accessible. Use MailerSend (have SMTP), Binance P2P for crypto-to-fiat, Wise where it works.",
    tags: ['payments', 'pinned-seed'],
  },
  {
    content:
      "Fatemeh and I both pursue Italy + Germany. Same university where possible (Trento primary). She has BSc CS 17/20, I have humanities + Fani-Herfe'i 17/20.",
    tags: ['applications', 'pinned-seed'],
  },
  {
    content:
      'I work 2 days/week on Barriertek (BarrierTek), 3 days/week available for my own work.',
    tags: ['schedule', 'pinned-seed'],
  },
  {
    content:
      'BarrierTek contract ends ~October 2026. Need freelance income bridge by then.',
    tags: ['career', 'pinned-seed'],
  },
];

function toTargetDate(isoDay: string | null): Date | null {
  if (!isoDay) {
    return null;
  }
  return new Date(`${isoDay}T12:00:00.000Z`);
}

async function seedGoals(): Promise<void> {
  await AppDataSource.initialize();
  const goalRepo = AppDataSource.getRepository(Goal);
  const taskRepo = AppDataSource.getRepository(PlanTask);
  const memoryRepo = AppDataSource.getRepository(MemoryNote);

  for (const g of INITIAL_GOALS) {
    const exists = await goalRepo.exist({ where: { title: g.title } });
    if (exists) {
      logger.log(`Skip goal (exists): ${g.title}`);
      continue;
    }
    const goal = goalRepo.create({
      title: g.title,
      description: g.description,
      priority: g.priority,
      targetDate: toTargetDate(g.targetDate),
      active: true,
      metadata: {},
    });
    const saved = await goalRepo.save(goal);
    logger.log(`Created goal ${saved.id}: ${saved.title}`);

    if (g.subTasks?.length) {
      for (const st of g.subTasks) {
        await taskRepo.save(
          taskRepo.create({
            goalId: saved.id,
            title: st.title,
            description: '',
            type: st.type,
            status: 'todo',
            priority: st.priority,
            scheduledFor: null,
            dueAt: null,
            estimatedMinutes: null,
            completedAt: null,
            actionable: {},
            metadata: {},
          }),
        );
      }
    }
  }

  const pinnedSeedCount = await memoryRepo
    .createQueryBuilder('m')
    .where(`'pinned-seed' = ANY(m.tags)`)
    .getCount();
  if (pinnedSeedCount === 0) {
    for (const m of INITIAL_PINNED_MEMORY) {
      await memoryRepo.save(
        memoryRepo.create({
          content: m.content,
          tags: m.tags,
          pinned: true,
        }),
      );
      logger.log('Created pinned memory note');
    }
  } else {
    logger.log('Skip pinned memory seeds (already present)');
  }

  await AppDataSource.destroy();
  logger.log('seed:goals finished');
}

void seedGoals().catch((err: unknown) => {
  logger.error(err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
