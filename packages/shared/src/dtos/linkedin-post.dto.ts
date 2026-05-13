export interface ILinkedInPost {
  id: number;
  title: string;
  body: string;
  hashtags: string[];
  scheduledAt: string | null;
  postedAt: string | null;
  externalUrl: string | null;
  imageUrl: string | null;
  engagement: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateLinkedInPostDto {
  title: string;
  body?: string;
  hashtags?: string[];
  scheduledAt?: string;
  postedAt?: string;
  externalUrl?: string;
  imageUrl?: string;
  engagement?: Record<string, unknown>;
}

export interface IUpdateLinkedInPostDto {
  title?: string;
  body?: string;
  hashtags?: string[];
  scheduledAt?: string;
  postedAt?: string;
  externalUrl?: string;
  imageUrl?: string;
  engagement?: Record<string, unknown>;
}

export interface IMarkLinkedInPostPostedDto {
  externalUrl?: string;
}
