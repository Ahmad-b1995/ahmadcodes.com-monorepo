import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserEmailVerificationColumns1768000000000 implements MigrationInterface {
  name = 'AddUserEmailVerificationColumns1768000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'isEmailVerified'
        ) THEN
          ALTER TABLE "users" ADD "isEmailVerified" boolean NOT NULL DEFAULT false;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'emailVerificationToken'
        ) THEN
          ALTER TABLE "users" ADD "emailVerificationToken" character varying;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'passwordResetToken'
        ) THEN
          ALTER TABLE "users" ADD "passwordResetToken" character varying;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'passwordResetExpires'
        ) THEN
          ALTER TABLE "users" ADD "passwordResetExpires" TIMESTAMP;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "passwordResetExpires"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "passwordResetToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "emailVerificationToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "isEmailVerified"`,
    );
  }
}
