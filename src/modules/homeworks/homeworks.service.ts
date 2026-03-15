import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworksService {
    constructor(private readonly prisma: PrismaService) { }

    private async ensureRelationsExist(payload: {
        lessonId?: number;
        userId?: number;
        teacherId?: number;
    }) {
        const checks: Promise<unknown>[] = [];

        if (payload.lessonId) {
            checks.push(this.prisma.lesson.findUnique({ where: { id: payload.lessonId } }));
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
        if (payload.lessonId && !result[idx++]) {
            throw new NotFoundException('Lesson not found');
        }
        if (payload.userId && !result[idx++]) {
            throw new NotFoundException('User not found');
        }
        if (payload.teacherId && !result[idx++]) {
            throw new NotFoundException('Teacher not found');
        }
    }

    private selectHomeworkFields() {
        return {
            id: true,
            lessonId: true,
            userId: true,
            teacherId: true,
            title: true,
            file: true,
            durationTime: true,
            created_at: true,
            updated_at: true,
            lesson: { select: { id: true, title: true } },
            user: { select: { id: true, fullName: true, role: true } },
            teacher: { select: { id: true, fullName: true, email: true } },
        };
    }

    async create(createHomeworkDto: CreateHomeworkDto) {
        await this.ensureRelationsExist(createHomeworkDto);

        return this.prisma.homework.create({
            data: {
                lessonId: createHomeworkDto.lessonId,
                userId: createHomeworkDto.userId,
                teacherId: createHomeworkDto.teacherId,
                title: createHomeworkDto.title,
                file: createHomeworkDto.file,
                durationTime: createHomeworkDto.durationTime,
            },
            select: this.selectHomeworkFields(),
        });
    }

    findAll() {
        return this.prisma.homework.findMany({
            orderBy: { id: 'desc' },
            select: this.selectHomeworkFields(),
        });
    }

    async findOne(id: number) {
        const homework = await this.prisma.homework.findUnique({
            where: { id },
            select: this.selectHomeworkFields(),
        });

        if (!homework) {
            throw new NotFoundException('Homework not found');
        }

        return homework;
    }

    async update(id: number, updateHomeworkDto: UpdateHomeworkDto) {
        const exists = await this.prisma.homework.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Homework not found');
        }

        await this.ensureRelationsExist(updateHomeworkDto);

        return this.prisma.homework.update({
            where: { id },
            data: {
                lessonId: updateHomeworkDto.lessonId,
                userId: updateHomeworkDto.userId,
                teacherId: updateHomeworkDto.teacherId,
                title: updateHomeworkDto.title,
                file: updateHomeworkDto.file,
                durationTime: updateHomeworkDto.durationTime,
            },
            select: this.selectHomeworkFields(),
        });
    }

    async remove(id: number) {
        const exists = await this.prisma.homework.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Homework not found');
        }

        await this.prisma.homework.delete({ where: { id } });
        return { message: 'Homework deleted successfully' };
    }
}
