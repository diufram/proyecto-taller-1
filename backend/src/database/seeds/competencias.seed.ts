import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Competencia, Nivel, Estado } from '../entities/competencia.entity';
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

interface CompetenciaData {
  nombre: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  nivel_dificultad: Nivel;
  estado: Estado;
  max_participantes: number;
}

const competenciasData: CompetenciaData[] = [
  // ---------- 7 Abiertas (futuras) ----------
  {
    nombre: 'Clasificatorio Regional 2026',
    fecha_inicio: new Date('2026-07-01T09:00:00'),
    fecha_fin: new Date('2026-07-05T20:00:00'),
    nivel_dificultad: Nivel.AVANZADO,
    estado: Estado.ABIERTA,
    max_participantes: 60,
  },
  {
    nombre: 'Olimpíada Matemática 2026',
    fecha_inicio: new Date('2026-07-01T08:00:00'),
    fecha_fin: new Date('2026-07-15T20:00:00'),
    nivel_dificultad: Nivel.AVANZADO,
    estado: Estado.ABIERTA,
    max_participantes: 80,
  },
  {
    nombre: 'Desafío de Estructuras de Datos',
    fecha_inicio: new Date('2026-07-05T10:00:00'),
    fecha_fin: new Date('2026-07-12T22:00:00'),
    nivel_dificultad: Nivel.INTERMEDIO,
    estado: Estado.ABIERTA,
    max_participantes: 100,
  },
  {
    nombre: 'Concurso de Programación Funcional',
    fecha_inicio: new Date('2026-07-08T09:00:00'),
    fecha_fin: new Date('2026-07-20T18:00:00'),
    nivel_dificultad: Nivel.AVANZADO,
    estado: Estado.ABIERTA,
    max_participantes: 50,
  },
  {
    nombre: 'Torneo Universitario de Algoritmos',
    fecha_inicio: new Date('2026-07-10T09:00:00'),
    fecha_fin: new Date('2026-07-25T20:00:00'),
    nivel_dificultad: Nivel.INTERMEDIO,
    estado: Estado.ABIERTA,
    max_participantes: 80,
  },
  {
    nombre: 'Copa Femenina de Programación',
    fecha_inicio: new Date('2026-07-15T10:00:00'),
    fecha_fin: new Date('2026-08-05T18:00:00'),
    nivel_dificultad: Nivel.PRINCIPIANTE,
    estado: Estado.ABIERTA,
    max_participantes: 60,
  },
  {
    nombre: 'Code Sprint Universitario',
    fecha_inicio: new Date('2026-07-20T14:00:00'),
    fecha_fin: new Date('2026-07-30T22:00:00'),
    nivel_dificultad: Nivel.INTERMEDIO,
    estado: Estado.ABIERTA,
    max_participantes: 120,
  },

  // ---------- 6 En curso ----------
  {
    nombre: 'Copa Junior 2026',
    fecha_inicio: new Date('2026-06-15T10:00:00'),
    fecha_fin: new Date('2026-06-25T17:00:00'),
    nivel_dificultad: Nivel.PRINCIPIANTE,
    estado: Estado.EN_CURSO,
    max_participantes: 60,
  },
  {
    nombre: 'Proyecto Colaborativo 2026',
    fecha_inicio: new Date('2026-06-08T09:00:00'),
    fecha_fin: new Date('2026-06-30T23:59:59'),
    nivel_dificultad: Nivel.INTERMEDIO,
    estado: Estado.EN_CURSO,
    max_participantes: 80,
  },
  {
    nombre: 'Maratón de Verano 2026',
    fecha_inicio: new Date('2026-06-20T08:00:00'),
    fecha_fin: new Date('2026-07-05T23:59:59'),
    nivel_dificultad: Nivel.INTERMEDIO,
    estado: Estado.EN_CURSO,
    max_participantes: 80,
  },
  {
    nombre: 'Hackathon Universitario',
    fecha_inicio: new Date('2026-06-22T09:00:00'),
    fecha_fin: new Date('2026-07-05T20:00:00'),
    nivel_dificultad: Nivel.AVANZADO,
    estado: Estado.EN_CURSO,
    max_participantes: 60,
  },
  {
    nombre: 'Concurso de Verano Principiante',
    fecha_inicio: new Date('2026-06-18T10:00:00'),
    fecha_fin: new Date('2026-06-30T20:00:00'),
    nivel_dificultad: Nivel.PRINCIPIANTE,
    estado: Estado.EN_CURSO,
    max_participantes: 150,
  },
  {
    nombre: 'Liga de Programación Junior',
    fecha_inicio: new Date('2026-06-15T10:00:00'),
    fecha_fin: new Date('2026-07-01T20:00:00'),
    nivel_dificultad: Nivel.INTERMEDIO,
    estado: Estado.EN_CURSO,
    max_participantes: 100,
  },

  // ---------- 3 Finalizadas ----------
  {
    nombre: 'Duelo de Algoritmos',
    fecha_inicio: new Date('2026-06-20T16:00:00'),
    fecha_fin: new Date('2026-06-21T21:00:00'),
    nivel_dificultad: Nivel.INTERMEDIO,
    estado: Estado.FINALIZADA,
    max_participantes: 16,
  },
  {
    nombre: 'Maratón de Programación 2026',
    fecha_inicio: new Date('2026-05-20T00:00:00'),
    fecha_fin: new Date('2026-05-22T23:59:59'),
    nivel_dificultad: Nivel.INTERMEDIO,
    estado: Estado.FINALIZADA,
    max_participantes: 25,
  },
  {
    nombre: 'Olimpíadas de Código',
    fecha_inicio: new Date('2026-03-01T08:00:00'),
    fecha_fin: new Date('2026-03-15T20:00:00'),
    nivel_dificultad: Nivel.AVANZADO,
    estado: Estado.FINALIZADA,
    max_participantes: 15,
  },

  // ---------- 2 Canceladas ----------
  {
    nombre: 'Reto Inteligencia Artificial',
    fecha_inicio: new Date('2026-05-01T09:00:00'),
    fecha_fin: new Date('2026-05-15T18:00:00'),
    nivel_dificultad: Nivel.AVANZADO,
    estado: Estado.CANCELADA,
    max_participantes: 40,
  },
  {
    nombre: 'Reto Legacy',
    fecha_inicio: new Date('2026-01-01T10:00:00'),
    fecha_fin: new Date('2026-01-31T23:59:59'),
    nivel_dificultad: Nivel.PRINCIPIANTE,
    estado: Estado.CANCELADA,
    max_participantes: 30,
  },
];

export const competenciasSeed: Seed = {
  order: 3,
  name: 'Competencias',
  run: async () => {
    await dataSource.initialize();
    console.log('🔌 Conectado a la base de datos para seed');

    const repository = dataSource.getRepository(Competencia);

    for (const data of competenciasData) {
      const existing = await repository.findOne({
        where: { nombre: data.nombre },
      });

      if (existing) {
        console.log(
          `ℹ️  La competencia "${data.nombre}" ya existe, omitiendo.`,
        );
        continue;
      }

      const competencia = repository.create(data);
      await repository.save(competencia);
      console.log(`✅ Competencia creada: ${data.nombre} (${data.estado})`);
    }

    console.log('✅ Seeds de competencias completados');

    await dataSource.destroy();
  },
};
