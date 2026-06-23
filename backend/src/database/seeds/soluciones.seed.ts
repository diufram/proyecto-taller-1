import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import {
  Solucion,
  EstadoSolucion,
  Lenguaje,
} from '../entities/solucion.entity';
import { Usuario } from '../entities/usuario.entity';
import { Inscripcion } from '../entities/inscripcion.entity';
import { Problema } from '../entities/problema.entity';
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

interface SolucionData {
    usuario_correo: string;
    problema_titulo: string;
    competencia_nombre: string;
    lenguaje: Lenguaje;
    respuesta: string;
    estado: EstadoSolucion;
    resultado_validacion: boolean;
}

/**
 * ~30 soluciones distribuidas en competencias activas/finalizadas, con
 * 60% en `Pendiente` (para que el admin pruebe la sugerencia IA) y el
 * resto distribuido en Correcto/Incorrecto/En revisión para variedad.
 */
const solucionesData: SolucionData[] = [
    // ===== Concurso de Algoritmos =====
    {
        usuario_correo: 'matias@gmail.com',
        problema_titulo: 'Suma de Dos Números',
        competencia_nombre: 'Concurso de Algoritmos',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta: 'a, b = map(int, input().split())\nprint(a + b)',
    },
    {
        usuario_correo: 'lucas@gmail.com',
        problema_titulo: 'Suma de Dos Números',
        competencia_nombre: 'Concurso de Algoritmos',
        lenguaje: Lenguaje.JAVASCRIPT,
        estado: EstadoSolucion.CORRECTO,
        resultado_validacion: true,
        respuesta:
            'const [a, b] = require("fs").readFileSync(0, "utf8").split(" ").map(Number);\nconsole.log(a + b);',
    },
    {
        usuario_correo: 'sofia@gmail.com',
        problema_titulo: 'Par o Impar',
        competencia_nombre: 'Concurso de Algoritmos',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta: 'n = int(input())\nprint("PAR" if n % 2 == 0 else "IMPAR")',
    },
    {
        usuario_correo: 'juan@gmail.com',
        problema_titulo: 'Par o Impar',
        competencia_nombre: 'Concurso de Algoritmos',
        lenguaje: Lenguaje.C,
        estado: EstadoSolucion.CORRECTO,
        resultado_validacion: true,
        respuesta:
            '#include <stdio.h>\nint main() { int n; scanf("%d", &n); printf("%s\\n", n % 2 == 0 ? "PAR" : "IMPAR"); return 0; }',
    },
    {
        usuario_correo: 'matias@gmail.com',
        problema_titulo: 'Factorial',
        competencia_nombre: 'Concurso de Algoritmos',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'n = int(input())\nf = 1\nfor i in range(2, n + 1):\n    f *= i\nprint(f)',
    },
    {
        usuario_correo: 'lucas@gmail.com',
        problema_titulo: 'Factorial',
        competencia_nombre: 'Concurso de Algoritmos',
        lenguaje: Lenguaje.JAVASCRIPT,
        estado: EstadoSolucion.INCORRECTO,
        resultado_validacion: false,
        respuesta:
            'const n = Number(require("fs").readFileSync(0, "utf8"));\nlet f = 1;\nfor (let i = 2; i < n; i++) f *= i;\nconsole.log(f);',
    },
    {
        usuario_correo: 'sofia@gmail.com',
        problema_titulo: 'Encontrar el Máximo',
        competencia_nombre: 'Concurso de Algoritmos',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta: 'print(max(map(int, input().split()[1:])))',
    },
    {
        usuario_correo: 'juan@gmail.com',
        problema_titulo: 'Palíndromo',
        competencia_nombre: 'Concurso de Algoritmos',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta: 's = input()\nprint("SI" if s == s[::-1] else "NO")',
    },

    // ===== Sprint de Código =====
    {
        usuario_correo: 'matias@gmail.com',
        problema_titulo: 'Tabla de Multiplicar',
        competencia_nombre: 'Sprint de Código',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.CORRECTO,
        resultado_validacion: true,
        respuesta:
            'n = int(input())\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n*i}")',
    },
    {
        usuario_correo: 'valentina@gmail.com',
        problema_titulo: 'Contar Vocales',
        competencia_nombre: 'Sprint de Código',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta: 's = input()\nprint(sum(1 for c in s if c in "aeiou"))',
    },
    {
        usuario_correo: 'santiago@gmail.com',
        problema_titulo: 'Invertir Cadena',
        competencia_nombre: 'Sprint de Código',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.CORRECTO,
        resultado_validacion: true,
        respuesta: 'print(input()[::-1])',
    },

    // ===== Duelo de Algoritmos =====
    {
        usuario_correo: 'lucas@gmail.com',
        problema_titulo: 'Fibonacci',
        competencia_nombre: 'Duelo de Algoritmos',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'n = int(input())\na, b = 0, 1\nfor _ in range(n): a, b = b, a + b\nprint(a)',
    },
    {
        usuario_correo: 'sofia@gmail.com',
        problema_titulo: 'Búsqueda Binaria',
        competencia_nombre: 'Duelo de Algoritmos',
        lenguaje: Lenguaje.JAVASCRIPT,
        estado: EstadoSolucion.REVISION,
        resultado_validacion: false,
        respuesta:
            'const lines = require("fs").readFileSync(0, "utf8").split("\\n");\nconst arr = lines[1].split(" ").map(Number);\nconst x = Number(lines[2]);\nlet lo = 0, hi = arr.length - 1;\nwhile (lo <= hi) { const m = (lo+hi)>>1; if (arr[m] === x) { console.log(m); return; } if (arr[m] < x) lo = m+1; else hi = m-1; }\nconsole.log(-1);',
    },
    {
        usuario_correo: 'lucas@gmail.com',
        problema_titulo: 'Potencia Rápida',
        competencia_nombre: 'Duelo de Algoritmos',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'a, b = map(int, input().split())\nr = 1\nwhile b:\n    if b & 1: r *= a\n    a *= a\n    b >>= 1\nprint(r)',
    },

    // ===== Maratón de Programación =====
    {
        usuario_correo: 'juan@gmail.com',
        problema_titulo: 'Ordenamiento Burbuja',
        competencia_nombre: 'Maratón de Programación 2026',
        lenguaje: Lenguaje.PSEUDOCODIGO,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'leer N\nleer arreglo a de N enteros\npara i desde 0 hasta N-1:\n    para j desde 0 hasta N-2-i:\n        si a[j] > a[j+1]:\n            swap a[j], a[j+1]\nimprimir a separado por espacios',
    },
    {
        usuario_correo: 'martin@gmail.com',
        problema_titulo: 'Contar Pares que Suman K',
        competencia_nombre: 'Maratón de Programación 2026',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.CORRECTO,
        resultado_validacion: true,
        respuesta:
            'n, k = map(int, input().split())\narr = list(map(int, input().split()))\nseen = {}\ncnt = 0\nfor x in arr:\n    cnt += seen.get(k - x, 0)\n    seen[x] = seen.get(x, 0) + 1\nprint(cnt)',
    },

    // ===== Olimpíadas de Código =====
    {
        usuario_correo: 'camila@gmail.com',
        problema_titulo: 'Subconjunto que Suma X',
        competencia_nombre: 'Olimpíadas de Código',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'n, x = map(int, input().split())\narr = list(map(int, input().split()))\ndp = [False]*(x+1)\ndp[0] = True\nfor v in arr:\n    for s in range(x, v-1, -1):\n        if dp[s-v]: dp[s] = True\nprint("SI" if dp[x] else "NO")',
    },
    {
        usuario_correo: 'florencia@gmail.com',
        problema_titulo: 'Camino más corto en grilla',
        competencia_nombre: 'Olimpíadas de Código',
        lenguaje: Lenguaje.JAVASCRIPT,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'const input = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst [n, m] = input[0].split(" ").map(Number);\nconst grid = input.slice(1, n+1).map(r => r.split(" ").map(Number));\nconst dist = Array.from({length: n}, () => Array(m).fill(-1));\nif (grid[0][0] === 0) { dist[0][0] = 0; const q = [[0,0]]; while (q.length) { const [i,j] = q.shift(); for (const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]) { const ni=i+di, nj=j+dj; if (ni>=0 && ni<n && nj>=0 && nj<m && grid[ni][nj]===0 && dist[ni][nj]===-1) { dist[ni][nj] = dist[i][j]+1; q.push([ni,nj]); } } } }\nconsole.log(dist[n-1][m-1]);',
    },
    {
        usuario_correo: 'camila@gmail.com',
        problema_titulo: 'Contar Islas',
        competencia_nombre: 'Olimpíadas de Código',
        lenguaje: Lenguaje.C,
        estado: EstadoSolucion.INCORRECTO,
        resultado_validacion: false,
        respuesta:
            '#include <stdio.h>\nint grid[100][100], n, m;\nint main() { scanf("%d %d", &n, &m); for (int i=0;i<n;i++) for (int j=0;j<m;j++) scanf("%d", &grid[i][j]); printf("0\\n"); return 0; }',
    },

    // ===== Reto Backend 2026 =====
    {
        usuario_correo: 'diego@gmail.com',
        problema_titulo: 'Validar Paréntesis',
        competencia_nombre: 'Reto Backend 2026',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.CORRECTO,
        resultado_validacion: true,
        respuesta:
            's = input()\npairs = {")":"(","]":"[","}":"{"}\nstack = []\nok = True\nfor c in s:\n    if c in "([{": stack.append(c)\n    elif c in ")]}":\n        if not stack or stack[-1] != pairs[c]: ok = False; break\n        stack.pop()\nif stack: ok = False\nprint("BALANCEADO" if ok else "DESBALANCEADO")',
    },
    {
        usuario_correo: 'paula@gmail.com',
        problema_titulo: 'Cifrado César',
        competencia_nombre: 'Reto Backend 2026',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'k = int(input())\ns = input()\nprint("".join(chr((ord(c)-65+k)%26 + 65) for c in s))',
    },

    // ===== Reto Legacy =====
    {
        usuario_correo: 'bruno@gmail.com',
        problema_titulo: 'Área de un Rectángulo',
        competencia_nombre: 'Reto Legacy',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta: 'a, b = map(float, input().split())\nprint(f"{a*b:.2f}")',
    },
    {
        usuario_correo: 'renata@gmail.com',
        problema_titulo: 'Convertir Celsius a Fahrenheit',
        competencia_nombre: 'Reto Legacy',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.CORRECTO,
        resultado_validacion: true,
        respuesta: 'c = float(input())\nprint(f"{c * 9/5 + 32:.2f}")',
    },

    // ===== Copa Junior (En curso) =====
    {
        usuario_correo: 'valentina@gmail.com',
        problema_titulo: 'Número Mayor entre Tres',
        competencia_nombre: 'Copa Junior 2026',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta: 'a, b, c = map(int, input().split())\nprint(max(a, b, c))',
    },
    {
        usuario_correo: 'santiago@gmail.com',
        problema_titulo: 'Suma de Pares',
        competencia_nombre: 'Copa Junior 2026',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'n = int(input())\nprint(sum(i for i in range(2, n+1, 2)))',
    },
    {
        usuario_correo: 'camila@gmail.com',
        problema_titulo: 'Número Mayor entre Tres',
        competencia_nombre: 'Copa Junior 2026',
        lenguaje: Lenguaje.OTRO,
        estado: EstadoSolucion.REVISION,
        resultado_validacion: false,
        respuesta:
            'BEGIN\nREAD a, b, c\nIF a > b AND a > c THEN PRINT a\nELSE IF b > c THEN PRINT b\nELSE PRINT c\nEND',
    },

    // ===== Proyecto Colaborativo (En curso) =====
    {
        usuario_correo: 'juan@gmail.com',
        problema_titulo: 'Frecuencia de Caracteres',
        competencia_nombre: 'Proyecto Colaborativo 2026',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'from collections import Counter\ns = input()\nfor c, n in sorted(Counter(s).items()):\n    print(f"{c}:{n}")',
    },

    // ===== Hackathon Grupal 2026 =====
    {
        usuario_correo: 'lucas@gmail.com',
        problema_titulo: 'Suma de Subarreglo Máximo',
        competencia_nombre: 'Hackathon Grupal 2026',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.CORRECTO,
        resultado_validacion: true,
        respuesta:
            'n = int(input())\narr = list(map(int, input().split()))\nbest = cur = arr[0]\nfor x in arr[1:]:\n    cur = max(x, cur + x)\n    best = max(best, cur)\nprint(best)',
    },
    {
        usuario_correo: 'sofia@gmail.com',
        problema_titulo: 'Ordenar por Frecuencia',
        competencia_nombre: 'Hackathon Grupal 2026',
        lenguaje: Lenguaje.JAVASCRIPT,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'const s = require("fs").readFileSync(0, "utf8").trim();\nconst counts = {};\nconst order = [];\nfor (const c of s) { if (!(c in counts)) { counts[c] = 0; order.push(c); } counts[c]++; }\nconst sorted = order.sort((a,b) => counts[b] - counts[a]);\nconsole.log(sorted.map(c => c.repeat(counts[c])).join(""));',
    },

    // ===== Batalla de Equipos =====
    {
        usuario_correo: 'diego@gmail.com',
        problema_titulo: 'Longest Common Subsequence',
        competencia_nombre: 'Batalla de Equipos',
        lenguaje: Lenguaje.PYTHON,
        estado: EstadoSolucion.PENDIENTE,
        resultado_validacion: false,
        respuesta:
            'a = input()\nb = input()\nn, m = len(a), len(b)\ndp = [[0]*(m+1) for _ in range(n+1)]\nfor i in range(1, n+1):\n    for j in range(1, m+1):\n        if a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1] + 1\n        else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\nprint(dp[n][m])',
    },
];

