import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class UpdateStudentDto {
    @ApiPropertyOptional({ example: 'Updated Student Name' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({ example: 'updated.student@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'newpassword123' })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @ApiPropertyOptional({ example: '2007-01-15T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @ApiPropertyOptional({ example: 'https://cdn.site/student.png' })
    @IsOptional()
    @IsString()
    photo?: string;

    @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.ACTIVE })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}
