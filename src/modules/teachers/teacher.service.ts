import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureEmailIsFree(email: string, ignoreTeacherId?: number) {
    const [teacher, user, student] = await Promise.all([
      this.prisma.teacher.findUnique({ where: { email } }),
      this.prisma.user.findUnique({ where: { email } }),
      this.prisma.student.findUnique({ where: { email } }),
    ]);

    if (teacher && teacher.id !== ignoreTeacherId) {
      throw new ConflictException('Email already exists');
    }

    if (user || student) {
      throw new ConflictException('Email already exists');
    }
  }

  async create(createTeacherDto: CreateTeacherDto) {
    await this.ensureEmailIsFree(createTeacherDto.email);

    const hashedPassword = await bcrypt.hash(createTeacherDto.password, 10);

    return this.prisma.teacher.create({
      data: {
        fullName: createTeacherDto.fullName,
        email: createTeacherDto.email,
        password: hashedPassword,
        position: createTeacherDto.position,
        experience: createTeacherDto.experience,
        photo: createTeacherDto.photo,
        status: createTeacherDto.status,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        experience: true,
        photo: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  findAll() {
    return this.prisma.teacher.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        experience: true,
        photo: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        experience: true,
        photo: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    const exists = await this.prisma.teacher.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException('Teacher not found');
    }

    if (updateTeacherDto.email) {
      await this.ensureEmailIsFree(updateTeacherDto.email, id);
    }

    const data: {
      fullName?: string;
      email?: string;
      position?: string;
      experience?: number;
      photo?: string;
      status?: UpdateTeacherDto['status'];
      password?: string;
    } = {
      fullName: updateTeacherDto.fullName,
      email: updateTeacherDto.email,
      position: updateTeacherDto.position,
      experience: updateTeacherDto.experience,
      photo: updateTeacherDto.photo,
      status: updateTeacherDto.status,
    };

    if (updateTeacherDto.password) {
      data.password = await bcrypt.hash(updateTeacherDto.password, 10);
    }

    return this.prisma.teacher.update({
      where: { id },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        experience: true,
        photo: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.teacher.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException('Teacher not found');
    }

    await this.prisma.teacher.delete({ where: { id } });
    return { message: 'Teacher deleted successfully' };
  }
}
