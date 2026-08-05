import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMailMessages1746649200000 implements MigrationInterface {
  name = 'CreateMailMessages1746649200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "mail_messages" (
        "id" SERIAL PRIMARY KEY,
        "direction" varchar(16) NOT NULL,
        "status" varchar(16) NOT NULL DEFAULT 'queued',
        "from_address" varchar(320) NOT NULL,
        "to_addresses" text[] NOT NULL DEFAULT '{}',
        "cc_addresses" text[] NOT NULL DEFAULT '{}',
        "bcc_addresses" text[] NOT NULL DEFAULT '{}',
        "subject" varchar(998) NOT NULL,
        "body_html" text NOT NULL DEFAULT '',
        "body_text" text NOT NULL DEFAULT '',
        "message_id" varchar(998),
        "in_reply_to" varchar(998),
        "error" text,
        "sent_at" TIMESTAMPTZ,
        "received_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_mail_messages_direction_created"
        ON "mail_messages" ("direction", "created_at" DESC);
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_mail_messages_message_id"
        ON "mail_messages" ("message_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_mail_messages_message_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_mail_messages_direction_created";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "mail_messages";`);
  }
}
