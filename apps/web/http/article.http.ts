import { AxiosRequestConfig } from "axios";
import { fetchData } from "./axios.config";
import { IArticleResponseDto } from "@repo/shared/dtos";

export async function getAllArticles(
  options?: AxiosRequestConfig
): Promise<IArticleResponseDto[]> {
  return fetchData<IArticleResponseDto[]>(
    "/articles?published=true",
    options
  );
}

export async function findArticleById(
  id: number | string
): Promise<IArticleResponseDto> {
  return fetchData<IArticleResponseDto>(
    `/articles/${id}`,
    { method: "GET" }
  );
}

export async function getArticleBySlug(
  slug: string
): Promise<IArticleResponseDto> {
  return fetchData<IArticleResponseDto>(
    `/articles/slug/${slug}`,
    { method: "GET" }
  );
}

