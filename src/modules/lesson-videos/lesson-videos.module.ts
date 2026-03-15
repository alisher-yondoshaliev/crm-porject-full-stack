import { Module } from '@nestjs/common';
import { LessonVideosService } from './lesson-videos.service';
import { LessonVideosController } from './lesson-videos.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@Module({
  controllers: [LessonVideosController],
  providers: [LessonVideosService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class LessonVideosModule { }
