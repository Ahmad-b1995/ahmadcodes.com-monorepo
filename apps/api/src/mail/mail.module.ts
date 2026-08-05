import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import mailConfig from '../config/mail.config';
import smtpConfig from '../config/smtp.config';
import { MailInboundController } from './mail-inbound.controller';
import { MailController } from './mail.controller';
import { MailMessage } from './mail.entity';
import { MailService } from './mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailMessage]),
    ConfigModule.forFeature(smtpConfig),
    ConfigModule.forFeature(mailConfig),
  ],
  controllers: [MailController, MailInboundController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