export const solucionesSeed: Seed = {
    order: 6,
    name: 'Soluciones',
    run: async () => {
        await dataSource.initialize();
        console.log('🔌 Conectado a la base de datos para seed');

        const solucionRepository = dataSource.getRepository(Solucion);
        const usuarioRepository = dataSource.getRepository(Usuario);
        const problemaRepository = dataSource.getRepository(Problema);
        const inscripcionRepository = dataSource.getRepository(Inscripcion);

        let created = 0;
        let skipped = 0;

        for (const data of solucionesData) {
            const usuario = await usuarioRepository.findOne({
                where: { correo_electronico: data.usuario_correo },
            });
            if (!usuario) {
                console.log(
                    `⚠️  Usuario "${data.usuario_correo}" no encontrado, omitiendo.`,
                );
                skipped++;
                continue;
            }

            const problema = await problemaRepository
                .createQueryBuilder('p')
                .innerJoinAndSelect('p.competencia', 'c')
                .where('p.titulo = :titulo', { titulo: data.problema_titulo })
                .andWhere('c.nombre = :cn', { cn: data.competencia_nombre })
                .getOne();
            if (!problema) {
                console.log(
                    `⚠️  Problema "${data.problema_titulo}" en "${data.competencia_nombre}" no encontrado, omitiendo.`,
                );
                skipped++;
                continue;
            }

            // El usuario debe estar inscripto en esa competencia
            const inscripcion = await inscripcionRepository.findOne({
                where: {
                    usuario: { id: usuario.id },
                    competencia: { id: problema.competencia.id },
                },
            });
            if (!inscripcion) {
                console.log(
                    `⚠️  ${data.usuario_correo} no está inscripto en "${data.competencia_nombre}", omitiendo solución.`,
                );
                skipped++;
                continue;
            }

            // No duplicar: un usuario solo tiene una solución por problema
            const existing = await solucionRepository.findOne({
                where: {
                    usuario: { id: usuario.id },
                    problema: { id: problema.id },
                },
            });
            if (existing) {
                console.log(
                    `ℹ️  Solución de ${data.usuario_correo} en "${data.problema_titulo}" ya existe.`,
                );
                skipped++;
                continue;
            }

            const solucion = solucionRepository.create({
                respuesta: data.respuesta,
                lenguaje_programacion: data.lenguaje,
                estado: data.estado,
                resultado_validacion: data.resultado_validacion,
                problema: { id: problema.id },
                usuario: { id: usuario.id },
            });
            await solucionRepository.save(solucion);
            created++;
            console.log(
                `✅ Solución creada: ${data.usuario_correo} → "${data.problema_titulo}" (${data.estado})`,
            );
        }

        console.log(
            `✅ Seeds de soluciones completados (creadas: ${created}, omitidas: ${skipped})`,
        );
        await dataSource.destroy();
    },
};
