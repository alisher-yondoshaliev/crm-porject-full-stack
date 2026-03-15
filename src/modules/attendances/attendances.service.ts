import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendancesService {
    constructor(private readonly prisma: PrismaService) { }

    private async ensureRelationsExist(payload: {
        lessonId?: number;
        studentId?: number;
        userId?: number;
        teacherId?: number;
    }) {
        const checks: Promise<unknown>[] = [];

        if (payload.lessonId) {
            checks.push(this.prisma.lesson.findUnique({ where: { id: payload.lessonId } }));
        }
        if (payload.studentId) {
            checks.push(this.prisma.student.findUnique({ where: { id: payload.studentId } }));
        }
        if (payload.userId) {
            checks.push(this.prisma.user.findUnique({ where: { id: payload.userId } }));
        }
        if (payload.teacherId) {
            checks.push(this.prisma.teacher.findUnique({ where: { id: payload.teacherId } }));
        }

        const result = await Promise.all(checks);

        let idx = 0;
        if (payload.lessonId && !result[idx++]) {
            throw new NotFoundException('Lesson not found');
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

    private selectAttendanceFields() {
        return {
            id: true,
            lessonId: true,
            studentId: true,
            userId: true,
            teacherId: true,
            isPresent: true,
            created_at: true,
            updated_at: true,
            lesson: { select: { id: true, title: true } },
            student: { select: { id: true, fullName: true, email: true } },
            user: { select: { id: true, fullName: true, role: true } },
            teacher: { select: { id: true, fullName: true, email: true } },
        };
    }

    async create(createAttendanceDto: CreateAttendanceDto) {
        await this.ensureRelationsExist(createAttendanceDto);

        return this.prisma.attendance.create({
            data: {
                lessonId: createAttendanceDto.lessonId,
                studentId: createAttendanceDto.studentId,
                userId: createAttendanceDto.userId,
                teacherId: createAttendanceDto.teacherId,
                isPresent: createAttendanceDto.isPresent,
            },
            select: this.selectAttendanceFields(),
        });
    }

    findAll() {
        return this.prisma.attendance.findMany({
            orderBy: { id: 'desc' },
            select: this.selectAttendanceFields(),
        });
    }

    async findOne(id: number) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
            select: this.selectAttendanceFields(),
        });

        if (!attendance) {
            throw new NotFoundException('Attendance not found');
        }

        return attendance;
    }

    async update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
        const exists = await this.prisma.attendance.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Attendance not found');
        }

        await this.ensureRelationsExist(updateAttendanceDto);

        return this.prisma.attendance.update({
            where: { id },
            data: {
                lessonId: updateAttendanceDto.lessonId,
                studentId: updateAttendanceDto.studentId,
                userId: updateAttendanceDto.userId,
                teacherId: updateAttendanceDto.teacherId,
                isPresent: updateAttendanceDto.isPresent,
            },
            select: this.selectAttendanceFields(),
        });
    }

    async remove(id: number) {
        const exists = await this.prisma.attendance.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Attendance not found');
        }

        await this.prisma.attendance.delete({ where: { id } });
        return { message: 'Attendance deleted successfully' };
    }
}
