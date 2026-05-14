import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
import { PlanTask } from './plan-task.entity';
import {
  CreatePlanTaskDto,
  ListPlanTasksQueryDto,
  UpdatePlanTaskDto,
} from './plan-task.dto';

@Injectable()
export class PlanTaskService {
  private readonly logger = new Logger(PlanTaskService.name);

  constructor(
    @InjectRepository(PlanTask)
    private readonly planTaskRepository: Repository<PlanTask>,
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}

  private async assertGoalExists(goalId: number): Promise<void> {
    const exists = await this.goalRepository.exist({ where: { id: goalId } });
    if (!exists) {
      throw new NotFoundException(`Goal ${goalId} not found`);
    }
  }

  async create(dto: CreatePlanTaskDto): Promise<PlanTask> {
    if (dto.goalId != null) {
      await this.assertGoalExists(dto.goalId);
    }
    const row = this.planTaskRepository.create({
      goalId: dto.goalId ?? null,
      title: dto.title,
      description: dto.description ?? '',
      type: dto.type,
      status: dto.status ?? 'todo',
      priority: dto.priority,
      scheduledFor: dto.scheduledFor ?? null,
      dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
      estimatedMinutes: dto.estimatedMinutes ?? null,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
      actionable: dto.actionable ?? {},
      metadata: dto.metadata ?? {},
    });
    const saved = await this.planTaskRepository.save(row);
    this.logger.log(`Created plan task ${saved.id}`);
    return saved;
  }

  async findAll(query: ListPlanTasksQueryDto): Promise<PlanTask[]> {
    const qb = this.planTaskRepository
      .createQueryBuilder('t')
      .orderBy('t.dueAt', 'ASC', 'NULLS LAST')
      .addOrderBy(
        `CASE t.priority
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
          ELSE 5 END`,
        'ASC',
      )
      .addOrderBy('t.id', 'ASC');

    if (query.goalId != null) {
      qb.andWhere('t.goalId = :goalId', { goalId: query.goalId });
    }
    if (query.status != null) {
      qb.andWhere('t.status = :status', { status: query.status });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<PlanTask> {
    const task = await this.planTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Plan task ${id} not found`);
    }
    return task;
  }

  async findByIds(ids: number[]): Promise<PlanTask[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.planTaskRepository
      .createQueryBuilder('t')
      .where('t.id IN (:...ids)', { ids })
      .getMany();
  }

  async update(id: number, dto: UpdatePlanTaskDto): Promise<PlanTask> {
    const task = await this.findOne(id);
    if (dto.goalId !== undefined) {
      if (dto.goalId != null) {
        await this.assertGoalExists(dto.goalId);
      }
      task.goalId = dto.goalId;
    }
    if (dto.title !== undefined) {
      task.title = dto.title;
    }
    if (dto.description !== undefined) {
      task.description = dto.description;
    }
    if (dto.type !== undefined) {
      task.type = dto.type;
    }
    if (dto.status !== undefined) {
      task.status = dto.status;
    }
    if (dto.priority !== undefined) {
      task.priority = dto.priority;
    }
    if (dto.scheduledFor !== undefined) {
      task.scheduledFor = dto.scheduledFor;
    }
    if (dto.dueAt !== undefined) {
      task.dueAt = dto.dueAt === null ? null : new Date(dto.dueAt);
    }
    if (dto.estimatedMinutes !== undefined) {
      task.estimatedMinutes = dto.estimatedMinutes;
    }
    if (dto.completedAt !== undefined) {
      task.completedAt =
        dto.completedAt === null ? null : new Date(dto.completedAt);
    }
    if (dto.actionable !== undefined) {
      task.actionable = dto.actionable;
    }
    if (dto.metadata !== undefined) {
      task.metadata = dto.metadata;
    }
    return this.planTaskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const res = await this.planTaskRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`Plan task ${id} not found`);
    }
  }
}
