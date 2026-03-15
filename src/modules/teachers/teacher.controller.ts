import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Roles } from 'src/common/utils/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Teachers')
@Controller('teachers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @ApiOperation({ summary: 'Yangi teacher yaratish' })
  @ApiResponse({ status: 201, description: 'Teacher yaratildi' })
  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @ApiOperation({ summary: 'Barcha teacherlarni olish' })
  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  @ApiOperation({ summary: 'Bitta teacherni olish' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(+id);
  }

  @ApiOperation({ summary: 'Teacher ma`lumotini yangilash' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(+id, updateTeacherDto);
  }

  @ApiOperation({ summary: 'Teacherni o`chirish' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(+id);
  }
}
