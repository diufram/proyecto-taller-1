import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Dificultad } from '../models/problema.model';

export type NivelCompetencia = 'Principiante' | 'Intermedio' | 'Avanzado';
export type TipoCompetencia = 'Individual' | 'Grupal';

export interface GeneratedProblem {
    titulo: string;
    descripcion: string;
    dificultad: Dificultad;
    formato_entrada: string;
    formato_salida: string;
    ejemplo_entrada: string;
    ejemplo_salida: string;
    sourceKeyword: string;
}

export interface GenerateOptions {
    prompt: string;
    cantidad: number;
    dificultad?: Dificultad | null;
    competenciaNombre: string;
    competenciaDescripcion: string;
    nivelDificultad: NivelCompetencia;
    tipo: TipoCompetencia;
}

interface ProblemTemplate {
    baseTitulo: string;
    baseDescripcion: string;
    dificultadPreferida: Dificultad;
    formatoEntrada: string;
    formatoSalida: string;
    parametros: Array<{
        entrada: string;
        salida: string;
    }>;
}

const KEYWORD_TEMPLATES: Record<string, ProblemTemplate[]> = {
    suma: [
        {
            baseTitulo: 'Suma de dos números',
            baseDescripcion:
                'Dados dos números enteros A y B separados por espacio, imprimir la suma de ambos.',
            dificultadPreferida: 'Facil',
            formatoEntrada:
                'Una línea con dos enteros A y B separados por espacio.',
            formatoSalida: 'Un entero que representa la suma de A y B.',
            parametros: [
                { entrada: '3 5', salida: '8' },
                { entrada: '10 25', salida: '35' },
                { entrada: '-7 12', salida: '5' },
            ],
        },
        {
            baseTitulo: 'Suma acumulada hasta N',
            baseDescripcion:
                'Calcular la suma de todos los enteros desde 1 hasta N inclusive.',
            dificultadPreferida: 'Facil',
            formatoEntrada: 'Un entero N (1 <= N <= 1000).',
            formatoSalida: 'La suma 1 + 2 + ... + N.',
            parametros: [
                { entrada: '5', salida: '15' },
                { entrada: '10', salida: '55' },
                { entrada: '100', salida: '5050' },
            ],
        },
        {
            baseTitulo: 'Suma de dígitos',
            baseDescripcion:
                'Dado un número entero positivo, calcular la suma de sus dígitos.',
            dificultadPreferida: 'Facil',
            formatoEntrada: 'Un entero N positivo (1 <= N <= 10^9).',
            formatoSalida: 'La suma de los dígitos de N.',
            parametros: [
                { entrada: '123', salida: '6' },
                { entrada: '9999', salida: '36' },
                { entrada: '1000', salida: '1' },
            ],
        },
        {
            baseTitulo: 'Suma de pares en un rango',
            baseDescripcion:
                'Dados dos enteros A y B, calcular la suma de todos los números pares entre A y B inclusive.',
            dificultadPreferida: 'Medio',
            formatoEntrada: 'Una línea con dos enteros A y B (A <= B).',
            formatoSalida: 'La suma de los números pares en el rango.',
            parametros: [
                { entrada: '1 10', salida: '30' },
                { entrada: '5 5', salida: '0' },
            ],
        },
    ],
    factorial: [
        {
            baseTitulo: 'Factorial de un número',
            baseDescripcion:
                'Calcular N! = 1 * 2 * ... * N para el valor de N dado.',
            dificultadPreferida: 'Medio',
            formatoEntrada: 'Un entero N (0 <= N <= 12).',
            formatoSalida: 'El factorial de N.',
            parametros: [
                { entrada: '5', salida: '120' },
                { entrada: '0', salida: '1' },
                { entrada: '10', salida: '3628800' },
            ],
        },
        {
            baseTitulo: 'Factorial doble',
            baseDescripcion:
                'Calcular el factorial doble de N: N!! = N * (N-2) * (N-4) * ... hasta 1 o 2.',
            dificultadPreferida: 'Dificil',
            formatoEntrada: 'Un entero N (1 <= N <= 20).',
            formatoSalida: 'El factorial doble de N.',
            parametros: [
                { entrada: '5', salida: '15' },
                { entrada: '6', salida: '48' },
            ],
        },
    ],
    par: [
        {
            baseTitulo: 'Par o impar',
            baseDescripcion:
                'Dado un número entero N, determinar si es par o impar.',
            dificultadPreferida: 'Facil',
            formatoEntrada: 'Un entero N en una sola línea.',
            formatoSalida: 'Imprimir "PAR" si N es par, o "IMPAR" si es impar.',
            parametros: [
                { entrada: '7', salida: 'IMPAR' },
                { entrada: '12', salida: 'PAR' },
                { entrada: '0', salida: 'PAR' },
            ],
        },
    ],
    fibonacci: [
        {
            baseTitulo: 'N-ésimo número de Fibonacci',
            baseDescripcion:
                'Dado un entero N, imprimir el N-ésimo término de la sucesión de Fibonacci (F(0)=0, F(1)=1).',
            dificultadPreferida: 'Medio',
            formatoEntrada: 'Un entero N (0 <= N <= 40).',
            formatoSalida: 'El N-ésimo número de Fibonacci.',
            parametros: [
                { entrada: '10', salida: '55' },
                { entrada: '0', salida: '0' },
                { entrada: '7', salida: '13' },
            ],
        },
        {
            baseTitulo: 'Suma de Fibonacci hasta N',
            baseDescripcion:
                'Calcular la suma de los primeros N+1 términos de la sucesión de Fibonacci (F(0) hasta F(N)).',
            dificultadPreferida: 'Medio',
            formatoEntrada: 'Un entero N (0 <= N <= 30).',
            formatoSalida: 'La suma de F(0) + F(1) + ... + F(N).',
            parametros: [
                { entrada: '5', salida: '12' },
                { entrada: '10', salida: '143' },
            ],
        },
    ],
    palindromo: [
        {
            baseTitulo: 'Detectar palíndromo',
            baseDescripcion:
                'Determinar si una palabra dada es un palíndromo (se lee igual al revés).',
            dificultadPreferida: 'Medio',
            formatoEntrada:
                'Una palabra (solo letras minúsculas, máximo 100 caracteres).',
            formatoSalida: 'Imprimir "SI" si es palíndromo, "NO" en caso contrario.',
            parametros: [
                { entrada: 'reconocer', salida: 'SI' },
                { entrada: 'hola', salida: 'NO' },
                { entrada: 'ana', salida: 'SI' },
            ],
        },
        {
            baseTitulo: 'Palíndromo de números',
            baseDescripcion:
                'Determinar si un número entero positivo es palíndromo (se lee igual al revés).',
            dificultadPreferida: 'Medio',
            formatoEntrada: 'Un entero N positivo.',
            formatoSalida: 'Imprimir "SI" si es palíndromo, "NO" en caso contrario.',
            parametros: [
                { entrada: '12321', salida: 'SI' },
                { entrada: '1234', salida: 'NO' },
            ],
        },
    ],
    primo: [
        {
            baseTitulo: 'Es primo',
            baseDescripcion:
                'Dado un entero N, determinar si es un número primo.',
            dificultadPreferida: 'Medio',
            formatoEntrada: 'Un entero N (1 <= N <= 10^6).',
            formatoSalida: 'Imprimir "SI" si N es primo, "NO" en caso contrario.',
            parametros: [
                { entrada: '17', salida: 'SI' },
                { entrada: '24', salida: 'NO' },
                { entrada: '2', salida: 'SI' },
            ],
        },
        {
            baseTitulo: 'N-ésimo primo',
            baseDescripcion:
                'Dado un entero N, imprimir el N-ésimo número primo (1 = 2, 2 = 3, 3 = 5, ...).',
            dificultadPreferida: 'Dificil',
            formatoEntrada: 'Un entero N (1 <= N <= 1000).',
            formatoSalida: 'El N-ésimo primo.',
            parametros: [
                { entrada: '1', salida: '2' },
                { entrada: '10', salida: '29' },
            ],
        },
    ],
    maximo: [
        {
            baseTitulo: 'Máximo de un arreglo',
            baseDescripcion:
                'Dado un arreglo de N números, encontrar e imprimir el valor máximo.',
            dificultadPreferida: 'Facil',
            formatoEntrada:
                'Primera línea N (1 <= N <= 100). Segunda línea N enteros separados por espacio.',
            formatoSalida: 'El valor máximo del arreglo.',
            parametros: [
                { entrada: '5\n3 9 1 7 5', salida: '9' },
                { entrada: '4\n-2 -8 -1 -5', salida: '-1' },
            ],
        },
        {
            baseTitulo: 'Segundo máximo',
            baseDescripcion:
                'Dado un arreglo de N números distintos, encontrar el segundo valor más grande.',
            dificultadPreferida: 'Medio',
            formatoEntrada:
                'Primera línea N (2 <= N <= 100). Segunda línea N enteros distintos.',
            formatoSalida: 'El segundo valor más grande del arreglo.',
            parametros: [
                { entrada: '5\n3 9 1 7 5', salida: '7' },
                { entrada: '4\n10 20 30 40', salida: '30' },
            ],
        },
    ],
    minimo: [
        {
            baseTitulo: 'Mínimo de un arreglo',
            baseDescripcion:
                'Dado un arreglo de N números, encontrar e imprimir el valor mínimo.',
            dificultadPreferida: 'Facil',
            formatoEntrada:
                'Primera línea N (1 <= N <= 100). Segunda línea N enteros separados por espacio.',
            formatoSalida: 'El valor mínimo del arreglo.',
            parametros: [
                { entrada: '5\n3 9 1 7 5', salida: '1' },
                { entrada: '3\n10 20 30', salida: '10' },
            ],
        },
    ],
    string: [
        {
            baseTitulo: 'Invertir una cadena',
            baseDescripcion:
                'Dado un string, imprimirlo con los caracteres en orden inverso.',
            dificultadPreferida: 'Facil',
            formatoEntrada:
                'Una línea con un string (sin espacios, máximo 100 caracteres).',
            formatoSalida: 'El string invertido.',
            parametros: [
                { entrada: 'hola', salida: 'aloh' },
                { entrada: 'taller', salida: 'rellat' },
            ],
        },
        {
            baseTitulo: 'Contar vocales',
            baseDescripcion:
                'Dado un string en minúsculas, contar la cantidad de vocales que contiene.',
            dificultadPreferida: 'Facil',
            formatoEntrada: 'Una línea con un string en minúsculas.',
            formatoSalida: 'Un entero con la cantidad de vocales.',
            parametros: [
                { entrada: 'murcielago', salida: '5' },
                { entrada: 'xyz', salida: '0' },
            ],
        },
    ],
    array: [
        {
            baseTitulo: 'Promedio de un arreglo',
            baseDescripcion:
                'Dado un arreglo de N números, calcular su promedio con 2 decimales.',
            dificultadPreferida: 'Medio',
            formatoEntrada:
                'Primera línea N (1 <= N <= 100). Segunda línea N enteros separados por espacio.',
            formatoSalida: 'El promedio con 2 decimales.',
            parametros: [
                { entrada: '4\n10 20 30 40', salida: '25.00' },
                { entrada: '3\n5 5 5', salida: '5.00' },
            ],
        },
        {
            baseTitulo: 'Invertir un arreglo',
            baseDescripcion:
                'Dado un arreglo de N números, imprimirlo en orden inverso.',
            dificultadPreferida: 'Facil',
            formatoEntrada:
                'Primera línea N (1 <= N <= 100). Segunda línea N enteros separados por espacio.',
            formatoSalida: 'Los N números en orden inverso, separados por espacio.',
            parametros: [
                { entrada: '4\n1 2 3 4', salida: '4 3 2 1' },
                { entrada: '3\n10 20 30', salida: '30 20 10' },
            ],
        },
    ],
    contador: [
        {
            baseTitulo: 'Contar vocales',
            baseDescripcion:
                'Dado un string en minúsculas, contar la cantidad de vocales que contiene.',
            dificultadPreferida: 'Facil',
            formatoEntrada: 'Una línea con un string en minúsculas.',
            formatoSalida: 'Un entero con la cantidad de vocales.',
            parametros: [
                { entrada: 'murcielago', salida: '5' },
                { entrada: 'xyz', salida: '0' },
            ],
        },
    ],
};

