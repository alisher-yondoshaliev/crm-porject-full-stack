import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateHomeworkResponseDto } from './dto/create-homework-response.dto';
import { UpdateHomeworkResponseDto } from './dto/update-homework-response.dto';

@Injectable()
export class HomeworkResponsesService {
    constructor(private readonly prisma: PrismaService) { }

    private async ensureRelationsExist(payload: {
        homeworkId?: number;
        studentId?: number;
    }) {
        const checks: Promise<unknown>[] = [];

        if (payload.homeworkId) {
            checks.push(
                this.prisma.homework.findUnique({ where: { id: payload.homeworkId } }),
            );
        }
        if (payload.studentId) {
            checks.push(
                this.prisma.student.findUnique({ where: { id: payload.studentId } }),
            );
        }

        const result = await Promise.all(checks);

        let idx = 0;
        if (payload.homeworkId && !result[idx++]) {
            throw new NotFoundException('Homework not found');
        }
        if (payload.studentId && !result[idx++]) {
            throw new NotFoundException('Student not found');
        }
    }

    private selectHomeworkResponseFields() {
        return {
            id: true,
            homeworkId: true,
            studentId: true,
            title: true,
            file: true,
            status: true,
            created_at: true,
            updated_at: true,
            homework: { select: { id: true, title: true } },
            student: { select: { id: true, fullName: true, email: true } },
        };
    }

    async create(createHomeworkResponseDto: CreateHomeworkResponseDto) {
        await this.ensureRelationsExist(createHomeworkResponseDto);

        return this.prisma.homeworkResponse.create({
            data: {
                homeworkId: createHomeworkResponseDto.homeworkId,
                studentId: createHomeworkResponseDto.studentId,
                title: createHomeworkResponseDto.title,
                file: createHomeworkResponseDto.file,
                status: createHomeworkResponseDto.status,
            },
            select: this.selectHomeworkResponseFields(),
        });
    }

    findAll() {
        return this.prisma.homeworkResponse.findMany({
            orderBy: { id: 'desc' },
            select: this.selectHomeworkResponseFields(),
        });
    }

    async findOne(id: number) {
        const response = await this.prisma.homeworkResponse.findUnique({
            where: { id },
            select: this.selectHomeworkResponseFields(),
        });

        if (!response) {
            throw new NotFoundException('Homework response not found');
        }

        return response;
    }

    async update(id: number, updateHomeworkResponseDto: UpdateHomeworkResponseDto) {
        const exists = await this.prisma.homeworkResponse.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Homework response not found');
        }

        await this.ensureRelationsExist(updateHomeworkResponseDto);

        return this.prisma.homeworkResponse.update({
            where: { id },
            data: {
                homeworkId: updateHomeworkResponseDto.homeworkId,
                studentId: updateHomeworkResponseDto.studentId,
                title: updateHomeworkResponseDto.title,
                file: updateHomeworkResponseDto.file,
                status: updateHomeworkResponseDto.status,
            },
            select: this.selectHomeworkResponseFields(),
        });
    }

    async remove(id: number) {
        const exists = await this.prisma.homeworkResponse.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Homework response not found');
        }

        await this.prisma.homeworkResponse.delete({ where: { id } });
        return { message: 'Homework response deleted successfully' };
    }
}
