import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleAndPermissionIsActive1768100000000 implements MigrationInterface {
  name = 'AddRoleAndPermissionIsActive1768100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'roles' AND column_name = 'isActive'
        ) THEN
          ALTER TABLE "roles" ADD "isActive" boolean NOT NULL DEFAULT true;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'permissions' AND column_name = 'isActive'
        ) THEN
          ALTER TABLE "permissions" ADD "isActive" boolean NOT NULL DEFAULT true;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN IF EXISTS "isActive"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN IF EXISTS "isActive"`);
  }
}
