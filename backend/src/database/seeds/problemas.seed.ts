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
    // ---------- Concurso de Algoritmos (Intermedio) ----------
    {
        titulo: 'Suma de Dos Números',
        descripcion:
            'Dados dos números enteros A y B, imprimir la suma de ambos.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Una línea con dos enteros A y B separados por espacio.',
        formato_salida: 'Un entero que representa la suma de A + B.',
        ejemplo_entrada: '3 5',
        ejemplo_salida: '8',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Par o Impar',
        descripcion:
            'Dado un número entero N, determinar si es par o impar. Imprimir "PAR" si es par, "IMPAR" en caso contrario.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Un entero N en una sola línea.',
        formato_salida: 'La palabra "PAR" o "IMPAR".',
        ejemplo_entrada: '7',
        ejemplo_salida: 'IMPAR',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Factorial',
        descripcion:
            'Calcular el factorial de un número entero N. N! = 1 × 2 × ... × N. Por definición 0! = 1.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un entero N donde 0 <= N <= 12.',
        formato_salida: 'El factorial de N.',
        ejemplo_entrada: '5',
        ejemplo_salida: '120',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Encontrar el Máximo',
        descripcion:
            'Dado un arreglo de N números enteros, encontrar el valor máximo.',
        dificultad: Dificultad.FACIL,
        formato_entrada:
            'Primera línea: N (1 <= N <= 100). Segunda línea: N enteros separados por espacio.',
        formato_salida: 'El valor máximo del arreglo.',
        ejemplo_entrada: '5\n3 9 1 7 5',
        ejemplo_salida: '9',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Palíndromo',
        descripcion:
            'Determinar si una palabra es un palíndromo (se lee igual de izquierda a derecha que de derecha a izquierda).',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Una palabra en una sola línea (solo letras minúsculas, máximo 100 caracteres).',
        formato_salida: 'Imprimir "SI" si es palíndromo, "NO" en caso contrario.',
        ejemplo_entrada: 'reconocer',
        ejemplo_salida: 'SI',
        competencia_nombre: 'Concurso de Algoritmos',
    },
    {
        titulo: 'Suma de Dígitos',
        descripcion:
            'Dado un número entero N, calcular la suma de todos sus dígitos.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un entero N (0 <= N <= 10^9).',
        formato_salida: 'La suma de los dígitos de N.',
        ejemplo_entrada: '12345',
        ejemplo_salida: '15',
        competencia_nombre: 'Concurso de Algoritmos',
    },

    // ---------- Sprint de Código (Principiante) ----------
    {
        titulo: 'Tabla de Multiplicar',
        descripcion:
            'Dado un entero N, imprimir la tabla de multiplicar del 1 al 10 con el formato "N x i = resultado".',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Un entero N (1 <= N <= 20).',
        formato_salida:
            '10 líneas con el formato "N x i = resultado" para i desde 1 hasta 10.',
        ejemplo_entrada: '3',
        ejemplo_salida:
            '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30',
        competencia_nombre: 'Sprint de Código',
    },
    {
        titulo: 'Contar Vocales',
        descripcion:
            'Dado un string, contar cuántas vocales (a, e, i, o, u) contiene. Considerar solo minúsculas.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Una línea con texto (sin espacios, máximo 200 caracteres).',
        formato_salida: 'La cantidad de vocales.',
        ejemplo_entrada: 'programacion',
        ejemplo_salida: '4',
        competencia_nombre: 'Sprint de Código',
    },
    {
        titulo: 'Invertir Cadena',
        descripcion: 'Dado un string, imprimirlo invertido.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Una línea con texto (sin espacios, máximo 200 caracteres).',
        formato_salida: 'El texto invertido.',
        ejemplo_entrada: 'hola',
        ejemplo_salida: 'aloh',
        competencia_nombre: 'Sprint de Código',
    },

    // ---------- Duelo de Algoritmos (Intermedio) ----------
    {
        titulo: 'Fibonacci',
        descripcion:
            'Dado un entero N, imprimir el N-ésimo término de la sucesión de Fibonacci. f(0) = 0, f(1) = 1, f(n) = f(n-1) + f(n-2).',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un entero N (0 <= N <= 30).',
        formato_salida: 'El N-ésimo término de Fibonacci.',
        ejemplo_entrada: '10',
        ejemplo_salida: '55',
        competencia_nombre: 'Duelo de Algoritmos',
    },
    {
        titulo: 'Búsqueda Binaria',
        descripcion:
            'Dado un arreglo ordenado de N enteros y un valor X, encontrar el índice de X en el arreglo. Si no existe, devolver -1.',
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
        descripcion:
            'Dados dos enteros A y B, calcular A^B de forma eficiente (exponenciación binaria).',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Dos enteros A y B separados por espacio (0 <= A, B <= 30).',
        formato_salida: 'A elevado a la B.',
        ejemplo_entrada: '2 10',
        ejemplo_salida: '1024',
        competencia_nombre: 'Duelo de Algoritmos',
    },

    // ---------- Maratón de Programación (Intermedio) ----------
    {
        titulo: 'Ordenamiento Burbuja',
        descripcion:
            'Dado un arreglo de N enteros, ordenarlo de forma ascendente usando el algoritmo de ordenamiento burbuja.',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N (1 <= N <= 50). Segunda línea: N enteros.',
        formato_salida: 'Los N enteros ordenados ascendentemente, separados por espacio.',
        ejemplo_entrada: '5\n5 3 1 4 2',
        ejemplo_salida: '1 2 3 4 5',
        competencia_nombre: 'Maratón de Programación',
    },
    {
        titulo: 'Contar Pares que Suman K',
        descripcion:
            'Dado un arreglo de N enteros y un valor K, contar cuántos pares de índices (i, j) con i < j cumplen que arr[i] + arr[j] = K.',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N y K. Segunda línea: N enteros.',
        formato_salida: 'La cantidad de pares que suman K.',
        ejemplo_entrada: '5 7\n1 5 3 6 2',
        ejemplo_salida: '2',
        competencia_nombre: 'Maratón de Programación',
    },
    {
        titulo: 'Rotar Arreglo',
        descripcion:
            'Dado un arreglo de N enteros y un valor K, rotar el arreglo K posiciones a la derecha.',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N y K. Segunda línea: N enteros.',
        formato_salida:
            'El arreglo rotado, con los elementos separados por espacio.',
        ejemplo_entrada: '5 2\n1 2 3 4 5',
        ejemplo_salida: '4 5 1 2 3',
        competencia_nombre: 'Maratón de Programación',
    },

    // ---------- Olimpíadas de Código (Avanzado) ----------
    {
        titulo: 'Subconjunto que Suma X',
        descripcion:
            'Dado un arreglo de N enteros y un valor X, determinar si existe un subconjunto del arreglo cuyos elementos sumen exactamente X.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Primera línea: N y X. Segunda línea: N enteros.',
        formato_salida: 'Imprimir "SI" si existe, "NO" en caso contrario.',
        ejemplo_entrada: '5 11\n1 5 3 7 2',
        ejemplo_salida: 'SI',
        competencia_nombre: 'Olimpíadas de Código',
    },
    {
        titulo: 'Camino más corto en grilla',
        descripcion:
            'Dada una grilla de N x M con 0 (casilla libre) y 1 (obstáculo), encontrar la longitud del camino más corto desde la esquina superior izquierda (0,0) hasta la esquina inferior derecha (N-1, M-1). Solo se puede mover arriba/abajo/izquierda/derecha.',
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
        descripcion:
            'Dada una grilla de N x M con 0 (agua) y 1 (tierra), contar la cantidad de islas (grupos de celdas conectadas horizontal o verticalmente).',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N y M. Siguientes N líneas: M valores 0 o 1.',
        formato_salida: 'La cantidad de islas.',
        ejemplo_entrada: '4 5\n0 1 0 0 1\n1 0 0 1 1\n0 0 0 0 0\n0 0 1 1 0',
        ejemplo_salida: '3',
        competencia_nombre: 'Olimpíadas de Código',
    },

    // ---------- Reto Backend 2026 (Avanzado) ----------
    {
        titulo: 'Validar Paréntesis',
        descripcion:
            'Dado un string con paréntesis (), corchetes [] y llaves {}, determinar si están balanceados y correctamente anidados.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Una línea con el string a evaluar (máx 200 caracteres).',
        formato_salida: 'Imprimir "BALANCEADO" o "DESBALANCEADO".',
        ejemplo_entrada: '({[]})',
        ejemplo_salida: 'BALANCEADO',
        competencia_nombre: 'Reto Backend 2026',
    },
    {
        titulo: 'Cifrado César',
        descripcion:
            'Aplicar el cifrado César con desplazamiento K a un string de letras mayúsculas.',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: K (0 <= K < 26). Segunda línea: el texto a cifrar (solo mayúsculas, sin espacios).',
        formato_salida: 'El texto cifrado.',
        ejemplo_entrada: '3\nHOLA',
        ejemplo_salida: 'KROD',
        competencia_nombre: 'Reto Backend 2026',
    },
    {
        titulo: 'Simular Cola de Impresión',
        descripcion:
            'Procesar N trabajos de impresión. Cada trabajo tiene un nombre y una cantidad de páginas. La impresora imprime hasta M páginas por turno. En cada turno se procesan los trabajos en orden, avanzando en el que se quedó. Imprimir el orden en que los trabajos terminan.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N y M. Siguientes N líneas: nombre del trabajo y páginas.',
        formato_salida:
            'Los nombres de los trabajos en el orden en que terminaron, uno por línea.',
        ejemplo_entrada: '3 5\nA 8\nB 4\nC 2',
        ejemplo_salida: 'B\nC\nA',
        competencia_nombre: 'Reto Backend 2026',
    },

    // ---------- Reto Legacy (Principiante) ----------
    {
        titulo: 'Área de un Rectángulo',
        descripcion:
            'Dados el ancho y el alto de un rectángulo, calcular su área.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Dos números reales separados por espacio.',
        formato_salida: 'El área con dos decimales.',
        ejemplo_entrada: '3 4',
        ejemplo_salida: '12.00',
        competencia_nombre: 'Reto Legacy',
    },
    {
        titulo: 'Convertir Celsius a Fahrenheit',
        descripcion:
            'Dada una temperatura en grados Celsius, convertirla a Fahrenheit usando F = C × 9/5 + 32.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Un número real (la temperatura en Celsius).',
        formato_salida: 'La temperatura en Fahrenheit con dos decimales.',
        ejemplo_entrada: '100',
        ejemplo_salida: '212.00',
        competencia_nombre: 'Reto Legacy',
    },
    {
        titulo: 'Promedio de N Números',
        descripcion:
            'Dados N números reales, calcular su promedio.',
        dificultad: Dificultad.FACIL,
        formato_entrada:
            'Primera línea: N (1 <= N <= 100). Segunda línea: N números reales separados por espacio.',
        formato_salida: 'El promedio con dos decimales.',
        ejemplo_entrada: '4\n1 2 3 4',
        ejemplo_salida: '2.50',
        competencia_nombre: 'Reto Legacy',
    },

    // ---------- Copa Junior 2026 (Principiante - En curso) ----------
    {
        titulo: 'Número Mayor entre Tres',
        descripcion:
            'Dados tres números enteros, imprimir el mayor de ellos.',
        dificultad: Dificultad.FACIL,
        formato_entrada: 'Tres enteros A, B y C separados por espacio.',
        formato_salida: 'El mayor de los tres.',
        ejemplo_entrada: '4 9 2',
        ejemplo_salida: '9',
        competencia_nombre: 'Copa Junior 2026',
    },
    {
        titulo: 'Suma de Pares',
        descripcion:
            'Dado un entero N, sumar todos los números pares desde 2 hasta N inclusive. Si N es impar, considerar hasta N-1.',
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
        descripcion:
            'Dado un string, contar la frecuencia de cada carácter (solo letras minúsculas). Imprimir los caracteres ordenados alfabéticamente seguidos de su cantidad.',
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
        descripcion:
            'Dados dos arreglos de N enteros, generar un tercer arreglo donde cada posición i es arr1[i] + arr2[i].',
        dificultad: Dificultad.FACIL,
        formato_entrada:
            'Primera línea: N. Segunda línea: N enteros. Tercera línea: N enteros.',
        formato_salida: 'Los N valores sumados, separados por espacio.',
        ejemplo_entrada: '4\n1 2 3 4\n5 6 7 8',
        ejemplo_salida: '6 8 10 12',
        competencia_nombre: 'Proyecto Colaborativo 2026',
    },

    // ---------- Hackathon Grupal 2026 (Avanzado - Finalizada) ----------
    {
        titulo: 'Ordenar por Frecuencia',
        descripcion:
            'Dado un string, ordenar sus caracteres por frecuencia descendente. En caso de empate, mantener el orden de aparición original.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Una línea con texto en minúsculas (sin espacios).',
        formato_salida: 'El string ordenado por frecuencia.',
        ejemplo_entrada: 'aabbbcccc',
        ejemplo_salida: 'ccccbbbaa',
        competencia_nombre: 'Hackathon Grupal 2026',
    },
    {
        titulo: 'Suma de Subarreglo Máximo',
        descripcion:
            'Dado un arreglo de N enteros (positivos y negativos), encontrar la suma máxima de un subarreglo contiguo (algoritmo de Kadane).',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: N (1 <= N <= 100). Segunda línea: N enteros.',
        formato_salida: 'La suma máxima de un subarreglo contiguo.',
        ejemplo_entrada: '9\n-2 1 -3 4 -1 2 1 -5 4',
        ejemplo_salida: '6',
        competencia_nombre: 'Hackathon Grupal 2026',
    },
    {
        titulo: 'Anagramas Válidos',
        descripcion:
            'Dados dos strings, determinar si son anagramas (contienen exactamente los mismos caracteres con la misma frecuencia).',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Dos líneas, una por string (solo minúsculas, sin espacios).',
        formato_salida: 'Imprimir "ANAGRAMA" o "NO ANAGRAMA".',
        ejemplo_entrada: 'roma\namor',
        ejemplo_salida: 'ANAGRAMA',
        competencia_nombre: 'Hackathon Grupal 2026',
    },

    // ---------- Batalla de Equipos (Avanzado) ----------
    {
        titulo: 'Longest Common Subsequence',
        descripcion:
            'Dadas dos cadenas, encontrar la longitud de la subsecuencia común más larga (LCS).',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Dos líneas con strings (sin espacios, máximo 100 caracteres).',
        formato_salida: 'La longitud de la LCS.',
        ejemplo_entrada: 'ABCBDAB\nBDCAB',
        ejemplo_salida: '4',
        competencia_nombre: 'Batalla de Equipos',
    },
    {
        titulo: 'Merge de Arreglos Ordenados',
        descripcion:
            'Dados dos arreglos ordenados de N y M enteros, generar un único arreglo ordenado combinándolos.',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N y M. Segunda línea: N enteros ordenados. Tercera línea: M enteros ordenados.',
        formato_salida:
            'Los N + M enteros ordenados, separados por espacio.',
        ejemplo_entrada: '3 4\n1 4 7\n2 3 5 8',
        ejemplo_salida: '1 2 3 4 5 7 8',
        competencia_nombre: 'Batalla de Equipos',
    },
    {
        titulo: 'Permutaciones de un String',
        descripcion:
            'Dado un string, generar todas sus permutaciones únicas en orden lexicográfico, una por línea.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada: 'Una línea con texto en minúsculas (sin espacios, máximo 8 caracteres).',
        formato_salida: 'Todas las permutaciones únicas, una por línea, ordenadas.',
        ejemplo_entrada: 'ab',
        ejemplo_salida: 'ab\nba',
        competencia_nombre: 'Batalla de Equipos',
    },

    // ---------- Reto Fullstack 2026 (Intermedio) ----------
    {
        titulo: 'Validar Email',
        descripcion:
            'Dado un string, determinar si tiene formato de email válido (formato: local@dominio.extension). Solo letras, dígitos, guion bajo, punto y guion en local y dominio.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Una línea con el email a validar.',
        formato_salida: 'Imprimir "VALIDO" o "INVALIDO".',
        ejemplo_entrada: 'usuario@example.com',
        ejemplo_salida: 'VALIDO',
        competencia_nombre: 'Reto Fullstack 2026',
    },
    {
        titulo: 'Comprimir String',
        descripcion:
            'Dado un string, comprimirlo usando la regla "carácter seguido de la cantidad de repeticiones consecutivas". Si la compresión no reduce el tamaño, devolver el string original.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Una línea con texto (sin espacios).',
        formato_salida: 'El string comprimido o el original.',
        ejemplo_entrada: 'aabbbcccc',
        ejemplo_salida: 'a2b3c4',
        competencia_nombre: 'Reto Fullstack 2026',
    },

    // ---------- Hackathon Express 2026 (Intermedio) ----------
    {
        titulo: 'Sumar Dígitos hasta Uno',
        descripcion:
            'Dado un entero N, sumar sus dígitos repetidamente hasta obtener un solo dígito.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un entero N (0 <= N <= 10^9).',
        formato_salida: 'El dígito final.',
        ejemplo_entrada: '9875',
        ejemplo_salida: '2',
        competencia_nombre: 'Hackathon Express 2026',
    },
    {
        titulo: 'Elemento Único',
        descripcion:
            'Dado un arreglo donde todos los elementos aparecen dos veces, excepto uno que aparece una sola vez, encontrar ese elemento.',
        dificultad: Dificultad.MEDIO,
        formato_entrada:
            'Primera línea: N (impar). Segunda línea: N enteros.',
        formato_salida: 'El elemento único.',
        ejemplo_entrada: '5\n2 3 2 4 3',
        ejemplo_salida: '4',
        competencia_nombre: 'Hackathon Express 2026',
    },

    // ---------- Reto Inteligencia Artificial (Avanzado - Cancelada) ----------
    {
        titulo: 'Conteo de Palabras',
        descripcion:
            'Dado un texto, contar la cantidad de veces que aparece cada palabra (case-insensitive) e imprimir ordenadas alfabéticamente.',
        dificultad: Dificultad.MEDIO,
        formato_entrada: 'Un texto de una o varias líneas terminado en EOF.',
        formato_salida: 'Una línea por palabra con formato "palabra:cantidad", orden alfabético.',
        ejemplo_entrada: 'Hola hola mundo',
        ejemplo_salida: 'hola:2\nmundo:1',
        competencia_nombre: 'Reto Inteligencia Artificial',
    },

    // ---------- Clasificatorio Regional 2026 (Avanzado - Abierta) ----------
    {
        titulo: 'Knapsack 0-1',
        descripcion:
            'Dados N objetos con un peso y un valor, y una mochila con capacidad W, encontrar el valor máximo que se puede obtener eligiendo un subconjunto de objetos (cada objeto se puede elegir a lo sumo una vez).',
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
        descripcion:
            'Dado un grafo ponderado no dirigido con V vértices y E aristas, encontrar la distancia más corta desde el vértice 0 al vértice V-1.',
        dificultad: Dificultad.DIFICIL,
        formato_entrada:
            'Primera línea: V y E. Siguientes E líneas: u, v, w (peso).',
        formato_salida:
            'La distancia más corta, o -1 si no hay camino.',
        ejemplo_entrada: '4 4\n0 1 1\n0 2 4\n1 2 2\n2 3 3',
        ejemplo_salida: '6',
        competencia_nombre: 'Clasificatorio Regional 2026',
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
