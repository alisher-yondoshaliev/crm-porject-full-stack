import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HomeworkStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateHomeworkResultDto {
    @ApiProperty({ example: 1, description: 'Homework ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    homeworkId: number;

    @ApiProperty({ example: 1, description: 'Student ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    studentId: number;

    @ApiProperty({ example: 'Result for HW #1' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ example: 'https://cdn.site/result.pdf' })
    @IsOptional()
    @IsString()
    file?: string;

    @ApiProperty({ example: 90, description: 'Ball (0-100)' })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(100)
    score: number;

    @ApiProperty({ enum: HomeworkStatus, example: HomeworkStatus.APPROVED })
    @IsEnum(HomeworkStatus)
    status: HomeworkStatus;

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
