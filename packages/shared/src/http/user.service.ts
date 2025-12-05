import { HttpClient } from './client';
import type { IUser, ICreateUserDto, IUpdateUserDto } from '../dtos/user.dto';

export class UserService {
  constructor(private client: HttpClient) {}

  async getUsers(): Promise<IUser[]> {
    return this.client.get<IUser[]>('/users');
  }

  async getUser(id: string): Promise<IUser> {
    return this.client.get<IUser>(`/users/${id}`);
  }

  async createUser(data: ICreateUserDto): Promise<IUser> {
    return this.client.post<IUser>('/users', data);
  }

  async updateUser(id: string, data: IUpdateUserDto): Promise<IUser> {
    return this.client.patch<IUser>(`/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }
}

