import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class CreateStudentGroupDto {
    @ApiProperty({ example: 1, description: 'User ID (responsible staff)' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    userId: number;

    @ApiProperty({ example: 1, description: 'Group ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    groupId: number;

    @ApiProperty({ example: 1, description: 'Student ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    studentId: number;

    @ApiPropertyOptional({ enum: Status, example: Status.ACTIVE })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
