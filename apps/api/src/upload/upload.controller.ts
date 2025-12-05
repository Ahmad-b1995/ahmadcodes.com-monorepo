import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('article-image')
  @Roles('admin', 'editor')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArticleImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ success: boolean; data: { alt: string; src: string } }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.uploadService.uploadArticleImage(file);
    return {
      success: true,
      data: result,
    };
  }

  @Post('image')
  @Roles('admin', 'editor')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{
    success: boolean;
    data: { key: string; url: string; alt: string };
  }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.uploadService.uploadFile(file, 'images');
    return {
      success: true,
      data: result,
    };
  }
}
