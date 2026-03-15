import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class CreateRatingDto {
    @ApiProperty({ example: 1, description: 'Teacher ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    teacherId: number;

    @ApiProperty({ example: 1, description: 'Lesson ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    lessonId: number;

    @ApiProperty({ example: 95, description: 'Rating score (0-100)' })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @Max(100)
    score: number;
}
