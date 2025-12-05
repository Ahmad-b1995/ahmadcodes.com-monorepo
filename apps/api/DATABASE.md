# Database Management

This document explains how database schema management and seeding work in this project.

## Overview

- **Schema Management**: TypeORM migrations (NOT synchronize)
- **Data Seeding**: CLI-based seeding service
- **Database**: PostgreSQL

## Configuration

### Environment Variables

Create a `.env` file in `apps/api`:

```bash
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=ahmadcodes_db

# Seeding Configuration (optional)
DEFAULT_USERS=admin@example.com:password123:Admin:User:admin,editor@example.com:password123:Editor:User:editor
```

## Schema Management (Migrations)

### Why Migrations?

We use migrations instead of `synchronize: true` because:
- ✅ **Version control** for database schema
- ✅ **Safe for production** - explicit, reviewable changes
- ✅ **Team collaboration** - everyone uses the same schema
- ✅ **Rollback capability** - can revert changes
- ✅ **Audit trail** - clear history of schema changes

### Migration Commands

```bash
# Generate migration from entity changes
npm run migration:generate src/migrations/DescriptiveName

# Create empty migration (for data migrations, etc.)
npm run migration:create src/migrations/DescriptiveName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Workflow Example

1. **Modify an entity:**

```typescript
// user.entity.ts
@Entity('users')
export class User {
  // ... existing fields
  
  @Column({ nullable: true })  // Add new field
  bio: string;
}
```

2. **Generate migration:**

```bash
npm run migration:generate src/migrations/AddBioToUser
```

3. **Review the generated SQL** in `src/migrations/`

4. **Run the migration:**

```bash
npm run migration:run
```

### Important Notes

- **Never use `synchronize: true` in production**
- **Always review generated migrations** before running
- **Test migrations in development** before deploying
- **Never modify executed migrations** - create a new one instead
- **Commit migrations** to version control

## Data Seeding

### Overview

Seeding is managed through a centralized service (`SeedService`) that can be run via CLI commands.

### What Gets Seeded

1. **Permissions** - CRUD permissions for resources
2. **Roles** - Admin, Editor, User roles with permissions
3. **Users** - Configured via environment variable
4. **Articles** - Sample blog content

### Seed Commands

```bash
# Seed the database
npm run seed

# Clear all seeded data
npm run seed:clear

# Clear and reseed (refresh)
npm run seed:refresh
```

### User Seeding Configuration

Users are defined in the `DEFAULT_USERS` environment variable:

**Format:** `email:password:firstName:lastName:role,email:password:firstName:lastName:role`

**Example:**
```bash
DEFAULT_USERS=admin@test.com:pass123:John:Doe:admin,editor@test.com:pass123:Jane:Smith:editor
```

**Available roles:** `admin`, `editor`, `user`

If `DEFAULT_USERS` is not set, seeding will skip user creation with a warning.

### Seeding Features

- ✅ **Idempotent** - Safe to run multiple times (checks for existing data)
- ✅ **Environment-based** - Different users per environment
- ✅ **Sequential** - Seeds in correct order (permissions → roles → users → articles)
- ✅ **Clear logging** - Shows what's being created/skipped

## Development Workflow

### First Time Setup

1. **Create database:**
```bash
createdb ahmadcodes_db
```

2. **Set environment variables** (`.env` file)

3. **Run migrations:**
```bash
npm run migration:run
```

4. **Seed initial data:**
```bash
npm run seed
```

5. **Start development server:**
```bash
npm run dev
```

### Making Schema Changes

1. **Modify entity files**
2. **Generate migration:** `npm run migration:generate src/migrations/DescriptiveName`
3. **Review and run:** `npm run migration:run`
4. **Commit both entity changes and migration**

### Resetting Development Database

If you need to start fresh:

```bash
# Option 1: Clear and reseed data (keeps schema)
npm run seed:clear
npm run seed

# Option 2: Complete reset (drops and recreates database)
dropdb ahmadcodes_db
createdb ahmadcodes_db
npm run migration:run
npm run seed
```

## Production Deployment

### Recommended Deployment Flow

```bash
# 1. Build the application
npm run build

# 2. Run pending migrations
npm run migration:run

# 3. Seed data (if needed for new environments)
npm run seed

# 4. Start the application
npm run start:prod
```

### Production Checklist

- [ ] `synchronize` is `false` in production (already configured)
- [ ] Migrations are tested in staging
- [ ] Database backups are in place before migrations
- [ ] `DEFAULT_USERS` contains production-safe credentials
- [ ] Environment variables are properly set
- [ ] Migration scripts run before app starts

## Troubleshooting

### "No changes in database schema were found"

This means your entities match the database. If you expect changes:
1. Verify entity file changes are saved
2. Check that entities are registered in modules
3. Ensure data-source.ts points to correct entity files

### Migration fails to run

1. Check database connection (env variables)
2. Review the generated SQL in the migration file
3. Check database logs for detailed errors
4. Ensure you have proper database permissions

### Seeding fails

1. Verify database connection
2. Check that `DEFAULT_USERS` format is correct
3. Ensure migrations have run (tables exist)
4. Check logs for specific errors

### Database out of sync with code

```bash
# Check which migrations are pending
npm run migration:show

# Run pending migrations
npm run migration:run

# If entities changed without migration, generate one
npm run migration:generate src/migrations/SyncChanges
npm run migration:run
```

## Files Structure

```
apps/api/
├── src/
│   ├── config/
│   │   └── database.config.ts      # NestJS database config
│   ├── migrations/                  # Migration files
│   │   ├── README.md               # Migration documentation
│   │   └── *.ts                    # Individual migrations
│   ├── seed/
│   │   ├── seed.service.ts         # Centralized seeding logic
│   │   └── seed.module.ts          # Seed module
│   ├── data-source.ts              # TypeORM CLI config
│   └── seed-runner.ts              # Seed CLI runner
└── DATABASE.md                      # This file
```

## Additional Resources

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [TypeORM Best Practices](https://typeorm.io/migrations#creating-a-new-migration)
- Project-specific: See `src/migrations/README.md` for detailed migration guide

