import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { OutreachSource, OutreachStatus } from './outreach.entity';

const SOURCES: OutreachSource[] = [
  'warm',
  'cold',
  'linkedin',
  'event',
  'referral',
];

const STATUSES: OutreachStatus[] = [
  'queued',
  'contacted',
  'responded',
  'booked',
  'closed',
];

export class CreateOutreachContactDto {
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  company?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  role?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(998)
  linkedinUrl?: string;

  @IsEnum(SOURCES)
  source!: OutreachSource;

  @IsOptional()
  @IsEnum(STATUSES)
  status?: OutreachStatus;

  @IsOptional()
  @IsDateString()
  lastContactedAt?: string;

  @IsOptional()
  @IsDateString()
  lastReplyAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  tags?: string[];
}

export class UpdateOutreachContactDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  company?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  role?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(998)
  linkedinUrl?: string;

  @IsOptional()
  @IsEnum(SOURCES)
  source?: OutreachSource;

  @IsOptional()
  @IsEnum(STATUSES)
  status?: OutreachStatus;

  @IsOptional()
  @IsDateString()
  lastContactedAt?: string;

  @IsOptional()
  @IsDateString()
  lastReplyAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  tags?: string[];
}
