import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRetroalimentacionProblemas1782669600000
  implements MigrationInterface
{
  name = 'RemoveRetroalimentacionProblemas1782669600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "retroalimentacion_problemas" DROP CONSTRAINT IF EXISTS "FK_fd7638ef4b10174c9e1e59c72b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "retroalimentacion_problemas" DROP CONSTRAINT IF EXISTS "FK_fbec8f76b8573a4bfaca6a302a7"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "retroalimentacion_problemas"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "retroalimentacion_problemas" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "retroalimentacion" text NOT NULL, "usuarioId" integer, "problemaId" integer, CONSTRAINT "PK_136bd74d10d8c4495befdbdef5a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "retroalimentacion_problemas" ADD CONSTRAINT "FK_fbec8f76b8573a4bfaca6a302a7" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "retroalimentacion_problemas" ADD CONSTRAINT "FK_fd7638ef4b10174c9e1e59c72b5" FOREIGN KEY ("problemaId") REFERENCES "problemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
