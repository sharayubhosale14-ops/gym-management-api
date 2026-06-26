import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMembershipDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  planName!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsIn(['active', 'expired', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
