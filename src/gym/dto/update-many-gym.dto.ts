import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateManyGymDto {
  @ApiProperty({
    example: 'Pune',
  })
  @IsString()
  @IsNotEmpty()
  oldLocation!: string;

  @ApiProperty({
    example: 'Navi Mumbai',
  })
  @IsString()
  @IsNotEmpty()
  newLocation!: string;
}
