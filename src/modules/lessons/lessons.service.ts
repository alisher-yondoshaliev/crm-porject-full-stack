import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
    constructor(private readonly prisma: PrismaService) { }

    private async ensureRelationsExist(payload: {
        groupId?: number;
        userId?: number;
        teacherId?: number;
    }) {
        const checks: Promise<unknown>[] = [];

        if (payload.groupId) {
            checks.push(this.prisma.group.findUnique({ where: { id: payload.groupId } }));
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
        if (payload.groupId && !result[idx++]) {
            throw new NotFoundException('Group not found');
        }
        if (payload.userId && !result[idx++]) {
            throw new NotFoundException('User not found');
        }
        if (payload.teacherId && !result[idx++]) {
            throw new NotFoundException('Teacher not found');
        }
    }

    private selectLessonFields() {
        return {
            id: true,
            groupId: true,
            title: true,
            userId: true,
            teacherId: true,
            created_at: true,
            updated_at: true,
            group: { select: { id: true, name: true } },
            user: { select: { id: true, fullName: true, role: true } },
            teacher: { select: { id: true, fullName: true, email: true } },
        };
    }

    async create(createLessonDto: CreateLessonDto) {
        await this.ensureRelationsExist(createLessonDto);

        return this.prisma.lesson.create({
            data: {
                groupId: createLessonDto.groupId,
                title: createLessonDto.title,
                userId: createLessonDto.userId,
                teacherId: createLessonDto.teacherId,
            },
            select: this.selectLessonFields(),
        });
    }

    findAll() {
        return this.prisma.lesson.findMany({
            orderBy: { id: 'desc' },
            select: this.selectLessonFields(),
        });
    }

    async findOne(id: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            select: this.selectLessonFields(),
        });

        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        return lesson;
    }

    async update(id: number, updateLessonDto: UpdateLessonDto) {
        const exists = await this.prisma.lesson.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Lesson not found');
        }

        await this.ensureRelationsExist(updateLessonDto);

        return this.prisma.lesson.update({
            where: { id },
            data: {
                groupId: updateLessonDto.groupId,
                title: updateLessonDto.title,
                userId: updateLessonDto.userId,
                teacherId: updateLessonDto.teacherId,
            },
            select: this.selectLessonFields(),
        });
    }

    async remove(id: number) {
        const exists = await this.prisma.lesson.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Lesson not found');
        }

        await this.prisma.lesson.delete({ where: { id } });
        return { message: 'Lesson deleted successfully' };
    }
}
