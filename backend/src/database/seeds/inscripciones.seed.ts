import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Inscripcion } from '../entities/inscripcion.entity';
import { Usuario } from '../entities/usuario.entity';
import { Competencia } from '../entities/competencia.entity';
import { Grupo } from '../entities/grupo.entity';
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
    grupo_nombre?: string;
    integrantes?: string[]; // correos; el primero es el líder
}

const inscripcionesData: InscripcionData[] = [
    // ===== Finalizadas - Individuales (cada usuario resuelve por su cuenta) =====
    { usuario_correo: 'lucas@gmail.com', competencia_nombre: 'Duelo de Algoritmos' },
    { usuario_correo: 'sofia@gmail.com', competencia_nombre: 'Duelo de Algoritmos' },

    { usuario_correo: 'juan@gmail.com', competencia_nombre: 'Maratón de Programación 2026' },
    { usuario_correo: 'martin@gmail.com', competencia_nombre: 'Maratón de Programación 2026' },

    { usuario_correo: 'camila@gmail.com', competencia_nombre: 'Olimpíadas de Código' },
    { usuario_correo: 'florencia@gmail.com', competencia_nombre: 'Olimpíadas de Código' },

    // ===== En curso (se pueden seguir inscribiendo) =====
    { usuario_correo: 'valentina@gmail.com', competencia_nombre: 'Copa Junior 2026' },
    { usuario_correo: 'santiago@gmail.com', competencia_nombre: 'Copa Junior 2026' },
    {
        usuario_correo: 'camila@gmail.com',
        competencia_nombre: 'Copa Junior 2026',
        grupo_nombre: 'Los Juniors',
        integrantes: ['camila@gmail.com', 'martin@gmail.com', 'florencia@gmail.com'],
    },

    {
        usuario_correo: 'juan@gmail.com',
        competencia_nombre: 'Proyecto Colaborativo 2026',
        grupo_nombre: 'Innovadores',
        integrantes: ['juan@gmail.com', 'maria@gmail.com', 'martin@gmail.com', 'florencia@gmail.com'],
    },

    // ===== Abierta (algunos usuarios ya inscritos para probar) =====
    { usuario_correo: 'matias@gmail.com', competencia_nombre: 'Clasificatorio Regional 2026' },
    { usuario_correo: 'lucas@gmail.com', competencia_nombre: 'Clasificatorio Regional 2026' },

    // ===== Abiertas nuevas (futuras) =====
    { usuario_correo: 'sofia@gmail.com', competencia_nombre: 'Olimpíada Matemática 2026' },
    { usuario_correo: 'camila@gmail.com', competencia_nombre: 'Olimpíada Matemática 2026' },
    { usuario_correo: 'florencia@gmail.com', competencia_nombre: 'Olimpíada Matemática 2026' },

    { usuario_correo: 'martin@gmail.com', competencia_nombre: 'Desafío de Estructuras de Datos' },
    { usuario_correo: 'diego@gmail.com', competencia_nombre: 'Desafío de Estructuras de Datos' },

    { usuario_correo: 'paula@gmail.com', competencia_nombre: 'Concurso de Programación Funcional' },
    { usuario_correo: 'bruno@gmail.com', competencia_nombre: 'Concurso de Programación Funcional' },

    {
        usuario_correo: 'juan@gmail.com',
        competencia_nombre: 'Torneo Universitario de Algoritmos',
        grupo_nombre: 'Los Compiladores',
        integrantes: ['juan@gmail.com', 'maria@gmail.com', 'martin@gmail.com', 'florencia@gmail.com'],
    },
    {
        usuario_correo: 'sofia@gmail.com',
        competencia_nombre: 'Torneo Universitario de Algoritmos',
        grupo_nombre: 'Code Warriors',
        integrantes: ['sofia@gmail.com', 'valentina@gmail.com', 'santiago@gmail.com'],
    },

    { usuario_correo: 'valentina@gmail.com', competencia_nombre: 'Copa Femenina de Programación' },
    { usuario_correo: 'maria@gmail.com', competencia_nombre: 'Copa Femenina de Programación' },

    { usuario_correo: 'renata@gmail.com', competencia_nombre: 'Code Sprint Universitario' },
    { usuario_correo: 'facundo@gmail.com', competencia_nombre: 'Code Sprint Universitario' },

    // ===== En curso nuevas =====
    { usuario_correo: 'santiago@gmail.com', competencia_nombre: 'Maratón de Verano 2026' },
    { usuario_correo: 'bruno@gmail.com', competencia_nombre: 'Maratón de Verano 2026' },
    { usuario_correo: 'renata@gmail.com', competencia_nombre: 'Maratón de Verano 2026' },

    {
        usuario_correo: 'diego@gmail.com',
        competencia_nombre: 'Hackathon Universitario',
        grupo_nombre: 'Los Hackers',
        integrantes: ['diego@gmail.com', 'paula@gmail.com', 'bruno@gmail.com'],
    },
    {
        usuario_correo: 'martin@gmail.com',
        competencia_nombre: 'Hackathon Universitario',
        grupo_nombre: 'Dev Squad',
        integrantes: ['martin@gmail.com', 'camila@gmail.com'],
    },

    { usuario_correo: 'valentina@gmail.com', competencia_nombre: 'Concurso de Verano Principiante' },
    { usuario_correo: 'santiago@gmail.com', competencia_nombre: 'Concurso de Verano Principiante' },
    { usuario_correo: 'renata@gmail.com', competencia_nombre: 'Concurso de Verano Principiante' },

    {
        usuario_correo: 'juan@gmail.com',
        competencia_nombre: 'Liga de Programación Junior',
        grupo_nombre: 'Los Juniors 2',
        integrantes: ['juan@gmail.com', 'maria@gmail.com', 'martin@gmail.com', 'florencia@gmail.com'],
    },
    {
        usuario_correo: 'lucas@gmail.com',
        competencia_nombre: 'Liga de Programación Junior',
        grupo_nombre: 'Los Pibes',
        integrantes: ['lucas@gmail.com', 'sofia@gmail.com', 'valentina@gmail.com', 'santiago@gmail.com'],
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
        const grupoRepository = dataSource.getRepository(Grupo);

        const gruposCache = new Map<string, Grupo>();

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

            if (!data.grupo_nombre) {
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
                continue;
            }

            if (!data.integrantes || data.integrantes.length === 0) {
                console.log(
                    `⚠️  Inscripción grupal sin integrantes para "${data.competencia_nombre}".`,
                );
                continue;
            }

            const integrantes = await usuarioRepository.find({
                where: data.integrantes.map((correo) => ({
                    correo_electronico: correo,
                })),
            });
            const correosEncontrados = new Set(
                integrantes.map((u) => u.correo_electronico),
            );
            const faltantes = data.integrantes.filter(
                (c) => !correosEncontrados.has(c),
            );
            if (faltantes.length > 0) {
                console.log(
                    `⚠️  Integrantes faltantes para grupo "${data.grupo_nombre}": ${faltantes.join(', ')}`,
                );
                if (integrantes.length === 0) continue;
            }

            const cacheKey = `${competencia.id}::${data.grupo_nombre}`;
            let grupo = gruposCache.get(cacheKey);
            if (!grupo) {
                const grupoExistente = await grupoRepository.findOne({
                    where: {
                        nombre: data.grupo_nombre,
                        competencia: { id: competencia.id },
                    },
                });
                if (grupoExistente) {
                    grupo = grupoExistente;
                } else {
                    grupo = grupoRepository.create({
                        nombre: data.grupo_nombre,
                        competencia: { id: competencia.id },
                    });
                    await grupoRepository.save(grupo);
                    console.log(
                        `✅ Grupo creado: "${data.grupo_nombre}" en "${data.competencia_nombre}"`,
                    );
                }
                gruposCache.set(cacheKey, grupo);
            }

            for (const usuario of integrantes) {
                const exists = await inscripcionRepository.findOne({
                    where: {
                        usuario: { id: usuario.id },
                        competencia: { id: competencia.id },
                    },
                });
                if (exists) {
                    console.log(
                        `ℹ️  ${usuario.correo_electronico} ya inscrito en "${data.competencia_nombre}".`,
                    );
                    continue;
                }

                const inscripcion = inscripcionRepository.create({
                    usuario: { id: usuario.id },
                    competencia: { id: competencia.id },
                    grupo: { id: grupo.id },
                    fecha_inscripcion: new Date(),
                });
                await inscripcionRepository.save(inscripcion);
                console.log(
                    `✅ Inscripción grupal: ${usuario.correo_electronico} → "${data.grupo_nombre}" (${data.competencia_nombre})`,
                );
            }
        }

        console.log('✅ Seeds de inscripciones completados');
        await dataSource.destroy();
    },
};
