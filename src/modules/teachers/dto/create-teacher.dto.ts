import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Teacher Name', description: 'Teacher toliq ismi' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'teacher@example.com', description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'Parol' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Senior Teacher', description: 'Lavozim' })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty({ example: 3, description: 'Tajriba (yil)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  experience: number;

  @ApiPropertyOptional({
    example: 'https://cdn.site/teacher.png',
    description: 'Rasm URL',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.ACTIVE })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
