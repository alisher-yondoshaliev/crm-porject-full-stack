import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel, Status } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateCourseDto {
    @ApiProperty({ example: 'Node.js Backend', description: 'Course name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 6, description: 'Davomiylik (oy)' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    durationMonth: number;

    @ApiProperty({ example: 72, description: 'Darslar soni' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    durationLesson: number;

    @ApiProperty({ example: 1200000, description: 'Narx' })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({
        example: 'Backend bo`yicha amaliy kurs',
        description: 'Qo`shimcha tavsif',
    })
    @IsOptional()
    @IsString()
    description?: string;
}
