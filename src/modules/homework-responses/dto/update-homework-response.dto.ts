import { ApiPropertyOptional } from '@nestjs/swagger';
import { HomeworkStatusStudent } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateHomeworkResponseDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    homeworkId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    studentId?: number;

    @ApiPropertyOptional({ example: 'Updated solution' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'https://cdn.site/student-solution.pdf' })
    @IsOptional()
    @IsString()
    file?: string;

    @ApiPropertyOptional({
        enum: HomeworkStatusStudent,
        example: HomeworkStatusStudent.COMPLETED,
    })
    @IsOptional()
    @IsEnum(HomeworkStatusStudent)
    status?: HomeworkStatusStudent;
}
