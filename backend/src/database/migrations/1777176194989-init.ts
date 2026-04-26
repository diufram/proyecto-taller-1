import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1777176194989 implements MigrationInterface {
    name = 'Init1777176194989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "grupos" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "nombre" character varying NOT NULL, CONSTRAINT "PK_34de64ec8a5ecd99afb23b2bd62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."soluciones_estado_enum" AS ENUM('Pendiente', 'Correcto', 'Incorrecto', 'En revisión')`);
        await queryRunner.query(`CREATE TYPE "public"."soluciones_lenguaje_programacion_enum" AS ENUM('Python', 'Java', 'C', 'JavaScript', 'Pseudocodigo', 'Otro')`);
        await queryRunner.query(`CREATE TABLE "soluciones" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "respuesta" text NOT NULL, "estado" "public"."soluciones_estado_enum" NOT NULL, "lenguaje_programacion" "public"."soluciones_lenguaje_programacion_enum" NOT NULL, "resultado_validacion" boolean NOT NULL DEFAULT false, "problemaId" integer, "usuarioId" integer, CONSTRAINT "PK_f0f37e6a7ad8e96ffe202ca3758" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."problemas_dificultad_enum" AS ENUM('Facil', 'Medio', 'Dificil')`);
        await queryRunner.query(`CREATE TABLE "problemas" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "titulo" character varying NOT NULL, "descripcion" text NOT NULL, "dificultad" "public"."problemas_dificultad_enum" NOT NULL, "formato_entrada" text NOT NULL, "formato_salida" text NOT NULL, "ejemplo_entrada" text NOT NULL, "ejemplo_salida" text NOT NULL, "competenciaId" integer, CONSTRAINT "PK_3533a0bf7b5deabc98763101348" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rankings" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "posicion" integer NOT NULL, "puntuacion" integer NOT NULL, "usuarioId" integer, "competenciaId" integer, CONSTRAINT "PK_05d87d598d485338c9980373d20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."competencias_nivel_dificultad_enum" AS ENUM('Principiante', 'Intermedio', 'Avanzado')`);
        await queryRunner.query(`CREATE TYPE "public"."competencias_estado_enum" AS ENUM('Abierta', 'En curso', 'Finalizada', 'Cancelada')`);
        await queryRunner.query(`CREATE TYPE "public"."competencias_tipo_enum" AS ENUM('Individual', 'Grupal')`);
        await queryRunner.query(`CREATE TABLE "competencias" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "nombre" character varying NOT NULL, "descripcion" text NOT NULL, "fecha_inicio" TIMESTAMP NOT NULL, "fecha_fin" TIMESTAMP NOT NULL, "nivel_dificultad" "public"."competencias_nivel_dificultad_enum" NOT NULL, "estado" "public"."competencias_estado_enum" NOT NULL, "tipo" "public"."competencias_tipo_enum" NOT NULL, "max_participantes" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_5200c17b2042a1db2e495f3af37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inscripciones" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "fecha_inscripcion" TIMESTAMP NOT NULL, "usuarioId" integer, "grupoId" integer, "competenciaId" integer, CONSTRAINT "PK_17a12f6ab342f6762d81e940d19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "retroalimentacion_problemas" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "retroalimentacion" text NOT NULL, "usuarioId" integer, "problemaId" integer, CONSTRAINT "PK_136bd74d10d8c4495befdbdef5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "nombre_usuario" character varying NOT NULL, "correo_electronico" character varying NOT NULL, "contrasena" character varying NOT NULL, "rol" "public"."usuarios_rol_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e871b7157e4b74290df9baa9c93" UNIQUE ("correo_electronico"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "personas" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "nombre" character varying NOT NULL, "apellido" character varying NOT NULL, "celular" character varying NOT NULL, "correo" character varying NOT NULL, "usuarioId" integer, CONSTRAINT "REL_7c8c9bafba93459a6217ef8277" UNIQUE ("usuarioId"), CONSTRAINT "PK_714aa5d028f8f3e6645e971cecd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "soluciones" ADD CONSTRAINT "FK_a0ae4081c1192b4c388f9b4f647" FOREIGN KEY ("problemaId") REFERENCES "problemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "soluciones" ADD CONSTRAINT "FK_91d627a9126ee3c478ea58e2f2a" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "problemas" ADD CONSTRAINT "FK_0dd21502398bb8e62724fe5389c" FOREIGN KEY ("competenciaId") REFERENCES "competencias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rankings" ADD CONSTRAINT "FK_94873b84e9132a029f305bf9857" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rankings" ADD CONSTRAINT "FK_73d39512a12359c3144d117b02a" FOREIGN KEY ("competenciaId") REFERENCES "competencias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripciones" ADD CONSTRAINT "FK_fd351e2c00391ca09f6a39044eb" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripciones" ADD CONSTRAINT "FK_e68059dd1e1ddf336ff6e9b1281" FOREIGN KEY ("grupoId") REFERENCES "grupos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripciones" ADD CONSTRAINT "FK_7c5910a932d331413f8bd96871d" FOREIGN KEY ("competenciaId") REFERENCES "competencias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retroalimentacion_problemas" ADD CONSTRAINT "FK_fbec8f76b8573a4bfaca6a302a7" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "retroalimentacion_problemas" ADD CONSTRAINT "FK_fd7638ef4b10174c9e1e59c72b5" FOREIGN KEY ("problemaId") REFERENCES "problemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "personas" ADD CONSTRAINT "FK_7c8c9bafba93459a6217ef82774" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "personas" DROP CONSTRAINT "FK_7c8c9bafba93459a6217ef82774"`);
        await queryRunner.query(`ALTER TABLE "retroalimentacion_problemas" DROP CONSTRAINT "FK_fd7638ef4b10174c9e1e59c72b5"`);
        await queryRunner.query(`ALTER TABLE "retroalimentacion_problemas" DROP CONSTRAINT "FK_fbec8f76b8573a4bfaca6a302a7"`);
        await queryRunner.query(`ALTER TABLE "inscripciones" DROP CONSTRAINT "FK_7c5910a932d331413f8bd96871d"`);
        await queryRunner.query(`ALTER TABLE "inscripciones" DROP CONSTRAINT "FK_e68059dd1e1ddf336ff6e9b1281"`);
        await queryRunner.query(`ALTER TABLE "inscripciones" DROP CONSTRAINT "FK_fd351e2c00391ca09f6a39044eb"`);
        await queryRunner.query(`ALTER TABLE "rankings" DROP CONSTRAINT "FK_73d39512a12359c3144d117b02a"`);
        await queryRunner.query(`ALTER TABLE "rankings" DROP CONSTRAINT "FK_94873b84e9132a029f305bf9857"`);
        await queryRunner.query(`ALTER TABLE "problemas" DROP CONSTRAINT "FK_0dd21502398bb8e62724fe5389c"`);
        await queryRunner.query(`ALTER TABLE "soluciones" DROP CONSTRAINT "FK_91d627a9126ee3c478ea58e2f2a"`);
        await queryRunner.query(`ALTER TABLE "soluciones" DROP CONSTRAINT "FK_a0ae4081c1192b4c388f9b4f647"`);
        await queryRunner.query(`DROP TABLE "personas"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum"`);
        await queryRunner.query(`DROP TABLE "retroalimentacion_problemas"`);
        await queryRunner.query(`DROP TABLE "inscripciones"`);
        await queryRunner.query(`DROP TABLE "competencias"`);
        await queryRunner.query(`DROP TYPE "public"."competencias_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."competencias_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."competencias_nivel_dificultad_enum"`);
        await queryRunner.query(`DROP TABLE "rankings"`);
        await queryRunner.query(`DROP TABLE "problemas"`);
        await queryRunner.query(`DROP TYPE "public"."problemas_dificultad_enum"`);
        await queryRunner.query(`DROP TABLE "soluciones"`);
        await queryRunner.query(`DROP TYPE "public"."soluciones_lenguaje_programacion_enum"`);
        await queryRunner.query(`DROP TYPE "public"."soluciones_estado_enum"`);
        await queryRunner.query(`DROP TABLE "grupos"`);
    }

}
