import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Module } from 'nestjs-s3';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    S3Module.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: {
          credentials: configService.get('s3.credentials'),
          region: configService.get('s3.region'),
          endpoint: configService.get('s3.endpoint'),
          forcePathStyle: configService.get('s3.forcePathStyle'),
          signatureVersion: configService.get('s3.signatureVersion'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
