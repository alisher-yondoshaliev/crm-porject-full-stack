import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HomeworkStatusStudent } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateHomeworkResponseDto {
    @ApiProperty({ example: 1, description: 'Homework ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    homeworkId: number;

    @ApiProperty({ example: 1, description: 'Student ID' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    studentId: number;

    @ApiProperty({ example: 'My solution', description: 'Javob nomi' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ example: 'https://cdn.site/student-solution.pdf' })
    @IsOptional()
    @IsString()
    file?: string;

    @ApiProperty({
        enum: HomeworkStatusStudent,
        example: HomeworkStatusStudent.COMPLETED,
    })
    @IsEnum(HomeworkStatusStudent)
    status: HomeworkStatusStudent;
}
