import { HttpClient } from './client';
import type {
  ILoginDto,
  IRegisterDto,
  IAuthResponse,
  IRefreshTokenResponse,
  IUserProfile,
} from '../dtos/auth.dto';

export class AuthService {
  constructor(private client: HttpClient) {}

  async login(credentials: ILoginDto): Promise<IAuthResponse> {
    return this.client.post<IAuthResponse>('/auth/login', credentials);
  }

  async register(data: IRegisterDto): Promise<IAuthResponse> {
    return this.client.post<IAuthResponse>('/auth/register', data);
  }

  async refreshTokens(refreshToken: string): Promise<IRefreshTokenResponse> {
    return this.client.post<IRefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.client.post('/auth/logout', { refreshToken });
  }

  async getProfile(): Promise<IUserProfile> {
    return this.client.get<IUserProfile>('/auth/me');
  }

  async forgotPassword(email: string): Promise<void> {
    await this.client.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await this.client.post('/auth/reset-password', { token, password });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.client.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }
}

