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
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Roles } from 'src/common/utils/roles.decorator';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('Lessons')
@Controller('lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @ApiOperation({ summary: 'Yangi lesson yaratish' })
  @ApiResponse({ status: 201, description: 'Lesson yaratildi' })
  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @ApiOperation({ summary: 'Barcha lessonlarni olish' })
  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @ApiOperation({ summary: 'Bitta lessonni olish' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Lessonni yangilash' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(+id, updateLessonDto);
  }

  @ApiOperation({ summary: 'Lessonni o`chirish' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(+id);
  }
}
