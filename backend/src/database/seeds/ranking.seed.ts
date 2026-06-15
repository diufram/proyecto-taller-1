import { DataSource, Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { Usuario, Rol } from '../entities/usuario.entity';
import {
  Solucion,
  EstadoSolucion,
  Lenguaje,
} from '../entities/solucion.entity';
import { Problema } from '../entities/problema.entity';
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

const PUNTOS_POR_DIFICULTAD: Record<string, number> = {
  Facil: 10,
  Medio: 20,
  Dificil: 30,
};

const solucionesPorUsuario: Record<string, number> = {
  matias_ramos: 12,
  lucas_garcia: 10,
  sofia_martinez: 9,
  valentina_lopez: 8,
  santiago_rodriguez: 6,
  camila_fernandez: 5,
  juan_pereyra: 4,
  maria_torres: 3,
};

const inscripcionesPorUsuario: Record<string, number> = {
  matias_ramos: 4,
  lucas_garcia: 3,
  sofia_martinez: 3,
  valentina_lopez: 2,
  santiago_rodriguez: 2,
  camila_fernandez: 2,
  juan_pereyra: 1,
  maria_torres: 1,
};

export const rankingSeed: Seed = {
  order: 5,
  name: 'Ranking Inicial (Soluciones + Puntos)',
  run: async () => {
    await dataSource.initialize();
    console.log('🔌 Conectado a la base de datos para seed');

    const usuarioRepository = dataSource.getRepository(Usuario);
    const problemaRepository = dataSource.getRepository(Problema);
    const solucionRepository = dataSource.getRepository(Solucion);
    const inscripcionRepository = dataSource.getRepository(Inscripcion);

    const problemas = await problemaRepository.find({
      relations: ['competencia'],
    });

    const competenciasUnicas = Array.from(
      new Map(
        problemas.map((p) => [
          p.competencia.id,
          { id: p.competencia.id, nombre: p.competencia.nombre },
        ]),
      ).values(),
    );

    for (const [username, totalSoluciones] of Object.entries(
      solucionesPorUsuario,
    )) {
      const usuario = await usuarioRepository.findOne({
        where: { nombre_usuario: username, rol: Rol.USER },
      });

      if (!usuario) {
        console.log(`⚠️  Usuario "${username}" no encontrado, omitiendo.`);
        continue;
      }

      const totalInscripciones = inscripcionesPorUsuario[username] ?? 0;

      const yaTieneSoluciones = await solucionRepository.count({
        where: { usuario: { id: usuario.id } },
      });
      if (yaTieneSoluciones > 0) {
        console.log(
          `ℹ️  "${username}" ya tiene soluciones, omitiendo creación.`,
        );
      } else {
        const problemasAsignados = problemas
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(totalSoluciones, problemas.length));

        let puntosAcumulados = 0;
        for (const problema of problemasAsignados) {
          const puntos = PUNTOS_POR_DIFICULTAD[problema.dificultad] ?? 0;
          puntosAcumulados += puntos;

          const solucion = solucionRepository.create({
            respuesta: `// Solución seed para "${problema.titulo}"`,
            estado: EstadoSolucion.CORRECTO,
            lenguaje_programacion: 'Python' as Lenguaje,
            resultado_validacion: true,
            problema: { id: problema.id } as Problema,
            usuario: { id: usuario.id } as Usuario,
          });
          await solucionRepository.save(solucion);
        }

        usuario.puntos_totales = puntosAcumulados;
        await usuarioRepository.save(usuario);
        console.log(
          `✅ ${username}: ${problemasAsignados.length} soluciones (${puntosAcumulados} pts)`,
        );
      }

      const yaTieneInscripciones = await inscripcionRepository.count({
        where: { usuario: { id: usuario.id } },
      });
      if (yaTieneInscripciones === 0 && totalInscripciones > 0) {
        const competenciasAsignadas = competenciasUnicas
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(totalInscripciones, competenciasUnicas.length));

        for (const comp of competenciasAsignadas) {
          const inscripcion = inscripcionRepository.create({
            fecha_inscripcion: new Date(),
            usuario: { id: usuario.id } as Usuario,
            competencia: { id: comp.id },
          });
          await inscripcionRepository.save(inscripcion);
        }
        console.log(
          `✅ ${username}: ${competenciasAsignadas.length} inscripciones`,
        );
      }
    }

    await recomputarPosiciones(usuarioRepository);

    console.log('✅ Seeds de ranking completados');

    await dataSource.destroy();
  },
};

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
