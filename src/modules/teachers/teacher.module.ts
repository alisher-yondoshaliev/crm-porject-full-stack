import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class TeacherModule {}
