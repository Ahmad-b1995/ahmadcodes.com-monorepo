import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Article } from './article.entity';

@Injectable()
export class ArticleSeeder implements OnModuleInit {
  private readonly logger = new Logger(ArticleSeeder.name);

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<boolean>('ENABLE_SEEDING', false);
    if (shouldSeed) {
      // Add a small delay to ensure users are seeded first
      await new Promise((resolve) => setTimeout(resolve, 300));
      await this.seed();
    }
  }

  async seed() {
    this.logger.log('🌱 Seeding articles...');

    const articlesData = [
      {
        title: 'Getting Started with NestJS',
        slug: 'getting-started-with-nestjs',
        content: `# Getting Started with NestJS

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript by default and combines elements of OOP, FP, and FRP.

## Why NestJS?

NestJS provides an out-of-the-box application architecture that allows developers to create highly testable, scalable, and maintainable applications.

Key features include:
- Built with TypeScript
- Modular architecture
- Dependency injection
- Powerful CLI
- Excellent documentation

## Installation

To get started, install the NestJS CLI:

\`\`\`bash
npm install -g @nestjs/cli
nest new project-name
\`\`\`

This will create a new NestJS project with all the necessary dependencies.`,
        excerpt: 'Learn the basics of NestJS and why it\'s a great choice for building backend applications.',
        image: {
          alt: 'NestJS Logo',
          src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        },
        published: true,
        publishedAt: new Date('2024-01-15'),
        metaDescription: 'A comprehensive guide to getting started with NestJS framework',
        tags: ['nestjs', 'nodejs', 'typescript', 'backend'],
      },
      {
        title: 'TypeORM Best Practices',
        slug: 'typeorm-best-practices',
        content: `# TypeORM Best Practices

TypeORM is an ORM that can run in Node.js and can be used with TypeScript and JavaScript. Here are some best practices to follow.

## Use Repository Pattern

Always use repositories for database operations:

\`\`\`typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
}
\`\`\`

## Avoid N+1 Queries

Use eager loading or query builder with joins:

\`\`\`typescript
const users = await this.userRepository.find({
  relations: ['posts', 'profile'],
});
\`\`\`

## Use Transactions

For operations that need atomicity:

\`\`\`typescript
await this.dataSource.transaction(async (manager) => {
  await manager.save(user);
  await manager.save(profile);
});
\`\`\``,
        excerpt: 'Essential TypeORM best practices for building robust database layers.',
        image: {
          alt: 'Database schema',
          src: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
        },
        published: true,
        publishedAt: new Date('2024-02-01'),
        metaDescription: 'Learn TypeORM best practices for efficient database operations',
        tags: ['typeorm', 'database', 'nodejs', 'typescript'],
      },
      {
        title: 'Building RESTful APIs with Authentication',
        slug: 'building-restful-apis-with-authentication',
        content: `# Building RESTful APIs with Authentication

Learn how to build secure RESTful APIs with JWT authentication in NestJS.

## Setting up JWT

First, install the necessary packages:

\`\`\`bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
\`\`\`

## Creating Auth Module

Create an authentication module to handle login and token generation:

\`\`\`typescript
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
\`\`\`

## Protecting Routes

Use guards to protect your routes:

\`\`\`typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
\`\`\``,
        excerpt: 'A complete guide to implementing JWT authentication in NestJS applications.',
        image: {
          alt: 'Authentication flow',
          src: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800',
        },
        published: true,
        publishedAt: new Date('2024-02-15'),
        metaDescription: 'Complete guide to JWT authentication in NestJS',
        tags: ['authentication', 'jwt', 'nestjs', 'security'],
      },
      {
        title: 'Advanced React Patterns',
        slug: 'advanced-react-patterns',
        content: `# Advanced React Patterns

Explore advanced React patterns for building scalable applications.

## Compound Components

Create flexible and reusable components:

\`\`\`jsx
<Select>
  <Select.Trigger>Select option</Select.Trigger>
  <Select.List>
    <Select.Option value="1">Option 1</Select.Option>
    <Select.Option value="2">Option 2</Select.Option>
  </Select.List>
</Select>
\`\`\`

## Render Props

Share code between components:

\`\`\`jsx
<DataProvider render={(data) => (
  <div>{data.name}</div>
)} />
\`\`\`

## Custom Hooks

Extract reusable logic:

\`\`\`jsx
function useAuth() {
  const [user, setUser] = useState(null);
  // ... authentication logic
  return { user, login, logout };
}
\`\`\``,
        excerpt: 'Master advanced React patterns for better component architecture.',
        image: {
          alt: 'React patterns',
          src: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        },
        published: false,
        publishedAt: null,
        metaDescription: 'Learn advanced React patterns for scalable applications',
        tags: ['react', 'javascript', 'frontend', 'patterns'],
      },
      {
        title: 'Docker for Node.js Applications',
        slug: 'docker-for-nodejs-applications',
        content: `# Docker for Node.js Applications

Learn how to containerize your Node.js applications with Docker.

## Creating a Dockerfile

Here's a basic Dockerfile for Node.js:

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "dist/main.js"]
\`\`\`

## Multi-stage Builds

Optimize your Docker images:

\`\`\`dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["node", "dist/main.js"]
\`\`\`

## Docker Compose

Orchestrate multiple containers:

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: password
\`\`\``,
        excerpt: 'Complete guide to containerizing Node.js applications with Docker.',
        image: {
          alt: 'Docker containers',
          src: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
        },
        published: true,
        publishedAt: new Date('2024-03-01'),
        metaDescription: 'Learn how to containerize Node.js applications with Docker',
        tags: ['docker', 'nodejs', 'devops', 'containers'],
      },
    ];

    for (const articleData of articlesData) {
      const existing = await this.articleRepository.findOne({
        where: { slug: articleData.slug },
      });

      if (!existing) {
        const article = this.articleRepository.create(articleData);
        await this.articleRepository.save(article);
        this.logger.log(`✅ Created article: ${articleData.title}`);
      } else {
        this.logger.log(`⏭️  Article already exists: ${articleData.title}`);
      }
    }

    this.logger.log('✨ Articles seeding completed');
  }
}

