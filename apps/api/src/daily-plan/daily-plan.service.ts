import { createHash } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';
import { DataSource, In, MoreThanOrEqual, Repository } from 'typeorm';
import type {
  IGenerateDailyPlanGoal,
  IGenerateDailyPlanInput,
  IGenerateDailyPlanMemoryNote,
  IGenerateDailyPlanTask,
} from '../llm/daily-plan-llm.types';
import type { IDailyPlanGeneratedTask } from '../llm/daily-plan-output.schema';
import { LlmService } from '../llm/llm.service';
import { DailyPlan } from './daily-plan.entity';
import { Goal } from './goal.entity';
import { MemoryNote } from './memory-note.entity';
import { PlanTask } from './plan-task.entity';
import type { PlanTaskActionable } from './plan-task.entity';
import type { DailyPlanFeedbackAction } from './daily-plan.dto';
import { MemoryNoteService } from './memory-note.service';

function utcTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function assertIsoDate(value: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BadRequestException('Invalid date; use YYYY-MM-DD');
  }
}

function resolvePlanDate(date?: string): string {
  const resolved = date ?? utcTodayDateString();
  assertIsoDate(resolved);
  return resolved;
}

function buildSummaryFromTasks(tasks: IDailyPlanGeneratedTask[]): string {
  if (tasks.length === 0) {
    return 'No tasks selected.';
  }
  const line = tasks
    .slice(0, 8)
    .map((t) => t.title)
    .join(' · ');
  return line.length > 2000 ? `${line.slice(0, 1997)}…` : line;
}

function hashContextPayload(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

function serializeGoal(g: Goal): IGenerateDailyPlanGoal {
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    priority: g.priority,
    targetDate: g.targetDate ? g.targetDate.toISOString() : null,
    active: g.active,
  };
}

function serializePlanTask(t: PlanTask): IGenerateDailyPlanTask {
  return {
    id: t.id,
    goalId: t.goalId,
    title: t.title,
    description: t.description,
    type: t.type,
    status: t.status,
    priority: t.priority,
    scheduledFor: t.scheduledFor,
    dueAt: t.dueAt ? t.dueAt.toISOString() : null,
    estimatedMinutes: t.estimatedMinutes,
    completedAt: t.completedAt ? t.completedAt.toISOString() : null,
    actionable: t.actionable,
    metadata: t.metadata,
  };
}

function serializeMemory(m: MemoryNote): IGenerateDailyPlanMemoryNote {
  return {
    id: m.id,
    content: m.content,
    tags: m.tags,
    pinned: m.pinned,
    createdAt: m.createdAt.toISOString(),
  };
}

@Injectable()
export class DailyPlanService {
  private readonly logger = new Logger(DailyPlanService.name);

  constructor(
    @InjectRepository(DailyPlan)
    private readonly dailyPlanRepository: Repository<DailyPlan>,
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(PlanTask)
    private readonly planTaskRepository: Repository<PlanTask>,
    private readonly dataSource: DataSource,
    private readonly llmService: LlmService,
    private readonly memoryNoteService: MemoryNoteService,
    private readonly configService: ConfigService,
  ) {}

  pickAvailableMinutes(override?: number): number {
    return this.defaultAvailableMinutes(override);
  }

  private defaultAvailableMinutes(fallback: number | undefined): number {
    const fromEnv = this.configService.get<string>(
      'DAILY_PLAN_DEFAULT_MINUTES',
    );
    const parsed = fromEnv ? parseInt(fromEnv, 10) : Number.NaN;
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
    return fallback ?? 480;
  }

  private userProfile() {
    return {
      name: this.configService.get<string>('DAILY_PLAN_PROFILE_NAME') ?? 'User',
      currentLocation:
        this.configService.get<string>('DAILY_PLAN_PROFILE_LOCATION') ?? '',
      careerStage:
        this.configService.get<string>('DAILY_PLAN_PROFILE_CAREER_STAGE') ?? '',
    };
  }

