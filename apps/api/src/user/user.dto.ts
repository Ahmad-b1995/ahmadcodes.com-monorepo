import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';
import {
  ICreateUserDto,
  IUpdateUserDto,
  IUserResponseDto,
} from '@repo/shared/dtos';

export class CreateUserDto implements ICreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  roleIds?: string[];
}

export class UpdateUserDto implements IUpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  roleIds?: string[];
}

export class UserResponseDto implements IUserResponseDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  isActive!: boolean;
  isEmailVerified!: boolean;
  roles!: {
    id: string;
    name: string;
    description: string;
  }[];
  createdAt!: Date;
  updatedAt!: Date;
}
