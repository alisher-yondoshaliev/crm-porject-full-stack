import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateLessonVideoDto } from './dto/create-lesson-video.dto';
import { UpdateLessonVideoDto } from './dto/update-lesson-video.dto';

@Injectable()
export class LessonVideosService {
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

    private selectVideoFields() {
        return {
            id: true,
            lessonId: true,
            userId: true,
            teacherId: true,
            file: true,
            created_at: true,
            lesson: { select: { id: true, title: true } },
            user: { select: { id: true, fullName: true, role: true } },
            teacher: { select: { id: true, fullName: true, email: true } },
        };
    }

    async create(createLessonVideoDto: CreateLessonVideoDto) {
        await this.ensureRelationsExist(createLessonVideoDto);

        return this.prisma.lessonVideo.create({
            data: {
                lessonId: createLessonVideoDto.lessonId,
                file: createLessonVideoDto.file,
                userId: createLessonVideoDto.userId,
                teacherId: createLessonVideoDto.teacherId,
            },
            select: this.selectVideoFields(),
        });
    }

    findAll() {
        return this.prisma.lessonVideo.findMany({
            orderBy: { id: 'desc' },
            select: this.selectVideoFields(),
        });
    }

    async findOne(id: number) {
        const video = await this.prisma.lessonVideo.findUnique({
            where: { id },
            select: this.selectVideoFields(),
        });

        if (!video) {
            throw new NotFoundException('Lesson video not found');
        }

        return video;
    }

    async update(id: number, updateLessonVideoDto: UpdateLessonVideoDto) {
        const exists = await this.prisma.lessonVideo.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Lesson video not found');
        }

        await this.ensureRelationsExist(updateLessonVideoDto);

        return this.prisma.lessonVideo.update({
            where: { id },
            data: {
                lessonId: updateLessonVideoDto.lessonId,
                file: updateLessonVideoDto.file,
                userId: updateLessonVideoDto.userId,
                teacherId: updateLessonVideoDto.teacherId,
            },
            select: this.selectVideoFields(),
        });
    }

    async remove(id: number) {
        const exists = await this.prisma.lessonVideo.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Lesson video not found');
        }

        await this.prisma.lessonVideo.delete({ where: { id } });
        return { message: 'Lesson video deleted successfully' };
    }
}
