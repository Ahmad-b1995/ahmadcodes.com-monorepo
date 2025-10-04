import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IArticleImage,
  ICreateArticleDto,
  IUpdateArticleDto,
  IArticleResponseDto,
} from '@repo/shared/dtos';

export class ArticleImage implements IArticleImage {
  @IsString()
  @IsNotEmpty()
  alt!: string;

  @IsString()
  @IsNotEmpty()
  src!: string;
}

export class CreateArticleDto implements ICreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  excerpt!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ArticleImage)
  image!: ArticleImage;

  @IsString()
  @IsNotEmpty()
  metaDescription!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class UpdateArticleDto implements IUpdateArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ArticleImage)
  @IsOptional()
  image?: ArticleImage;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class ArticleResponseDto implements IArticleResponseDto {
  id!: number;
  title!: string;
  slug!: string;
  content!: string;
  excerpt!: string;
  image!: ArticleImage;
  published!: boolean;
  createdAt!: string;
  publishedAt!: string;
  metaDescription!: string;
  tags!: string[];
}

