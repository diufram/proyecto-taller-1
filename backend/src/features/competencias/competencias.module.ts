import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competencia } from '../../database/entities/competencia.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CompetenciasController } from './competencias.controller';
import { CompetenciasRepository } from './competencias.repository';
import { CompetenciasService } from './competencias.service';

@Module({
  imports: [TypeOrmModule.forFeature([Competencia])],
  controllers: [CompetenciasController],
  providers: [CompetenciasService, CompetenciasRepository, JwtAuthGuard, RolesGuard],
})
export class CompetenciasModule {}
