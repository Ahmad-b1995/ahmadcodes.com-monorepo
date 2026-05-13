import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLinkedInPostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  hashtags?: string[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsDateString()
  postedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(998)
  externalUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(998)
  imageUrl?: string;

  @IsOptional()
  @IsObject()
  engagement?: Record<string, unknown>;
}

export class UpdateLinkedInPostDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  hashtags?: string[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsDateString()
  postedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(998)
  externalUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(998)
  imageUrl?: string;

  @IsOptional()
  @IsObject()
  engagement?: Record<string, unknown>;
}

export class MarkLinkedInPostPostedDto {
  @IsOptional()
  @IsString()
  @MaxLength(998)
  externalUrl?: string;
}
