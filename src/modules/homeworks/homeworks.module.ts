import { Module } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { HomeworksController } from './homeworks.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@Module({
  controllers: [HomeworksController],
  providers: [HomeworksService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class HomeworksModule { }
