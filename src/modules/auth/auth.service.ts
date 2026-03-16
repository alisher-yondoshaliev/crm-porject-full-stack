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

type LoginPayload = {
  id: number;
  email: string;
  fullName: string;
  role: Role;
};

type TokenPayload = {
  sub: number;
  email: string;
  role: Role;
  type: 'access' | 'refresh';
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private getJwtSecret() {
    return process.env.JWT_SECRET_KEY || 'dev-jwt-secret';
  }

  private getRefreshJwtSecret() {
    return process.env.JWT_REFRESH_SECRET_KEY || this.getJwtSecret();
  }

  private async validatePassword(plainPassword: string, hashedPassword: string) {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);

    if (!isValid) {
      throw new UnauthorizedException(`Noto'g'ri ma'lumotlar`);
    }
  }

  private async syncSeededSuperAdmin(loginEmail: string) {
    const superAdminEmail = process.env.SUPERADMIN_EMAIL;
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      return;
    }

    const normalizedSuperAdminEmail = this.normalizeEmail(superAdminEmail);

    if (loginEmail !== normalizedSuperAdminEmail) {
      return;
    }

    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    await this.prisma.user.upsert({
      where: { email: normalizedSuperAdminEmail },
      update: {
        fullName: process.env.SUPERADMIN_FULL_NAME || 'System Super Admin',
        password: hashedPassword,
        position: process.env.SUPERADMIN_POSITION || 'System Owner',
        role: Role.SUPERADMIN,
      },
      create: {
        fullName: process.env.SUPERADMIN_FULL_NAME || 'System Super Admin',
        email: normalizedSuperAdminEmail,
        password: hashedPassword,
        position: process.env.SUPERADMIN_POSITION || 'System Owner',
        hire_date: new Date(),
        role: Role.SUPERADMIN,
      },
    });
  }

  private async ensureEmailIsFree(email: string) {
    const normalizedEmail = this.normalizeEmail(email);

    const [user, teacher, student] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: normalizedEmail } }),
      this.prisma.teacher.findUnique({ where: { email: normalizedEmail } }),
      this.prisma.student.findUnique({ where: { email: normalizedEmail } }),
    ]);

    if (user || teacher || student) {
      throw new ConflictException('User with this email already exists');
    }
  }

  private async findLoginUserByEmail(normalizedEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        password: user.password,
      };
    }

    const teacher = await this.prisma.teacher.findUnique({
      where: { email: normalizedEmail },
    });

    if (teacher) {
      return {
        id: teacher.id,
        fullName: teacher.fullName,
        email: teacher.email,
        role: Role.TEACHER,
        password: teacher.password,
      };
    }

    const student = await this.prisma.student.findUnique({
      where: { email: normalizedEmail },
    });

    if (student) {
      return {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        role: Role.STUDENT,
        password: student.password,
      };
    }

    return null;
  }

  private async generateTokens(payload: LoginPayload) {
    const jwtPayloadBase = {
      sub: payload.id,
      email: payload.email,
      role: payload.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...jwtPayloadBase, type: 'access' satisfies TokenPayload['type'] },
        {
          secret: this.getJwtSecret(),
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        { ...jwtPayloadBase, type: 'refresh' satisfies TokenPayload['type'] },
        {
          secret: this.getRefreshJwtSecret(),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async buildLoginResult(payload: LoginPayload) {
    const { accessToken, refreshToken } = await this.generateTokens(payload);

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      accessTokenExpiresIn: '1d',
      refreshTokenExpiresIn: '7d',
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
        email: this.normalizeEmail(registerAdminDto.email),
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
    const normalizedEmail = this.normalizeEmail(loginUserDto.login);

    await this.syncSeededSuperAdmin(normalizedEmail);

    const account = await this.findLoginUserByEmail(normalizedEmail);

    if (account) {
      await this.validatePassword(loginUserDto.password, account.password);

      return this.buildLoginResult({
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        role: account.role,
      });
    }

    throw new UnauthorizedException(`Noto'g'ri ma'lumotlar`);
  }
}
