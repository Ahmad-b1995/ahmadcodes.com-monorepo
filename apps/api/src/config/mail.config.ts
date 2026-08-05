import { registerAs } from '@nestjs/config';

export interface MailInboundConfig {
  /** Shared secret for POST /mail/inbound (X-Inbound-Secret header). */
  inboundSecret: string;
}

export default registerAs<MailInboundConfig>('mail', () => ({
  inboundSecret: process.env.INBOUND_MAIL_SECRET ?? '',
}));