const DEFAULT_TEMPLATES: ProblemTemplate[] = [
    {
        baseTitulo: 'Suma de dos números',
        baseDescripcion:
            'Dados dos números enteros A y B separados por espacio, imprimir la suma de ambos.',
        dificultadPreferida: 'Facil',
        formatoEntrada: 'Una línea con dos enteros A y B separados por espacio.',
        formatoSalida: 'Un entero que representa la suma de A y B.',
        parametros: [
            { entrada: '3 5', salida: '8' },
            { entrada: '10 25', salida: '35' },
        ],
    },
    {
        baseTitulo: 'Par o impar',
        baseDescripcion:
            'Dado un número entero N, determinar si es par o impar.',
        dificultadPreferida: 'Facil',
        formatoEntrada: 'Un entero N en una sola línea.',
        formatoSalida: 'Imprimir "PAR" si N es par, o "IMPAR" si es impar.',
        parametros: [
            { entrada: '7', salida: 'IMPAR' },
            { entrada: '12', salida: 'PAR' },
        ],
    },
    {
        baseTitulo: 'Invertir una cadena',
        baseDescripcion:
            'Dado un string, imprimirlo con los caracteres en orden inverso.',
        dificultadPreferida: 'Facil',
        formatoEntrada:
            'Una línea con un string (sin espacios, máximo 100 caracteres).',
        formatoSalida: 'El string invertido.',
        parametros: [
            { entrada: 'hola', salida: 'aloh' },
            { entrada: 'taller', salida: 'rellat' },
        ],
    },
    {
        baseTitulo: 'Factorial de un número',
        baseDescripcion:
            'Calcular N! = 1 * 2 * ... * N para el valor de N dado.',
        dificultadPreferida: 'Medio',
        formatoEntrada: 'Un entero N (0 <= N <= 12).',
        formatoSalida: 'El factorial de N.',
        parametros: [
            { entrada: '5', salida: '120' },
            { entrada: '0', salida: '1' },
        ],
    },
    {
        baseTitulo: 'N-ésimo número de Fibonacci',
        baseDescripcion:
            'Dado un entero N, imprimir el N-ésimo término de la sucesión de Fibonacci (F(0)=0, F(1)=1).',
        dificultadPreferida: 'Medio',
        formatoEntrada: 'Un entero N (0 <= N <= 40).',
        formatoSalida: 'El N-ésimo número de Fibonacci.',
        parametros: [
            { entrada: '10', salida: '55' },
            { entrada: '7', salida: '13' },
        ],
    },
];

