import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDailyPlanAvailableMinutes1768400100000
  implements MigrationInterface
{
  name = 'AddDailyPlanAvailableMinutes1768400100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "daily_plans"
      ADD COLUMN "available_minutes" integer NOT NULL DEFAULT 480;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "daily_plans" DROP COLUMN IF EXISTS "available_minutes";
    `);
  }
}
