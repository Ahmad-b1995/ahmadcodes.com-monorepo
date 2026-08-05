import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { TaskModule } from '../tasks/task.module';
import { LinkedInPostModule } from '../linkedin-posts/linkedin-post.module';
import { OutreachModule } from '../outreach/outreach.module';
import { DigestService } from './digest.service';

@Module({
  imports: [MailModule, TaskModule, LinkedInPostModule, OutreachModule],
  providers: [DigestService],
})
export class DigestModule {}
