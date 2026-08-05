import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

const splitCommaList = (value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

export class SendMailDto {
  @IsArray({ message: 'to must be an array of email addresses' })
  @ArrayUnique()
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true })
  @Transform(({ value }) => splitCommaList(value), { toClassOnly: true })
  to!: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true })
  @Transform(({ value }) => splitCommaList(value), { toClassOnly: true })
  cc?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true })
  @Transform(({ value }) => splitCommaList(value), { toClassOnly: true })
  bcc?: string[];

  @IsString()
  @MinLength(1)
  @MaxLength(998)
  subject!: string;

  /**
   * Rich-text HTML body (TipTap output).
   */
  @IsString()
  bodyHtml!: string;

  /**
   * Plain-text fallback body. Optional — derived from bodyHtml when not provided.
   */
  @IsOptional()
  @IsString()
  bodyText?: string;

  /**
   * If replying to an existing inbound message, set this to the source's
   * Message-ID header so the new send threads correctly.
   */
  @IsOptional()
  @IsString()
  @MaxLength(998)
  inReplyTo?: string;
}

export class ListMailQueryDto {
  @IsOptional()
  @IsString()
  direction?: 'sent' | 'received';

  @IsOptional()
  @IsString()
  status?: 'queued' | 'sent' | 'failed' | 'received';
}

/**
 * Inbound payload from Email Worker / trusted integrations.
 * Addresses may include display names; validated as non-empty strings within DB limits.
 */
export class InboundMailDto {
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  fromAddress!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(320, { each: true })
  @MinLength(1, { each: true })
  @Transform(({ value }) => splitCommaList(value), { toClassOnly: true })
  toAddresses!: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(320, { each: true })
  @Transform(({ value }) => splitCommaList(value), { toClassOnly: true })
  ccAddresses?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(320, { each: true })
  @Transform(({ value }) => splitCommaList(value), { toClassOnly: true })
  bccAddresses?: string[];

  @IsString()
  @MinLength(1)
  subject!: string;

  @IsOptional()
  @IsString()
  bodyHtml?: string;

  @IsOptional()
  @IsString()
  bodyText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(998)
  messageId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(998)
  inReplyTo?: string;

  @IsOptional()
  @IsObject()
  headers?: Record<string, unknown>;
}
