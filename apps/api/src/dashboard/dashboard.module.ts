import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../tasks/task.entity';
import { LinkedInPost } from '../linkedin-posts/linkedin-post.entity';
import { MailMessage } from '../mail/mail.entity';
import { OutreachModule } from '../outreach/outreach.module';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, LinkedInPost, MailMessage]),
    OutreachModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
