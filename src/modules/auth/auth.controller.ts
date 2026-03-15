import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserDto, RegisterAdminDto } from './dto/auth';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Roles } from 'src/common/utils/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags("Auth (Kirish va ro'yxatdan o'tish tizimi)")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "Yangi ADMIN qo'shish (faqat SUPERADMIN)",
  })
  @ApiResponse({ status: 201, description: 'ADMIN yaratildi!' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Post('register')
  register(@Body() registerAdminDto: RegisterAdminDto, @Req() req: any) {
    return this.authService.register(registerAdminDto, req.user);
  }

  @ApiOperation({
    summary: 'Tizimga kirish (Admin, Teacher, Student — barchasi)',
  })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi tizimga kirdi!' })
  @Post('login')
  login(@Body() payload: LoginUserDto) {
    return this.authService.login(payload);
  }
}
