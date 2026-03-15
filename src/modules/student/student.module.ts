import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@Module({
    controllers: [StudentController],
    providers: [StudentService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class StudentModule { }
