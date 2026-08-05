import { HttpClient, PaginatedResponse } from './client';
import type {
  ICreateMemoryNoteDto,
  IMemoryNote,
  IMemoryNoteListQuery,
  IUpdateMemoryNoteDto,
} from '../dtos/daily-planning.dto';

export class MemoryNoteHttpService {
  constructor(private client: HttpClient) {}

  async list(
    query?: IMemoryNoteListQuery,
  ): Promise<PaginatedResponse<IMemoryNote>> {
    return this.client.get<PaginatedResponse<IMemoryNote>>('/memory-notes', {
      params: query,
    });
  }

  async create(data: ICreateMemoryNoteDto): Promise<IMemoryNote> {
    return this.client.post<IMemoryNote>('/memory-notes', data);
  }

  async update(id: number, data: IUpdateMemoryNoteDto): Promise<IMemoryNote> {
    return this.client.patch<IMemoryNote>(`/memory-notes/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/memory-notes/${id}`);
  }
}
