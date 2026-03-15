import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateLessonDto {
    @ApiProperty({ example: 1, description: 'Group ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    groupId: number;

    @ApiProperty({ example: 'Lesson 1: Intro', description: 'Dars sarlavhasi' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiPropertyOptional({ example: 1, description: 'User ID (optional)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    userId?: number;

    @ApiPropertyOptional({ example: 1, description: 'Teacher ID (optional)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    teacherId?: number;
}
