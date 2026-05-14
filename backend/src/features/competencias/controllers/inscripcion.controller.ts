import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { CreateInscripcionDto } from '../dto/create-inscripcion.dto';
import { InscripcionesService } from '../inscripciones.service';

@ApiTags('Inscripciones')
@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Inscribirse a una competencia' })
  @ApiResponse({ status: 201, description: 'Inscripción creada correctamente' })
  @ApiResponse({ status: 400, description: 'Inscripción inválida' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateInscripcionDto) {
    return this.inscripcionesService.create(user, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Listar mis inscripciones' })
  @ApiResponse({ status: 200, description: 'Listado de inscripciones del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  my(@CurrentUser() user: JwtPayload) {
    return this.inscripcionesService.my(user);
  }
}
