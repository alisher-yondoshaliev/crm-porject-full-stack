import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';
import { UpdateStudentGroupDto } from './dto/update-student-group.dto';

@Injectable()
export class StudentGroupService {
    constructor(private readonly prisma: PrismaService) { }

    private async ensureRelationsExist(payload: {
        userId?: number;
        groupId?: number;
        studentId?: number;
    }) {
        const checks: Promise<unknown>[] = [];

        if (payload.userId) {
            checks.push(this.prisma.user.findUnique({ where: { id: payload.userId } }));
        }
        if (payload.groupId) {
            checks.push(this.prisma.group.findUnique({ where: { id: payload.groupId } }));
        }
        if (payload.studentId) {
            checks.push(
                this.prisma.student.findUnique({ where: { id: payload.studentId } }),
            );
        }

        const result = await Promise.all(checks);

        let idx = 0;
        if (payload.userId && !result[idx++]) {
            throw new NotFoundException('User not found');
        }
        if (payload.groupId && !result[idx++]) {
            throw new NotFoundException('Group not found');
        }
        if (payload.studentId && !result[idx++]) {
            throw new NotFoundException('Student not found');
        }
    }

    private selectStudentGroupFields() {
        return {
            id: true,
            userId: true,
            groupId: true,
            studentId: true,
            status: true,
            created_at: true,
            updated_at: true,
            user: { select: { id: true, fullName: true, role: true } },
            group: { select: { id: true, name: true } },
            student: { select: { id: true, fullName: true, email: true } },
        };
    }

    async create(createStudentGroupDto: CreateStudentGroupDto) {
        await this.ensureRelationsExist(createStudentGroupDto);

        try {
            return await this.prisma.studentGroup.create({
                data: {
                    userId: createStudentGroupDto.userId,
                    groupId: createStudentGroupDto.groupId,
                    studentId: createStudentGroupDto.studentId,
                    status: createStudentGroupDto.status,
                },
                select: this.selectStudentGroupFields(),
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('This student already exists in this group');
            }
            throw error;
        }
    }

    findAll() {
        return this.prisma.studentGroup.findMany({
            orderBy: { id: 'desc' },
            select: this.selectStudentGroupFields(),
        });
    }

    async findOne(id: number) {
        const studentGroup = await this.prisma.studentGroup.findUnique({
            where: { id },
            select: this.selectStudentGroupFields(),
        });

        if (!studentGroup) {
            throw new NotFoundException('Student-group record not found');
        }

        return studentGroup;
    }

    async update(id: number, updateStudentGroupDto: UpdateStudentGroupDto) {
        const exists = await this.prisma.studentGroup.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Student-group record not found');
        }

        await this.ensureRelationsExist(updateStudentGroupDto);

        try {
            return await this.prisma.studentGroup.update({
                where: { id },
                data: {
                    userId: updateStudentGroupDto.userId,
                    groupId: updateStudentGroupDto.groupId,
                    studentId: updateStudentGroupDto.studentId,
                    status: updateStudentGroupDto.status,
                },
                select: this.selectStudentGroupFields(),
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('This student already exists in this group');
            }
            throw error;
        }
    }

    async remove(id: number) {
        const exists = await this.prisma.studentGroup.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Student-group record not found');
        }

        await this.prisma.studentGroup.delete({ where: { id } });
        return { message: 'Student-group record deleted successfully' };
    }
}
