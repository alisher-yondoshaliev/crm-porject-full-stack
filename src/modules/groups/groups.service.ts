import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupsService {
    constructor(private readonly prisma: PrismaService) { }

    private async ensureRelationsExist(payload: {
        teacherId?: number;
        userId?: number;
        roomId?: number;
        courseId?: number;
    }) {
        const checks: Promise<unknown>[] = [];

        if (payload.teacherId) {
            checks.push(this.prisma.teacher.findUnique({ where: { id: payload.teacherId } }));
        }
        if (payload.userId) {
            checks.push(this.prisma.user.findUnique({ where: { id: payload.userId } }));
        }
        if (payload.roomId) {
            checks.push(this.prisma.room.findUnique({ where: { id: payload.roomId } }));
        }
        if (payload.courseId) {
            checks.push(this.prisma.course.findUnique({ where: { id: payload.courseId } }));
        }

        const result = await Promise.all(checks);

        let idx = 0;
        if (payload.teacherId && !result[idx++]) {
            throw new NotFoundException('Teacher not found');
        }
        if (payload.userId && !result[idx++]) {
            throw new NotFoundException('User not found');
        }
        if (payload.roomId && !result[idx++]) {
            throw new NotFoundException('Room not found');
        }
        if (payload.courseId && !result[idx++]) {
            throw new NotFoundException('Course not found');
        }
    }

    private selectGroupFields() {
        return {
            id: true,
            name: true,
            startDate: true,
            startTime: true,
            weekDays: true,
            status: true,
            created_at: true,
            updated_at: true,
            teacher: { select: { id: true, fullName: true, email: true } },
            user: { select: { id: true, fullName: true, email: true, role: true } },
            room: { select: { id: true, name: true, capacity: true } },
            course: { select: { id: true, name: true, level: true, price: true } },
        };
    }

    async create(createGroupDto: CreateGroupDto) {
        await this.ensureRelationsExist(createGroupDto);

        try {
            return await this.prisma.group.create({
                data: {
                    teacherId: createGroupDto.teacherId,
                    userId: createGroupDto.userId,
                    roomId: createGroupDto.roomId,
                    courseId: createGroupDto.courseId,
                    name: createGroupDto.name,
                    startDate: new Date(createGroupDto.startDate),
                    startTime: createGroupDto.startTime,
                    weekDays: createGroupDto.weekDays,
                    status: createGroupDto.status,
                },
                select: this.selectGroupFields(),
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Group with this name already exists');
            }
            throw error;
        }
    }

    findAll() {
        return this.prisma.group.findMany({
            orderBy: { id: 'desc' },
            select: this.selectGroupFields(),
        });
    }

    async findOne(id: number) {
        const group = await this.prisma.group.findUnique({
            where: { id },
            select: this.selectGroupFields(),
        });

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        return group;
    }

    async update(id: number, updateGroupDto: UpdateGroupDto) {
        const exists = await this.prisma.group.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Group not found');
        }

        await this.ensureRelationsExist(updateGroupDto);

        try {
            return await this.prisma.group.update({
                where: { id },
                data: {
                    teacherId: updateGroupDto.teacherId,
                    userId: updateGroupDto.userId,
                    roomId: updateGroupDto.roomId,
                    courseId: updateGroupDto.courseId,
                    name: updateGroupDto.name,
                    startDate: updateGroupDto.startDate
                        ? new Date(updateGroupDto.startDate)
                        : undefined,
                    startTime: updateGroupDto.startTime,
                    weekDays: updateGroupDto.weekDays,
                    status: updateGroupDto.status,
                },
                select: this.selectGroupFields(),
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException('Group with this name already exists');
            }
            throw error;
        }
    }

    async remove(id: number) {
        const exists = await this.prisma.group.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Group not found');
        }

        await this.prisma.group.delete({ where: { id } });
        return { message: 'Group deleted successfully' };
    }
}
