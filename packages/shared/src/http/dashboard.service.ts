import { HttpClient } from './client';
import type { ICareerSummary } from '../dtos/dashboard.dto';

export class DashboardService {
  constructor(private client: HttpClient) {}

  async getCareerSummary(): Promise<ICareerSummary> {
    return this.client.get<ICareerSummary>('/dashboard/career-summary');
  }
}
