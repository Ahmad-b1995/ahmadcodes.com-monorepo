import {
  HttpClient,
  AuthService,
  ArticleService,
  MailService,
  UserService,
  RoleService,
  UploadService,
  TaskService,
  LinkedInPostService,
  OutreachService,
  DashboardService,
  GoalPlanService,
  PlanTaskAdminService,
  DailyPlanHttpService,
  MemoryNoteHttpService,
} from '@repo/shared/http';
import type { IRefreshTokenResponse } from '@repo/shared/dtos';
import { useAuthStore } from '@/stores/auth-store';

const httpClient: HttpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL!,
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
export const mailService = new MailService(httpClient);
export const userService = new UserService(httpClient);
export const roleService = new RoleService(httpClient);
export const uploadService = new UploadService(httpClient);
export const taskService = new TaskService(httpClient);
export const linkedInPostService = new LinkedInPostService(httpClient);
export const outreachService = new OutreachService(httpClient);
export const dashboardService = new DashboardService(httpClient);
export const goalPlanService = new GoalPlanService(httpClient);
export const planTaskAdminService = new PlanTaskAdminService(httpClient);
export const dailyPlanHttpService = new DailyPlanHttpService(httpClient);
export const memoryNoteHttpService = new MemoryNoteHttpService(httpClient);

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

