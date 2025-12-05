import type { IArticle } from '@repo/shared/dtos'
import type { Article } from './schema'

/**
 * Transform API response DTO to frontend Article type
 * Only transformation: converting date strings to Date objects
 */
export function transformArticleFromDTO(dto: IArticle): Article {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
  }
}

/**
 * Transform array of articles
 */
export function transformArticlesToDTO(
  dtos: IArticle[]
): Article[] {
  return dtos.map(transformArticleFromDTO)
}

