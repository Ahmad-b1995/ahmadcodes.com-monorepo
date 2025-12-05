# Database Migrations

This directory contains TypeORM database migrations for managing schema changes.

## Overview

Migrations provide version control for your database schema. Instead of using `synchronize: true` (which automatically syncs entities to the database), we use migrations for explicit, trackable schema changes.

## Migration Commands

### Generate a Migration

Automatically generates a migration by comparing your entities with the current database schema:

```bash
npm run migration:generate src/migrations/MigrationName
```

### Create an Empty Migration

Creates a blank migration file that you can manually edit:

```bash
npm run migration:create src/migrations/MigrationName
```

### Run Migrations

Executes all pending migrations:

```bash
npm run migration:run
```

### Revert Last Migration

Reverts the most recently executed migration:

```bash
npm run migration:revert
```

### Show Migration Status

Displays which migrations have been executed:

```bash
npm run migration:show
```

## Workflow

### When Adding/Modifying Entities

1. **Make changes to your entity files** (e.g., add a new column, change a type)
2. **Generate a migration:**
   ```bash
   npm run migration:generate src/migrations/AddColumnToUser
   ```
3. **Review the generated migration** to ensure it does what you expect
4. **Run the migration:**
   ```bash
   npm run migration:run
   ```

### Example: Adding a Column

1. Add a new property to your entity:
   ```typescript
   @Column({ nullable: true })
   phoneNumber: string;
   ```

2. Generate migration:
   ```bash
   npm run migration:generate src/migrations/AddPhoneNumberToUser
   ```

3. Review the generated file, then run:
   ```bash
   npm run migration:run
   ```

### Example: Creating a New Table

1. Create a new entity file:
   ```typescript
   @Entity('categories')
   export class Category {
     @PrimaryGeneratedColumn('uuid')
     id: string;
     
     @Column()
     name: string;
   }
   ```

2. Register it in your module's TypeORM imports

3. Generate migration:
   ```bash
   npm run migration:generate src/migrations/CreateCategoryTable
   ```

4. Run the migration:
   ```bash
   npm run migration:run
   ```

## Migration Structure

Each migration has two methods:

```typescript
export class MigrationName1234567890 implements MigrationInterface {
  name = 'MigrationName1234567890';

  // Executed when running migrations
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "phoneNumber" varchar`);
  }

  // Executed when reverting migrations
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNumber"`);
  }
}
```

## Best Practices

1. **Always review generated migrations** before running them
2. **Test migrations** in development before deploying to production
3. **Never modify executed migrations** - create a new migration instead
4. **Keep migrations small and focused** - one logical change per migration
5. **Write reversible migrations** - always implement the `down` method
6. **Commit migrations to version control** with your code changes
7. **Run migrations as part of deployment** process

## Production Deployment

In production, migrations should be run automatically during deployment:

```bash
# Example deployment script
npm run build
npm run migration:run
npm run start:prod
```

## Initial Schema Note

The `InitialSchema` migration is a placeholder. The initial database schema was created using TypeORM's synchronize feature. All subsequent changes should be managed through migrations.

## Troubleshooting

### Migration failed to execute

If a migration fails:
1. Check the error message
2. Fix the issue (database connection, SQL syntax, etc.)
3. The migration will be retried on next `migration:run`

### Need to revert multiple migrations

Run `migration:revert` multiple times:
```bash
npm run migration:revert  # Reverts last migration
npm run migration:revert  # Reverts second-to-last
```

### Database and code are out of sync

1. Check migration status: `npm run migration:show`
2. If migrations are pending: `npm run migration:run`
3. If you made entity changes without migrations:
   ```bash
   npm run migration:generate src/migrations/SyncChanges
   npm run migration:run
   ```

## Configuration

Migration settings are configured in:
- `src/data-source.ts` - Used by TypeORM CLI commands
- `src/config/database.config.ts` - Used by the NestJS application

Both should be kept in sync regarding:
- Database connection settings
- Entity paths
- Migration paths