@Injectable({ providedIn: 'root' })
export class ProblemGeneratorService {
    private readonly MIN_COUNT = 1;
    private readonly MAX_COUNT = 5;
    private readonly MOCK_DELAY_MS = 1500;

    generate(opts: GenerateOptions): Observable<GeneratedProblem[]> {
        const cantidad = this.clamp(
            opts.cantidad ?? 2,
            this.MIN_COUNT,
            this.MAX_COUNT,
        );

        const match = this.matchKeyword(opts.prompt);
        const templates = match
            ? KEYWORD_TEMPLATES[match]
            : DEFAULT_TEMPLATES;

        const difficultyFilter = this.resolveDifficultyFilter(
            opts.dificultad ?? null,
            opts.nivelDificultad,
        );

        const result: GeneratedProblem[] = [];
        for (let i = 0; i < cantidad; i++) {
            const template = templates[i % templates.length];
            const params =
                template.parametros[i % template.parametros.length];

            const dificultad = this.pickDifficulty(
                template.dificultadPreferida,
                difficultyFilter,
            );

            const titulo =
                cantidad > 1 && templates.length > 1
                    ? `${template.baseTitulo} #${i + 1}`
                    : template.baseTitulo;

            result.push({
                titulo,
                descripcion: template.baseDescripcion,
                dificultad,
                formato_entrada: template.formatoEntrada,
                formato_salida: template.formatoSalida,
                ejemplo_entrada: params.entrada,
                ejemplo_salida: params.salida,
                sourceKeyword: match ?? 'general',
            });
        }

        return of(result).pipe(delay(this.MOCK_DELAY_MS));
    }

    private matchKeyword(prompt: string): string | null {
        const normalized = this.normalize(prompt);
        for (const keyword of Object.keys(KEYWORD_TEMPLATES)) {
            if (normalized.includes(keyword)) {
                return keyword;
            }
        }
        return null;
    }

    private resolveDifficultyFilter(
        userChoice: Dificultad | null,
        nivel: NivelCompetencia,
    ): Set<Dificultad> | null {
        if (userChoice) {
            return new Set([userChoice]);
        }
        switch (nivel) {
            case 'Principiante':
                return new Set(['Facil']);
            case 'Avanzado':
                return new Set(['Medio', 'Dificil']);
            case 'Intermedio':
            default:
                return null;
        }
    }

    private pickDifficulty(
        preferred: Dificultad,
        allowed: Set<Dificultad> | null,
    ): Dificultad {
        if (!allowed || allowed.size === 0) {
            return preferred;
        }
        if (allowed.has(preferred)) {
            return preferred;
        }
        const arr = Array.from(allowed);
        return arr[0];
    }

    private normalize(value: string): string {
        return (value ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    private clamp(value: number, min: number, max: number): number {
        if (isNaN(value)) return min;
        return Math.max(min, Math.min(max, Math.floor(value)));
    }
}
