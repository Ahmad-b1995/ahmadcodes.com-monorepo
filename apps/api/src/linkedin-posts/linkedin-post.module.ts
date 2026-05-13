import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkedInPost } from './linkedin-post.entity';
import { LinkedInPostService } from './linkedin-post.service';
import { LinkedInPostController } from './linkedin-post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LinkedInPost])],
  controllers: [LinkedInPostController],
  providers: [LinkedInPostService],
  exports: [LinkedInPostService],
})
export class LinkedInPostModule {}
