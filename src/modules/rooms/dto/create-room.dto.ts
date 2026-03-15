import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateRoomDto {
    @ApiProperty({ example: 'Room A-101', description: 'Xona nomi' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 24, description: 'Xona sig`imi' })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    capacity: number;

    @ApiPropertyOptional({ enum: Status, example: Status.ACTIVE })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
