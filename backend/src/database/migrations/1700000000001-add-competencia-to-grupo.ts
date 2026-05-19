import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompetenciaToGrupo1700000000001 implements MigrationInterface {
    name = 'AddCompetenciaToGrupo1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "grupos"
            ADD COLUMN IF NOT EXISTS "competenciaId" integer
        `);

        await queryRunner.query(`
            ALTER TABLE "grupos"
            ADD CONSTRAINT "FK_grupos_competencia"
            FOREIGN KEY ("competenciaId")
            REFERENCES "competencias"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "grupos"
            DROP CONSTRAINT IF EXISTS "FK_grupos_competencia"
        `);

        await queryRunner.query(`
            ALTER TABLE "grupos"
            DROP COLUMN IF EXISTS "competenciaId"
        `);
    }
}