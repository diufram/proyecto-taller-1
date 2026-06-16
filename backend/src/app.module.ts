import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { CompetenciasModule } from './features/competencias/competencias.module';
import { ProfileModule } from './features/profile/profile.module';
import { GruposModule } from './features/grupos/grupos.module';
import { ProblemasModule } from './features/problemas/problemas.module';
import { SolucionesModule } from './features/soluciones/soluciones.module';
import { RankingModule } from './features/ranking/ranking.module';
import { DashboardModule } from './features/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    CompetenciasModule,
    ProfileModule,
    GruposModule,
    ProblemasModule,
    SolucionesModule,
    RankingModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
