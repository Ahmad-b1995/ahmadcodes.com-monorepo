import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasks1768300000000 implements MigrationInterface {
  name = 'CreateTasks1768300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" SERIAL PRIMARY KEY,
        "type" varchar(32) NOT NULL,
        "title" varchar(500) NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "status" varchar(32) NOT NULL DEFAULT 'draft',
        "scheduled_at" TIMESTAMPTZ,
        "due_at" TIMESTAMPTZ,
        "completed_at" TIMESTAMPTZ,
        "metadata" jsonb NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_tasks_type_status"
        ON "tasks" ("type", "status");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_tasks_due_at"
        ON "tasks" ("due_at");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_due_at";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_type_status";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks";`);
  }
}
