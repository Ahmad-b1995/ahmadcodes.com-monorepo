import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Permission } from '../permission/permission.entity';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';
import { Article } from '../article/article.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly configService: ConfigService,
  ) {}

  async seedAll(): Promise<void> {
    this.logger.log('🌱 Starting database seeding...');

    await this.seedPermissions();
    await this.seedRoles();
    await this.seedUsers();
    await this.seedArticles();

    this.logger.log('✅ Database seeding completed successfully!');
  }

  private async seedPermissions(): Promise<void> {
    this.logger.log('Seeding permissions...');

    const permissionsData = [
      // User permissions
      { name: 'create:user', description: 'Create new users' },
      { name: 'read:user', description: 'View user details' },
      { name: 'update:user', description: 'Update user information' },
      { name: 'delete:user', description: 'Delete users' },

      // Role permissions
      { name: 'create:role', description: 'Create new roles' },
      { name: 'read:role', description: 'View role details' },
      { name: 'update:role', description: 'Update role information' },
      { name: 'delete:role', description: 'Delete roles' },

      // Article permissions
      { name: 'create:article', description: 'Create new articles' },
      { name: 'read:article', description: 'View articles' },
      { name: 'update:article', description: 'Update articles' },
      { name: 'delete:article', description: 'Delete articles' },
      { name: 'publish:article', description: 'Publish articles' },
    ];

    for (const permissionData of permissionsData) {
      const existing = await this.permissionRepository.findOne({
        where: { name: permissionData.name },
      });

      if (!existing) {
        const permission = this.permissionRepository.create(permissionData);
        await this.permissionRepository.save(permission);
        this.logger.log(`  ✓ Created permission: ${permissionData.name}`);
      } else {
        this.logger.log(`  ⊙ Permission already exists: ${permissionData.name}`);
      }
    }
  }

  private async seedRoles(): Promise<void> {
    this.logger.log('Seeding roles...');

    // Define roles with their permissions
    const rolesData = [
      {
        name: 'admin',
        description: 'Administrator with full access',
        permissions: [
          'create:user',
          'read:user',
          'update:user',
          'delete:user',
          'create:role',
          'read:role',
          'update:role',
          'delete:role',
          'create:article',
          'read:article',
          'update:article',
          'delete:article',
          'publish:article',
        ],
      },
      {
        name: 'editor',
        description: 'Content editor with article management access',
        permissions: [
          'create:article',
          'read:article',
          'update:article',
          'delete:article',
          'publish:article',
        ],
      },
      {
        name: 'user',
        description: 'Regular user with basic access',
        permissions: ['read:article'],
      },
    ];

    for (const roleData of rolesData) {
      const existing = await this.roleRepository.findOne({
        where: { name: roleData.name },
        relations: ['permissions'],
      });

      if (!existing) {
        // Find permissions
        const permissions = await this.permissionRepository
          .createQueryBuilder('permission')
          .where('permission.name IN (:...names)', {
            names: roleData.permissions,
          })
          .getMany();

        const role = this.roleRepository.create({
          name: roleData.name,
          description: roleData.description,
          permissions,
        });

        await this.roleRepository.save(role);
        this.logger.log(
          `  ✓ Created role: ${roleData.name} with ${permissions.length} permissions`,
        );
      } else {
        this.logger.log(`  ⊙ Role already exists: ${roleData.name}`);
      }
    }
  }

  private async seedUsers(): Promise<void> {
    this.logger.log('Seeding users...');

    // Get default users from environment
    const defaultUsers = this.configService.get<string>('DEFAULT_USERS');

    if (!defaultUsers) {
      this.logger.warn(
        '⚠️  No DEFAULT_USERS found in environment. Skipping user creation.',
      );
      this.logger.warn(
        '⚠️  Please set DEFAULT_USERS in your .env file (format: email:password:firstName:lastName:role,email:password:firstName:lastName:role)',
      );
      return;
    }

    // Parse the users (format: email:password:firstName:lastName:role,email:password:firstName:lastName:role)
    const usersData = defaultUsers.split(',').map((user) => {
      const [email, password, firstName, lastName, roleName] = user
        .trim()
        .split(':');
      return {
        email: email?.trim(),
        password: password?.trim(),
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        roleName: roleName?.trim(),
      };
    });

    for (const userData of usersData) {
      if (
        !userData.email ||
        !userData.password ||
        !userData.firstName ||
        !userData.lastName ||
        !userData.roleName
      ) {
        this.logger.warn(`  ⚠️  Invalid user format: ${userData.email}`);
        continue;
      }

      // Check if user already exists
      const existing = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (existing) {
        this.logger.log(`  ⊙ User already exists: ${userData.email}`);
        continue;
      }

      try {
        const role = await this.roleRepository.findOne({
          where: { name: userData.roleName },
        });

        if (!role) {
          this.logger.error(`  ✗ Role not found: ${userData.roleName}`);
          continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const user = this.userRepository.create({
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isActive: true,
          isEmailVerified: true,
          roles: [role],
        });

        await this.userRepository.save(user);
        this.logger.log(
          `  ✓ Created user: ${userData.email} (${userData.roleName})`,
        );
      } catch (error) {
        this.logger.error(
          `  ✗ Failed to create user ${userData.email}:`,
          error,
        );
      }
    }
  }

  private async seedArticles(): Promise<void> {
    this.logger.log('Seeding articles...');

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
        excerpt:
          "Learn the basics of NestJS and why it's a great choice for building backend applications.",
        image: {
          alt: 'NestJS Logo',
          src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        },
        published: true,
        publishedAt: new Date('2024-01-15'),
        metaDescription:
          'A comprehensive guide to getting started with NestJS framework',
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
        excerpt:
          'Essential TypeORM best practices for building robust database layers.',
        image: {
          alt: 'Database schema',
          src: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
        },
        published: true,
        publishedAt: new Date('2024-02-01'),
        metaDescription:
          'Learn TypeORM best practices for efficient database operations',
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
        excerpt:
          'A complete guide to implementing JWT authentication in NestJS applications.',
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
        excerpt:
          'Complete guide to containerizing Node.js applications with Docker.',
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
        this.logger.log(`  ✓ Created article: ${articleData.title}`);
      } else {
        this.logger.log(`  ⊙ Article already exists: ${articleData.title}`);
      }
    }
  }

  async clearAll(): Promise<void> {
    this.logger.log('🧹 Clearing all seeded data...');

    // Delete in order of dependencies (children first, parents last)

    // Delete articles
    await this.articleRepository.delete({});
    this.logger.log('  ✓ Cleared all articles');

    // Delete users (must be before roles due to foreign key)
    await this.userRepository.delete({});
    this.logger.log('  ✓ Cleared all users');

    // Delete roles
    await this.roleRepository.delete({});
    this.logger.log('  ✓ Cleared all roles');

    // Delete permissions
    await this.permissionRepository.delete({});
    this.logger.log('  ✓ Cleared all permissions');

    this.logger.log('✅ All seeded data cleared successfully!');
  }
}

