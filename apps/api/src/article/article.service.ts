import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto, UpdateArticleDto } from './article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    // Check for existing slug
    const existingSlug = await this.articleRepository.findOne({
      where: { slug: createArticleDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Article with this slug already exists');
    }

    // Check for existing title
    const existingTitle = await this.articleRepository.findOne({
      where: { title: createArticleDto.title },
    });

    if (existingTitle) {
      throw new ConflictException('Article with this title already exists');
    }

    const article = this.articleRepository.create({
      ...createArticleDto,
      publishedAt: createArticleDto.published ? new Date() : null,
    });

    try {
      return await this.articleRepository.save(article);
    } catch (error) {
      // Handle database unique constraint violations
      if (error.code === '23505') {
        if (error.constraint?.includes('title')) {
          throw new ConflictException('Article with this title already exists');
        }
        if (error.constraint?.includes('slug')) {
          throw new ConflictException('Article with this slug already exists');
        }
        throw new ConflictException('Article with duplicate data already exists');
      }
      throw error;
    }
  }

  async findAll(published?: boolean): Promise<Article[]> {
    const query = this.articleRepository.createQueryBuilder('article');

    if (published !== undefined) {
      query.where('article.published = :published', { published });
    }

    return query.orderBy('article.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { slug } });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.findOne(id);

    // Check for existing slug if it's being changed
    if (updateArticleDto.slug && updateArticleDto.slug !== article.slug) {
      const existingSlug = await this.articleRepository.findOne({
        where: { slug: updateArticleDto.slug },
      });

      if (existingSlug) {
        throw new ConflictException('Article with this slug already exists');
      }
    }

    // Check for existing title if it's being changed
    if (updateArticleDto.title && updateArticleDto.title !== article.title) {
      const existingTitle = await this.articleRepository.findOne({
        where: { title: updateArticleDto.title },
      });

      if (existingTitle) {
        throw new ConflictException('Article with this title already exists');
      }
    }

    if (updateArticleDto.published && !article.published) {
      article.publishedAt = new Date();
    }

    Object.assign(article, updateArticleDto);

    try {
      return await this.articleRepository.save(article);
    } catch (error) {
      // Handle database unique constraint violations
      if (error.code === '23505') {
        if (error.constraint?.includes('title')) {
          throw new ConflictException('Article with this title already exists');
        }
        if (error.constraint?.includes('slug')) {
          throw new ConflictException('Article with this slug already exists');
        }
        throw new ConflictException('Article with duplicate data already exists');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
  }

  async search(query: string): Promise<Article[]> {
    return this.articleRepository
      .createQueryBuilder('article')
      .where('article.title ILIKE :query', { query: `%${query}%` })
      .orWhere('article.content ILIKE :query', { query: `%${query}%` })
      .orWhere('article.excerpt ILIKE :query', { query: `%${query}%` })
      .orderBy('article.createdAt', 'DESC')
      .getMany();
  }

  async findByTag(tag: string): Promise<Article[]> {
    return this.articleRepository
      .createQueryBuilder('article')
      .where(':tag = ANY(article.tags)', { tag })
      .andWhere('article.published = :published', { published: true })
      .orderBy('article.createdAt', 'DESC')
      .getMany();
  }

  async getAllTags(): Promise<string[]> {
    const articles = await this.articleRepository.find({
      select: ['tags'],
    });

    // Extract all unique tags from articles
    const allTags = articles.flatMap((article) => article.tags);
    const uniqueTags = [...new Set(allTags)];

    // Sort alphabetically
    return uniqueTags.sort();
  }
}

