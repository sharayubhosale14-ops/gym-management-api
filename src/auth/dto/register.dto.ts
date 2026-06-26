import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Sharayu Bhosale',
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'sharayu@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
  })
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'user',
    required: false,
  })
  @IsOptional()
  role?: string;
}
