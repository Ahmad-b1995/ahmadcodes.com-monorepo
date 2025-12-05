import { Metadata } from 'next';
import { ArticleService, HttpClient } from '@repo/shared/http';
import Link from 'next/link';
import Image from 'next/image';
import type { IArticle } from '@repo/shared/dtos';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog | Ahmad\'s Tech Insights',
  description: 'Explore technical articles, tutorials, and insights on web development, software engineering, and technology trends.',
  keywords: 'blog, web development, software engineering, tutorials, technical articles, programming',
  openGraph: {
    title: 'Blog | Ahmad\'s Tech Insights',
    description: 'Explore technical articles, tutorials, and insights on web development, software engineering, and technology trends.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Ahmad\'s Tech Insights',
    description: 'Explore technical articles, tutorials, and insights on web development, software engineering, and technology trends.',
  },
};

const httpClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500/api',
  withCredentials: true,
});
const articleService = new ArticleService(httpClient);

export default async function BlogPage() {
  let articles: IArticle[] = [];
  
  try {
    const response = await articleService.getArticles({ published: true });
    articles = response.data;
  } catch (error) {
    // During build time, API might not be available
    console.warn('Failed to fetch articles:', error);
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Ahmad's Tech Blog",
    "description": "Technical articles, tutorials, and insights on web development and software engineering",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    "author": {
      "@type": "Person",
      "name": "Ahmad"
    },
    "blogPost": articles.map(article => ({
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt,
      "image": article.image.src,
      "datePublished": article.publishedAt,
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${article.slug}`,
      "author": {
        "@type": "Person",
        "name": "Ahmad"
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Navigation */}
          <nav className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
            >
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Blog
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Explore technical articles, tutorials, and insights on web development, 
              software engineering, and technology trends.
            </p>
          </header>

          {/* Articles Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/blog/${article.slug}`} className="block">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={article.image.src}
                      alt={article.image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-xs text-slate-500 dark:text-slate-400">
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
                          {article.tags.slice(0, 2).map((tag: string) => (
                            <span 
                              key={tag}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                      {article.title}
                    </h2>
                    
                    {article.excerpt && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {articles.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No articles yet
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Check back soon for new content!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
