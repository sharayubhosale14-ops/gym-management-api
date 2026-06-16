import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGymDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;
}