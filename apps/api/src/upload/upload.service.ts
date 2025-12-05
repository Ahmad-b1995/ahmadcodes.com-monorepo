import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectS3 } from 'nestjs-s3';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService implements OnModuleInit {
  private readonly bucketName: string;
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor(
    @InjectS3() private readonly s3: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName =
      this.configService.get<string>('s3.bucketName') || 'articles';
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      console.log(`✅ Bucket "${this.bucketName}" is ready for uploads`);
    } catch (error) {
      if ((error as any).$metadata?.httpStatusCode === 404) {
        try {
          await this.s3.send(
            new CreateBucketCommand({ Bucket: this.bucketName }),
          );
          console.log(`✅ Bucket "${this.bucketName}" created successfully`);
        } catch (createError) {
          console.error('❌ Error creating bucket:', createError);
        }
      } else {
        console.error('⚠️  Error checking bucket:', error);
      }
    }
  }

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ key: string; url: string; alt: string }> {
    this.validateFile(file);

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3.send(command);

      // Build the URL for Digital Ocean Spaces or S3
      const endpoint = this.configService.get<string>('s3.endpoint');
      const region = this.configService.get<string>('s3.region');

      // Digital Ocean Spaces URL format: https://bucket-name.region.digitaloceanspaces.com/file-key
      // For other S3-compatible services, use: endpoint/bucket/file-key
      let url: string;
      if (endpoint?.includes('digitaloceanspaces.com')) {
        url = `https://${this.bucketName}.${region}.digitaloceanspaces.com/${fileName}`;
      } else {
        url = `${endpoint}/${this.bucketName}/${fileName}`;
      }

      return {
        key: fileName,
        url,
        alt: file.originalname,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3.send(command);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async uploadArticleImage(
    file: Express.Multer.File,
  ): Promise<{ alt: string; src: string }> {
    const result = await this.uploadFile(file, 'articles');
    return {
      alt: result.alt,
      src: result.url,
    };
  }
}

