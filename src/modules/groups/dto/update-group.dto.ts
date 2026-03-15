import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status, WeekDays } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsDateString,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class UpdateGroupDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    teacherId?: number;

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
    roomId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    courseId?: number;

    @ApiPropertyOptional({ example: 'Frontend N10' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '2026-03-20T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ example: '14:00' })
    @IsOptional()
    @IsString()
    startTime?: string;

    @ApiPropertyOptional({ enum: WeekDays, isArray: true })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(WeekDays, { each: true })
    weekDays?: WeekDays[];

    @ApiPropertyOptional({ enum: Status, example: Status.ACTIVE })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
