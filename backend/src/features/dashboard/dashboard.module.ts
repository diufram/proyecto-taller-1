import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competencia } from '../../database/entities/competencia.entity';
import { Problema } from '../../database/entities/problema.entity';
import { Solucion } from '../../database/entities/solucion.entity';
import { Usuario } from '../../database/entities/usuario.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competencia, Problema, Solucion, Usuario]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
