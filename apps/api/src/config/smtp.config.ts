import { registerAs } from '@nestjs/config';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromAddress: string;
  fromName: string;
}

export default registerAs<SmtpConfig>('smtp', () => {
  const host = process.env.SMTP_HOST ?? '';
  const portRaw = process.env.SMTP_PORT ?? '587';
  const user = process.env.SMTP_USER ?? '';
  const password = process.env.SMTP_PASSWORD ?? '';
  const fromAddress = process.env.SMTP_FROM_ADDRESS ?? user;
  const fromName = process.env.SMTP_FROM_NAME ?? 'Ahmad Bagheri';

  const port = Number.parseInt(portRaw, 10);
  // Convention: port 465 = implicit TLS (`secure: true`); 587/2525 = STARTTLS (`secure: false`).
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  return {
    host,
    port,
    secure,
    user,
    password,
    fromAddress,
    fromName,
  };
});
