import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competencia } from '../../database/entities/competencia.entity';
import { Inscripcion } from '../../database/entities/inscripcion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CompetenciasController } from './controllers/competencias.controller';
import { InscripcionesController } from './controllers/inscripcion.controller';
import { CompetenciasRepository } from './competencias.repository';
import { CompetenciasService } from './competencias.service';
import { InscripcionesService } from './inscripciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Competencia, Inscripcion])],
  controllers: [CompetenciasController, InscripcionesController],
  providers: [
    CompetenciasService,
    CompetenciasRepository,
    InscripcionesService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class CompetenciasModule {}
