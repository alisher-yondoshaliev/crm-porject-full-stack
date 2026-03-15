import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateHomeworkDto {
    @ApiProperty({ example: 1, description: 'Lesson ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    lessonId: number;

    @ApiProperty({ example: 'Homework #1', description: 'Vazifa nomi' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ example: 'https://cdn.site/hw-1.pdf' })
    @IsOptional()
    @IsString()
    file?: string;

    @ApiPropertyOptional({ example: 24, description: 'Soatlarda deadline' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    durationTime?: number;

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
