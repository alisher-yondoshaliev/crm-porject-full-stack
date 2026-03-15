import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
    constructor(private readonly prisma: PrismaService) { }

    private async ensureRelationsExist(payload: {
        teacherId?: number;
        lessonId?: number;
    }) {
        const checks: Promise<unknown>[] = [];

        if (payload.teacherId) {
            checks.push(
                this.prisma.teacher.findUnique({ where: { id: payload.teacherId } }),
            );
        }
        if (payload.lessonId) {
            checks.push(this.prisma.lesson.findUnique({ where: { id: payload.lessonId } }));
        }

        const result = await Promise.all(checks);

        let idx = 0;
        if (payload.teacherId && !result[idx++]) {
            throw new NotFoundException('Teacher not found');
        }
        if (payload.lessonId && !result[idx++]) {
            throw new NotFoundException('Lesson not found');
        }
    }

    private selectRatingFields() {
        return {
            id: true,
            teacherId: true,
            lessonId: true,
            score: true,
            created_at: true,
            teacher: { select: { id: true, fullName: true, email: true } },
            lesson: { select: { id: true, title: true } },
        };
    }

    async create(createRatingDto: CreateRatingDto) {
        await this.ensureRelationsExist(createRatingDto);

        return this.prisma.rating.create({
            data: {
                teacherId: createRatingDto.teacherId,
                lessonId: createRatingDto.lessonId,
                score: createRatingDto.score,
            },
            select: this.selectRatingFields(),
        });
    }

    findAll() {
        return this.prisma.rating.findMany({
            orderBy: { id: 'desc' },
            select: this.selectRatingFields(),
        });
    }

    async findOne(id: number) {
        const rating = await this.prisma.rating.findUnique({
            where: { id },
            select: this.selectRatingFields(),
        });

        if (!rating) {
            throw new NotFoundException('Rating not found');
        }

        return rating;
    }

    async update(id: number, updateRatingDto: UpdateRatingDto) {
        const exists = await this.prisma.rating.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Rating not found');
        }

        await this.ensureRelationsExist(updateRatingDto);

        return this.prisma.rating.update({
            where: { id },
            data: {
                teacherId: updateRatingDto.teacherId,
                lessonId: updateRatingDto.lessonId,
                score: updateRatingDto.score,
            },
            select: this.selectRatingFields(),
        });
    }

    async remove(id: number) {
        const exists = await this.prisma.rating.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Rating not found');
        }

        await this.prisma.rating.delete({ where: { id } });
        return { message: 'Rating deleted successfully' };
    }
}
