export type MailDirection = 'sent' | 'received';
export type MailStatus = 'queued' | 'sent' | 'failed' | 'received';

export interface IMailMessage {
  id: number;
  direction: MailDirection;
  status: MailStatus;
  fromAddress: string;
  toAddresses: string[];
  ccAddresses: string[];
  bccAddresses: string[];
  subject: string;
  bodyHtml: string;
  bodyText: string;
  messageId: string | null;
  inReplyTo: string | null;
  error: string | null;
  sentAt: string | null;
  receivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISendMailDto {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  inReplyTo?: string;
}

export interface IMailListFilters {
  direction?: MailDirection;
  status?: MailStatus;
  page?: number;
  limit?: number;
}
