import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGymDto {
  @IsNumber()
  id!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;
}