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
    dificultad: Dificultad;
    formato_entrada: string;
    formato_salida: string;
    ejemplo_entrada: string;
    ejemplo_salida: string;
    competencia_nombre: string;
}

const problemasData: ProblemaData[] = [
    // ---------- Duelo de Algoritmos (Intermedio - Finalizada) ----------
    {
        titulo: 'Fibonacci',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un entero N (0 <= N <= 30).',
        formato_salida: 'El N-ésimo término de Fibonacci.',
        ejemplo_entrada: '10',
        ejemplo_salida: '55',
        competencia_nombre: 'Duelo de Algoritmos',
    },
    {
        titulo: 'Búsqueda Binaria',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N. Segunda línea: N enteros ordenados. Tercera línea: X.',
        formato_salida: 'El índice de X (0-based) o -1 si no existe.',
        ejemplo_entrada: '5\n1 3 5 7 9\n5',
        ejemplo_salida: '2',
        competencia_nombre: 'Duelo de Algoritmos',
    },
    {
        titulo: 'Potencia Rápida',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Dos enteros A y B separados por espacio (0 <= A, B <= 30).',
        formato_salida: 'A elevado a la B.',
        ejemplo_entrada: '2 10',
        ejemplo_salida: '1024',
        competencia_nombre: 'Duelo de Algoritmos',
    },

    // ---------- Maratón de Programación (Intermedio - Finalizada) ----------
    {
        titulo: 'Ordenamiento Burbuja',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N (1 <= N <= 50). Segunda línea: N enteros.',
        formato_salida: 'Los N enteros ordenados ascendentemente, separados por espacio.',
        ejemplo_entrada: '5\n5 3 1 4 2',
        ejemplo_salida: '1 2 3 4 5',
        competencia_nombre: 'Maratón de Programación 2026',
    },
    {
        titulo: 'Contar Pares que Suman K',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N y K. Segunda línea: N enteros.',
        formato_salida: 'La cantidad de pares que suman K.',
        ejemplo_entrada: '5 7\n1 5 3 6 2',
        ejemplo_salida: '2',
        competencia_nombre: 'Maratón de Programación 2026',
    },
    {
        titulo: 'Rotar Arreglo',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N y K. Segunda línea: N enteros.',
        formato_salida:
            'El arreglo rotado, con los elementos separados por espacio.',
        ejemplo_entrada: '5 2\n1 2 3 4 5',
        ejemplo_salida: '4 5 1 2 3',
        competencia_nombre: 'Maratón de Programación 2026',
    },

    // ---------- Olimpíadas de Código (Avanzado - Finalizada) ----------
    {
        titulo: 'Subconjunto que Suma X',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Primera línea: N y X. Segunda línea: N enteros.',
        formato_salida: 'Imprimir "SI" si existe, "NO" en caso contrario.',
        ejemplo_entrada: '5 11\n1 5 3 7 2',
        ejemplo_salida: 'SI',
        competencia_nombre: 'Olimpíadas de Código',
    },
    {
        titulo: 'Camino más corto en grilla',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N y M. Siguientes N líneas: M valores 0 o 1 separados por espacio.',
        formato_salida: 'La cantidad mínima de pasos, o -1 si no hay camino.',
        ejemplo_entrada: '3 3\n0 0 0\n0 1 0\n0 0 0',
        ejemplo_salida: '4',
        competencia_nombre: 'Olimpíadas de Código',
    },
    {
        titulo: 'Contar Islas',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N y M. Siguientes N líneas: M valores 0 o 1.',
        formato_salida: 'La cantidad de islas.',
        ejemplo_entrada: '4 5\n0 1 0 0 1\n1 0 0 1 1\n0 0 0 0 0\n0 0 1 1 0',
        ejemplo_salida: '3',
        competencia_nombre: 'Olimpíadas de Código',
    },

    // ---------- Copa Junior 2026 (Principiante - En curso) ----------
    {
        titulo: 'Número Mayor entre Tres',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Tres enteros A, B y C separados por espacio.',
        formato_salida: 'El mayor de los tres.',
        ejemplo_entrada: '4 9 2',
        ejemplo_salida: '9',
        competencia_nombre: 'Copa Junior 2026',
    },
    {
        titulo: 'Suma de Pares',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Un entero N (2 <= N <= 1000).',
        formato_salida: 'La suma de los pares.',
        ejemplo_entrada: '10',
        ejemplo_salida: '30',
        competencia_nombre: 'Copa Junior 2026',
    },

    // ---------- Proyecto Colaborativo 2026 (Intermedio - En curso) ----------
    {
        titulo: 'Frecuencia de Caracteres',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Una línea con texto en minúsculas (sin espacios, máximo 200 caracteres).',
        formato_salida:
            'Una línea por cada carácter presente, formato "letra:cantidad", ordenadas por letra.',
        ejemplo_entrada: 'aabbbc',
        ejemplo_salida: 'a:2\nb:3\nc:1',
        competencia_nombre: 'Proyecto Colaborativo 2026',
    },
    {
        titulo: 'Sumar Dos Arreglos',
        dificultad: Dificultad.FACIL,
        formato_entrada:
            'Primera línea: N. Segunda línea: N enteros. Tercera línea: N enteros.',
        formato_salida: 'Los N valores sumados, separados por espacio.',
        ejemplo_entrada: '4\n1 2 3 4\n5 6 7 8',
        ejemplo_salida: '6 8 10 12',
        competencia_nombre: 'Proyecto Colaborativo 2026',
    },

    // ---------- Reto Inteligencia Artificial (Avanzado - Cancelada) ----------
    {
        titulo: 'Conteo de Palabras',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un texto de una o varias líneas terminado en EOF.',
        formato_salida: 'Una línea por palabra con formato "palabra:cantidad", orden alfabético.',
        ejemplo_entrada: 'Hola hola mundo',
        ejemplo_salida: 'hola:2\nmundo:1',
        competencia_nombre: 'Reto Inteligencia Artificial',
    },

    // ---------- Reto Legacy (Principiante - Cancelada) ----------
    {
        titulo: 'Área de un Rectángulo',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Dos números reales separados por espacio.',
        formato_salida: 'El área con dos decimales.',
        ejemplo_entrada: '3 4',
        ejemplo_salida: '12.00',
        competencia_nombre: 'Reto Legacy',
    },
    {
        titulo: 'Convertir Celsius a Fahrenheit',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Un número real (la temperatura en Celsius).',
        formato_salida: 'La temperatura en Fahrenheit con dos decimales.',
        ejemplo_entrada: '100',
        ejemplo_salida: '212.00',
        competencia_nombre: 'Reto Legacy',
    },
    {
        titulo: 'Promedio de N Números',
        dificultad: Dificultad.FACIL,
        formato_entrada:
            'Primera línea: N (1 <= N <= 100). Segunda línea: N números reales separados por espacio.',
        formato_salida: 'El promedio con dos decimales.',
        ejemplo_entrada: '4\n1 2 3 4',
        ejemplo_salida: '2.50',
        competencia_nombre: 'Reto Legacy',
    },

    // ---------- Clasificatorio Regional 2026 (Avanzado - Abierta) ----------
    {
        titulo: 'Knapsack 0-1',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N y W. Siguientes N líneas: peso y valor de cada objeto.',
        formato_salida: 'El valor máximo que se puede obtener.',
        ejemplo_entrada: '4 5\n2 3\n3 4\n4 5\n5 6',
        ejemplo_salida: '7',
        competencia_nombre: 'Clasificatorio Regional 2026',
    },
    {
        titulo: 'Dijkstra en Grafo Ponderado',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: V y E. Siguientes E líneas: u, v, w (peso).',
        formato_salida:
            'La distancia más corta, o -1 si no hay camino.',
        ejemplo_entrada: '4 4\n0 1 1\n0 2 4\n1 2 2\n2 3 3',
        ejemplo_salida: '6',
        competencia_nombre: 'Clasificatorio Regional 2026',
    },

    // ---------- Olimpíada Matemática 2026 (Avanzado - Abierta) ----------
    {
        titulo: 'Número Primo',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un entero N (0 <= N <= 10^6).',
        formato_salida: 'Imprimir "SI" si es primo, "NO" en caso contrario.',
        ejemplo_entrada: '17',
        ejemplo_salida: 'SI',
        competencia_nombre: 'Olimpíada Matemática 2026',
    },
    {
        titulo: 'Máximo Común Divisor',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Dos enteros A y B (1 <= A, B <= 10^9).',
        formato_salida: 'El MCD de A y B.',
        ejemplo_entrada: '12 18',
        ejemplo_salida: '6',
        competencia_nombre: 'Olimpíada Matemática 2026',
    },
    {
        titulo: 'Descomposición en Primos',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un entero N (2 <= N <= 10^6).',
        formato_salida: 'Los factores primos separados por espacio.',
        ejemplo_entrada: '12',
        ejemplo_salida: '2 2 3',
        competencia_nombre: 'Olimpíada Matemática 2026',
    },

    // ---------- Desafío de Estructuras de Datos (Intermedio - Abierta) ----------
    {
        titulo: 'Invertir Lista Enlazada',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N (1 <= N <= 1000). Segunda línea: N enteros.',
        formato_salida: 'Los N enteros en orden inverso, separados por espacio.',
        ejemplo_entrada: '5\n1 2 3 4 5',
        ejemplo_salida: '5 4 3 2 1',
        competencia_nombre: 'Desafío de Estructuras de Datos',
    },
    {
        titulo: 'Stack con Mínimo',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: M. Siguientes M líneas: operación y valor (si aplica). Operaciones: "push X", "pop", "min".',
        formato_salida:
            'Para cada pop y min, imprimir el valor resultante, uno por línea.',
        ejemplo_entrada:
            '6\npush 3\npush 1\nmin\npop\nmin\npop',
        ejemplo_salida: '1\n1\n3',
        competencia_nombre: 'Desafío de Estructuras de Datos',
    },
    {
        titulo: 'Recorrido BFS en Grafo',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: V y E. Siguientes E líneas: u, v (arista).',
        formato_salida: 'Los vértices en orden BFS, separados por espacio.',
        ejemplo_entrada: '4 3\n0 1\n1 2\n2 3',
        ejemplo_salida: '0 1 2 3',
        competencia_nombre: 'Desafío de Estructuras de Datos',
    },

    // ---------- Concurso de Programación Funcional (Avanzado - Abierta) ----------
    {
        titulo: 'Map y Filter',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N. Segunda línea: N enteros.',
        formato_salida: 'Los valores filtrados y duplicados, separados por espacio.',
        ejemplo_entrada: '5\n1 2 3 4 5',
        ejemplo_salida: '4 8',
        competencia_nombre: 'Concurso de Programación Funcional',
    },
    {
        titulo: 'Reduce - Sumar Arreglo',
        dificultad: Dificultad.FACIL,
        formato_entrada:
            'Primera línea: N. Segunda línea: N enteros.',
        formato_salida: 'La suma de los N enteros.',
        ejemplo_entrada: '4\n1 2 3 4',
        ejemplo_salida: '10',
        competencia_nombre: 'Concurso de Programación Funcional',
    },
    {
        titulo: 'Recursión - Potencia',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Dos enteros A y B (0 <= A <= 20, 0 <= B <= 30).',
        formato_salida: 'A elevado a la B.',
        ejemplo_entrada: '2 10',
        ejemplo_salida: '1024',
        competencia_nombre: 'Concurso de Programación Funcional',
    },

    // ---------- Torneo Universitario de Algoritmos (Intermedio - Abierta, Grupal) ----------
    {
        titulo: 'Cumpleaños en Común',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N. Siguientes N líneas: día y mes separados por espacio.',
        formato_salida: 'Día y mes de la fecha más repetida.',
        ejemplo_entrada: '5\n15 3\n20 5\n15 3\n01 1\n15 3',
        ejemplo_salida: '15 3',
        competencia_nombre: 'Torneo Universitario de Algoritmos',
    },
    {
        titulo: 'Matriz Simétrica',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N. Siguientes N líneas: N enteros separados por espacio.',
        formato_salida: 'Imprimir "SI" si es simétrica, "NO" en caso contrario.',
        ejemplo_entrada: '3\n1 2 3\n2 5 6\n3 6 9',
        ejemplo_salida: 'SI',
        competencia_nombre: 'Torneo Universitario de Algoritmos',
    },
    {
        titulo: 'Punto más Cercano',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N. Siguientes N líneas: x e y (números reales).',
        formato_salida: 'La menor distancia con 4 decimales.',
        ejemplo_entrada: '3\n0 0\n3 0\n0 4',
        ejemplo_salida: '3.0000',
        competencia_nombre: 'Torneo Universitario de Algoritmos',
    },

    // ---------- Copa Femenina de Programación (Principiante - Abierta) ----------
    {
        titulo: 'Saludo Personalizado',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Una línea con un nombre (sin espacios, máximo 50 caracteres).',
        formato_salida: 'El saludo personalizado.',
        ejemplo_entrada: 'Sofia',
        ejemplo_salida: 'Hola, Sofia!',
        competencia_nombre: 'Copa Femenina de Programación',
    },
    {
        titulo: 'Sumar Tres Números',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Tres enteros A, B y C separados por espacio.',
        formato_salida: 'La suma de los tres.',
        ejemplo_entrada: '5 7 3',
        ejemplo_salida: '15',
        competencia_nombre: 'Copa Femenina de Programación',
    },
    {
        titulo: 'Año Bisiesto',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Un entero A (1 <= A <= 9999).',
        formato_salida: 'Imprimir "SI" si es bisiesto, "NO" en caso contrario.',
        ejemplo_entrada: '2024',
        ejemplo_salida: 'SI',
        competencia_nombre: 'Copa Femenina de Programación',
    },

    // ---------- Code Sprint Universitario (Intermedio - Abierta) ----------
    {
        titulo: 'Detección de Duplicados',
        dificultad: Dificultad.FACIL,
        formato_entrada:
            'Primera línea: N. Segunda línea: N enteros.',
        formato_salida: 'Imprimir "SI" si hay duplicados, "NO" en caso contrario.',
        ejemplo_entrada: '5\n1 2 3 4 1',
        ejemplo_salida: 'SI',
        competencia_nombre: 'Code Sprint Universitario',
    },
    {
        titulo: 'Producto de Elementos Excepto Self',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N. Segunda línea: N enteros (pueden ser 0).',
        formato_salida: 'El arreglo resultante, separado por espacio.',
        ejemplo_entrada: '4\n1 2 3 4',
        ejemplo_salida: '24 12 8 6',
        competencia_nombre: 'Code Sprint Universitario',
    },
    {
        titulo: 'Longest Increasing Subsequence',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N. Segunda línea: N enteros.',
        formato_salida: 'La longitud de la LIS.',
        ejemplo_entrada: '6\n10 9 2 5 3 7',
        ejemplo_salida: '3',
        competencia_nombre: 'Code Sprint Universitario',
    },

    // ---------- Maratón de Verano 2026 (Intermedio - En curso) ----------
    {
        titulo: 'Temperaturas Extremas',
        dificultad: Dificultad.FACIL,
        formato_entrada:
            'Primera línea: N. Segunda línea: N enteros.',
        formato_salida: 'La diferencia entre la máxima y la mínima.',
        ejemplo_entrada: '5\n15 22 8 30 18',
        ejemplo_salida: '22',
        competencia_nombre: 'Maratón de Verano 2026',
    },
    {
        titulo: 'Lista de Compras',
        dificultad: Dificultad.FACIL,
        formato_entrada:
            'Primera línea: N. Siguientes N líneas: nombre y precio.',
        formato_salida: 'El total de la compra.',
        ejemplo_entrada: '3\npan 1000\nleche 2500\nhuevos 3500',
        ejemplo_salida: '7000',
        competencia_nombre: 'Maratón de Verano 2026',
    },
    {
        titulo: 'Palabras más Largas',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Una línea de texto con varias palabras separadas por espacio.',
        formato_salida: 'Las palabras más largas separadas por espacio.',
        ejemplo_entrada: 'el gato negro saltó la cerca alta',
        ejemplo_salida: 'saltó cerca',
        competencia_nombre: 'Maratón de Verano 2026',
    },

    // ---------- Hackathon Universitario (Avanzado - En curso, Grupal) ----------
    {
        titulo: 'Trie - Búsqueda de Prefijo',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N. Siguientes N líneas: palabras. Luego una línea con M. Siguientes M líneas: prefijos.',
        formato_salida: 'Para cada consulta, la cantidad (uno por línea).',
        ejemplo_entrada:
            '4\napple\napp\napricot\nbanana\n2\nap\nb',
        ejemplo_salida: '3\n1',
        competencia_nombre: 'Hackathon Universitario',
    },
    {
        titulo: 'Union-Find (DSU)',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N. Siguientes N líneas: operación y dos enteros si aplica.',
        formato_salida: 'Para cada find, imprimir el representante.',
        ejemplo_entrada:
            '5\nunion 1 2\nunion 2 3\nfind 1\nfind 3\nfind 4',
        ejemplo_salida: '1\n1\n4',
        competencia_nombre: 'Hackathon Universitario',
    },
    {
        titulo: 'Top K Frecuentes',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N y K. Segunda línea: N enteros.',
        formato_salida: 'Los K elementos más frecuentes, separados por espacio.',
        ejemplo_entrada: '8\n1 1 2 2 3 3 3 4\n2',
        ejemplo_salida: '3 1',
        competencia_nombre: 'Hackathon Universitario',
    },

    // ---------- Concurso de Verano Principiante (Principiante - En curso) ----------
    {
        titulo: 'Edad en Días',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Un entero N (0 <= N <= 150).',
        formato_salida: 'La cantidad de días.',
        ejemplo_entrada: '20',
        ejemplo_salida: '7300',
        competencia_nombre: 'Concurso de Verano Principiante',
    },
    {
        titulo: 'Promedio Simple',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Tres enteros A, B y C separados por espacio.',
        formato_salida: 'El promedio entero de los tres.',
        ejemplo_entrada: '8 9 10',
        ejemplo_salida: '9',
        competencia_nombre: 'Concurso de Verano Principiante',
    },
    {
        titulo: 'Tabla del 2 al 5',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Sin entrada.',
        formato_salida: 'Las tablas con una línea vacía entre ellas.',
        ejemplo_entrada: '',
        ejemplo_salida:
            '2 x 1 = 2\n... (continúa hasta 2 x 10 = 20)\n\n3 x 1 = 3\n...',
        competencia_nombre: 'Concurso de Verano Principiante',
    },

    // ---------- Liga de Programación Junior (Intermedio - En curso, Grupal) ----------
    {
        titulo: 'Validar RUT',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Una línea con el RUT en formato "12345678-9".',
        formato_salida: 'Imprimir "VALIDO" o "INVALIDO".',
        ejemplo_entrada: '12345678-9',
        ejemplo_salida: 'VALIDO',
        competencia_nombre: 'Liga de Programación Junior',
    },
    {
        titulo: 'Puntaje de Tenis',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Dos strings separados por espacio con los puntajes.',
        formato_salida:
            'El ganador del game o "EMPATE" si están iguales.',
        ejemplo_entrada: '40 ventaja',
        ejemplo_salida: 'Jugador 2',
        competencia_nombre: 'Liga de Programación Junior',
    },
    {
        titulo: 'Reconstruir Frase',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N. Siguientes N líneas: "orden palabra" (orden de 1 a N).',
        formato_salida: 'La frase reconstruida.',
        ejemplo_entrada: '4\n3 el\n1 Hola\n4 mundo\n2 gran',
        ejemplo_salida: 'Hola gran el mundo',
        competencia_nombre: 'Liga de Programación Junior',
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
