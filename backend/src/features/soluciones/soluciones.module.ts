import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Solucion } from '../../database/entities/solucion.entity';
import { Problema } from '../../database/entities/problema.entity';
import { Inscripcion } from '../../database/entities/inscripcion.entity';
import { Usuario } from '../../database/entities/usuario.entity';
import { SolucionesController } from './controllers/soluciones.controller';
import { SolucionesService } from './services/soluciones.service';
import { SolucionesRepository } from './repositories/soluciones.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Solucion, Problema, Inscripcion, Usuario]),
  ],
  controllers: [SolucionesController],
  providers: [
    SolucionesService,
    SolucionesRepository,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class SolucionesModule {}
