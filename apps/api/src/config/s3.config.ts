import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => {
  if (!process.env.S3_ACCESS_KEY_ID) {
    throw new Error('S3_ACCESS_KEY_ID environment variable is required');
  }
  if (!process.env.S3_SECRET_ACCESS_KEY) {
    throw new Error('S3_SECRET_ACCESS_KEY environment variable is required');
  }
  if (!process.env.S3_ENDPOINT) {
    throw new Error('S3_ENDPOINT environment variable is required');
  }
  if (!process.env.S3_BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME environment variable is required');
  }

  return {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    signatureVersion: 'v4',
    bucketName: process.env.S3_BUCKET_NAME,
  };
});
