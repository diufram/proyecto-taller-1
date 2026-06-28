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
 * Soluciones distribuidas en competencias finalizadas, en curso y abiertas,
 * con variedad de estados para probar listados, filtros, ranking y calificación.
 */
const solucionesData: SolucionData[] = [
  // ===== Duelo de Algoritmos (Finalizada - Intermedio) =====
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

  // ===== Maratón de Programación 2026 (Finalizada - Intermedio) =====
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

  // ===== Olimpíadas de Código (Finalizada - Avanzado) =====
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

  // ===== Copa Junior 2026 (En curso - Principiante) =====
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
    respuesta: 'n = int(input())\nprint(sum(i for i in range(2, n+1, 2)))',
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

  // ===== Proyecto Colaborativo 2026 (En curso - Intermedio) =====
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

  // ===== Maratón de Verano 2026 (En curso - Intermedio) =====
  {
    usuario_correo: 'santiago@gmail.com',
    problema_titulo: 'Temperaturas Extremas',
    competencia_nombre: 'Maratón de Verano 2026',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'n = int(input())\nt = list(map(int, input().split()))\nprint(max(t) - min(t))',
  },
  {
    usuario_correo: 'bruno@gmail.com',
    problema_titulo: 'Lista de Compras',
    competencia_nombre: 'Maratón de Verano 2026',
    lenguaje: Lenguaje.JAVASCRIPT,
    estado: EstadoSolucion.CORRECTO,
    resultado_validacion: true,
    respuesta:
      'const lines = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst n = Number(lines[0]);\nlet total = 0;\nfor (let i = 1; i <= n; i++) { const parts = lines[i].split(" "); total += Number(parts[1]); }\nconsole.log(total);',
  },
  {
    usuario_correo: 'renata@gmail.com',
    problema_titulo: 'Palabras más Largas',
    competencia_nombre: 'Maratón de Verano 2026',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'palabras = input().split()\nmax_len = max(len(p) for p in palabras)\nprint(" ".join(p for p in palabras if len(p) == max_len))',
  },

  // ===== Hackathon Universitario (En curso - Avanzado, Grupal) =====
  {
    usuario_correo: 'diego@gmail.com',
    problema_titulo: 'Trie - Búsqueda de Prefijo',
    competencia_nombre: 'Hackathon Universitario',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def insert(self, w):\n        node = self.root\n        for c in w:\n            if c not in node.children: node.children[c] = TrieNode()\n            node = node.children[c]\n        node.is_end = True\n    def count_prefix(self, p):\n        node = self.root\n        for c in p:\n            if c not in node.children: return 0\n            node = node.children[c]\n        return self._count(node)\n    def _count(self, node):\n        n = 1 if node.is_end else 0\n        for c in node.children.values(): n += self._count(c)\n        return n\n\nlines = []\nwhile True:\n    try: lines.append(input())\n    except EOFError: break\nidx = 0\nn = int(lines[idx]); idx += 1\ntrie = Trie()\nfor _ in range(n): trie.insert(lines[idx]); idx += 1\nm = int(lines[idx]); idx += 1\nfor _ in range(m): print(trie.count_prefix(lines[idx])); idx += 1',
  },
  {
    usuario_correo: 'martin@gmail.com',
    problema_titulo: 'Union-Find (DSU)',
    competencia_nombre: 'Hackathon Universitario',
    lenguaje: Lenguaje.C,
    estado: EstadoSolucion.CORRECTO,
    resultado_validacion: true,
    respuesta:
      '#include <stdio.h>\nint parent[100001], rank_[100001];\nint find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }\nvoid unite(int a, int b) { a = find(a); b = find(b); if (a == b) return; if (rank_[a] < rank_[b]) { int t = a; a = b; b = t; } parent[b] = a; if (rank_[a] == rank_[b]) rank_[a]++; }\nint main() { int n; scanf("%d", &n); for (int i = 0; i <= 100000; i++) { parent[i] = i; rank_[i] = 0; } char op[8]; int x, y; for (int i = 0; i < n; i++) { scanf("%s", op); if (op[0] == \'u\') { scanf("%d %d", &x, &y); unite(x, y); } else { scanf("%d", &x); printf("%d\\n", find(x)); } } return 0; }',
  },
  {
    usuario_correo: 'paula@gmail.com',
    problema_titulo: 'Top K Frecuentes',
    competencia_nombre: 'Hackathon Universitario',
    lenguaje: Lenguaje.JAVASCRIPT,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'const [nk, ...rest] = require("fs").readFileSync(0, "utf8").trim().split("\\n");\nconst [n, k] = nk.split(" ").map(Number);\nconst arr = rest.join(" ").split(" ").map(Number);\nconst counts = new Map();\nfor (const x of arr) counts.set(x, (counts.get(x) || 0) + 1);\nconst sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]);\nconsole.log(sorted.slice(0, k).map(e => e[0]).join(" "));',
  },
  {
    usuario_correo: 'bruno@gmail.com',
    problema_titulo: 'Recorrido BFS en Grafo',
    competencia_nombre: 'Hackathon Universitario',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.INCORRECTO,
    resultado_validacion: false,
    respuesta:
      'v, e = map(int, input().split())\nadj = [[] for _ in range(v)]\nfor _ in range(e):\n    a, b = map(int, input().split())\n    adj[a].append(b)\nprint(" ".join(str(x) for x in range(v)))',
  },

  // ===== Concurso de Verano Principiante (En curso - Principiante) =====
  {
    usuario_correo: 'valentina@gmail.com',
    problema_titulo: 'Edad en Días',
    competencia_nombre: 'Concurso de Verano Principiante',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta: 'n = int(input())\nprint(n * 365)',
  },
  {
    usuario_correo: 'santiago@gmail.com',
    problema_titulo: 'Promedio Simple',
    competencia_nombre: 'Concurso de Verano Principiante',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.CORRECTO,
    resultado_validacion: true,
    respuesta: 'a, b, c = map(int, input().split())\nprint((a + b + c) // 3)',
  },
  {
    usuario_correo: 'renata@gmail.com',
    problema_titulo: 'Tabla del 2 al 5',
    competencia_nombre: 'Concurso de Verano Principiante',
    lenguaje: Lenguaje.PSEUDOCODIGO,
    estado: EstadoSolucion.REVISION,
    resultado_validacion: false,
    respuesta:
      'para n desde 2 hasta 5:\n    para i desde 1 hasta 10:\n        escribir n + " x " + i + " = " + (n*i)\n    escribir ""',
  },

  // ===== Liga de Programación Junior (En curso - Intermedio, Grupal) =====
  {
    usuario_correo: 'juan@gmail.com',
    problema_titulo: 'Validar RUT',
    competencia_nombre: 'Liga de Programación Junior',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'rut, dv = input().split("-")\nrut = int(rut)\ns = 0\nm = 2\nfor d in reversed(str(rut)):\n    s += int(d) * m\n    m = m + 1 if m < 7 else 2\ncalc = 11 - (s % 11)\nif calc == 11: calc_dv = "0"\nelif calc == 10: calc_dv = "K"\nelse: calc_dv = str(calc)\nprint("VALIDO" if calc_dv == dv else "INVALIDO")',
  },
  {
    usuario_correo: 'lucas@gmail.com',
    problema_titulo: 'Puntaje de Tenis',
    competencia_nombre: 'Liga de Programación Junior',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.CORRECTO,
    resultado_validacion: true,
    respuesta:
      'a, b = input().split()\nif a == b: print("EMPATE")\nelif (a, b) in [("40", "ventaja"), ("30", "40")]: print("Jugador 1")\nelif (a, b) in [("ventaja", "40"), ("40", "30")]: print("Jugador 2")\nelif a == "gana": print("Jugador 1")\nelif b == "gana": print("Jugador 2")\nelif a == "ventaja": print("Jugador 1")\nelif b == "ventaja": print("Jugador 2")\nelse: print("Jugador 1" if a > b else "Jugador 2")',
  },
  {
    usuario_correo: 'sofia@gmail.com',
    problema_titulo: 'Reconstruir Frase',
    competencia_nombre: 'Liga de Programación Junior',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'n = int(input())\norden = {}\nfor _ in range(n):\n    o, w = input().split(maxsplit=1)\n    orden[int(o)] = w\nprint(" ".join(orden[i] for i in range(1, n+1)))',
  },
  {
    usuario_correo: 'valentina@gmail.com',
    problema_titulo: 'Validar RUT',
    competencia_nombre: 'Liga de Programación Junior',
    lenguaje: Lenguaje.JAVASCRIPT,
    estado: EstadoSolucion.INCORRECTO,
    resultado_validacion: false,
    respuesta:
      'const [rut, dv] = require("fs").readFileSync(0, "utf8").trim().split("-");\nlet s = 0, m = 2;\nfor (let i = rut.length - 1; i >= 0; i--) { s += Number(rut[i]) * m; m = m < 7 ? m + 1 : 2; }\nlet calc = 11 - (s % 11);\nlet calcDv = calc === 11 ? "0" : calc === 10 ? "K" : String(calc);\nconsole.log(calcDv === dv ? "VALIDO" : "INVALIDO");',
  },

  // ===== Clasificatorio Regional 2026 (Abierta - Avanzado) =====
  {
    usuario_correo: 'matias@gmail.com',
    problema_titulo: 'Knapsack 0-1',
    competencia_nombre: 'Clasificatorio Regional 2026',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'n, w = map(int, input().split())\ndp = [0] * (w + 1)\nfor _ in range(n):\n    peso, valor = map(int, input().split())\n    for cap in range(w, peso - 1, -1):\n        dp[cap] = max(dp[cap], dp[cap - peso] + valor)\nprint(dp[w])',
  },
  {
    usuario_correo: 'lucas@gmail.com',
    problema_titulo: 'Dijkstra en Grafo Ponderado',
    competencia_nombre: 'Clasificatorio Regional 2026',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.REVISION,
    resultado_validacion: false,
    respuesta:
      'import heapq\nn, m = map(int, input().split())\ng = [[] for _ in range(n)]\nfor _ in range(m):\n    a, b, c = map(int, input().split())\n    g[a].append((b, c))\nd = [10**18] * n\nd[0] = 0\npq = [(0, 0)]\nwhile pq:\n    dist, u = heapq.heappop(pq)\n    if dist != d[u]: continue\n    for v, c in g[u]:\n        if d[v] > dist + c:\n            d[v] = dist + c\n            heapq.heappush(pq, (d[v], v))\nprint(d[n - 1] if d[n - 1] < 10**18 else -1)',
  },

  // ===== Olimpíada Matemática 2026 (Abierta - Avanzado) =====
  {
    usuario_correo: 'sofia@gmail.com',
    problema_titulo: 'Número Primo',
    competencia_nombre: 'Olimpíada Matemática 2026',
    lenguaje: Lenguaje.JAVASCRIPT,
    estado: EstadoSolucion.CORRECTO,
    resultado_validacion: true,
    respuesta:
      'const n = Number(require("fs").readFileSync(0, "utf8"));\nlet ok = n > 1;\nfor (let i = 2; i * i <= n; i++) if (n % i === 0) ok = false;\nconsole.log(ok ? "SI" : "NO");',
  },
  {
    usuario_correo: 'camila@gmail.com',
    problema_titulo: 'Máximo Común Divisor',
    competencia_nombre: 'Olimpíada Matemática 2026',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'a, b = map(int, input().split())\nwhile b:\n    a, b = b, a % b\nprint(a)',
  },
  {
    usuario_correo: 'florencia@gmail.com',
    problema_titulo: 'Descomposición en Primos',
    competencia_nombre: 'Olimpíada Matemática 2026',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.INCORRECTO,
    resultado_validacion: false,
    respuesta:
      'n = int(input())\nprint(n)',
  },

  // ===== Desafío de Estructuras de Datos (Abierta - Intermedio) =====
  {
    usuario_correo: 'martin@gmail.com',
    problema_titulo: 'Stack con Mínimo',
    competencia_nombre: 'Desafío de Estructuras de Datos',
    lenguaje: Lenguaje.JAVA,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'import java.util.*;\nclass Main { public static void main(String[] args) { Scanner sc = new Scanner(System.in); Stack<Integer> st = new Stack<>(), mn = new Stack<>(); int q = sc.nextInt(); while(q-- > 0){ String op=sc.next(); if(op.equals("push")){ int x=sc.nextInt(); st.push(x); mn.push(mn.empty()?x:Math.min(x,mn.peek())); } else if(op.equals("pop")){ st.pop(); mn.pop(); } else System.out.println(mn.peek()); } } }',
  },
  {
    usuario_correo: 'diego@gmail.com',
    problema_titulo: 'Recorrido BFS en Grafo',
    competencia_nombre: 'Desafío de Estructuras de Datos',
    lenguaje: Lenguaje.C,
    estado: EstadoSolucion.REVISION,
    resultado_validacion: false,
    respuesta:
      '#include <stdio.h>\nint main(){ int n,m; scanf("%d %d", &n, &m); for(int i=0;i<n;i++) printf("%d ", i); return 0; }',
  },

  // ===== Concurso de Programación Funcional (Abierta - Avanzado) =====
  {
    usuario_correo: 'paula@gmail.com',
    problema_titulo: 'Map y Filter',
    competencia_nombre: 'Concurso de Programación Funcional',
    lenguaje: Lenguaje.JAVASCRIPT,
    estado: EstadoSolucion.CORRECTO,
    resultado_validacion: true,
    respuesta:
      'const arr = require("fs").readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\nconsole.log(arr.map(x => x * 2).filter(x => x % 3 === 0).join(" "));',
  },
  {
    usuario_correo: 'bruno@gmail.com',
    problema_titulo: 'Reduce - Sumar Arreglo',
    competencia_nombre: 'Concurso de Programación Funcional',
    lenguaje: Lenguaje.JAVASCRIPT,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'const nums = require("fs").readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\nconsole.log(nums.reduce((a, b) => a + b, 0));',
  },

  // ===== Torneo Universitario de Algoritmos (Abierta - Intermedio) =====
  {
    usuario_correo: 'juan@gmail.com',
    problema_titulo: 'Cumpleaños en Común',
    competencia_nombre: 'Torneo Universitario de Algoritmos',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'n = int(input())\nseen = set()\nans = "NO"\nfor _ in range(n):\n    d = input().strip()\n    if d in seen: ans = "SI"\n    seen.add(d)\nprint(ans)',
  },
  {
    usuario_correo: 'maria@gmail.com',
    problema_titulo: 'Matriz Simétrica',
    competencia_nombre: 'Torneo Universitario de Algoritmos',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.CORRECTO,
    resultado_validacion: true,
    respuesta:
      'n = int(input())\na = [list(map(int, input().split())) for _ in range(n)]\nprint("SI" if all(a[i][j] == a[j][i] for i in range(n) for j in range(n)) else "NO")',
  },

  // ===== Copa Femenina de Programación (Abierta - Principiante) =====
  {
    usuario_correo: 'valentina@gmail.com',
    problema_titulo: 'Saludo Personalizado',
    competencia_nombre: 'Copa Femenina de Programación',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.CORRECTO,
    resultado_validacion: true,
    respuesta: 'nombre = input().strip()\nprint(f"Hola, {nombre}!")',
  },
  {
    usuario_correo: 'maria@gmail.com',
    problema_titulo: 'Año Bisiesto',
    competencia_nombre: 'Copa Femenina de Programación',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'y = int(input())\nprint("SI" if (y % 400 == 0 or (y % 4 == 0 and y % 100 != 0)) else "NO")',
  },

  // ===== Code Sprint Universitario (Abierta - Intermedio) =====
  {
    usuario_correo: 'renata@gmail.com',
    problema_titulo: 'Detección de Duplicados',
    competencia_nombre: 'Code Sprint Universitario',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.PENDIENTE,
    resultado_validacion: false,
    respuesta:
      'arr = list(map(int, input().split()))\nprint("SI" if len(arr) != len(set(arr)) else "NO")',
  },
  {
    usuario_correo: 'facundo@gmail.com',
    problema_titulo: 'Producto de Elementos Excepto Self',
    competencia_nombre: 'Code Sprint Universitario',
    lenguaje: Lenguaje.PYTHON,
    estado: EstadoSolucion.REVISION,
    resultado_validacion: false,
    respuesta:
      'a = list(map(int, input().split()))\nprod = 1\nfor x in a: prod *= x\nprint(" ".join(str(prod // x) for x in a))',
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
