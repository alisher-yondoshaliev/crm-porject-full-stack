import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateHomeworkResultDto } from './dto/create-homework-result.dto';
import { UpdateHomeworkResultDto } from './dto/update-homework-result.dto';

@Injectable()
export class HomeworkResultsService {
    constructor(private readonly prisma: PrismaService) { }

    private async ensureRelationsExist(payload: {
        homeworkId?: number;
        studentId?: number;
        userId?: number;
        teacherId?: number;
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
        if (payload.userId) {
            checks.push(this.prisma.user.findUnique({ where: { id: payload.userId } }));
        }
        if (payload.teacherId) {
            checks.push(
                this.prisma.teacher.findUnique({ where: { id: payload.teacherId } }),
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
        if (payload.userId && !result[idx++]) {
            throw new NotFoundException('User not found');
        }
        if (payload.teacherId && !result[idx++]) {
            throw new NotFoundException('Teacher not found');
        }
    }

    private selectHomeworkResultFields() {
        return {
            id: true,
            homeworkId: true,
            studentId: true,
            userId: true,
            teacherId: true,
            title: true,
            file: true,
            score: true,
            status: true,
            created_at: true,
            updated_at: true,
            homework: { select: { id: true, title: true } },
            student: { select: { id: true, fullName: true, email: true } },
            user: { select: { id: true, fullName: true, role: true } },
            teacher: { select: { id: true, fullName: true, email: true } },
        };
    }

    async create(createHomeworkResultDto: CreateHomeworkResultDto) {
        await this.ensureRelationsExist(createHomeworkResultDto);

        return this.prisma.homeworkResult.create({
            data: {
                homeworkId: createHomeworkResultDto.homeworkId,
                studentId: createHomeworkResultDto.studentId,
                userId: createHomeworkResultDto.userId,
                teacherId: createHomeworkResultDto.teacherId,
                title: createHomeworkResultDto.title,
                file: createHomeworkResultDto.file,
                score: createHomeworkResultDto.score,
                status: createHomeworkResultDto.status,
            },
            select: this.selectHomeworkResultFields(),
        });
    }

    findAll() {
        return this.prisma.homeworkResult.findMany({
            orderBy: { id: 'desc' },
            select: this.selectHomeworkResultFields(),
        });
    }

    async findOne(id: number) {
        const result = await this.prisma.homeworkResult.findUnique({
            where: { id },
            select: this.selectHomeworkResultFields(),
        });

        if (!result) {
            throw new NotFoundException('Homework result not found');
        }

        return result;
    }

    async update(id: number, updateHomeworkResultDto: UpdateHomeworkResultDto) {
        const exists = await this.prisma.homeworkResult.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Homework result not found');
        }

        await this.ensureRelationsExist(updateHomeworkResultDto);

        return this.prisma.homeworkResult.update({
            where: { id },
            data: {
                homeworkId: updateHomeworkResultDto.homeworkId,
                studentId: updateHomeworkResultDto.studentId,
                userId: updateHomeworkResultDto.userId,
                teacherId: updateHomeworkResultDto.teacherId,
                title: updateHomeworkResultDto.title,
                file: updateHomeworkResultDto.file,
                score: updateHomeworkResultDto.score,
                status: updateHomeworkResultDto.status,
            },
            select: this.selectHomeworkResultFields(),
        });
    }

    async remove(id: number) {
        const exists = await this.prisma.homeworkResult.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Homework result not found');
        }

        await this.prisma.homeworkResult.delete({ where: { id } });
        return { message: 'Homework result deleted successfully' };
    }
}
