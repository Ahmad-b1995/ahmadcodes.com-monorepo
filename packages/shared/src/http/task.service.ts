import { HttpClient } from './client';
import type {
  ICreateTaskDto,
  ITask,
  ITaskListQuery,
  IUpdateTaskDto,
} from '../dtos/task.dto';

export class TaskService {
  constructor(private client: HttpClient) {}

  async list(query?: ITaskListQuery): Promise<ITask[]> {
    return this.client.get<ITask[]>('/tasks', { params: query });
  }

  async get(id: number): Promise<ITask> {
    return this.client.get<ITask>(`/tasks/${id}`);
  }

  async create(data: ICreateTaskDto): Promise<ITask> {
    return this.client.post<ITask>('/tasks', data);
  }

  async update(id: number, data: IUpdateTaskDto): Promise<ITask> {
    return this.client.patch<ITask>(`/tasks/${id}`, data);
  }

  async remove(id: number): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }
}
