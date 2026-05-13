import { HttpClient } from './client';
import type {
  ICreateOutreachContactDto,
  IOutreachContact,
  IUpdateOutreachContactDto,
} from '../dtos/outreach.dto';

export class OutreachService {
  constructor(private client: HttpClient) {}

  async list(): Promise<IOutreachContact[]> {
    return this.client.get<IOutreachContact[]>('/outreach');
  }

  async overdue(): Promise<IOutreachContact[]> {
    return this.client.get<IOutreachContact[]>('/outreach/overdue');
  }

  async get(id: number): Promise<IOutreachContact> {
    return this.client.get<IOutreachContact>(`/outreach/${id}`);
  }

  async create(data: ICreateOutreachContactDto): Promise<IOutreachContact> {
    return this.client.post<IOutreachContact>('/outreach', data);
  }

  async update(
    id: number,
    data: IUpdateOutreachContactDto,
  ): Promise<IOutreachContact> {
    return this.client.patch<IOutreachContact>(`/outreach/${id}`, data);
  }

  async remove(id: number): Promise<void> {
    await this.client.delete(`/outreach/${id}`);
  }
}
