export interface UploadResponseDto {
  success: boolean;
  data: {
    alt: string;
    src: string;
  };
}

export interface ImageUploadResponseDto {
  success: boolean;
  data: {
    key: string;
    url: string;
    alt: string;
  };
}

export interface ArticleImageDto {
  alt: string;
  src: string;
}

