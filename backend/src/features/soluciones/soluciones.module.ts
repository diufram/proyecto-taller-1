import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Solucion } from '../../database/entities/solucion.entity';
import { Problema } from '../../database/entities/problema.entity';
import { Inscripcion } from '../../database/entities/inscripcion.entity';
import { SolucionesController } from './controllers/soluciones.controller';
import { SolucionesService } from './services/soluciones.service';
import { SolucionesRepository } from './repositories/soluciones.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Solucion, Problema, Inscripcion])],
  controllers: [SolucionesController],
  providers: [SolucionesService, SolucionesRepository, JwtAuthGuard],
})
export class SolucionesModule {}