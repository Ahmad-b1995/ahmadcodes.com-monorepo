import axiosInstance from './axios.config';
import type { UploadResponseDto, ImageUploadResponseDto } from '@repo/shared';

export async function uploadArticleImage(file: File): Promise<UploadResponseDto['data']> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<UploadResponseDto>(
    '/upload/article-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
}

export async function uploadImage(file: File): Promise<ImageUploadResponseDto['data']> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<ImageUploadResponseDto>(
    '/upload/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