  private async buildLlmInput(
    planDate: string,
    availableMinutes: number,
  ): Promise<{ input: IGenerateDailyPlanInput; contextHash: string }> {
    const goals = await this.goalRepository.find({
      where: { active: true },
      order: { id: 'ASC' },
    });
    const tasks = await this.planTaskRepository.find({ order: { id: 'ASC' } });

    const memorySince = new Date();
    memorySince.setUTCDate(memorySince.getUTCDate() - 30);
    const memoryNotes =
      await this.memoryNoteService.findRecentForLlm(memorySince);

    const completedSince = new Date();
    completedSince.setUTCDate(completedSince.getUTCDate() - 14);
    const completedTasks = await this.planTaskRepository.find({
      where: {
        status: 'done',
        completedAt: MoreThanOrEqual(completedSince),
      },
      order: { completedAt: 'DESC' },
    });

    const input: IGenerateDailyPlanInput = {
      userProfile: this.userProfile(),
      goals: goals.map(serializeGoal),
      tasks: tasks.map(serializePlanTask),
      memoryNotes: memoryNotes.map(serializeMemory),
      completedTasks: completedTasks.map(serializePlanTask),
      todayDate: planDate,
      availableMinutes,
    };

    const contextHash = hashContextPayload({
      goals: input.goals,
      tasks: input.tasks,
      memoryNotes: input.memoryNotes,
      completedTasks: input.completedTasks,
      todayDate: planDate,
      availableMinutes,
      userProfile: input.userProfile,
    });

    return { input, contextHash };
  }

  private async orderTasksByIds(taskIds: number[]): Promise<PlanTask[]> {
    if (taskIds.length === 0) {
      return [];
    }
    const rows = await this.planTaskRepository.find({
      where: { id: In(taskIds) },
    });
    const map = new Map(rows.map((r) => [r.id, r]));
    return taskIds.map((id) => map.get(id)).filter((t): t is PlanTask => !!t);
  }

  async getPlanBundleByDate(
    planDate: string,
    availableMinutes?: number,
  ): Promise<{ plan: DailyPlan; tasks: PlanTask[] }> {
    const existing = await this.dailyPlanRepository.findOne({
      where: { planDate },
    });
    if (existing) {
      const tasks = await this.orderTasksByIds(existing.taskIds);
      return { plan: existing, tasks };
    }
    const today = utcTodayDateString();
    if (planDate !== today) {
      throw new NotFoundException(`No saved plan for ${planDate}`);
    }
    return this.generateAndPersist(
      planDate,
      this.defaultAvailableMinutes(availableMinutes),
    );
  }

  async generateAndPersist(
    planDate: string,
    availableMinutes: number,
  ): Promise<{ plan: DailyPlan; tasks: PlanTask[] }> {
    const { input, contextHash } = await this.buildLlmInput(
      planDate,
      availableMinutes,
    );
    const llm = await this.llmService.generateDailyPlan(input);

    await this.dataSource.transaction(async (em) => {
      await em.delete(DailyPlan, { planDate });

      const taskIds: number[] = [];
      for (const t of llm.plan.tasks) {
        const id = await this.upsertPlanTaskFromLlm(em, t);
        taskIds.push(id);
      }

      const suggestions = llm.plan.suggestedMemoryNotes ?? [];
      for (const s of suggestions) {
        const note = em.create(MemoryNote, {
          content: s.content,
          tags: [...s.tags, 'llm-suggestion'],
          pinned: false,
        });
        await em.save(note);
      }

      const summary = buildSummaryFromTasks(llm.plan.tasks);
      const row = em.create(DailyPlan, {
        planDate,
        summary,
        rationale: llm.plan.rationale,
        generatedAt: new Date(),
        llmModel: llm.model,
        llmInputTokens: llm.inputTokens,
        llmOutputTokens: llm.outputTokens,
        taskIds,
        contextHash,
        availableMinutes,
      });
      await em.save(row);
    });

    const plan = await this.dailyPlanRepository.findOneOrFail({
      where: { planDate },
    });
    const tasks = await this.orderTasksByIds(plan.taskIds);
    this.logger.log(`Saved daily plan for ${planDate} (${tasks.length} tasks)`);
    return { plan, tasks };
  }

