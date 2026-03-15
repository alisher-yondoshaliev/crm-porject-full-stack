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
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Roles } from 'src/common/utils/roles.decorator';

@ApiTags('Attendances')
@Controller('attendances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) { }

  @ApiOperation({ summary: 'Yangi attendance yozuvi yaratish' })
  @ApiResponse({ status: 201, description: 'Attendance yaratildi' })
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  @ApiOperation({ summary: 'Barcha attendance yozuvlarini olish' })
  @Get()
  findAll() {
    return this.attendancesService.findAll();
  }

  @ApiOperation({ summary: 'Bitta attendance yozuvini olish' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Attendance yozuvini yangilash' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendancesService.update(+id, updateAttendanceDto);
  }

  @ApiOperation({ summary: 'Attendance yozuvini o`chirish' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(+id);
  }
}
