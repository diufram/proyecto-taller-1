import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Problema, Dificultad } from '../entities/problema.entity';
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

interface ProblemaData {
    titulo: string;
    descripcion: string;
    dificultad: Dificultad;
    formato_entrada: string;
    formato_salida: string;
    ejemplo_entrada: string;
    ejemplo_salida: string;
    competencia_nombre: string;
}

const problemasData: ProblemaData[] = [
    {
        titulo: 'Suma de Dos Números',
        descripcion: 'Dado dos números enteros A y B, escribir un programa que imprima la suma de ambos.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'La primera línea contiene dos enteros A y B separados por espacio.',
        formato_salida: 'Imprimir un entero representando la suma de A y B.',
        ejemplo_entrada: '3 5',
        ejemplo_salida: '8',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Par o Impar',
        descripcion: 'Dado un número entero N, determinar si es par o impar.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Un entero N en una sola línea.',
        formato_salida: 'Imprimir "PAR" si N es par, o "IMPAR" si N es impar.',
        ejemplo_entrada: '7',
        ejemplo_salida: 'IMPAR',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Factorial',
        descripcion: 'Calcular el factorial de un número N (N! = 1 * 2 * ... * N).',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un entero N (0 <= N <= 12).',
        formato_salida: 'Imprimir el factorial de N.',
        ejemplo_entrada: '5',
        ejemplo_salida: '120',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Encontrar el Máximo',
        descripcion: 'Dado un arreglo de N números, encontrar el valor máximo.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Primera línea N (1 <= N <= 100). Segunda línea N enteros separados por espacio.',
        formato_salida: 'Imprimir el valor máximo del arreglo.',
        ejemplo_entrada: '5\n3 9 1 7 5',
        ejemplo_salida: '9',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Palíndromo',
        descripcion: 'Determinar si una palabra es un palíndromo.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Una palabra (solo letras minúsculas, máximo 100 caracteres).',
        formato_salida: 'Imprimir "SI" si es palíndromo, "NO" en caso contrario.',
        ejemplo_entrada: 'reconocer',
        ejemplo_salida: 'SI',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Registro de Equipos',
        descripcion: 'Los equipos deben registrar su información y crear un grupo.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Nombre del equipo y lista de integrantes.',
        formato_salida: 'Confirmación del registro del equipo.',
        ejemplo_entrada: 'Equipo Alpha\nIntegrante1, Integrante2',
        ejemplo_salida: 'Equipo registrado exitosamente',
        competencia_nombre: 'Hackathon Grupal 2026',
    },
    {
        titulo: 'Asignación de Tareas',
        descripcion: 'Distribuir tareas entre los miembros del equipo de forma equitativa.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Número de tareas N y número de integrantes M.',
        formato_salida: 'Distribución óptima de tareas.',
        ejemplo_entrada: '6 3',
        ejemplo_salida: 'Cada integrante recibe 2 tareas',
        competencia_nombre: 'Hackathon Grupal 2026',
    },
    {
        titulo: 'Planificación de Sprint',
        descripcion: 'Calcular la duración mínima de un sprint dados los requisitos.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Número de historias de usuario y puntos de historia por día.',
        formato_salida: 'Duración del sprint en días.',
        ejemplo_entrada: '20 4',
        ejemplo_salida: '5',
        competencia_nombre: 'Hackathon Grupal 2026',
    },
    {
        titulo: 'Revisión de Código Legacy',
        descripcion: 'Analizar y corregir bugs en código heredado.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Código fuente con errores.',
        formato_salida: 'Código corregido.',
        ejemplo_entrada: 'function sum(a,b){return a+b}',
        ejemplo_salida: 'function sum(a,b){return Number(a)+Number(b)}',
        competencia_nombre: 'Reto Legacy',
    },
    {
        titulo: 'Migración de Datos',
        descripcion: 'Transformar datos de un formato a otro.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Datos en formato JSON.',
        formato_salida: 'Datos transformados.',
        ejemplo_entrada: '{"nombre":"Juan","edad":30}',
        ejemplo_salida: 'Juan,30',
        competencia_nombre: 'Reto Legacy',
    },
    {
        titulo: 'Suma Rápida',
        descripcion: 'Resolver 50 sumas simples en el menor tiempo posible.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Parejas de números separados por línea.',
        formato_salida: 'Resultados de las sumas.',
        ejemplo_entrada: '10 20\n30 40',
        ejemplo_salida: '30\n70',
        competencia_nombre: 'Sprint de Código',
    },
    {
        titulo: 'Búsqueda Lineal vs Binaria',
        descripcion: 'Comparar rendimiento de algoritmos de búsqueda.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Arreglo ordenado y elemento a buscar.',
        formato_salida: 'Índice del elemento o -1 si no existe.',
        ejemplo_entrada: '[1,3,5,7,9] 7',
        ejemplo_salida: '3',
        competencia_nombre: 'Sprint de Código',
    },
    {
        titulo: 'Torneo de Equipos',
        descripcion: 'Organizar un torneo de eliminación directa.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Número de equipos participantes.',
        formato_salida: 'Número de partidos necesarios.',
        ejemplo_entrada: '8',
        ejemplo_salida: '7',
        competencia_nombre: 'Batalla de Equipos',
    },
    {
        titulo: 'Estrategia de Equipo',
        descripcion: 'Calcular la formación óptima del equipo.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Número de jugadores y posiciones requeridas.',
        formato_salida: 'Formación sugerida.',
        ejemplo_entrada: '11 4-4-2',
        ejemplo_salida: 'GK,LB,CB,CB,RB,LM,CM,CM,RM,ST,ST',
        competencia_nombre: 'Batalla de Equipos',
    },
    {
        titulo: 'Desarrollo API REST',
        descripcion: 'Crear un CRUD completo con autenticación.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Endpoints requeridos.',
        formato_salida: 'API funcional con todos los endpoints.',
        ejemplo_entrada: 'POST /users, GET /users, DELETE /users/:id',
        ejemplo_salida: 'API funcionando en puerto 3000',
        competencia_nombre: 'Batalla de Equipos',
    },
    {
        titulo: 'Maratón de Algoritmos',
        descripcion: 'Resolver 10 problemas de complejidad creciente en 48 horas.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Problemas de dificultad Variable.',
        formato_salida: 'Soluciones correctas.',
        ejemplo_entrada: '10 problemas',
        ejemplo_salida: '10/10 resueltos',
        competencia_nombre: 'Maratón de Programación',
    },
    {
        titulo: 'Optimización de Código',
        descripcion: 'Mejorar el rendimiento de un algoritmo lento.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Código ineficiente con descripción del problema.',
        formato_salida: 'Código optimizado.',
        ejemplo_entrada: 'O(n²) quicksort',
        ejemplo_salida: 'O(n log n)',
        competencia_nombre: 'Maratón de Programación',
    },
    {
        titulo: 'Guía de Onboarding',
        descripcion: 'Crear un tutorial interactivo para nuevos participantes.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Temario básico de la competencia.',
        formato_salida: 'Tutorial completo.',
        ejemplo_entrada: 'Reglas básicas',
        ejemplo_salida: 'Tutorial creado',
        competencia_nombre: 'Copa Junior',
    },
    {
        titulo: 'Primer Proyecto Grupal',
        descripcion: 'Completar un proyecto simple en equipo.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Requisitos del proyecto.',
        formato_salida: 'Proyecto funcionando.',
        ejemplo_entrada: 'Calculadora básica',
        ejemplo_salida: 'Calculadora operativa',
        competencia_nombre: 'Copa Junior',
    },
    {
        titulo: 'Clasificación de Imágenes',
        descripcion: 'Clasificar imágenes usando un modelo de ML simple.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Dataset de imágenes.',
        formato_salida: 'Predicciones de clase.',
        ejemplo_entrada: '1000 imágenes',
        ejemplo_salida: '85% accuracy',
        competencia_nombre: 'Reto Inteligencia Artificial',
    },
    {
        titulo: 'Chatbot Inteligente',
        descripcion: 'Crear un chatbot que responda preguntas frecuentes.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Base de conocimiento.',
        formato_salida: 'Chatbot funcional.',
        ejemplo_entrada: 'FAQ de la empresa',
        ejemplo_salida: 'Chatbot respuestas correctas',
        competencia_nombre: 'Reto Inteligencia Artificial',
    },
    {
        titulo: 'Bracket 1v1',
        descripcion: 'Generar brackets para torneo individual.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Número de participantes (potencia de 2).',
        formato_salida: 'Bracket completo.',
        ejemplo_entrada: '8',
        ejemplo_salida: 'Bracket 3 rondas',
        competencia_nombre: 'Duelo de Algoritmos',
    },
    {
        titulo: 'Desempate por Tiempo',
        descripcion: 'Calcular rankings considerando tiempo de resolución.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Resultados y tiempos de cada participante.',
        formato_salida: 'Ranking ordenado.',
        ejemplo_entrada: 'Juan:3 proble, Sofia:4 proble',
        ejemplo_salida: '1. Sofia, 2. Juan',
        competencia_nombre: 'Duelo de Algoritmos',
    },
    {
        titulo: 'Gestión de Proyecto',
        descripcion: 'Planificar y ejecutar un proyecto de múltiples fases.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Lista de tareas y dependencias.',
        formato_salida: 'Plan de ejecución óptimo.',
        ejemplo_entrada: '10 tareas con dependencias',
        ejemplo_salida: 'Ruta crítica',
        competencia_nombre: 'Proyecto Colaborativo',
    },
    {
        titulo: 'Sistema de Notificaciones',
        descripcion: 'Implementar un sistema de notificaciones en tiempo real.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Eventos y usuarios.',
        formato_salida: 'Notificaciones entregadas.',
        ejemplo_entrada: '3 eventos, 5 usuarios',
        ejemplo_salida: '15 notificaciones',
        competencia_nombre: 'Proyecto Colaborativo',
    },
    {
        titulo: 'API de Usuarios',
        descripcion: 'Crear endpoints de CRUD para usuarios.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Datos de usuarios.',
        formato_salida: 'API RESTful.',
        ejemplo_entrada: 'POST /users',
        ejemplo_salida: '201 Created',
        competencia_nombre: 'Desafío Backend',
    },
    {
        titulo: 'Autenticación JWT',
        descripcion: 'Implementar login con tokens JWT.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Credenciales de usuario.',
        formato_salida: 'Token de acceso.',
        ejemplo_entrada: 'email, password',
        ejemplo_salida: 'jwt_token',
        competencia_nombre: 'Desafío Backend',
    },
    {
        titulo: 'App en 24 Horas',
        descripcion: 'Desarrollar una aplicación funcional en 24 horas.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Tema de la hackathon.',
        formato_salida: 'Aplicación funcionando.',
        ejemplo_entrada: 'App de productividad',
        ejemplo_salida: 'Appdeployada',
        competencia_nombre: 'Hackathon Express',
    },
    {
        titulo: 'Pitch de Proyecto',
        descripcion: 'Presentar el proyecto en 5 minutos.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Proyecto desarrollado.',
        formato_salida: 'Pitch grabado.',
        ejemplo_entrada: 'App de tareas',
        ejemplo_salida: 'Video 5 min',
        competencia_nombre: 'Hackathon Express',
    },
    {
        titulo: 'Problemas Clásicos de OI',
        descripcion: 'Resolver problemas clásicos de Olimpiadas de Informática.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: '3 problemas de alta complejidad.',
        formato_salida: 'Soluciones óptimas.',
        ejemplo_entrada: '3 problemas NP-hard',
        ejemplo_salida: '3 soluciones O(n log n)',
        competencia_nombre: 'Olimpíadas de Código',
    },
    {
        titulo: 'Estructuras de Datos Avanzadas',
        descripcion: 'Implementar estructuras de datos complejas.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Tipo de estructura.',
        formato_salida: 'Implementación funcional.',
        ejemplo_entrada: 'Arbol AVL',
        ejemplo_salida: 'AVL funcional',
        competencia_nombre: 'Olimpíadas de Código',
    },
    {
        titulo: 'Aplicación Fullstack',
        descripcion: 'Desarrollar una aplicación con frontend y backend.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Stack tecnológico.',
        formato_salida: 'Aplicación completa.',
        ejemplo_entrada: 'React + Node.js',
        ejemplo_salida: 'App desplegada',
        competencia_nombre: 'Reto Fullstack',
    },
    {
        titulo: 'Integración de APIs',
        descripcion: 'Conectar múltiples APIs externas.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Lista de APIs a integrar.',
        formato_salida: 'Datos consolidados.',
        ejemplo_entrada: 'Weather, News, Maps API',
        ejemplo_salida: 'Dashboardintegrado',
        competencia_nombre: 'Reto Fullstack',
    },
    {
        titulo: 'Clasificatorio Round 1',
        descripcion: 'Primera ronda del clasificatorio nacional.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: '5 problemas.',
        formato_salida: 'Resultados de la ronda.',
        ejemplo_entrada: '5 problemas',
        ejemplo_salida: 'Top 10 avanzan',
        competencia_nombre: 'Clasificatorio Regional',
    },
    {
        titulo: 'Clasificatorio Final',
        descripcion: 'Última ronda para clasificar al nacional.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: '3 problemas complejos.',
        formato_salida: 'Ganadores del clasificatorio.',
        ejemplo_entrada: '3 problemas',
        ejemplo_salida: 'Top 3 al nacional',
        competencia_nombre: 'Clasificatorio Regional',
    },
];

