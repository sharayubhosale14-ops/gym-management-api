import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGymDto {
  @ApiProperty({
    example: 'Gold Gym',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Pune',
  })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiPropertyOptional({
    example: '6a3e7c07e2587f6d54864eea',
  })
  @IsOptional()
  @IsMongoId()
  ownerId?: string;
}
