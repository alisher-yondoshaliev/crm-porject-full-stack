import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private validateRole(role: Role) {
    const allowedRoles: Role[] = [Role.MANAGEMENT, Role.ADMINSTRATOR];

    if (!allowedRoles.includes(role)) {
      throw new BadRequestException(
        'Users module can create only MANAGEMENT or ADMINSTRATOR roles',
      );
    }
  }

  private async ensureEmailIsFree(email: string, ignoreUserId?: number) {
    const [user, teacher, student] = await Promise.all([
      this.prisma.user.findUnique({ where: { email } }),
      this.prisma.teacher.findUnique({ where: { email } }),
      this.prisma.student.findUnique({ where: { email } }),
    ]);

    if (user && user.id !== ignoreUserId) {
      throw new ConflictException('Email already exists');
    }

    if (teacher || student) {
      throw new ConflictException('Email already exists');
    }
  }

  async create(createUserDto: CreateUserDto) {
    await this.ensureEmailIsFree(createUserDto.email);

    const role = createUserDto.role ?? Role.MANAGEMENT;
    this.validateRole(role);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        password: hashedPassword,
        position: createUserDto.position,
        role,
        address: createUserDto.address,
        photo: createUserDto.photo,
        status: createUserDto.status,
        hire_date: createUserDto.hireDate
          ? new Date(createUserDto.hireDate)
          : new Date(),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        role: true,
        address: true,
        photo: true,
        status: true,
        hire_date: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        role: true,
        address: true,
        photo: true,
        status: true,
        hire_date: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        role: true,
        address: true,
        photo: true,
        status: true,
        hire_date: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email) {
      await this.ensureEmailIsFree(updateUserDto.email, id);
    }

    if (updateUserDto.role) {
      this.validateRole(updateUserDto.role);
    }

    const data: {
      fullName?: string;
      email?: string;
      position?: string;
      role?: Role;
      address?: string;
      photo?: string;
      status?: UpdateUserDto['status'];
      hire_date?: Date;
      password?: string;
    } = {
      fullName: updateUserDto.fullName,
      email: updateUserDto.email,
      position: updateUserDto.position,
      role: updateUserDto.role,
      address: updateUserDto.address,
      photo: updateUserDto.photo,
      status: updateUserDto.status,
      hire_date: updateUserDto.hireDate
        ? new Date(updateUserDto.hireDate)
        : undefined,
    };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        role: true,
        address: true,
        photo: true,
        status: true,
        hire_date: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async remove(id: number) {
    const exists = await this.prisma.user.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
