import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateGymDto {
  @ApiPropertyOptional({
    example: 'Fitness Hub',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Mumbai',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: '6a3e7c07e2587f6d54864eea',
  })
  @IsOptional()
  @IsMongoId()
  ownerId?: string;
}
