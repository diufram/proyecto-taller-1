import { Body, Controller, Delete, Get, Param, Post, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { JoinGrupoDto } from './dto/join-grupo.dto';

@ApiTags('Grupos')
@Controller('grupos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo grupo e inscribirse' })
  @ApiResponse({ status: 201, description: 'Grupo creado e inscrito correctamente' })
  @ApiResponse({ status: 400, description: 'Competencia no abierta o ya inscrito' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe un grupo con ese nombre' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateGrupoDto) {
    return this.gruposService.create(user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar grupos disponibles en una competencia' })
  @ApiResponse({ status: 200, description: 'Lista de grupos' })
  @ApiResponse({ status: 404, description: 'Competencia no encontrada' })
  findByCompetencia(@Body('competencia_id', ParseIntPipe) competenciaId: number) {
    return this.gruposService.findByCompetencia(competenciaId);
  }

  @Post('unirse')
  @ApiOperation({ summary: 'Unirse a un grupo existente' })
  @ApiResponse({ status: 201, description: 'Te has unido al grupo correctamente' })
  @ApiResponse({ status: 400, description: 'Grupo lleno o ya inscrito' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  join(@CurrentUser() user: JwtPayload, @Body() dto: JoinGrupoDto) {
    return this.gruposService.join(user, dto);
  }

  @Delete(':id/salir')
  @ApiOperation({ summary: 'Salir de un grupo' })
  @ApiResponse({ status: 200, description: 'Has salido del grupo' })
  @ApiResponse({ status: 400, description: 'No estás inscrito en este grupo' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  leave(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) grupoId: number) {
    return this.gruposService.leave(user, grupoId);
  }
}