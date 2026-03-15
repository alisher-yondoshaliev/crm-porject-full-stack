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
import { HomeworkResponsesService } from './homework-responses.service';
import { CreateHomeworkResponseDto } from './dto/create-homework-response.dto';
import { UpdateHomeworkResponseDto } from './dto/update-homework-response.dto';

@ApiTags('Homework Responses')
@Controller('homework-responses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER, Role.STUDENT)
export class HomeworkResponsesController {
  constructor(
    private readonly homeworkResponsesService: HomeworkResponsesService,
  ) { }

  @ApiOperation({ summary: 'Yangi homework response yaratish' })
  @ApiResponse({ status: 201, description: 'Homework response yaratildi' })
  @Post()
  create(@Body() createHomeworkResponseDto: CreateHomeworkResponseDto) {
    return this.homeworkResponsesService.create(createHomeworkResponseDto);
  }

  @ApiOperation({ summary: 'Barcha homework responselarni olish' })
  @Get()
  findAll() {
    return this.homeworkResponsesService.findAll();
  }

  @ApiOperation({ summary: 'Bitta homework responseni olish' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkResponsesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Homework responseni yangilash' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHomeworkResponseDto: UpdateHomeworkResponseDto,
  ) {
    return this.homeworkResponsesService.update(+id, updateHomeworkResponseDto);
  }

  @ApiOperation({ summary: 'Homework responseni o`chirish' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkResponsesService.remove(+id);
  }
}
