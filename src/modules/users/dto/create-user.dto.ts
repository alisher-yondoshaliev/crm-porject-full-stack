import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Manager User',
    description: 'Foydalanuvchi toliq ismi',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'manager@example.com', description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'Parol' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Branch Manager', description: 'Lavozim' })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.MANAGEMENT,
    description: 'Role (faqat MANAGEMENT yoki ADMINSTRATOR)',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: 'Toshkent sh.', description: 'Manzil' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.site/photo.png',
    description: 'Rasm URL',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'Status',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    example: '2026-03-14T00:00:00.000Z',
    description: 'Ishga olingan sana',
  })
  @IsOptional()
  @IsDateString()
  hireDate?: string;
}
