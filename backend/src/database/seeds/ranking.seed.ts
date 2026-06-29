import { DataSource, Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { Usuario, Rol } from '../entities/usuario.entity';
import { Solucion, EstadoSolucion } from '../entities/solucion.entity';
import { Problema, Dificultad } from '../entities/problema.entity';
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

export const rankingSeed: Seed = {
  order: 7,
  name: 'Ranking (recalcular puntos y posiciones)',
  run: async () => {
    await dataSource.initialize();
    console.log('🔌 Conectado a la base de datos para seed');

    const usuarioRepository = dataSource.getRepository(Usuario);
    const problemaRepository = dataSource.getRepository(Problema);
    const solucionRepository = dataSource.getRepository(Solucion);

    // Resetear puntos a 0
    await usuarioRepository
      .createQueryBuilder()
      .update(Usuario)
      .set({ puntos_totales: 0, posicion_global: () => 'NULL' })
      .where('rol = :rol', { rol: Rol.ESTUDIANTE })
      .execute();

    const problemas = await problemaRepository.find();
    const puntosPorProblema = new Map<number, number>();
    for (const p of problemas) {
      puntosPorProblema.set(p.id, PUNTOS_POR_DIFICULTAD[p.dificultad] ?? 0);
    }

    // Sumar puntos por cada solución CORRECTA
    const correctas = await solucionRepository.find({
      where: { estado: EstadoSolucion.CORRECTO },
      relations: ['usuario', 'problema'],
    });

    const puntosPorUsuario = new Map<number, number>();
    for (const s of correctas) {
      if (!s.usuario) continue;
      const puntos = puntosPorProblema.get(s.problema.id) ?? 0;
      puntosPorUsuario.set(
        s.usuario.id,
        (puntosPorUsuario.get(s.usuario.id) ?? 0) + puntos,
      );
    }

    for (const [usuarioId, puntos] of puntosPorUsuario) {
      await usuarioRepository.update(
        { id: usuarioId },
        { puntos_totales: puntos },
      );
    }

    await recomputarPosiciones(usuarioRepository);

    console.log(
      `✅ Ranking recalculado (${correctas.length} soluciones correctas procesadas).`,
    );
    await dataSource.destroy();
  },
};

async function recomputarPosiciones(repo: Repository<Usuario>) {
  const ranking = await repo
    .createQueryBuilder('u')
    .select('u.id', 'id')
    .addSelect(
      'ROW_NUMBER() OVER (ORDER BY u.puntos_totales DESC, u.created_at ASC)',
      'pos',
    )
    .where('u.rol = :rol', { rol: Rol.ESTUDIANTE })
    .getRawMany<{ id: number; pos: string }>();

  for (const r of ranking) {
    await repo.update({ id: r.id }, { posicion_global: parseInt(r.pos, 10) });
  }
  console.log(`📊 Posiciones recalculadas para ${ranking.length} usuarios.`);
}
