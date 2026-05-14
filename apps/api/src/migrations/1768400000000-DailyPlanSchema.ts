import { MigrationInterface, QueryRunner } from 'typeorm';

export class DailyPlanSchema1768400000000 implements MigrationInterface {
  name = 'DailyPlanSchema1768400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "goals" (
        "id" SERIAL PRIMARY KEY,
        "title" varchar(500) NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "priority" varchar(16) NOT NULL,
        "target_date" TIMESTAMPTZ,
        "active" boolean NOT NULL DEFAULT true,
        "metadata" jsonb NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_goals_active_priority"
        ON "goals" ("active", "priority");
    `);

    await queryRunner.query(`
      CREATE TABLE "plan_tasks" (
        "id" SERIAL PRIMARY KEY,
        "goal_id" integer REFERENCES "goals"("id") ON DELETE SET NULL,
        "title" varchar(500) NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "type" varchar(32) NOT NULL,
        "status" varchar(32) NOT NULL DEFAULT 'todo',
        "priority" varchar(16) NOT NULL,
        "scheduled_for" date,
        "due_at" TIMESTAMPTZ,
        "estimated_minutes" integer,
        "completed_at" TIMESTAMPTZ,
        "actionable" jsonb NOT NULL DEFAULT '{}',
        "metadata" jsonb NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plan_tasks_goal_id"
        ON "plan_tasks" ("goal_id");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_plan_tasks_status_due"
        ON "plan_tasks" ("status", "due_at");
    `);

    await queryRunner.query(`
      CREATE TABLE "memory_notes" (
        "id" SERIAL PRIMARY KEY,
        "content" text NOT NULL,
        "tags" text[] NOT NULL DEFAULT '{}',
        "pinned" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_memory_notes_pinned_created"
        ON "memory_notes" ("pinned", "created_at");
    `);

    await queryRunner.query(`
      CREATE TABLE "daily_plans" (
        "id" SERIAL PRIMARY KEY,
        "plan_date" date NOT NULL UNIQUE,
        "summary" text NOT NULL,
        "rationale" text NOT NULL,
        "generated_at" TIMESTAMPTZ NOT NULL,
        "llm_model" varchar(64) NOT NULL,
        "llm_input_tokens" integer NOT NULL,
        "llm_output_tokens" integer NOT NULL,
        "task_ids" integer[] NOT NULL DEFAULT '{}',
        "context_hash" varchar(64) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "daily_plans";`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_memory_notes_pinned_created";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "memory_notes";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plan_tasks_status_due";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_plan_tasks_goal_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plan_tasks";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_goals_active_priority";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "goals";`);
  }
}
