import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(private readonly prisma: PrismaService) { }

    private selectCourseFields() {
        return {
            id: true,
            name: true,
            durationMonth: true,
            durationLesson: true,
            status: true,
            level: true,
            price: true,
            description: true,
            created_at: true,
            updated_at: true,
        };
    }

    async create(createCourseDto: CreateCourseDto) {
        try {
            return await this.prisma.course.create({
                data: {
                    name: createCourseDto.name,
                    durationMonth: createCourseDto.durationMonth,
                    durationLesson: createCourseDto.durationLesson,
                    status: createCourseDto.status,
                    level: createCourseDto.level,
                    price: createCourseDto.price,
                    description: createCourseDto.description,
                },
                select: this.selectCourseFields(),
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Course with this name already exists');
            }
            throw error;
        }
    }

    findAll() {
        return this.prisma.course.findMany({
            orderBy: { id: 'desc' },
            select: this.selectCourseFields(),
        });
    }

    async findOne(id: number) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            select: this.selectCourseFields(),
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        return course;
    }

    async update(id: number, updateCourseDto: UpdateCourseDto) {
        const exists = await this.prisma.course.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Course not found');
        }

        try {
            return await this.prisma.course.update({
                where: { id },
                data: {
                    name: updateCourseDto.name,
                    durationMonth: updateCourseDto.durationMonth,
                    durationLesson: updateCourseDto.durationLesson,
                    status: updateCourseDto.status,
                    level: updateCourseDto.level,
                    price: updateCourseDto.price,
                    description: updateCourseDto.description,
                },
                select: this.selectCourseFields(),
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Course with this name already exists');
            }
            throw error;
        }
    }

    async remove(id: number) {
        const exists = await this.prisma.course.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Course not found');
        }

        await this.prisma.course.delete({ where: { id } });
        return { message: 'Course deleted successfully' };
    }
}
