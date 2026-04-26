import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module'; // Importas tu nuevo módulo
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { CompetenciasModule } from './features/competencias/competencias.module';

@Module({
  imports: [
    // 1. Configuración global (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Infraestructura de Base de Datos
    DatabaseModule,

    // 3. Features
    AuthModule,
    CompetenciasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
