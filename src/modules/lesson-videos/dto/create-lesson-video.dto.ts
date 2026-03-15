import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateLessonVideoDto {
    @ApiProperty({ example: 1, description: 'Lesson ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    lessonId: number;

    @ApiProperty({
        example: 'https://cdn.site/lesson-1.mp4',
        description: 'Video file URL',
    })
    @IsNotEmpty()
    @IsString()
    file: string;

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
