import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Inscripcion } from '../entities/inscripcion.entity';
import { Usuario } from '../entities/usuario.entity';
import { Competencia } from '../entities/competencia.entity';
import { Seed } from './base.seed';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: true,
});

interface InscripcionData {
  usuario_correo: string;
  competencia_nombre: string;
}

const inscripcionesData: InscripcionData[] = [
  // ===== Finalizadas =====
  {
    usuario_correo: 'lucas@gmail.com',
    competencia_nombre: 'Duelo de Algoritmos',
  },
  {
    usuario_correo: 'sofia@gmail.com',
    competencia_nombre: 'Duelo de Algoritmos',
  },

  {
    usuario_correo: 'juan@gmail.com',
    competencia_nombre: 'Maratón de Programación 2026',
  },
  {
    usuario_correo: 'martin@gmail.com',
    competencia_nombre: 'Maratón de Programación 2026',
  },

  {
    usuario_correo: 'camila@gmail.com',
    competencia_nombre: 'Olimpíadas de Código',
  },
  {
    usuario_correo: 'florencia@gmail.com',
    competencia_nombre: 'Olimpíadas de Código',
  },

  // ===== En curso =====
  {
    usuario_correo: 'valentina@gmail.com',
    competencia_nombre: 'Copa Junior 2026',
  },
  {
    usuario_correo: 'santiago@gmail.com',
    competencia_nombre: 'Copa Junior 2026',
  },
  {
    usuario_correo: 'camila@gmail.com',
    competencia_nombre: 'Copa Junior 2026',
  },
  {
    usuario_correo: 'martin@gmail.com',
    competencia_nombre: 'Copa Junior 2026',
  },
  {
    usuario_correo: 'florencia@gmail.com',
    competencia_nombre: 'Copa Junior 2026',
  },

  {
    usuario_correo: 'juan@gmail.com',
    competencia_nombre: 'Proyecto Colaborativo 2026',
  },
  {
    usuario_correo: 'maria@gmail.com',
    competencia_nombre: 'Proyecto Colaborativo 2026',
  },
  {
    usuario_correo: 'martin@gmail.com',
    competencia_nombre: 'Proyecto Colaborativo 2026',
  },
  {
    usuario_correo: 'florencia@gmail.com',
    competencia_nombre: 'Proyecto Colaborativo 2026',
  },

  {
    usuario_correo: 'santiago@gmail.com',
    competencia_nombre: 'Maratón de Verano 2026',
  },
  {
    usuario_correo: 'bruno@gmail.com',
    competencia_nombre: 'Maratón de Verano 2026',
  },
  {
    usuario_correo: 'renata@gmail.com',
    competencia_nombre: 'Maratón de Verano 2026',
  },

  {
    usuario_correo: 'diego@gmail.com',
    competencia_nombre: 'Hackathon Universitario',
  },
  {
    usuario_correo: 'paula@gmail.com',
    competencia_nombre: 'Hackathon Universitario',
  },
  {
    usuario_correo: 'bruno@gmail.com',
    competencia_nombre: 'Hackathon Universitario',
  },

  {
    usuario_correo: 'valentina@gmail.com',
    competencia_nombre: 'Concurso de Verano Principiante',
  },
  {
    usuario_correo: 'santiago@gmail.com',
    competencia_nombre: 'Concurso de Verano Principiante',
  },
  {
    usuario_correo: 'renata@gmail.com',
    competencia_nombre: 'Concurso de Verano Principiante',
  },

  {
    usuario_correo: 'juan@gmail.com',
    competencia_nombre: 'Liga de Programación Junior',
  },
  {
    usuario_correo: 'maria@gmail.com',
    competencia_nombre: 'Liga de Programación Junior',
  },
  {
    usuario_correo: 'martin@gmail.com',
    competencia_nombre: 'Liga de Programación Junior',
  },
  {
    usuario_correo: 'florencia@gmail.com',
    competencia_nombre: 'Liga de Programación Junior',
  },
  {
    usuario_correo: 'lucas@gmail.com',
    competencia_nombre: 'Liga de Programación Junior',
  },
  {
    usuario_correo: 'sofia@gmail.com',
    competencia_nombre: 'Liga de Programación Junior',
  },
  {
    usuario_correo: 'valentina@gmail.com',
    competencia_nombre: 'Liga de Programación Junior',
  },
  {
    usuario_correo: 'santiago@gmail.com',
    competencia_nombre: 'Liga de Programación Junior',
  },

  // ===== Abiertas =====
  {
    usuario_correo: 'matias@gmail.com',
    competencia_nombre: 'Clasificatorio Regional 2026',
  },
  {
    usuario_correo: 'lucas@gmail.com',
    competencia_nombre: 'Clasificatorio Regional 2026',
  },

  {
    usuario_correo: 'sofia@gmail.com',
    competencia_nombre: 'Olimpíada Matemática 2026',
  },
  {
    usuario_correo: 'camila@gmail.com',
    competencia_nombre: 'Olimpíada Matemática 2026',
  },
  {
    usuario_correo: 'florencia@gmail.com',
    competencia_nombre: 'Olimpíada Matemática 2026',
  },

  {
    usuario_correo: 'martin@gmail.com',
    competencia_nombre: 'Desafío de Estructuras de Datos',
  },
  {
    usuario_correo: 'diego@gmail.com',
    competencia_nombre: 'Desafío de Estructuras de Datos',
  },

  {
    usuario_correo: 'paula@gmail.com',
    competencia_nombre: 'Concurso de Programación Funcional',
  },
  {
    usuario_correo: 'bruno@gmail.com',
    competencia_nombre: 'Concurso de Programación Funcional',
  },

  {
    usuario_correo: 'juan@gmail.com',
    competencia_nombre: 'Torneo Universitario de Algoritmos',
  },
  {
    usuario_correo: 'maria@gmail.com',
    competencia_nombre: 'Torneo Universitario de Algoritmos',
  },
  {
    usuario_correo: 'martin@gmail.com',
    competencia_nombre: 'Torneo Universitario de Algoritmos',
  },
  {
    usuario_correo: 'florencia@gmail.com',
    competencia_nombre: 'Torneo Universitario de Algoritmos',
  },
  {
    usuario_correo: 'sofia@gmail.com',
    competencia_nombre: 'Torneo Universitario de Algoritmos',
  },
  {
    usuario_correo: 'valentina@gmail.com',
    competencia_nombre: 'Torneo Universitario de Algoritmos',
  },
  {
    usuario_correo: 'santiago@gmail.com',
    competencia_nombre: 'Torneo Universitario de Algoritmos',
  },

  {
    usuario_correo: 'valentina@gmail.com',
    competencia_nombre: 'Copa Femenina de Programación',
  },
  {
    usuario_correo: 'maria@gmail.com',
    competencia_nombre: 'Copa Femenina de Programación',
  },

  {
    usuario_correo: 'renata@gmail.com',
    competencia_nombre: 'Code Sprint Universitario',
  },
  {
    usuario_correo: 'facundo@gmail.com',
    competencia_nombre: 'Code Sprint Universitario',
  },
];

