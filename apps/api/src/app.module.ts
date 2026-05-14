import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { ArticleModule } from './article/article.module';
import { MailModule } from './mail/mail.module';
import { TaskModule } from './tasks/task.module';
import { LinkedInPostModule } from './linkedin-posts/linkedin-post.module';
import { OutreachModule } from './outreach/outreach.module';
import { DigestModule } from './digest/digest.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UploadModule } from './upload/upload.module';
import { SeedModule } from './seed/seed.module';
import { DailyPlanModule } from './daily-plan/daily-plan.module';
import { LlmModule } from './llm/llm.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import s3Config from './config/s3.config';
import smtpConfig from './config/smtp.config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, s3Config, smtpConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (config: TypeOrmModuleOptions) => config,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    ArticleModule,
    MailModule,
    TaskModule,
    LinkedInPostModule,
    OutreachModule,
    DigestModule,
    DashboardModule,
    UploadModule,
    SeedModule,
    DailyPlanModule,
    LlmModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
