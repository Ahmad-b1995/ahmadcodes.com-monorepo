import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { Public } from '../auth/decorators/public.decorator';
import mailConfig from '../config/mail.config';
import { InboundMailDto } from './mail.dto';
import { MailService } from './mail.service';
import { MailMessage } from './mail.entity';

function timingSafeSecretEqual(expected: string, received: string): boolean {
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(received, 'utf8');
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

@Controller('mail')
export class MailInboundController {
  constructor(
    private readonly mailService: MailService,
    @Inject(mailConfig.KEY)
    private readonly mailInbound: ConfigType<typeof mailConfig>,
  ) {}

  @Public()
  @Post('inbound')
  @HttpCode(200)
  async inbound(
    @Headers('x-inbound-secret') secretHeader: string | string[] | undefined,
    @Body() dto: InboundMailDto,
  ): Promise<MailMessage> {
    const configured = this.mailInbound.inboundSecret;
    if (!configured) {
      throw new UnauthorizedException('Inbound mail is not configured');
    }

    const received = firstHeader(secretHeader);
    if (
      received === undefined ||
      !timingSafeSecretEqual(configured, received)
    ) {
      throw new UnauthorizedException('Invalid inbound secret');
    }

    return this.mailService.receiveInbound(dto);
  }
}
