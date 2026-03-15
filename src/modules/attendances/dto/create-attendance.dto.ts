import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsOptional,
    Min,
} from 'class-validator';

export class CreateAttendanceDto {
    @ApiProperty({ example: 1, description: 'Lesson ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    lessonId: number;

    @ApiProperty({ example: 1, description: 'Student ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    studentId: number;

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

    @ApiProperty({ example: true, description: 'Darsga kelgan/kelmagan' })
    @IsBoolean()
    isPresent: boolean;
}
