import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserRoleToEstudiante1782669700000
  implements MigrationInterface
{
  name = 'RenameUserRoleToEstudiante1782669700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."usuarios_rol_enum" RENAME VALUE 'user' TO 'estudiante'`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ALTER COLUMN "rol" SET DEFAULT 'estudiante'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ALTER COLUMN "rol" SET DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."usuarios_rol_enum" RENAME VALUE 'estudiante' TO 'user'`,
    );
  }
}