export const inscripcionesSeed: Seed = {
  order: 5,
  name: 'Inscripciones',
  run: async () => {
    await dataSource.initialize();
    console.log('🔌 Conectado a la base de datos para seed');

    const inscripcionRepository = dataSource.getRepository(Inscripcion);
    const usuarioRepository = dataSource.getRepository(Usuario);
    const competenciaRepository = dataSource.getRepository(Competencia);

    for (const data of inscripcionesData) {
      const competencia = await competenciaRepository.findOne({
        where: { nombre: data.competencia_nombre },
      });
      if (!competencia) {
        console.log(
          `⚠️  Competencia "${data.competencia_nombre}" no encontrada, omitiendo.`,
        );
        continue;
      }

      const usuario = await usuarioRepository.findOne({
        where: { correo_electronico: data.usuario_correo },
      });
      if (!usuario) {
        console.log(
          `⚠️  Usuario "${data.usuario_correo}" no encontrado, omitiendo.`,
        );
        continue;
      }

      const exists = await inscripcionRepository.findOne({
        where: {
          usuario: { id: usuario.id },
          competencia: { id: competencia.id },
        },
      });
      if (exists) {
        console.log(
          `ℹ️  Inscripción de ${data.usuario_correo} en "${data.competencia_nombre}" ya existe.`,
        );
        continue;
      }

      const inscripcion = inscripcionRepository.create({
        usuario: { id: usuario.id },
        competencia: { id: competencia.id },
        fecha_inscripcion: new Date(),
      });
      await inscripcionRepository.save(inscripcion);
      console.log(
        `✅ Inscripción individual: ${data.usuario_correo} → "${data.competencia_nombre}"`,
      );
    }

    console.log('✅ Seeds de inscripciones completados');
    await dataSource.destroy();
  },
};
