import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class RoomsModule { }
