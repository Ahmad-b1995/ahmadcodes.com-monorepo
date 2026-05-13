import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutreachContact } from './outreach.entity';
import { CreateOutreachContactDto, UpdateOutreachContactDto } from './outreach.dto';

@Injectable()
export class OutreachService {
  constructor(
    @InjectRepository(OutreachContact)
    private readonly repo: Repository<OutreachContact>,
  ) {}

  async create(dto: CreateOutreachContactDto): Promise<OutreachContact> {
    const row = this.repo.create({
      name: dto.name,
      company: dto.company ?? '',
      role: dto.role ?? '',
      email: dto.email ?? '',
      linkedinUrl: dto.linkedinUrl ?? null,
      source: dto.source,
      status: dto.status ?? 'queued',
      lastContactedAt: dto.lastContactedAt
        ? new Date(dto.lastContactedAt)
        : null,
      lastReplyAt: dto.lastReplyAt ? new Date(dto.lastReplyAt) : null,
      notes: dto.notes ?? '',
      tags: dto.tags ?? [],
    });
    return this.repo.save(row);
  }

  async findAll(): Promise<OutreachContact[]> {
    return this.repo.find({ order: { updatedAt: 'DESC' } });
  }

  async findOverdue(): Promise<OutreachContact[]> {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    return this.repo
      .createQueryBuilder('c')
      .where('c.status = :status', { status: 'contacted' })
      .andWhere('c.last_contacted_at IS NOT NULL')
      .andWhere('c.last_contacted_at < :cutoff', { cutoff })
      .andWhere('c.last_reply_at IS NULL')
      .orderBy('c.last_contacted_at', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<OutreachContact> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Outreach contact ${id} not found`);
    }
    return row;
  }

  async update(
    id: number,
    dto: UpdateOutreachContactDto,
  ): Promise<OutreachContact> {
    const row = await this.findOne(id);
    if (dto.name !== undefined) row.name = dto.name;
    if (dto.company !== undefined) row.company = dto.company;
    if (dto.role !== undefined) row.role = dto.role;
    if (dto.email !== undefined) row.email = dto.email;
    if (dto.linkedinUrl !== undefined) {
      row.linkedinUrl = dto.linkedinUrl ?? null;
    }
    if (dto.source !== undefined) row.source = dto.source;
    if (dto.status !== undefined) row.status = dto.status;
    if (dto.lastContactedAt !== undefined) {
      row.lastContactedAt = dto.lastContactedAt
        ? new Date(dto.lastContactedAt)
        : null;
    }
    if (dto.lastReplyAt !== undefined) {
      row.lastReplyAt = dto.lastReplyAt ? new Date(dto.lastReplyAt) : null;
    }
    if (dto.notes !== undefined) row.notes = dto.notes;
    if (dto.tags !== undefined) row.tags = dto.tags;
    return this.repo.save(row);
  }

  async remove(id: number): Promise<void> {
    const row = await this.findOne(id);
    await this.repo.remove(row);
  }
}
