export type OutreachSource =
  | 'warm'
  | 'cold'
  | 'linkedin'
  | 'event'
  | 'referral';

export type OutreachStatus =
  | 'queued'
  | 'contacted'
  | 'responded'
  | 'booked'
  | 'closed';

export interface IOutreachContact {
  id: number;
  name: string;
  company: string;
  role: string;
  email: string;
  linkedinUrl: string | null;
  source: OutreachSource;
  status: OutreachStatus;
  lastContactedAt: string | null;
  lastReplyAt: string | null;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateOutreachContactDto {
  name: string;
  company?: string;
  role?: string;
  email?: string;
  linkedinUrl?: string;
  source: OutreachSource;
  status?: OutreachStatus;
  lastContactedAt?: string;
  lastReplyAt?: string;
  notes?: string;
  tags?: string[];
}

export interface IUpdateOutreachContactDto {
  name?: string;
  company?: string;
  role?: string;
  email?: string;
  linkedinUrl?: string;
  source?: OutreachSource;
  status?: OutreachStatus;
  lastContactedAt?: string;
  lastReplyAt?: string;
  notes?: string;
  tags?: string[];
}
