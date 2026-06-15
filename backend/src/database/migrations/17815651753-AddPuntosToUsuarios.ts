import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPuntosToUsuarios17815651753 implements MigrationInterface {
  name = 'AddPuntosToUsuarios17815651753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "puntos_totales" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "posicion_global" integer`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_usuarios_puntos_totales" ON "usuarios" ("puntos_totales")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_usuarios_puntos_totales"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP COLUMN "posicion_global"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP COLUMN "puntos_totales"`,
    );
  }
}
