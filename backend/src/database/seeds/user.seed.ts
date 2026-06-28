import { hash } from 'bcryptjs';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Usuario, Rol } from '../entities/usuario.entity';
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

export const userSeed: Seed = {
  order: 2,
  name: 'Test Users',
  run: async () => {
    await dataSource.initialize();
    console.log('🔌 Conectado a la base de datos para seed');

    const repository = dataSource.getRepository(Usuario);

    const usuariosData = [
      { correo_electronico: 'm@gmail.com' },
      { correo_electronico: 'matias@gmail.com' },
      { correo_electronico: 'lucas@gmail.com' },
      { correo_electronico: 'sofia@gmail.com' },
      { correo_electronico: 'valentina@gmail.com' },
      { correo_electronico: 'santiago@gmail.com' },
      { correo_electronico: 'camila@gmail.com' },
      { correo_electronico: 'juan@gmail.com' },
      { correo_electronico: 'maria@gmail.com' },
      { correo_electronico: 'martin@gmail.com' },
      { correo_electronico: 'florencia@gmail.com' },
      { correo_electronico: 'diego@gmail.com' },
      { correo_electronico: 'paula@gmail.com' },
      { correo_electronico: 'bruno@gmail.com' },
      { correo_electronico: 'renata@gmail.com' },
      { correo_electronico: 'facundo@gmail.com' },
    ];

    const hashedPassword = await hash('123123123', 10);

    for (const userData of usuariosData) {
      const existing = await repository.findOne({
        where: { correo_electronico: userData.correo_electronico },
      });

      if (existing) {
        console.log(
          `ℹ️  El usuario "${userData.correo_electronico}" ya existe, omitiendo.`,
        );
        continue;
      }

      const user = repository.create({
        correo_electronico: userData.correo_electronico,
        contrasena: hashedPassword,
        rol: Rol.USER,
      });

      await repository.save(user);
      console.log(
        `✅ Usuario creado: ${userData.correo_electronico}`,
      );
    }

    console.log('✅ Seeds de usuarios completados');

    await dataSource.destroy();
  },
};
