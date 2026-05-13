import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOutreachContacts1768300300000 implements MigrationInterface {
  name = 'CreateOutreachContacts1768300300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "outreach_contacts" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar(320) NOT NULL,
        "company" varchar(320) NOT NULL DEFAULT '',
        "role" varchar(320) NOT NULL DEFAULT '',
        "email" varchar(320) NOT NULL DEFAULT '',
        "linkedin_url" varchar(998),
        "source" varchar(32) NOT NULL,
        "status" varchar(32) NOT NULL DEFAULT 'queued',
        "last_contacted_at" TIMESTAMPTZ,
        "last_reply_at" TIMESTAMPTZ,
        "notes" text NOT NULL DEFAULT '',
        "tags" text[] NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_outreach_status_last_contacted"
        ON "outreach_contacts" ("status", "last_contacted_at");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_outreach_status_last_contacted";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "outreach_contacts";`);
  }
}
