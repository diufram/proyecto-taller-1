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
    // ---------- 7 Abiertas (futuras) ----------
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
    {
        nombre: 'Olimpíada Matemática 2026',
        descripcion:
            'Competencia individual avanzada de resolución de problemas matemáticos y algorítmicos de alta complejidad.',
        fecha_inicio: new Date('2026-07-01T08:00:00'),
        fecha_fin: new Date('2026-07-15T20:00:00'),
        nivel_dificultad: Nivel.AVANZADO,
        estado: Estado.ABIERTA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 80,
    },
    {
        nombre: 'Desafío de Estructuras de Datos',
        descripcion:
            'Competencia individual intermedia centrada en la implementación y uso eficiente de estructuras de datos.',
        fecha_inicio: new Date('2026-07-05T10:00:00'),
        fecha_fin: new Date('2026-07-12T22:00:00'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.ABIERTA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 100,
    },
    {
        nombre: 'Concurso de Programación Funcional',
        descripcion:
            'Competencia individual avanzada con foco en paradigmas funcionales: recursividad, inmutabilidad y funciones de orden superior.',
        fecha_inicio: new Date('2026-07-08T09:00:00'),
        fecha_fin: new Date('2026-07-20T18:00:00'),
        nivel_dificultad: Nivel.AVANZADO,
        estado: Estado.ABIERTA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 50,
    },
    {
        nombre: 'Torneo Universitario de Algoritmos',
        descripcion:
            'Competencia grupal intermedia para estudiantes universitarios. Equipos de hasta 4 integrantes.',
        fecha_inicio: new Date('2026-07-10T09:00:00'),
        fecha_fin: new Date('2026-07-25T20:00:00'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.ABIERTA,
        tipo: Tipo.GRUPAL,
        max_participantes: 4,
    },
    {
        nombre: 'Copa Femenina de Programación',
        descripcion:
            'Competencia individual principiante orientada a fomentar la participación femenina en programación.',
        fecha_inicio: new Date('2026-07-15T10:00:00'),
        fecha_fin: new Date('2026-08-05T18:00:00'),
        nivel_dificultad: Nivel.PRINCIPIANTE,
        estado: Estado.ABIERTA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 60,
    },
    {
        nombre: 'Code Sprint Universitario',
        descripcion:
            'Competencia individual intermedia de velocidad para estudiantes. Problemas de dificultad media en sesiones cortas.',
        fecha_inicio: new Date('2026-07-20T14:00:00'),
        fecha_fin: new Date('2026-07-30T22:00:00'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.ABIERTA,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 120,
    },

    // ---------- 6 En curso ----------
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
    {
        nombre: 'Maratón de Verano 2026',
        descripcion:
            'Competencia individual intermedia de 15 días. Problemas variados de dificultad media para practicar durante el verano.',
        fecha_inicio: new Date('2026-06-20T08:00:00'),
        fecha_fin: new Date('2026-07-05T23:59:59'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.EN_CURSO,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 80,
    },
    {
        nombre: 'Hackathon Universitario',
        descripcion:
            'Hackathon grupal avanzado. Equipos de hasta 3 integrantes resuelven problemas algorítmicos complejos en 13 días.',
        fecha_inicio: new Date('2026-06-22T09:00:00'),
        fecha_fin: new Date('2026-07-05T20:00:00'),
        nivel_dificultad: Nivel.AVANZADO,
        estado: Estado.EN_CURSO,
        tipo: Tipo.GRUPAL,
        max_participantes: 3,
    },
    {
        nombre: 'Concurso de Verano Principiante',
        descripcion:
            'Competencia individual principiante de 12 días con problemas suaves para quienes están empezando.',
        fecha_inicio: new Date('2026-06-18T10:00:00'),
        fecha_fin: new Date('2026-06-30T20:00:00'),
        nivel_dificultad: Nivel.PRINCIPIANTE,
        estado: Estado.EN_CURSO,
        tipo: Tipo.INDIVIDUAL,
        max_participantes: 150,
    },
    {
        nombre: 'Liga de Programación Junior',
        descripcion:
            'Liga grupal intermedia para estudiantes junior. Equipos de hasta 4 integrantes compiten por dos semanas.',
        fecha_inicio: new Date('2026-06-15T10:00:00'),
        fecha_fin: new Date('2026-07-01T20:00:00'),
        nivel_dificultad: Nivel.INTERMEDIO,
        estado: Estado.EN_CURSO,
        tipo: Tipo.GRUPAL,
        max_participantes: 4,
    },

    // ---------- 3 Finalizadas ----------
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

    // ---------- 2 Canceladas ----------
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
    {
        nombre: 'Reto Legacy',
        descripcion:
            'Competencia individual principiante. Problemas de algoritmos básicos y manejo de datos simples. Cancelada por baja convocatoria.',
        fecha_inicio: new Date('2026-01-01T10:00:00'),
        fecha_fin: new Date('2026-01-31T23:59:59'),
        nivel_dificultad: Nivel.PRINCIPIANTE,
        estado: Estado.CANCELADA,
        tipo: Tipo.INDIVIDUAL,
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
