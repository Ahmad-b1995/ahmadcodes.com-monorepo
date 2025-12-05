import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { Permission } from '../permission/permission.entity';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';
import { Article } from '../article/article.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Permission, Role, User, Article]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}

