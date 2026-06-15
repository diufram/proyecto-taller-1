import { ApiProperty } from '@nestjs/swagger';

export class MyRankingStatsDto {
  @ApiProperty({ example: 5 })
  position!: number;

  @ApiProperty({ example: 250 })
  points!: number;

  @ApiProperty({ example: 12 })
  solvedProblems!: number;

  @ApiProperty({ example: 3 })
  competitions!: number;

  @ApiProperty({ example: 50 })
  totalUsers!: number;
}
