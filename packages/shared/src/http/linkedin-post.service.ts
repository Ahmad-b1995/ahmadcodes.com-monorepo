import { HttpClient } from './client';
import type {
  ICreateLinkedInPostDto,
  ILinkedInPost,
  IMarkLinkedInPostPostedDto,
  IUpdateLinkedInPostDto,
} from '../dtos/linkedin-post.dto';

export class LinkedInPostService {
  constructor(private client: HttpClient) {}

  async list(): Promise<ILinkedInPost[]> {
    return this.client.get<ILinkedInPost[]>('/linkedin-posts');
  }

  async queue(): Promise<ILinkedInPost[]> {
    return this.client.get<ILinkedInPost[]>('/linkedin-posts/queue');
  }

  async get(id: number): Promise<ILinkedInPost> {
    return this.client.get<ILinkedInPost>(`/linkedin-posts/${id}`);
  }

  async create(data: ICreateLinkedInPostDto): Promise<ILinkedInPost> {
    return this.client.post<ILinkedInPost>('/linkedin-posts', data);
  }

  async update(id: number, data: IUpdateLinkedInPostDto): Promise<ILinkedInPost> {
    return this.client.patch<ILinkedInPost>(`/linkedin-posts/${id}`, data);
  }

  async markPosted(
    id: number,
    data: IMarkLinkedInPostPostedDto,
  ): Promise<ILinkedInPost> {
    return this.client.post<ILinkedInPost>(
      `/linkedin-posts/${id}/mark-posted`,
      data,
    );
  }

  async remove(id: number): Promise<void> {
    await this.client.delete(`/linkedin-posts/${id}`);
  }
}
