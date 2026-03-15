import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, PrismaService, JwtAuthGuard, RolesGuard],
})
export class GroupsModule { }
