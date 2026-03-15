import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateStudentDto {
    @ApiProperty({ example: 'Student Name', description: 'Student toliq ismi' })
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @ApiProperty({ example: 'student@example.com', description: 'Email' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '12345678', description: 'Parol' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: '2007-01-15T00:00:00.000Z',
        description: 'Tugilgan sana',
    })
    @IsDateString()
    birthDate: string;

    @ApiPropertyOptional({ example: 'https://cdn.site/student.png', description: 'Rasm URL' })
    @IsOptional()
    @IsString()
    photo?: string;

    @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.ACTIVE })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}
