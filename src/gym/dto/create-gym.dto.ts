import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGymDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsOptional()
  @IsMongoId()
  ownerId?: string;
}
