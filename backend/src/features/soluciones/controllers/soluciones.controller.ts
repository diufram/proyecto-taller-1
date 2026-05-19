import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SolucionesService } from '../services/soluciones.service';
import { CreateSolucionDto } from '../dto/create-solucion.dto';
import { QuerySolucionesDto } from '../dto/query-soluciones.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@ApiTags('Soluciones')
@Controller('soluciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class SolucionesController {
  constructor(private readonly solucionesService: SolucionesService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar una solucion para un problema' })
  @ApiResponse({ status: 201, description: 'Solucion enviada correctamente' })
  @ApiResponse({ status: 400, description: 'No esta inscrito o ya envio solucion' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Problema no encontrado' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateSolucionDto,
  ) {
    return this.solucionesService.create(user, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Listar mis soluciones' })
  @ApiResponse({ status: 200, description: 'Listado paginado de mis soluciones' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAllByUser(
    @CurrentUser() user: JwtPayload,
    @Query() query: QuerySolucionesDto,
  ) {
    return this.solucionesService.findAllByUser(user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solucion por id' })
  @ApiResponse({ status: 200, description: 'Solucion encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Solucion no encontrada' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.solucionesService.findOne(id, user);
  }
}