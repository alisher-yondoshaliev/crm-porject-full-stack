import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, RegisterAdminDto } from './dto/auth';
import { PrismaService } from 'src/common/prisma/prisma.service';

type JwtUserPayload = {
  sub: number;
  email: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async ensureEmailIsFree(email: string) {
    const [user, teacher, student] = await Promise.all([
      this.prisma.user.findUnique({ where: { email } }),
      this.prisma.teacher.findUnique({ where: { email } }),
      this.prisma.student.findUnique({ where: { email } }),
    ]);

    if (user || teacher || student) {
      throw new ConflictException('User with this email already exists');
    }
  }

  private async buildLoginResult(payload: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  }) {
    const accessToken = await this.jwtService.signAsync({
      sub: payload.id,
      email: payload.email,
      role: payload.role,
    });

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: payload.id,
        fullName: payload.fullName,
        email: payload.email,
        role: payload.role,
      },
    };
  }

  async register(
    registerAdminDto: RegisterAdminDto,
    currentUser: JwtUserPayload,
  ) {
    await this.ensureEmailIsFree(registerAdminDto.email);

    if (!currentUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (currentUser.role !== Role.SUPERADMIN) {
      throw new ForbiddenException('Only SUPERADMIN can create ADMIN');
    }

    const hashedPassword = await bcrypt.hash(registerAdminDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: registerAdminDto.fullName,
        email: registerAdminDto.email,
        password: hashedPassword,
        role: Role.ADMIN,
        position: 'Branch Owner',
        hire_date: new Date(),
      },
    });

    return {
      message: 'Admin registered successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.login },
    });

    if (user) {
      const isValid = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!isValid) throw new UnauthorizedException(`Noto'g'ri ma'lumotlar`);

      return this.buildLoginResult({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    }

    // 2. Teacher jadvalidan qidirish
    const teacher = await this.prisma.teacher.findUnique({
      where: { email: loginUserDto.login },
    });

    if (teacher) {
      const isValid = await bcrypt.compare(
        loginUserDto.password,
        teacher.password,
      );
      if (!isValid) throw new UnauthorizedException(`Noto'g'ri ma'lumotlar`);

      return this.buildLoginResult({
        id: teacher.id,
        fullName: teacher.fullName,
        email: teacher.email,
        role: 'TEACHER',
      });
    }

    // 3. Student jadvalidan qidirish
    const student = await this.prisma.student.findUnique({
      where: { email: loginUserDto.login },
    });

    if (student) {
      const isValid = await bcrypt.compare(
        loginUserDto.password,
        student.password,
      );
      if (!isValid) throw new UnauthorizedException(`Noto'g'ri ma'lumotlar`);

      return this.buildLoginResult({
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        role: 'STUDENT',
      });
    }

    throw new UnauthorizedException(`Noto'g'ri ma'lumotlar`);
  }
}
