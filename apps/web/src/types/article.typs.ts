interface ArticleImage {
    alt: string;
    src: string;
  }
  
  interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: ArticleImage;
    published: boolean;
    createdAt: string;
    publishedAt: string;
    metaDescription: string;
    tags: string[];
  }