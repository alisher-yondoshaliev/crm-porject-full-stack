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
import { HomeworkResultsService } from './homework-results.service';
import { CreateHomeworkResultDto } from './dto/create-homework-result.dto';
import { UpdateHomeworkResultDto } from './dto/update-homework-result.dto';

@ApiTags('Homework Results')
@Controller('homework-results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
export class HomeworkResultsController {
  constructor(
    private readonly homeworkResultsService: HomeworkResultsService,
  ) { }

  @ApiOperation({ summary: 'Yangi homework result yaratish' })
  @ApiResponse({ status: 201, description: 'Homework result yaratildi' })
  @Post()
  create(@Body() createHomeworkResultDto: CreateHomeworkResultDto) {
    return this.homeworkResultsService.create(createHomeworkResultDto);
  }

  @ApiOperation({ summary: 'Barcha homework resultlarni olish' })
  @Get()
  findAll() {
    return this.homeworkResultsService.findAll();
  }

  @ApiOperation({ summary: 'Bitta homework resultni olish' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkResultsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Homework resultni yangilash' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHomeworkResultDto: UpdateHomeworkResultDto,
  ) {
    return this.homeworkResultsService.update(+id, updateHomeworkResultDto);
  }

  @ApiOperation({ summary: 'Homework resultni o`chirish' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkResultsService.remove(+id);
  }
}
