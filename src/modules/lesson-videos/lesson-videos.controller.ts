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
import { LessonVideosService } from './lesson-videos.service';
import { CreateLessonVideoDto } from './dto/create-lesson-video.dto';
import { UpdateLessonVideoDto } from './dto/update-lesson-video.dto';

@ApiTags('Lesson Videos')
@Controller('lesson-videos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
export class LessonVideosController {
  constructor(private readonly lessonVideosService: LessonVideosService) { }

  @ApiOperation({ summary: 'Yangi lesson video yaratish' })
  @ApiResponse({ status: 201, description: 'Lesson video yaratildi' })
  @Post()
  create(@Body() createLessonVideoDto: CreateLessonVideoDto) {
    return this.lessonVideosService.create(createLessonVideoDto);
  }

  @ApiOperation({ summary: 'Barcha lesson videolarni olish' })
  @Get()
  findAll() {
    return this.lessonVideosService.findAll();
  }

  @ApiOperation({ summary: 'Bitta lesson videoni olish' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonVideosService.findOne(+id);
  }

  @ApiOperation({ summary: 'Lesson videoni yangilash' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLessonVideoDto: UpdateLessonVideoDto,
  ) {
    return this.lessonVideosService.update(+id, updateLessonVideoDto);
  }

  @ApiOperation({ summary: 'Lesson videoni o`chirish' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonVideosService.remove(+id);
  }
}
