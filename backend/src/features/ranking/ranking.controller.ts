import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { RankingService } from './ranking.service';
import { RankingResponseDto } from './dto/ranking-user.dto';
import { MyRankingStatsDto } from './dto/my-ranking-stats.dto';

@ApiTags('Ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el ranking global de usuarios (público)' })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Ranking global',
    type: RankingResponseDto,
  })
  getGlobal(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.rankingService.getGlobalRanking(
      Math.min(Math.max(limit, 1), 100),
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener mis estadisticas en el ranking' })
  @ApiResponse({
    status: 200,
    description: 'Mis stats',
    type: MyRankingStatsDto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  getMine(@CurrentUser() user: JwtPayload) {
    return this.rankingService.getMyStats(user.sub);
  }
}
