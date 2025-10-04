import { AxiosRequestConfig } from "axios";
import { fetchData } from "./axios.config";
import { Article } from "@/types/article.typs";

export async function getAllArticles(
  options?: AxiosRequestConfig
): Promise<Article[]> {
  return fetchData<Article[]>(
    `${process.env.BASE_URL}/articles`,
    options
  );
}

// Function to find article by ID
export async function findArticleById(
  id: number | string
): Promise<Article> {
  return fetchData<Article>(
    `${process.env.BASE_URL}/articles/${id}`,
    { method: "GET" }
  );
}

// Function to find article by slug
export async function getArticleBySlug(
  slug: string
): Promise<Article> {
  return fetchData<Article>(
    `${process.env.BASE_URL}/articles/slug/${slug}`,
    { method: "GET" }
  );
}
