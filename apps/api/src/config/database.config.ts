import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
  // Check if SSL should be enabled via environment variable
  const databaseSsl = process.env.DATABASE_SSL;

  let sslConfig: boolean | { rejectUnauthorized: boolean } = false;

  if (databaseSsl === 'true' || databaseSsl === 'require') {
    sslConfig = { rejectUnauthorized: false };
  }

  const config = {
    type: 'postgres' as const,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'flowhq_db',
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
