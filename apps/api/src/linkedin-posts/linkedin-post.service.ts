import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkedInPost } from './linkedin-post.entity';
import {
  CreateLinkedInPostDto,
  MarkLinkedInPostPostedDto,
  UpdateLinkedInPostDto,
} from './linkedin-post.dto';

@Injectable()
export class LinkedInPostService {
  constructor(
    @InjectRepository(LinkedInPost)
    private readonly repo: Repository<LinkedInPost>,
  ) {}

  async create(dto: CreateLinkedInPostDto): Promise<LinkedInPost> {
    const row = this.repo.create({
      title: dto.title,
      body: dto.body ?? '',
      hashtags: dto.hashtags ?? [],
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      postedAt: dto.postedAt ? new Date(dto.postedAt) : null,
      externalUrl: dto.externalUrl ?? null,
      imageUrl: dto.imageUrl ?? null,
      engagement: dto.engagement ?? {},
    });
    return this.repo.save(row);
  }

  async findAll(): Promise<LinkedInPost[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findQueue(): Promise<LinkedInPost[]> {
    const now = new Date();
    const until = new Date(now);
    until.setUTCDate(until.getUTCDate() + 7);
    return this.repo
      .createQueryBuilder('p')
      .where('p.posted_at IS NULL')
      .andWhere('p.scheduled_at IS NOT NULL')
      .andWhere('p.scheduled_at >= :now', { now })
      .andWhere('p.scheduled_at <= :until', { until })
      .orderBy('p.scheduled_at', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<LinkedInPost> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException(`LinkedIn post ${id} not found`);
    }
    return row;
  }

  async update(id: number, dto: UpdateLinkedInPostDto): Promise<LinkedInPost> {
    const row = await this.findOne(id);
    if (dto.title !== undefined) row.title = dto.title;
    if (dto.body !== undefined) row.body = dto.body;
    if (dto.hashtags !== undefined) row.hashtags = dto.hashtags;
    if (dto.scheduledAt !== undefined) {
      row.scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : null;
    }
    if (dto.postedAt !== undefined) {
      row.postedAt = dto.postedAt ? new Date(dto.postedAt) : null;
    }
    if (dto.externalUrl !== undefined) {
      row.externalUrl = dto.externalUrl ?? null;
    }
    if (dto.imageUrl !== undefined) {
      row.imageUrl = dto.imageUrl ?? null;
    }
    if (dto.engagement !== undefined) row.engagement = dto.engagement;
    return this.repo.save(row);
  }

  async markPosted(
    id: number,
    dto: MarkLinkedInPostPostedDto,
  ): Promise<LinkedInPost> {
    const row = await this.findOne(id);
    row.postedAt = new Date();
    if (dto.externalUrl !== undefined && dto.externalUrl !== '') {
      row.externalUrl = dto.externalUrl;
    }
    return this.repo.save(row);
  }

  async remove(id: number): Promise<void> {
    const row = await this.findOne(id);
    await this.repo.remove(row);
  }
}
