import { HttpClient } from './client';
import type {
  ICreatePlanTaskDto,
  IPlanTask,
  IPlanTaskListQuery,
  IUpdatePlanTaskDto,
} from '../dtos/daily-planning.dto';

export class PlanTaskAdminService {
  constructor(private client: HttpClient) {}

  async list(query?: IPlanTaskListQuery): Promise<IPlanTask[]> {
    return this.client.get<IPlanTask[]>('/plan-tasks', { params: query });
  }

  async get(id: number): Promise<IPlanTask> {
    return this.client.get<IPlanTask>(`/plan-tasks/${id}`);
  }

  async create(data: ICreatePlanTaskDto): Promise<IPlanTask> {
    return this.client.post<IPlanTask>('/plan-tasks', data);
  }

  async update(id: number, data: IUpdatePlanTaskDto): Promise<IPlanTask> {
    return this.client.patch<IPlanTask>(`/plan-tasks/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/plan-tasks/${id}`);
  }
}
