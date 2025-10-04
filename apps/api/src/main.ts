import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Log environment variables
  Logger.log('=== Environment Configuration ===');
  Logger.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  Logger.log(`APP_PORT: ${process.env.APP_PORT || 4500}`);
  Logger.log(`DATABASE_HOST: ${process.env.DATABASE_HOST || 'localhost'}`);
  Logger.log(`DATABASE_PORT: ${process.env.DATABASE_PORT || '5432'}`);
  Logger.log(`DATABASE_NAME: ${process.env.DATABASE_NAME || 'flowhq_db'}`);
  Logger.log(`DATABASE_USERNAME: ${process.env.DATABASE_USERNAME || 'postgres'}`);
  Logger.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  Logger.log('=================================');

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FlowHQ API')
    .setDescription('API for FlowHQ')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : [
            'http://localhost:3000',
            'http://localhost:4200',
            'http://localhost:7000',
          ],
    credentials: true,
  });

  const port = process.env.APP_PORT || 4500;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
