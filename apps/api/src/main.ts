import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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


  if (!process.env.CORS_ORIGINS) {
    throw new Error('CORS_ORIGINS environment variable is required');
  }
  
  const corsOrigins = process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  if (!process.env.API_PORT) {
    throw new Error('API_PORT environment variable is required');
  }
  
  const port = parseInt(process.env.API_PORT, 10);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`,
  );
}

bootstrap();
