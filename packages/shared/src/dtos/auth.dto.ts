export interface IRegisterDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface ILoginDto {
  email: string;
  password: string;
}

export interface IRefreshTokenDto {
  refreshToken: string;
}

export interface IForgotPasswordDto {
  email: string;
}

export interface IResetPasswordDto {
  token: string;
  password: string;
}

export interface IChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
