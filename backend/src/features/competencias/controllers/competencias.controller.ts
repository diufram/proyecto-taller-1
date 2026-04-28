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
import { CompetenciasService } from '../competencias.service';
import { CreateCompetenciaDto } from '../dto/create-competencia.dto';
import { QueryCompetenciasDto } from '../dto/query-competencias.dto';
import { UpdateCompetenciaDto } from '../dto/update-competencia.dto';

@ApiTags('Competencias')
@Controller('competencias')
export class CompetenciasController {
  constructor(private readonly competenciasService: CompetenciasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Crear competencia' })
  @ApiResponse({ status: 201, description: 'Competencia creada correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 422, description: 'Error de validacion de datos' })
  create(@Body() dto: CreateCompetenciaDto) {
    return this.competenciasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar competencias' })
  @ApiResponse({ status: 200, description: 'Listado paginado de competencias' })
  findAll(@Query() query: QueryCompetenciasDto) {
    return this.competenciasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener competencia por id' })
  @ApiResponse({ status: 200, description: 'Competencia encontrada' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.competenciasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Actualizar competencia' })
  @ApiResponse({ status: 200, description: 'Competencia actualizada correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  @ApiResponse({ status: 422, description: 'Error de validacion de datos' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCompetenciaDto) {
    return this.competenciasService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Eliminar competencia' })
  @ApiResponse({ status: 200, description: 'Competencia eliminada correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Permisos insuficientes' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.competenciasService.remove(id);
  }
}
