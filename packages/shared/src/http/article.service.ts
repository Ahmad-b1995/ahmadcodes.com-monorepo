import { HttpClient, PaginatedResponse } from './client';
import type { IArticle, ICreateArticleDto, IUpdateArticleDto } from '../dtos/article.dto';

export interface ArticleFilters {
  page?: number;
  limit?: number;
  search?: string;
  published?: boolean;
  tags?: string[];
}

export class ArticleService {
  constructor(private client: HttpClient) {}

  async getArticles(filters?: ArticleFilters): Promise<PaginatedResponse<IArticle>> {
    return this.client.get<PaginatedResponse<IArticle>>('/articles', {
      params: filters,
    });
  }

  async getArticle(id: string): Promise<IArticle> {
    return this.client.get<IArticle>(`/articles/${id}`);
  }

  async getArticleBySlug(slug: string): Promise<IArticle> {
    return this.client.get<IArticle>(`/articles/slug/${slug}`);
  }

  async createArticle(data: ICreateArticleDto): Promise<IArticle> {
    return this.client.post<IArticle>('/articles', data);
  }

  async updateArticle(id: string, data: IUpdateArticleDto): Promise<IArticle> {
    return this.client.patch<IArticle>(`/articles/${id}`, data);
  }

  async deleteArticle(id: string): Promise<void> {
    await this.client.delete(`/articles/${id}`);
  }

  async publishArticle(id: string): Promise<IArticle> {
    return this.client.patch<IArticle>(`/articles/${id}/publish`, {});
  }

  async unpublishArticle(id: string): Promise<IArticle> {
    return this.client.patch<IArticle>(`/articles/${id}/unpublish`, {});
  }
}

