import React from "react";
import NavigationWrapper from "./NavigationWrapper";
import Image from "next/image";
import { ArticleService, HttpClient } from "@repo/shared/http";
import { connection } from "next/server";
import Link from "next/link";

const httpClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500/api',
  withCredentials: true,
});
const articleService = new ArticleService(httpClient);

const Blog = async () => {
  await connection()
  const response = await articleService.getArticles({ published: true });
  const articles = response.data;

  return (
    <NavigationWrapper elementName="blog">
      <section
        id="blog"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="Blog articles"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 lg:sr-only">
            Blog
          </h2>
        </div>

        <ul className="group/list">
          {articles.slice(0, 5).map((article) => (
            <li key={article.id} className="mb-12">
              <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100/50 dark:lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
                <div className="z-10 sm:order-2 sm:col-span-6">
                  <h3>
                    <Link
                      className="inline-flex items-baseline font-medium leading-tight text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-300 focus-visible:text-primary-600 dark:focus-visible:text-primary-300 group/link text-base"
                      href={`/blog/${article.slug}`}
                      aria-label={`${article.title}`}
                    >
                      <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                      <span>{article.title}</span>
                    </Link>
                  </h3>
                  
                  {article.excerpt && (
                    <p className="mt-2 text-sm leading-normal text-slate-600 dark:text-slate-400">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {article.publishedAt && (
                      <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    )}
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex gap-1">
                        {article.tags.slice(0, 3).map((tag: string) => (
                          <span 
                            key={tag}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
                <Image
                  alt={article.image.alt}
                  loading="lazy"
                  width={300}
                  height={300}
                  decoding="async"
                  className="rounded border-2 border-slate-200/10 dark:border-slate-700/10 transition group-hover:border-slate-200/30 dark:group-hover:border-slate-700/30 sm:order-1 sm:col-span-2 sm:translate-y-1"
                  style={{ color: "transparent" }}
                  src={article.image.src}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Link
            className="inline-flex items-center font-medium leading-tight text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-300 focus-visible:text-primary-600 dark:focus-visible:text-primary-300 group"
            href="/blog"
            aria-label="View Full Blog Archive"
          >
            <span>
              <span className="border-b border-transparent pb-px transition group-hover:border-primary-600 dark:group-hover:border-primary-300 motion-reduce:transition-none">
                View Full Blog Archive
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </NavigationWrapper>
  );
};

export default Blog;