  private async upsertPlanTaskFromLlm(
    em: EntityManager,
    t: IDailyPlanGeneratedTask,
  ): Promise<number> {
    const status = t.status ?? 'todo';
    const actionable = { ...t.actionable } as PlanTaskActionable;
    const est =
      t.estimatedMinutes ??
      (typeof actionable.estimateMinutes === 'number'
        ? actionable.estimateMinutes
        : null);

    if (t.id != null) {
      const existing = await em.findOne(PlanTask, { where: { id: t.id } });
      if (existing) {
        existing.goalId = t.goalId ?? null;
        existing.title = t.title;
        existing.description = t.description;
        existing.type = t.type;
        existing.status = status;
        existing.priority = t.priority;
        existing.scheduledFor = t.scheduledFor ?? null;
        existing.dueAt = t.dueAt ? new Date(t.dueAt) : null;
        existing.estimatedMinutes = est;
        existing.completedAt = status === 'done' ? new Date() : null;
        existing.actionable = actionable;
        existing.metadata = t.metadata ?? {};
        const saved = await em.save(existing);
        return saved.id;
      }
    }

    const row = em.create(PlanTask, {
      goalId: t.goalId ?? null,
      title: t.title,
      description: t.description,
      type: t.type,
      status,
      priority: t.priority,
      scheduledFor: t.scheduledFor ?? null,
      dueAt: t.dueAt ? new Date(t.dueAt) : null,
      estimatedMinutes: est,
      completedAt: status === 'done' ? new Date() : null,
      actionable,
      metadata: t.metadata ?? {},
    });
    const saved = await em.save(row);
    return saved.id;
  }

  async appendFeedbackMemory(
    planId: number,
    freeText: string,
    action: DailyPlanFeedbackAction,
  ): Promise<void> {
    const tags = ['daily-plan-feedback', `action:${action}`, `plan:${planId}`];
    await this.memoryNoteService.create({
      content: freeText,
      tags,
      pinned: false,
    });
  }

  async handleFeedback(dto: {
    planId: number;
    freeText: string;
    action: DailyPlanFeedbackAction;
    taskId?: number;
  }): Promise<{ plan: DailyPlan; tasks: PlanTask[] }> {
    const planRow = await this.dailyPlanRepository.findOne({
      where: { id: dto.planId },
    });
    if (!planRow) {
      throw new NotFoundException(`Daily plan ${dto.planId} not found`);
    }

    await this.appendFeedbackMemory(dto.planId, dto.freeText, dto.action);

    if (dto.action === 'save-context') {
      return this.getPlanBundleByDate(planRow.planDate);
    }

    if (dto.action === 'regenerate') {
      return this.generateAndPersist(
        planRow.planDate,
        planRow.availableMinutes,
      );
    }

    if (
      dto.action === 'complete-task' ||
      dto.action === 'defer-task' ||
      dto.action === 'delete-task-forever'
    ) {
      if (dto.taskId == null) {
        throw new BadRequestException('taskId is required for this action');
      }
      if (!planRow.taskIds.includes(dto.taskId)) {
        throw new BadRequestException('taskId is not part of this plan');
      }
    }

    if (dto.action === 'complete-task' && dto.taskId != null) {
      await this.planTaskRepository.update(dto.taskId, {
        status: 'done',
        completedAt: new Date(),
      });
    }

    if (dto.action === 'defer-task' && dto.taskId != null) {
      await this.planTaskRepository.update(dto.taskId, {
        status: 'deferred',
      });
    }

    if (dto.action === 'delete-task-forever' && dto.taskId != null) {
      await this.planTaskRepository.delete(dto.taskId);
      const nextIds = planRow.taskIds.filter((id) => id !== dto.taskId);
      await this.dailyPlanRepository.update(
        { id: planRow.id },
        { taskIds: nextIds },
      );
    }

    const refreshed = await this.dailyPlanRepository.findOneOrFail({
      where: { id: dto.planId },
    });
    const tasks = await this.orderTasksByIds(refreshed.taskIds);
    return { plan: refreshed, tasks };
  }
}

export { resolvePlanDate, utcTodayDateString };
