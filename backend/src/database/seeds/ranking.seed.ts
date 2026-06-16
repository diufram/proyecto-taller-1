import { DataSource, Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { Usuario, Rol } from '../entities/usuario.entity';
import {
  Solucion,
  EstadoSolucion,
  Lenguaje,
} from '../entities/solucion.entity';
import { Problema, Dificultad } from '../entities/problema.entity';
import { Inscripcion } from '../entities/inscripcion.entity';
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

const PUNTOS_POR_DIFICULTAD: Record<Dificultad, number> = {
  [Dificultad.FACIL]: 10,
  [Dificultad.MEDIO]: 20,
  [Dificultad.DIFICIL]: 30,
};

interface PerfilUsuario {
  username: string;
  correctas: number;
  incorrectas: number;
  pendientes: number;
  inscripciones: number;
}

const perfilesUsuarios: PerfilUsuario[] = [
  {
    username: 'matias_ramos',
    correctas: 14,
    incorrectas: 2,
    pendientes: 1,
    inscripciones: 6,
  },
  {
    username: 'lucas_garcia',
    correctas: 12,
    incorrectas: 1,
    pendientes: 0,
    inscripciones: 5,
  },
  {
    username: 'sofia_martinez',
    correctas: 11,
    incorrectas: 1,
    pendientes: 0,
    inscripciones: 5,
  },
  {
    username: 'valentina_lopez',
    correctas: 9,
    incorrectas: 2,
    pendientes: 0,
    inscripciones: 4,
  },
  {
    username: 'santiago_rodriguez',
    correctas: 8,
    incorrectas: 1,
    pendientes: 1,
    inscripciones: 4,
  },
  {
    username: 'camila_fernandez',
    correctas: 7,
    incorrectas: 2,
    pendientes: 0,
    inscripciones: 3,
  },
  {
    username: 'juan_pereyra',
    correctas: 6,
    incorrectas: 1,
    pendientes: 0,
    inscripciones: 3,
  },
  {
    username: 'maria_torres',
    correctas: 5,
    incorrectas: 0,
    pendientes: 0,
    inscripciones: 2,
  },
  {
    username: 'martin_acosta',
    correctas: 5,
    incorrectas: 1,
    pendientes: 0,
    inscripciones: 3,
  },
  {
    username: 'florencia_vega',
    correctas: 4,
    incorrectas: 1,
    pendientes: 0,
    inscripciones: 2,
  },
  {
    username: 'diego_suarez',
    correctas: 3,
    incorrectas: 0,
    pendientes: 1,
    inscripciones: 2,
  },
  {
    username: 'paula_romero',
    correctas: 3,
    incorrectas: 1,
    pendientes: 0,
    inscripciones: 1,
  },
  {
    username: 'bruno_aguilar',
    correctas: 2,
    incorrectas: 0,
    pendientes: 0,
    inscripciones: 1,
  },
  {
    username: 'renata_castro',
    correctas: 1,
    incorrectas: 1,
    pendientes: 0,
    inscripciones: 1,
  },
  {
    username: 'facundo_mendez',
    correctas: 1,
    incorrectas: 0,
    pendientes: 0,
    inscripciones: 1,
  },
];

const LENGUAJES: Lenguaje[] = [
  Lenguaje.PYTHON,
  Lenguaje.JAVA,
  Lenguaje.C,
  Lenguaje.JAVASCRIPT,
];

const RESPUESTAS_POR_LENGUAJE: Record<Lenguaje, string> = {
  [Lenguaje.PYTHON]: 'def solve():\n    return 42\n\nprint(solve())',
  [Lenguaje.JAVA]:
    'public class Main {\n    public static void main(String[] args) {\n        System.out.println(42);\n    }\n}',
  [Lenguaje.C]:
    '#include <stdio.h>\nint main() { printf("%d", 42); return 0; }',
  [Lenguaje.JAVASCRIPT]:
    'function solve() { return 42; }\nconsole.log(solve());',
  [Lenguaje.PSEUDOCODIGO]: 'INICIO\n  ESCRIBIR 42\nFIN',
  [Lenguaje.OTRO]: '// Solución alternativa',
};

export const rankingSeed: Seed = {
  order: 5,
  name: 'Ranking Inicial (Soluciones + Puntos + Inscripciones)',
  run: async () => {
    await dataSource.initialize();
    console.log('🔌 Conectado a la base de datos para seed');

    const usuarioRepository = dataSource.getRepository(Usuario);
    const problemaRepository = dataSource.getRepository(Problema);
    const solucionRepository = dataSource.getRepository(Solucion);
    const inscripcionRepository = dataSource.getRepository(Inscripcion);

    const problemas = await problemaRepository.find({
      relations: ['competencia'],
      order: { id: 'ASC' },
    });

    if (problemas.length === 0) {
      console.log('⚠️  No hay problemas cargados, abortando seed de ranking.');
      await dataSource.destroy();
      return;
    }

    const problemasPorDificultad: Record<Dificultad, Problema[]> = {
      [Dificultad.FACIL]: problemas.filter(
        (p) => p.dificultad === Dificultad.FACIL,
      ),
      [Dificultad.MEDIO]: problemas.filter(
        (p) => p.dificultad === Dificultad.MEDIO,
      ),
      [Dificultad.DIFICIL]: problemas.filter(
        (p) => p.dificultad === Dificultad.DIFICIL,
      ),
    };

    const competenciasUnicas = Array.from(
      new Map(
        problemas.map((p) => [
          p.competencia.id,
          { id: p.competencia.id, nombre: p.competencia.nombre },
        ]),
      ).values(),
    );

    for (let i = 0; i < perfilesUsuarios.length; i++) {
      const perfil = perfilesUsuarios[i];
      const usuario = await usuarioRepository.findOne({
        where: { nombre_usuario: perfil.username, rol: Rol.USER },
      });

      if (!usuario) {
        console.log(
          `⚠️  Usuario "${perfil.username}" no encontrado, omitiendo.`,
        );
        continue;
      }

      const problemasAsignables = problemasPorDificultad[Dificultad.FACIL]
        .concat(problemasPorDificultad[Dificultad.MEDIO])
        .concat(problemasPorDificultad[Dificultad.DIFICIL]);

      const problemasCorrectos = pickDistributed(
        problemasAsignables,
        perfil.correctas,
        i,
      );
      const problemasIncorrectos = pickDistributed(
        problemasAsignables.filter(
          (p) => !problemasCorrectos.some((pc) => pc.id === p.id),
        ),
        perfil.incorrectas,
        i,
      );
      const problemasPendientes = pickDistributed(
        problemasAsignables.filter(
          (p) =>
            !problemasCorrectos.some((pc) => pc.id === p.id) &&
            !problemasIncorrectos.some((pi) => pi.id === p.id),
        ),
        perfil.pendientes,
        i,
      );

      const yaTieneSoluciones = await solucionRepository.count({
        where: { usuario: { id: usuario.id } },
      });

      if (yaTieneSoluciones > 0) {
        console.log(
          `ℹ️  "${perfil.username}" ya tiene soluciones, omitiendo creación.`,
        );
      } else {
        let puntosAcumulados = 0;
        const lenguaje = LENGUAJES[i % LENGUAJES.length] || Lenguaje.PYTHON;

        for (const problema of problemasCorrectos) {
          const puntos = PUNTOS_POR_DIFICULTAD[problema.dificultad];
          puntosAcumulados += puntos;
          await solucionRepository.save(
            solucionRepository.create({
              respuesta: RESPUESTAS_POR_LENGUAJE[lenguaje],
              estado: EstadoSolucion.CORRECTO,
              lenguaje_programacion: lenguaje,
              resultado_validacion: true,
              problema: { id: problema.id } as Problema,
              usuario: { id: usuario.id } as Usuario,
            }),
          );
        }

        for (const problema of problemasIncorrectos) {
          await solucionRepository.save(
            solucionRepository.create({
              respuesta: `// Intento fallido para "${problema.titulo}"`,
              estado: EstadoSolucion.INCORRECTO,
              lenguaje_programacion: lenguaje,
              resultado_validacion: false,
              problema: { id: problema.id } as Problema,
              usuario: { id: usuario.id } as Usuario,
            }),
          );
        }

        for (const problema of problemasPendientes) {
          await solucionRepository.save(
            solucionRepository.create({
              respuesta: `// Pendiente de revisión para "${problema.titulo}"`,
              estado: EstadoSolucion.PENDIENTE,
              lenguaje_programacion: lenguaje,
              resultado_validacion: false,
              problema: { id: problema.id } as Problema,
              usuario: { id: usuario.id } as Usuario,
            }),
          );
        }

        usuario.puntos_totales = puntosAcumulados;
        await usuarioRepository.save(usuario);
        console.log(
          `✅ ${perfil.username}: ${problemasCorrectos.length}C/${problemasIncorrectos.length}I/${problemasPendientes.length}P → ${puntosAcumulados} pts`,
        );
      }

      const yaTieneInscripciones = await inscripcionRepository.count({
        where: { usuario: { id: usuario.id } },
      });
      if (yaTieneInscripciones === 0 && perfil.inscripciones > 0) {
        const competenciasAsignadas = pickDistributed(
          competenciasUnicas,
          perfil.inscripciones,
          i,
        );

        for (const comp of competenciasAsignadas) {
          const fecha = new Date();
          fecha.setDate(fecha.getDate() - (perfil.inscripciones * 2 + i));
          await inscripcionRepository.save(
            inscripcionRepository.create({
              fecha_inscripcion: fecha,
              usuario: { id: usuario.id } as Usuario,
              competencia: { id: comp.id },
            }),
          );
        }
      }
    }

    await recomputarPosiciones(usuarioRepository);

    console.log('✅ Seeds de ranking completados');

    await dataSource.destroy();
  },
};

function pickDistributed<T>(source: T[], count: number, seed: number): T[] {
  if (count <= 0 || source.length === 0) return [];
  const stride = Math.max(1, Math.floor(source.length / count));
  const result: T[] = [];
  const offset = seed % source.length;
  for (let i = 0; i < count; i++) {
    const idx = (offset + i * stride) % source.length;
    const item = source[idx];
    if (item && !result.includes(item)) {
      result.push(item);
    }
  }
  if (result.length < count) {
    for (const item of source) {
      if (result.length >= count) break;
      if (!result.includes(item)) result.push(item);
    }
  }
  return result.slice(0, count);
}

async function recomputarPosiciones(repo: Repository<Usuario>) {
  await repo
    .createQueryBuilder()
    .update(Usuario)
    .set({ posicion_global: () => 'NULL' })
    .where('rol = :rol', { rol: Rol.USER })
    .execute();

  const ranking = await repo
    .createQueryBuilder('u')
    .select('u.id', 'id')
    .addSelect(
      'ROW_NUMBER() OVER (ORDER BY u.puntos_totales DESC, u.created_at ASC)',
      'pos',
    )
    .where('u.rol = :rol', { rol: 'user' })
    .getRawMany<{ id: number; pos: string }>();

  for (const r of ranking) {
    await repo.update({ id: r.id }, { posicion_global: parseInt(r.pos, 10) });
  }
  console.log(`📊 Posiciones recalculadas para ${ranking.length} usuarios.`);
}
