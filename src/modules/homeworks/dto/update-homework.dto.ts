import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateHomeworkDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    lessonId?: number;

    @ApiPropertyOptional({ example: 'Homework #1 updated' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'https://cdn.site/hw-1.pdf' })
    @IsOptional()
    @IsString()
    file?: string;

    @ApiPropertyOptional({ example: 24 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    durationTime?: number;

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
