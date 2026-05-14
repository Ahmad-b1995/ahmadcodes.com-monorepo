import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { MemoryNote } from './memory-note.entity';
import { CreateMemoryNoteDto, UpdateMemoryNoteDto } from './memory-note.dto';

@Injectable()
export class MemoryNoteService {
  constructor(
    @InjectRepository(MemoryNote)
    private readonly memoryNoteRepository: Repository<MemoryNote>,
  ) {}

  async create(dto: CreateMemoryNoteDto): Promise<MemoryNote> {
    const row = this.memoryNoteRepository.create({
      content: dto.content,
      tags: dto.tags ?? [],
      pinned: dto.pinned ?? false,
    });
    return this.memoryNoteRepository.save(row);
  }

  async findAllPaginated(
    options: IPaginationOptions,
    filters: { tag?: string; pinned?: boolean },
  ): Promise<Pagination<MemoryNote>> {
    const qb = this.memoryNoteRepository
      .createQueryBuilder('m')
      .orderBy('m.pinned', 'DESC')
      .addOrderBy('m.createdAt', 'DESC');

    if (filters.tag != null && filters.tag !== '') {
      qb.andWhere(':tag = ANY(m.tags)', { tag: filters.tag });
    }
    if (filters.pinned === true || filters.pinned === false) {
      qb.andWhere('m.pinned = :pinned', { pinned: filters.pinned });
    }

    return paginate<MemoryNote>(qb, options);
  }

  async findRecentForLlm(since: Date): Promise<MemoryNote[]> {
    return this.memoryNoteRepository
      .createQueryBuilder('m')
      .where('m.createdAt >= :since', { since })
      .orderBy('m.pinned', 'DESC')
      .addOrderBy('m.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<MemoryNote> {
    const row = await this.memoryNoteRepository.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Memory note ${id} not found`);
    }
    return row;
  }

  async update(id: number, dto: UpdateMemoryNoteDto): Promise<MemoryNote> {
    const row = await this.findOne(id);
    if (dto.content !== undefined) {
      row.content = dto.content;
    }
    if (dto.tags !== undefined) {
      row.tags = dto.tags;
    }
    if (dto.pinned !== undefined) {
      row.pinned = dto.pinned;
    }
    return this.memoryNoteRepository.save(row);
  }

  async remove(id: number): Promise<void> {
    const res = await this.memoryNoteRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`Memory note ${id} not found`);
    }
  }
}
