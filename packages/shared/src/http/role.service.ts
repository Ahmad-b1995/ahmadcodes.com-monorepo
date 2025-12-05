import { HttpClient } from './client';
import type { IRole, ICreateRoleDto, IUpdateRoleDto } from '../dtos/role.dto';

export class RoleService {
  constructor(private client: HttpClient) {}

  async getRoles(): Promise<IRole[]> {
    return this.client.get<IRole[]>('/roles');
  }

  async getRole(id: string): Promise<IRole> {
    return this.client.get<IRole>(`/roles/${id}`);
  }

  async createRole(data: ICreateRoleDto): Promise<IRole> {
    return this.client.post<IRole>('/roles', data);
  }

  async updateRole(id: string, data: IUpdateRoleDto): Promise<IRole> {
    return this.client.patch<IRole>(`/roles/${id}`, data);
  }

  async deleteRole(id: string): Promise<void> {
    await this.client.delete(`/roles/${id}`);
  }
}

