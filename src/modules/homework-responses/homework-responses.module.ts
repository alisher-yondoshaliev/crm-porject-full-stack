import { Module } from '@nestjs/common';
import { HomeworkResponsesService } from './homework-responses.service';
import { HomeworkResponsesController } from './homework-responses.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@Module({
  controllers: [HomeworkResponsesController],
  providers: [HomeworkResponsesService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class HomeworkResponsesModule { }
