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
      { nombre_usuario: 'matias_ramos', correo_electronico: 'm@gmail.com' },
      { nombre_usuario: 'lucas_garcia', correo_electronico: 'lucas@gmail.com' },
      {
        nombre_usuario: 'sofia_martinez',
        correo_electronico: 'sofia@gmail.com',
      },
      {
        nombre_usuario: 'valentina_lopez',
        correo_electronico: 'valentina@gmail.com',
      },
      {
        nombre_usuario: 'santiago_rodriguez',
        correo_electronico: 'santiago@gmail.com',
      },
      {
        nombre_usuario: 'camila_fernandez',
        correo_electronico: 'camila@gmail.com',
      },
      { nombre_usuario: 'juan_pereyra', correo_electronico: 'juan@gmail.com' },
      { nombre_usuario: 'maria_torres', correo_electronico: 'maria@gmail.com' },
      {
        nombre_usuario: 'martin_acosta',
        correo_electronico: 'martin@gmail.com',
      },
      {
        nombre_usuario: 'florencia_vega',
        correo_electronico: 'florencia@gmail.com',
      },
      { nombre_usuario: 'diego_suarez', correo_electronico: 'diego@gmail.com' },
      { nombre_usuario: 'paula_romero', correo_electronico: 'paula@gmail.com' },
      {
        nombre_usuario: 'bruno_aguilar',
        correo_electronico: 'bruno@gmail.com',
      },
      {
        nombre_usuario: 'renata_castro',
        correo_electronico: 'renata@gmail.com',
      },
      {
        nombre_usuario: 'facundo_mendez',
        correo_electronico: 'facundo@gmail.com',
      },
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
        nombre_usuario: userData.nombre_usuario,
        correo_electronico: userData.correo_electronico,
        contrasena: hashedPassword,
        rol: Rol.USER,
        esta_verificado: true,
      });

      await repository.save(user);
      console.log(
        `✅ Usuario creado: ${userData.nombre_usuario} (${userData.correo_electronico})`,
      );
    }

    console.log('✅ Seeds de usuarios completados');

    await dataSource.destroy();
  },
};
