import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Persona } from '../entities/persona.entity';
import { Usuario } from '../entities/usuario.entity';
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

export const personasSeed: Seed = {
  order: 2.5,
  name: 'Personas',
  run: async () => {
    await dataSource.initialize();
    console.log('🔌 Conectado a la base de datos para seed');

    const personaRepository = dataSource.getRepository(Persona);
    const usuarioRepository = dataSource.getRepository(Usuario);

    const personasData = [
      {
        correo: 'm@gmail.com',
        nombre: 'Matias',
        apellido: 'Ramos',
        celular: '+5491112345678',
      },
      {
        correo: 'lucas@gmail.com',
        nombre: 'Lucas',
        apellido: 'Garcia',
        celular: '+5491123456789',
      },
      {
        correo: 'sofia@gmail.com',
        nombre: 'Sofia',
        apellido: 'Martinez',
        celular: '+5491134567890',
      },
      {
        correo: 'valentina@gmail.com',
        nombre: 'Valentina',
        apellido: 'Lopez',
        celular: '+5491145678901',
      },
      {
        correo: 'santiago@gmail.com',
        nombre: 'Santiago',
        apellido: 'Rodriguez',
        celular: '+5491156789012',
      },
      {
        correo: 'camila@gmail.com',
        nombre: 'Camila',
        apellido: 'Fernandez',
        celular: '+5491167890123',
      },
      {
        correo: 'juan@gmail.com',
        nombre: 'Juan',
        apellido: 'Pereyra',
        celular: '+5491178901234',
      },
      {
        correo: 'maria@gmail.com',
        nombre: 'Maria',
        apellido: 'Torres',
        celular: '+5491189012345',
      },
      {
        correo: 'martin@gmail.com',
        nombre: 'Martin',
        apellido: 'Acosta',
        celular: '+5491190123456',
      },
      {
        correo: 'florencia@gmail.com',
        nombre: 'Florencia',
        apellido: 'Vega',
        celular: '+5491101234567',
      },
      {
        correo: 'diego@gmail.com',
        nombre: 'Diego',
        apellido: 'Suarez',
        celular: '+5491110234567',
      },
      {
        correo: 'paula@gmail.com',
        nombre: 'Paula',
        apellido: 'Romero',
        celular: '+5491112034567',
      },
      {
        correo: 'bruno@gmail.com',
        nombre: 'Bruno',
        apellido: 'Aguilar',
        celular: '+5491113024567',
      },
      {
        correo: 'renata@gmail.com',
        nombre: 'Renata',
        apellido: 'Castro',
        celular: '+5491114012567',
      },
      {
        correo: 'facundo@gmail.com',
        nombre: 'Facundo',
        apellido: 'Mendez',
        celular: '+5491115001234',
      },
    ];

    for (const data of personasData) {
      const usuario = await usuarioRepository.findOne({
        where: { correo_electronico: data.correo },
      });

      if (!usuario) {
        console.log(
          `⚠️  Usuario "${data.correo}" no encontrado, omitiendo persona.`,
        );
        continue;
      }

      const existing = await personaRepository.findOne({
        where: { usuario: { id: usuario.id } },
      });

      if (existing) {
        console.log(`ℹ️  Persona para "${data.correo}" ya existe, omitiendo.`);
        continue;
      }

      const persona = personaRepository.create({
        nombre: data.nombre,
        apellido: data.apellido,
        celular: data.celular,
        usuario: { id: usuario.id },
      });

      await personaRepository.save(persona);
      console.log(
        `✅ Persona creada: ${data.nombre} ${data.apellido} (${data.correo})`,
      );
    }

    console.log('✅ Seeds de personas completados');

    await dataSource.destroy();
  },
};
