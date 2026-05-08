import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const splitCommaList = (value: unknown): string[] | unknown => {
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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;

  @IsOptional()
  @IsString()
  direction?: 'sent' | 'received';

  @IsOptional()
  @IsString()
  status?: 'queued' | 'sent' | 'failed' | 'received';
}
