import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Permission } from '../permission/permission.entity';
import { Role } from './role.entity';
import { RoleSeeder } from './role.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RoleController],
  providers: [RoleService, RoleSeeder],
  exports: [RoleService],
})
export class RoleModule {}
