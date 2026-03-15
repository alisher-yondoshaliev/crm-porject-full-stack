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
import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@ApiTags('Homeworks')
@Controller('homeworks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) { }

  @ApiOperation({ summary: 'Yangi homework yaratish' })
  @ApiResponse({ status: 201, description: 'Homework yaratildi' })
  @Post()
  create(@Body() createHomeworkDto: CreateHomeworkDto) {
    return this.homeworksService.create(createHomeworkDto);
  }

  @ApiOperation({ summary: 'Barcha homeworklarni olish' })
  @Get()
  findAll() {
    return this.homeworksService.findAll();
  }

  @ApiOperation({ summary: 'Bitta homeworkni olish' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworksService.findOne(+id);
  }

  @ApiOperation({ summary: 'Homeworkni yangilash' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkDto: UpdateHomeworkDto) {
    return this.homeworksService.update(+id, updateHomeworkDto);
  }

  @ApiOperation({ summary: 'Homeworkni o`chirish' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworksService.remove(+id);
  }
}
