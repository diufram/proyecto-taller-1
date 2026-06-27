import { ApiProperty } from '@nestjs/swagger';

export class RankingUserDto {
  @ApiProperty({ example: 1 })
  position!: number;

  @ApiProperty({ example: 'Matias' })
  name!: string;

  @ApiProperty({ example: 250 })
  points!: number;

  @ApiProperty({ example: 12 })
  solvedProblems!: number;

  @ApiProperty({ example: 3 })
  competitions!: number;

  @ApiProperty({ example: 'up', enum: ['up', 'down', 'stable'] })
  trend!: 'up' | 'down' | 'stable';

  @ApiProperty({ example: 42 })
  userId!: number;
}

export class RankingResponseDto {
  @ApiProperty({ type: [RankingUserDto] })
  ranking!: RankingUserDto[];

  @ApiProperty({ example: 8 })
  totalUsers!: number;
}
