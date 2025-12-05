import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_REGION || 'tor1',
  endpoint:
    process.env.S3_ENDPOINT ||
    `https://${process.env.S3_REGION || 'tor1'}.digitaloceanspaces.com`,
  forcePathStyle: false,
  signatureVersion: 'v4',
  bucketName: process.env.S3_BUCKET_NAME,
}));
