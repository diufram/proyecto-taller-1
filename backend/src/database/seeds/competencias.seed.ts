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

export const competenciasSeed: Seed = {
    order: 3,
    name: 'Competencias',
    run: async () => {
        await dataSource.initialize();
        console.log('🔌 Conectado a la base de datos para seed');

        const repository = dataSource.getRepository(Competencia);

        const competenciasData = [
            {
                nombre: 'Concurso de Algoritmos',
                descripcion: 'Competencia individual de resolución de algoritmos. Demuestra tus habilidades de programación.',
                fecha_inicio: new Date('2026-06-01T10:00:00'),
                fecha_fin: new Date('2026-06-15T23:59:59'),
                nivel_dificultad: Nivel.INTERMEDIO,
                estado: Estado.ABIERTA,
                tipo: Tipo.INDIVIDUAL,
                max_participantes: 50,
            },
            {
                nombre: 'Hackathon Grupal 2026',
                descripcion: 'Competencia grupal donde equipos de hasta 4 personas deben resolver problemas complejos.',
                fecha_inicio: new Date('2026-06-10T09:00:00'),
                fecha_fin: new Date('2026-06-20T18:00:00'),
                nivel_dificultad: Nivel.AVANZADO,
                estado: Estado.ABIERTA,
                tipo: Tipo.GRUPAL,
                max_participantes: 4,
            },
            {
                nombre: 'Reto Legacy',
                descripcion: 'Competencia individual finalizada. Solo para consulta de resultados.',
                fecha_inicio: new Date('2026-01-01T10:00:00'),
                fecha_fin: new Date('2026-01-31T23:59:59'),
                nivel_dificultad: Nivel.PRINCIPIANTE,
                estado: Estado.FINALIZADA,
                tipo: Tipo.INDIVIDUAL,
                max_participantes: 30,
            },
            {
                nombre: 'Sprint de Código',
                descripcion: 'Competencia individual de velocidad. Resuelve el mayor número de problemas en 2 horas.',
                fecha_inicio: new Date('2026-06-05T14:00:00'),
                fecha_fin: new Date('2026-06-05T18:00:00'),
                nivel_dificultad: Nivel.PRINCIPIANTE,
                estado: Estado.ABIERTA,
                tipo: Tipo.INDIVIDUAL,
                max_participantes: 100,
            },
            {
                nombre: 'Batalla de Equipos',
                descripcion: 'Competencia grupal de alto nivel. Equipos de hasta 5 integrantes.',
                fecha_inicio: new Date('2026-06-12T08:00:00'),
                fecha_fin: new Date('2026-06-18T20:00:00'),
                nivel_dificultad: Nivel.AVANZADO,
                estado: Estado.EN_CURSO,
                tipo: Tipo.GRUPAL,
                max_participantes: 5,
            },
            {
                nombre: 'Maratón de Programación',
                descripcion: 'Competencia individual de larga duración. 48 horas para resolver múltiples problemas.',
                fecha_inicio: new Date('2026-05-20T00:00:00'),
                fecha_fin: new Date('2026-05-22T23:59:59'),
                nivel_dificultad: Nivel.INTERMEDIO,
                estado: Estado.FINALIZADA,
                tipo: Tipo.INDIVIDUAL,
                max_participantes: 25,
            },
            {
                nombre: 'Copa Junior',
                descripcion: 'Competencia grupal para principiantes. Ideal para empezar en competencias.',
                fecha_inicio: new Date('2026-06-15T10:00:00'),
                fecha_fin: new Date('2026-06-25T17:00:00'),
                nivel_dificultad: Nivel.PRINCIPIANTE,
                estado: Estado.ABIERTA,
                tipo: Tipo.GRUPAL,
                max_participantes: 3,
            },
            {
                nombre: 'Reto Inteligencia Artificial',
                descripcion: 'Competencia individual enfocada en problemas de IA y machine learning.',
                fecha_inicio: new Date('2026-05-01T09:00:00'),
                fecha_fin: new Date('2026-05-15T18:00:00'),
                nivel_dificultad: Nivel.AVANZADO,
                estado: Estado.CANCELADA,
                tipo: Tipo.INDIVIDUAL,
                max_participantes: 40,
            },
            {
                nombre: 'Duelo de Algoritmos',
                descripcion: 'Competencia individual 1v1. Clasificatorios y eliminación directa.',
                fecha_inicio: new Date('2026-06-20T16:00:00'),
                fecha_fin: new Date('2026-06-21T21:00:00'),
                nivel_dificultad: Nivel.INTERMEDIO,
                estado: Estado.ABIERTA,
                tipo: Tipo.INDIVIDUAL,
                max_participantes: 16,
            },
            {
                nombre: 'Proyecto Colaborativo',
                descripcion: 'Competencia grupal donde cada equipo debe entregar un proyecto completo.',
                fecha_inicio: new Date('2026-06-08T09:00:00'),
                fecha_fin: new Date('2026-06-30T23:59:59'),
                nivel_dificultad: Nivel.INTERMEDIO,
                estado: Estado.EN_CURSO,
                tipo: Tipo.GRUPAL,
                max_participantes: 4,
            },
            {
                nombre: 'Desafío Backend',
                descripcion: 'Competencia individual de desarrollo backend. API REST, bases de datos y más.',
                fecha_inicio: new Date('2026-04-15T10:00:00'),
                fecha_fin: new Date('2026-04-30T18:00:00'),
                nivel_dificultad: Nivel.AVANZADO,
                estado: Estado.FINALIZADA,
                tipo: Tipo.INDIVIDUAL,
                max_participantes: 20,
            },
            {
                nombre: 'Hackathon Express',
                descripcion: 'Competencia grupal rápida. 24 horas para crear una solución funcional.',
                fecha_inicio: new Date('2026-06-22T09:00:00'),
                fecha_fin: new Date('2026-06-23T09:00:00'),
                nivel_dificultad: Nivel.INTERMEDIO,
                estado: Estado.ABIERTA,
                tipo: Tipo.GRUPAL,
                max_participantes: 3,
            },
            {
                nombre: 'Olimpíadas de Código',
                descripcion: 'Competencia individual estilo olímpico. Problemas de alta complejidad.',
                fecha_inicio: new Date('2026-03-01T08:00:00'),
                fecha_fin: new Date('2026-03-15T20:00:00'),
                nivel_dificultad: Nivel.AVANZADO,
                estado: Estado.FINALIZADA,
                tipo: Tipo.INDIVIDUAL,
                max_participantes: 15,
            },
            {
                nombre: 'Reto Fullstack',
                descripcion: 'Competencia grupal para construir aplicaciones fullstack completas.',
                fecha_inicio: new Date('2026-06-01T10:00:00'),
                fecha_fin: new Date('2026-06-10T18:00:00'),
                nivel_dificultad: Nivel.INTERMEDIO,
                estado: Estado.EN_CURSO,
                tipo: Tipo.GRUPAL,
                max_participantes: 4,
            },
            {
                nombre: 'Clasificatorio Regional',
                descripcion: 'Competencia individual para clasificar al evento nacional.',
                fecha_inicio: new Date('2026-07-01T09:00:00'),
                fecha_fin: new Date('2026-07-05T18:00:00'),
                nivel_dificultad: Nivel.AVANZADO,
                estado: Estado.ABIERTA,
                tipo: Tipo.INDIVIDUAL,
                max_participantes: 60,
            },
        ];

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