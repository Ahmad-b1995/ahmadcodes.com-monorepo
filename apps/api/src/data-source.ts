import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

// Required environment variables
if (!process.env.DATABASE_HOST) {
  throw new Error('DATABASE_HOST environment variable is required');
}
if (!process.env.DATABASE_PORT) {
  throw new Error('DATABASE_PORT environment variable is required');
}
if (!process.env.DATABASE_USERNAME) {
  throw new Error('DATABASE_USERNAME environment variable is required');
}
if (!process.env.DATABASE_PASSWORD) {
  throw new Error('DATABASE_PASSWORD environment variable is required');
}
if (!process.env.DATABASE_NAME) {
  throw new Error('DATABASE_NAME environment variable is required');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

