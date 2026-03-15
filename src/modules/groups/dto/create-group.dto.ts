import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status, WeekDays } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateGroupDto {
    @ApiProperty({ example: 1, description: 'Teacher ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    teacherId: number;

    @ApiProperty({ example: 1, description: 'User ID (group owner/staff)' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    userId: number;

    @ApiProperty({ example: 1, description: 'Room ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    roomId: number;

    @ApiProperty({ example: 1, description: 'Course ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    courseId: number;

    @ApiProperty({ example: 'Frontend N10', description: 'Group name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: '2026-03-20T00:00:00.000Z',
        description: 'Group start date',
    })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: '14:00', description: 'Start time (HH:mm)' })
    @IsNotEmpty()
    @IsString()
    startTime: string;

    @ApiProperty({
        enum: WeekDays,
        isArray: true,
        example: [WeekDays.MONDAY, WeekDays.WEDNESDAY, WeekDays.FRIDAY],
        description: 'Lesson week days',
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(WeekDays, { each: true })
    weekDays: WeekDays[];

    @ApiPropertyOptional({
        enum: Status,
        example: Status.ACTIVE,
        description: 'Group status',
    })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
