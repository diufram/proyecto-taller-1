import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module'; // Importas tu nuevo módulo
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. Configuración global (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Infraestructura de Base de Datos
    DatabaseModule,

    // 3. Aquí irán tus Features (UsersModule, ProblemsModule, etc.)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
