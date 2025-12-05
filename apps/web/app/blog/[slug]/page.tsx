import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleService, HttpClient } from '@repo/shared/http';
import type { IArticle } from '@repo/shared/dtos';

const httpClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  withCredentials: true,
});
const articleService = new ArticleService(httpClient);

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await articleService.getArticleBySlug(slug);
    
    return {
      title: `${article.title} | Ahmad's Blog`,
      description: article.metaDescription || article.excerpt,
      keywords: article.tags?.join(', '),
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [
          {
            url: article.image.src,
            alt: article.image.alt,
          },
        ],
        type: 'article',
        publishedTime: article.publishedAt || undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: [article.image.src],
      },
    };
  } catch {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }
}

export default async function ArticlePage({ params }: Props) {
  let article: IArticle;
  
  try {
    const { slug } = await params;
    article = await articleService.getArticleBySlug(slug);
  } catch {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image.src,
    "datePublished": article.publishedAt || article.createdAt,
    "dateModified": article.publishedAt || article.createdAt,
    "author": {
      "@type": "Person",
      "name": "Ahmad"
    },
    "publisher": {
      "@type": "Person",
      "name": "Ahmad"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${article.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Navigation */}
          <nav className="mb-8">
            <Link 
              href="/#blog" 
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
              Back to Blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                width={800}
                height={400}
                className="w-full h-64 md:h-80 object-cover rounded-lg border border-slate-200/10 dark:border-slate-700/10"
                priority
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {article.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <time dateTime={article.publishedAt || article.createdAt}>
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="[&>*]:mb-6 [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg [&>h1]:font-bold [&>h2]:font-semibold [&>h3]:font-medium [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>code]:bg-slate-100 [&>code]:dark:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm"
            />
          </article>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <Link 
                href="/#blog"
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                Read More Articles
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
