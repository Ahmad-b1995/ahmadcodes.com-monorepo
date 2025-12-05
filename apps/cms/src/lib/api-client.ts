import { HttpClient, AuthService, ArticleService, UserService, RoleService, UploadService } from '@repo/shared/http';
import type { IRefreshTokenResponse } from '@repo/shared/dtos';
import { useAuthStore } from '@/stores/auth-store';

const httpClient: HttpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4500/api',
  withCredentials: true,
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setTokens: (accessToken: string, refreshToken: string) => {
    useAuthStore.getState().setTokens(accessToken, refreshToken);
  },
  onTokenRefresh: async (refreshToken: string): Promise<IRefreshTokenResponse> => {
    const authService: AuthService = new AuthService(httpClient);
    return authService.refreshTokens(refreshToken);
  },
  onAuthError: () => {
    useAuthStore.getState().reset();
  },
});

export const authService = new AuthService(httpClient);
export const articleService = new ArticleService(httpClient);
export const userService = new UserService(httpClient);
export const roleService = new RoleService(httpClient);
export const uploadService = new UploadService(httpClient);

export { httpClient };

export type { IAuthResponse, IRefreshTokenResponse } from '@repo/shared/dtos';

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

