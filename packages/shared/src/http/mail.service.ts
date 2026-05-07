import { HttpClient, PaginatedResponse } from './client';
import type {
  IMailListFilters,
  IMailMessage,
  ISendMailDto,
} from '../dtos/mail.dto';

export class MailService {
  constructor(private client: HttpClient) {}

  async list(
    filters?: IMailListFilters,
  ): Promise<PaginatedResponse<IMailMessage>> {
    return this.client.get<PaginatedResponse<IMailMessage>>('/mail', {
      params: filters,
    });
  }

  async findOne(id: number): Promise<IMailMessage> {
    return this.client.get<IMailMessage>(`/mail/${id}`);
  }

  async send(payload: ISendMailDto): Promise<IMailMessage> {
    return this.client.post<IMailMessage>('/mail/send', payload);
  }

  async verify(): Promise<{ ok: true; host: string }> {
    return this.client.post<{ ok: true; host: string }>('/mail/verify', {});
  }

  async remove(id: number): Promise<void> {
    await this.client.delete(`/mail/${id}`);
  }
}
