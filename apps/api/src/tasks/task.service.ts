import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, ListTasksQueryDto, UpdateTaskDto } from './task.dto';
import { startOfUtcDay, addUtcDays } from '../common/utc-boundaries';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const row = this.taskRepo.create({
      type: dto.type,
      title: dto.title,
      description: dto.description ?? '',
      status: dto.status ?? 'draft',
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
      metadata: dto.metadata ?? {},
    });
    return this.taskRepo.save(row);
  }

  async findAll(query: ListTasksQueryDto): Promise<Task[]> {
    const qb = this.taskRepo
      .createQueryBuilder('t')
      .orderBy('t.due_at', 'ASC', 'NULLS LAST');

    if (query.type) {
      qb.andWhere('t.type = :type', { type: query.type });
    }
    if (query.status) {
      qb.andWhere('t.status = :status', { status: query.status });
    }

    const due = query.due ?? 'all';
    if (due !== 'all') {
      const now = new Date();
      const startToday = startOfUtcDay(now);
      const endToday = addUtcDays(startToday, 1);
      const endWeek = addUtcDays(startToday, 7);

      if (due === 'overdue') {
        qb.andWhere('t.due_at IS NOT NULL')
          .andWhere('t.due_at < :startToday', { startToday })
          .andWhere('t.status NOT IN (:...closed)', {
            closed: ['done', 'cancelled'],
          });
      } else if (due === 'today') {
        qb.andWhere('t.due_at IS NOT NULL')
          .andWhere('t.due_at >= :startToday', { startToday })
          .andWhere('t.due_at < :endToday', { endToday });
      } else if (due === 'this_week') {
        qb.andWhere('t.due_at IS NOT NULL')
          .andWhere('t.due_at >= :startToday', { startToday })
          .andWhere('t.due_at < :endWeek', { endWeek });
      }
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    if (dto.type !== undefined) task.type = dto.type;
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.scheduledAt !== undefined) {
      task.scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : null;
    }
    if (dto.dueAt !== undefined) {
      task.dueAt = dto.dueAt ? new Date(dto.dueAt) : null;
    }
    if (dto.completedAt !== undefined) {
      task.completedAt = dto.completedAt ? new Date(dto.completedAt) : null;
    }
    if (dto.metadata !== undefined) task.metadata = dto.metadata;
    return this.taskRepo.save(task);
  }

  /**
   * Reminders with due date from start of today through end of today + extraDays (UTC).
   */
  async findRemindersDueWithinDaysFromToday(
    extraDaysAfterToday: number,
  ): Promise<Task[]> {
    const now = new Date();
    const startToday = startOfUtcDay(now);
    const endExclusive = addUtcDays(startToday, extraDaysAfterToday + 1);
    return this.taskRepo
      .createQueryBuilder('t')
      .where('t.type = :type', { type: 'reminder' })
      .andWhere('t.status NOT IN (:...closed)', {
        closed: ['done', 'cancelled'],
      })
      .andWhere('t.due_at IS NOT NULL')
      .andWhere('t.due_at >= :startToday', { startToday })
      .andWhere('t.due_at < :endExclusive', { endExclusive })
      .orderBy('t.due_at', 'ASC')
      .getMany();
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
  }
}