export const problemasSeed: Seed = {
    order: 4,
    name: 'Problemas',
    run: async () => {
        await dataSource.initialize();
        console.log('🔌 Conectado a la base de datos para seed');

        const problemaRepository = dataSource.getRepository(Problema);
        const competenciaRepository = dataSource.getRepository(Competencia);

        for (const data of problemasData) {
            const competencia = await competenciaRepository.findOne({
                where: { nombre: data.competencia_nombre },
            });

            if (!competencia) {
                console.log(`⚠️  Competencia "${data.competencia_nombre}" no encontrada, omitiendo problema.`);
                continue;
            }

            const existing = await problemaRepository.findOne({
                where: { titulo: data.titulo, competencia: { id: competencia.id } },
            });

            if (existing) {
                console.log(`ℹ️  Problema "${data.titulo}" ya existe en "${data.competencia_nombre}", omitiendo.`);
                continue;
            }

            const problema = problemaRepository.create({
                titulo: data.titulo,
                descripcion: data.descripcion,
                dificultad: data.dificultad,
                formato_entrada: data.formato_entrada,
                formato_salida: data.formato_salida,
                ejemplo_entrada: data.ejemplo_entrada,
                ejemplo_salida: data.ejemplo_salida,
                competencia: { id: competencia.id },
            });

            await problemaRepository.save(problema);
            console.log(`✅ Problema creado: "${data.titulo}" (${data.competencia_nombre})`);
        }

        console.log('✅ Seeds de problemas completados');

        await dataSource.destroy();
    },
};