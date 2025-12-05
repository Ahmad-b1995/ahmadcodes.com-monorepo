import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
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

  // Check if SSL should be enabled via environment variable
  const databaseSsl = process.env.DATABASE_SSL;

  let sslConfig: boolean | { rejectUnauthorized: boolean } = false;

  if (databaseSsl === 'true' || databaseSsl === 'require') {
    sslConfig = { rejectUnauthorized: false };
  }

  const config = {
    type: 'postgres' as const,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    logging: process.env.NODE_ENV === 'development',
    ssl: sslConfig,
  };

  // Log connection details (without password)
  console.log('Database Configuration:', {
    host: config.host,
    port: config.port,
    username: config.username,
    database: config.database,
    ssl: config.ssl,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_SSL: process.env.DATABASE_SSL,
  });

  return config;
});
