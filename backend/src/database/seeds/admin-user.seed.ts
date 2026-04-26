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
});

export const adminUserSeed: Seed = {
    order: 1,
    name: 'Admin User',
    run: async () => {
        await dataSource.initialize();
        console.log('🔌 Conectado a la base de datos para seed');

        const repository = dataSource.getRepository(Usuario);

        const existing = await repository.findOne({
            where: { correo_electronico: 'admin@gmail.com' },
        });

        if (existing) {
            console.log('ℹ️  El usuario admin@gmail.com ya existe, omitiendo.');
            return;
        }

        const hashedPassword = await hash('123123123', 10);

        const admin = repository.create({
            nombre_usuario: 'admin',
            correo_electronico: 'admin@gmail.com',
            contrasena: hashedPassword,
            rol: Rol.ADMIN,
        });

        await repository.save(admin);

        console.log('✅ Usuario admin creado:');
        console.log('   Correo: admin@gmail.com');
        console.log('   Contraseña: 123123123');
        console.log('   Rol: ADMIN');

        await dataSource.destroy();
    },
};