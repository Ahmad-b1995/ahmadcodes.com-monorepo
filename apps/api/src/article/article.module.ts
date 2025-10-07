import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './article.entity';
import { ArticleSeeder } from './article.seeder';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UploadModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleSeeder],
  exports: [ArticleService],
})
export class ArticleModule {}
