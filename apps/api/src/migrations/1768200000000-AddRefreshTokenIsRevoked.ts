import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenIsRevoked1768200000000 implements MigrationInterface {
  name = 'AddRefreshTokenIsRevoked1768200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'refresh_tokens'
            AND column_name = 'isRevoked'
        ) THEN
          ALTER TABLE "refresh_tokens"
            ADD "isRevoked" boolean NOT NULL DEFAULT false;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP COLUMN IF EXISTS "isRevoked"`,
    );
  }
}
