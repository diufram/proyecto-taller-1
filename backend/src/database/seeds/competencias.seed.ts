import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Competencia, Nivel, Estado, Tipo } from '../entities/competencia.entity';
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
    descripcion: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    nivel_dificultad: Nivel;
    estado: Estado;
    tipo: Tipo;
    max_participantes: number;
}

const competenciasData: CompetenciaData[] = [
    // ---------- Abiertas (futuras, se puede inscribir) ----------
    {
        nombre: 'Clasificatorio Regional 2026',
        descripcion:
            'Competencia individual que clasifica al evento nacional. Problemas de dificultad media-alta con foco en algoritmos clásicos.',
        fecha_inicio: new Date('2026-07-01T09:00:00'),
        fecha_fin: new Date('2026-07-05T20:00:00'),
        nivel_dificultad: Nivel.AVANZADO,
        estado: Estado.ABIERTA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 60,
    },

    // ---------- En curso ----------
    {
        nombre: 'Copa Junior 2026',
        descripcion:
            'Competencia grupal para principiantes. Equipos de hasta 3 integrantes resuelven problemas introductorios de programación.',
        fecha_inicio: new Date('2026-06-15T10:00:00'),
        fecha_fin: new Date('2026-06-25T17:00:00'),
        nivel_dificultad: Nivel.PRINCIPIANTE,
        estado: Estado.EN_CURSO,
        tipo: Tipo.GRUPAL,
        max_participantes: 3,
    },
    {
        nombre: 'Proyecto Colaborativo 2026',
        descripcion:
            'Competencia grupal intermedia. Equipos de hasta 4 integrantes colaboran en problemas de dificultad media.',
        fecha_inicio: new Date('2026-06-08T09:00:00'),
        fecha_fin: new Date('2026-06-30T23:59:59'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.EN_CURSO,
        tipo: Tipo.GRUPAL,
        max_participantes: 4,
    },

    // ---------- Finalizadas (con soluciones para que el admin califique con IA) ----------
    {
        nombre: 'Concurso de Algoritmos',
        descripcion:
            'Competencia individual intermedia de resolución de algoritmos. Abarca desde operaciones básicas hasta algoritmos de búsqueda y ordenamiento.',
        fecha_inicio: new Date('2026-06-01T10:00:00'),
        fecha_fin: new Date('2026-06-15T23:59:59'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.FINALIZADA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 50,
    },
    {
        nombre: 'Hackathon Grupal 2026',
        descripcion:
            'Hackathon grupal avanzado. Equipos de hasta 4 integrantes resuelven problemas algorítmicos y de optimización en un tiempo limitado.',
        fecha_inicio: new Date('2026-06-10T09:00:00'),
        fecha_fin: new Date('2026-06-20T18:00:00'),
        nivel_dificultad: Nivel.AVANZADO,
        estado: Estado.FINALIZADA,
        tipo: Tipo.GRUPAL,
        max_participantes: 4,
    },
    {
        nombre: 'Sprint de Código',
        descripcion:
            'Competencia individual de velocidad. Resolver la mayor cantidad de problemas introductorios en pocas horas.',
        fecha_inicio: new Date('2026-06-05T14:00:00'),
        fecha_fin: new Date('2026-06-05T18:00:00'),
        nivel_dificultad: Nivel.PRINCIPIANTE,
        estado: Estado.FINALIZADA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 100,
    },
    {
        nombre: 'Duelo de Algoritmos',
        descripcion:
            'Competencia individual intermedia. Cada participante resuelve problemas en formato uno a uno contra el reloj.',
        fecha_inicio: new Date('2026-06-20T16:00:00'),
        fecha_fin: new Date('2026-06-21T21:00:00'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.FINALIZADA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 16,
    },
    {
        nombre: 'Maratón de Programación 2026',
        descripcion:
            'Competencia individual intermedia de larga duración. Problemas de dificultad creciente durante 48 horas.',
        fecha_inicio: new Date('2026-05-20T00:00:00'),
        fecha_fin: new Date('2026-05-22T23:59:59'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.FINALIZADA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 25,
    },
    {
        nombre: 'Olimpíadas de Código',
        descripcion:
            'Competencia individual estilo olímpico. Problemas de alta complejidad, estructuras de datos y algoritmos avanzados.',
        fecha_inicio: new Date('2026-03-01T08:00:00'),
        fecha_fin: new Date('2026-03-15T20:00:00'),
        nivel_dificultad: Nivel.AVANZADO,
        estado: Estado.FINALIZADA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 15,
    },
    {
        nombre: 'Reto Backend 2026',
        descripcion:
            'Competencia individual avanzada. Problemas de implementación de lógica de backend, estructuras y consultas.',
        fecha_inicio: new Date('2026-04-15T10:00:00'),
        fecha_fin: new Date('2026-04-30T18:00:00'),
        nivel_dificultad: Nivel.AVANZADO,
        estado: Estado.FINALIZADA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 20,
    },
    {
        nombre: 'Reto Fullstack 2026',
        descripcion:
            'Competencia grupal intermedia. Equipos de hasta 4 integrantes resuelven problemas de lógica con foco fullstack.',
        fecha_inicio: new Date('2026-06-01T10:00:00'),
        fecha_fin: new Date('2026-06-10T18:00:00'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.FINALIZADA,
        tipo: Tipo.GRUPAL,
        max_participantes: 4,
    },
    {
        nombre: 'Hackathon Express 2026',
        descripcion:
            'Hackathon grupal intermedia exprés. 24 horas para resolver problemas de dificultad media.',
        fecha_inicio: new Date('2026-06-22T09:00:00'),
        fecha_fin: new Date('2026-06-23T09:00:00'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.FINALIZADA,
        tipo: Tipo.GRUPAL,
        max_participantes: 3,
    },
    {
        nombre: 'Reto Legacy',
        descripcion:
            'Competencia individual principiante. Problemas de algoritmos básicos y manejo de datos simples.',
        fecha_inicio: new Date('2026-01-01T10:00:00'),
        fecha_fin: new Date('2026-01-31T23:59:59'),
        nivel_dificultad: Nivel.PRINCIPIANTE,
        estado: Estado.FINALIZADA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 30,
    },
    {
        nombre: 'Batalla de Equipos',
        descripcion:
            'Competencia grupal avanzada. Equipos de hasta 5 integrantes compiten en problemas algorítmicos complejos.',
        fecha_inicio: new Date('2026-06-12T08:00:00'),
        fecha_fin: new Date('2026-06-18T20:00:00'),
        nivel_dificultad: Nivel.AVANZADO,
        estado: Estado.FINALIZADA,
        tipo: Tipo.GRUPAL,
        max_participantes: 5,
    },

    // ---------- Canceladas ----------
    {
        nombre: 'Reto Inteligencia Artificial',
        descripcion:
            'Competencia individual avanzada enfocada en problemas de IA. Cancelada por reorganización del calendario.',
        fecha_inicio: new Date('2026-05-01T09:00:00'),
        fecha_fin: new Date('2026-05-15T18:00:00'),
        nivel_dificultad: Nivel.AVANZADO,
        estado: Estado.CANCELADA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 40,
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
                console.log(`ℹ️  La competencia "${data.nombre}" ya existe, omitiendo.`);
                continue;
            }

            const competencia = repository.create(data);
            await repository.save(competencia);
            console.log(`✅ Competencia creada: ${data.nombre} (${data.tipo} - ${data.estado})`);
        }

        console.log('✅ Seeds de competencias completados');

        await dataSource.destroy();
    },
};
