import { HttpClient } from './client';
import type { IUploadResponse } from '../dtos/upload.dto';

export class UploadService {
  constructor(private client: HttpClient) {}

  async uploadImage(file: File): Promise<IUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post<IUploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteImage(key: string): Promise<void> {
    await this.client.delete(`/upload/image/${encodeURIComponent(key)}`);
  }
}

