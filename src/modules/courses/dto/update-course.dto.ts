import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel, Status } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class UpdateCourseDto {
    @ApiPropertyOptional({ example: 'Updated Course Name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 6 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    durationMonth?: number;

    @ApiPropertyOptional({ example: 72 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    durationLesson?: number;

    @ApiPropertyOptional({ example: 1200000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiPropertyOptional({ enum: CourseLevel, example: CourseLevel.INTERMEDIATE })
    @IsOptional()
    @IsEnum(CourseLevel)
    level?: CourseLevel;

    @ApiPropertyOptional({ enum: Status, example: Status.ACTIVE })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @ApiPropertyOptional({ example: 'Updated description' })
    @IsOptional()
    @IsString()
    description?: string;
}
