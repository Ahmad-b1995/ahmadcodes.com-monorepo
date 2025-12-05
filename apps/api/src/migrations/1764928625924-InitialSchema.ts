import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1764928625924 implements MigrationInterface {
  name = 'InitialSchema1764928625924';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // This migration is a placeholder for the initial schema
    // The schema was created using TypeORM synchronize feature
    // All future schema changes should be done via migrations
    
    // Entities already in database:
    // - permissions
    // - roles
    // - users
    // - articles
    // - refresh_tokens
    // - role_permissions (junction table)
    // - user_roles (junction table)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Cannot revert initial schema as it was created via synchronize
    // To reset database, drop all tables manually or recreate the database
  }
}
