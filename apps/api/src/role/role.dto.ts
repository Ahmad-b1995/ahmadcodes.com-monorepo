import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';
import {
  ICreateRoleDto,
  IUpdateRoleDto,
  IRoleResponseDto,
} from '@repo/shared/dtos';

export class CreateRoleDto implements ICreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
} 

export class UpdateRoleDto implements IUpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}

export class RoleResponseDto implements IRoleResponseDto {
  id!: string;
  name!: string;
  description!: string;
  isActive!: boolean;
  permissions!: {
    id: string;
    name: string;
    description: string;
    resource: string;
    action: string;
  }[];
  createdAt!: Date;
  updatedAt!: Date;
}
