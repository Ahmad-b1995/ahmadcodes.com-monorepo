import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLinkedinPosts1768300200000 implements MigrationInterface {
  name = 'CreateLinkedinPosts1768300200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "linkedin_posts" (
        "id" SERIAL PRIMARY KEY,
        "title" varchar(500) NOT NULL,
        "body" text NOT NULL DEFAULT '',
        "hashtags" text[] NOT NULL DEFAULT '{}',
        "scheduled_at" TIMESTAMPTZ,
        "posted_at" TIMESTAMPTZ,
        "external_url" varchar(998),
        "image_url" varchar(998),
        "engagement" jsonb NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_linkedin_posts_scheduled"
        ON "linkedin_posts" ("scheduled_at")
        WHERE "posted_at" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_linkedin_posts_scheduled";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "linkedin_posts";`);
  }
}
