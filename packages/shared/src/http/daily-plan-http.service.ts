import { HttpClient } from './client';
import type {
  IDailyPlanBundle,
  IDailyPlanFeedbackDto,
} from '../dtos/daily-planning.dto';

export interface IDailyPlanQuery {
  date?: string;
  availableMinutes?: number;
}

export class DailyPlanHttpService {
  constructor(private client: HttpClient) {}

  async generate(query?: IDailyPlanQuery): Promise<IDailyPlanBundle> {
    return this.client.post<IDailyPlanBundle>(
      '/daily-plan/generate',
      {},
      {
        params: query,
      },
    );
  }

  async get(query?: IDailyPlanQuery): Promise<IDailyPlanBundle> {
    return this.client.get<IDailyPlanBundle>('/daily-plan', { params: query });
  }

  async feedback(body: IDailyPlanFeedbackDto): Promise<IDailyPlanBundle> {
    return this.client.post<IDailyPlanBundle>('/daily-plan/feedback', body);
  }
}
