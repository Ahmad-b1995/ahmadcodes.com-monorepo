import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  if (!process.env.JWT_EXPIRES_IN) {
    throw new Error('JWT_EXPIRES_IN environment variable is required');
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET environment variable is required');
  }
  if (!process.env.JWT_REFRESH_EXPIRES_IN) {
    throw new Error('JWT_REFRESH_EXPIRES_IN environment variable is required');
  }

  return {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  };
});
