import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './goal.entity';
import { CreateGoalDto, UpdateGoalDto } from './goal.dto';

@Injectable()
export class GoalService {
  private readonly logger = new Logger(GoalService.name);

  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}

  async create(dto: CreateGoalDto): Promise<Goal> {
    const row = this.goalRepository.create({
      title: dto.title,
      description: dto.description ?? '',
      priority: dto.priority,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
      active: dto.active ?? true,
      metadata: dto.metadata ?? {},
    });
    const saved = await this.goalRepository.save(row);
    this.logger.log(`Created goal ${saved.id}`);
    return saved;
  }

  async findAll(): Promise<Goal[]> {
    return this.goalRepository
      .createQueryBuilder('g')
      .orderBy(
        `CASE g.priority
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
          ELSE 5 END`,
        'ASC',
      )
      .addOrderBy('g.targetDate', 'ASC', 'NULLS LAST')
      .addOrderBy('g.id', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Goal> {
    const goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Goal ${id} not found`);
    }
    return goal;
  }

  async update(id: number, dto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.findOne(id);
    if (dto.title !== undefined) {
      goal.title = dto.title;
    }
    if (dto.description !== undefined) {
      goal.description = dto.description;
    }
    if (dto.priority !== undefined) {
      goal.priority = dto.priority;
    }
    if (dto.targetDate !== undefined) {
      goal.targetDate =
        dto.targetDate === null ? null : new Date(dto.targetDate);
    }
    if (dto.active !== undefined) {
      goal.active = dto.active;
    }
    if (dto.metadata !== undefined) {
      goal.metadata = dto.metadata;
    }
    return this.goalRepository.save(goal);
  }

  async remove(id: number): Promise<void> {
    const res = await this.goalRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`Goal ${id} not found`);
    }
  }
}
