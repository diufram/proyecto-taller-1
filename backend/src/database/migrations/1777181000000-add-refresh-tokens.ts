import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokens1777181000000 implements MigrationInterface {
  name = 'AddRefreshTokens1777181000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "revoked_at" TIMESTAMP, "usuario_id" integer NOT NULL, CONSTRAINT "UQ_refresh_tokens_token_hash" UNIQUE ("token_hash"), CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_usuario"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
