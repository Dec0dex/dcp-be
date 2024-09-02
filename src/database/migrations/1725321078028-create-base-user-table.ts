import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBaseUserTable1725321078028 implements MigrationInterface {
  name = 'CreateBaseUserTable1725321078028';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."UQ_user_username"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."UQ_user_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "username"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "email"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "image"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "externalId" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "profileTag" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "profileIcon" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "backgroundImage" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "firstName" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "lastName" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "isSuspended" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "needsEnrollment" boolean NOT NULL DEFAULT true
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phoneNumbers" jsonb DEFAULT '[]'
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "emails" jsonb DEFAULT '[]'
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "bio" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "bio" DROP DEFAULT
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_external_id" ON "user" ("externalId")
            WHERE "deleted_at" IS NULL
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_profile_tag" ON "user" ("profileTag")
            WHERE "deleted_at" IS NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."UQ_user_profile_tag"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."UQ_user_external_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "bio"
            SET DEFAULT ''
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "bio"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "emails"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phoneNumbers"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "needsEnrollment"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "isSuspended"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "lastName"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "firstName"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "backgroundImage"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "profileIcon"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "profileTag"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "externalId"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "image" character varying NOT NULL DEFAULT ''
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "email" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "username" character varying NOT NULL
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_email" ON "user" ("email")
            WHERE (deleted_at IS NULL)
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_username" ON "user" ("username")
            WHERE (deleted_at IS NULL)
        `);
  }
}
