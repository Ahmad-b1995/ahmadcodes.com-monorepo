import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import {
  ICreatePermissionDto,
  IUpdatePermissionDto,
  IPermissionResponseDto,
} from '@repo/shared/dtos';

export class CreatePermissionDto implements ICreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  resource?: string;

  @IsString()
  @IsOptional()
  action?: string;
}

export class UpdatePermissionDto implements IUpdatePermissionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  resource?: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class PermissionResponseDto implements IPermissionResponseDto {
  id!: string;
  name!: string;
  description!: string;
  resource!: string;
  action!: string;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
