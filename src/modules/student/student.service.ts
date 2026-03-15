import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
    constructor(private readonly prisma: PrismaService) { }

    private async ensureEmailIsFree(email: string, ignoreStudentId?: number) {
        const [student, user, teacher] = await Promise.all([
            this.prisma.student.findUnique({ where: { email } }),
            this.prisma.user.findUnique({ where: { email } }),
            this.prisma.teacher.findUnique({ where: { email } }),
        ]);

        if (student && student.id !== ignoreStudentId) {
            throw new ConflictException('Email already exists');
        }

        if (user || teacher) {
            throw new ConflictException('Email already exists');
        }
    }

    async create(createStudentDto: CreateStudentDto) {
        await this.ensureEmailIsFree(createStudentDto.email);

        const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

        return this.prisma.student.create({
            data: {
                fullName: createStudentDto.fullName,
                email: createStudentDto.email,
                password: hashedPassword,
                birth_date: new Date(createStudentDto.birthDate),
                photo: createStudentDto.photo,
                status: createStudentDto.status,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                birth_date: true,
                photo: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    findAll() {
        return this.prisma.student.findMany({
            orderBy: { id: 'desc' },
            select: {
                id: true,
                fullName: true,
                email: true,
                birth_date: true,
                photo: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    async findOne(id: number) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                email: true,
                birth_date: true,
                photo: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        return student;
    }

    async update(id: number, updateStudentDto: UpdateStudentDto) {
        const exists = await this.prisma.student.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Student not found');
        }

        if (updateStudentDto.email) {
            await this.ensureEmailIsFree(updateStudentDto.email, id);
        }

        const data: {
            fullName?: string;
            email?: string;
            photo?: string;
            birth_date?: Date;
            status?: UpdateStudentDto['status'];
            password?: string;
        } = {
            fullName: updateStudentDto.fullName,
            email: updateStudentDto.email,
            photo: updateStudentDto.photo,
            birth_date: updateStudentDto.birthDate
                ? new Date(updateStudentDto.birthDate)
                : undefined,
            status: updateStudentDto.status,
        };

        if (updateStudentDto.password) {
            data.password = await bcrypt.hash(updateStudentDto.password, 10);
        }

        return this.prisma.student.update({
            where: { id },
            data,
            select: {
                id: true,
                fullName: true,
                email: true,
                birth_date: true,
                photo: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    async remove(id: number) {
        const exists = await this.prisma.student.findUnique({ where: { id } });

        if (!exists) {
            throw new NotFoundException('Student not found');
        }

        await this.prisma.student.delete({ where: { id } });
        return { message: 'Student deleted successfully' };
    }
}
