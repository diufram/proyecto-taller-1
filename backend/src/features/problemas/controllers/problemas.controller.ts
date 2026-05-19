import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Rol } from '../../../database/entities/usuario.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ProblemasService } from '../services/problemas.service';
import { CreateProblemaDto } from '../dto/create-problema.dto';
import { QueryProblemasDto } from '../dto/query-problemas.dto';
import { UpdateProblemaDto } from '../dto/update-problema.dto';

@ApiTags('Problemas')
@Controller()
export class ProblemasController {
  constructor(private readonly problemasService: ProblemasService) {}

  @Post('competencias/:competenciaId/problemas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Crear problema para una competencia' })
  @ApiResponse({ status: 201, description: 'Problema creado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  @ApiResponse({ status: 422, description: 'Error de validacion o competencia no editable' })
  create(
    @Param('competenciaId', ParseIntPipe) competenciaId: number,
    @Body() dto: CreateProblemaDto,
  ) {
    return this.problemasService.create(dto, competenciaId);
  }

  @Get('competencias/:competenciaId/problemas')
  @ApiOperation({ summary: 'Listar problemas de una competencia' })
  @ApiResponse({ status: 200, description: 'Listado paginado de problemas' })
  findAllPorCompetencia(
    @Param('competenciaId', ParseIntPipe) competenciaId: number,
    @Query() query: QueryProblemasDto,
  ) {
    return this.problemasService.findAllPorCompetencia(competenciaId, query);
  }

  @Get('problemas/:id')
  @ApiOperation({ summary: 'Obtener problema por id' })
  @ApiResponse({ status: 200, description: 'Problema encontrado' })
  @ApiResponse({ status: 404, description: 'Problema no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.problemasService.findOne(id);
  }

  @Patch('problemas/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Actualizar problema' })
  @ApiResponse({ status: 200, description: 'Problema actualizado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Problema no encontrado' })
  @ApiResponse({ status: 422, description: 'Error de validacion o competencia no editable' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProblemaDto) {
    return this.problemasService.update(id, dto);
  }

  @Delete('problemas/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Eliminar problema' })
  @ApiResponse({ status: 200, description: 'Problema eliminado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Problema no encontrado' })
  @ApiResponse({ status: 422, description: 'Competencia no editable' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.problemasService.remove(id);
  }
}