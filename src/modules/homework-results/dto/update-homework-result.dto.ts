import { ApiPropertyOptional } from '@nestjs/swagger';
import { HomeworkStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateHomeworkResultDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    homeworkId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    studentId?: number;

    @ApiPropertyOptional({ example: 'Updated result title' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'https://cdn.site/result.pdf' })
    @IsOptional()
    @IsString()
    file?: string;

    @ApiPropertyOptional({ example: 95 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(100)
    score?: number;

    @ApiPropertyOptional({ enum: HomeworkStatus, example: HomeworkStatus.APPROVED })
    @IsOptional()
    @IsEnum(HomeworkStatus)
    status?: HomeworkStatus;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    userId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    teacherId?: number;
}
