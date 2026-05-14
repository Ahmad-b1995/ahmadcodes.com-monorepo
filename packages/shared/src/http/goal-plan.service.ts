import { HttpClient } from './client';
import type {
  ICreatePlanningGoalDto,
  IPlanningGoal,
  IUpdatePlanningGoalDto,
} from '../dtos/daily-planning.dto';

export class GoalPlanService {
  constructor(private client: HttpClient) {}

  async list(): Promise<IPlanningGoal[]> {
    return this.client.get<IPlanningGoal[]>('/goals');
  }

  async get(id: number): Promise<IPlanningGoal> {
    return this.client.get<IPlanningGoal>(`/goals/${id}`);
  }

  async create(data: ICreatePlanningGoalDto): Promise<IPlanningGoal> {
    return this.client.post<IPlanningGoal>('/goals', data);
  }

  async update(
    id: number,
    data: IUpdatePlanningGoalDto,
  ): Promise<IPlanningGoal> {
    return this.client.patch<IPlanningGoal>(`/goals/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    await this.client.delete(`/goals/${id}`);
  }
}
