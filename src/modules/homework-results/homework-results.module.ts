import { Module } from '@nestjs/common';
import { HomeworkResultsService } from './homework-results.service';
import { HomeworkResultsController } from './homework-results.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@Module({
  controllers: [HomeworkResultsController],
  providers: [HomeworkResultsService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class HomeworkResultsModule { }
