import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1728134400000 implements MigrationInterface {
  name = 'InitialMigration1728134400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create permissions table
    await queryRunner.query(`
      CREATE TABLE "permissions" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "resource" character varying NOT NULL,
        "action" character varying NOT NULL,
        "description" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_permissions_name" UNIQUE ("name"),
        CONSTRAINT "PK_permissions_id" PRIMARY KEY ("id")
      )
    `);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_roles_name" UNIQUE ("name"),
        CONSTRAINT "PK_roles_id" PRIMARY KEY ("id")
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying,
        "lastName" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create refresh_tokens table
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" SERIAL NOT NULL,
        "token" character varying NOT NULL,
        "userId" integer NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id")
      )
    `);

    // Create articles table
    await queryRunner.query(`
      CREATE TABLE "articles" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "content" text NOT NULL,
        "excerpt" character varying,
        "image" jsonb NOT NULL,
        "published" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "publishedAt" TIMESTAMP,
        "metaDescription" character varying,
        "tags" text array,
        CONSTRAINT "UQ_articles_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_articles_id" PRIMARY KEY ("id")
      )
    `);

    // Create junction table for roles and permissions
    await queryRunner.query(`
      CREATE TABLE "role_permissions" (
        "roleId" integer NOT NULL,
        "permissionId" integer NOT NULL,
        CONSTRAINT "PK_role_permissions" PRIMARY KEY ("roleId", "permissionId")
      )
    `);

    // Create junction table for users and roles
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "userId" integer NOT NULL,
        "roleId" integer NOT NULL,
        CONSTRAINT "PK_user_roles" PRIMARY KEY ("userId", "roleId")
      )
    `);

    // Create foreign keys
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" 
      ADD CONSTRAINT "FK_refresh_tokens_user" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "role_permissions" 
      ADD CONSTRAINT "FK_role_permissions_role" 
      FOREIGN KEY ("roleId") REFERENCES "roles"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "role_permissions" 
      ADD CONSTRAINT "FK_role_permissions_permission" 
      FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_roles" 
      ADD CONSTRAINT "FK_user_roles_user" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_roles" 
      ADD CONSTRAINT "FK_user_roles_role" 
      FOREIGN KEY ("roleId") REFERENCES "roles"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_articles_slug" ON "articles" ("slug")`);
    await queryRunner.query(`CREATE INDEX "IDX_articles_published" ON "articles" ("published")`);
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_role_permissions_role" ON "role_permissions" ("roleId")`);
    await queryRunner.query(`CREATE INDEX "IDX_role_permissions_permission" ON "role_permissions" ("permissionId")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_roles_user" ON "user_roles" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_roles_role" ON "user_roles" ("roleId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_role"`);
    await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_user_roles_user"`);
    await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_permission"`);
    await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_role_permissions_role"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user"`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_user_roles_role"`);
    await queryRunner.query(`DROP INDEX "IDX_user_roles_user"`);
    await queryRunner.query(`DROP INDEX "IDX_role_permissions_permission"`);
    await queryRunner.query(`DROP INDEX "IDX_role_permissions_role"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP INDEX "IDX_articles_published"`);
    await queryRunner.query(`DROP INDEX "IDX_articles_slug"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "articles"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}

