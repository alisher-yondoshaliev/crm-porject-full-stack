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
import { StudentGroupService } from './student-group.service';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';
import { UpdateStudentGroupDto } from './dto/update-student-group.dto';

@ApiTags('Student Group')
@Controller('student-group')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN)
export class StudentGroupController {
  constructor(private readonly studentGroupService: StudentGroupService) { }

  @ApiOperation({ summary: 'Studentni groupga biriktirish' })
  @ApiResponse({ status: 201, description: 'Student groupga qo`shildi' })
  @Post()
  create(@Body() createStudentGroupDto: CreateStudentGroupDto) {
    return this.studentGroupService.create(createStudentGroupDto);
  }

  @ApiOperation({ summary: 'Barcha student-group yozuvlarini olish' })
  @Get()
  findAll() {
    return this.studentGroupService.findAll();
  }

  @ApiOperation({ summary: 'Bitta student-group yozuvini olish' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentGroupService.findOne(+id);
  }

  @ApiOperation({ summary: 'Student-group yozuvini yangilash' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentGroupDto: UpdateStudentGroupDto,
  ) {
    return this.studentGroupService.update(+id, updateStudentGroupDto);
  }

  @ApiOperation({ summary: 'Student-group yozuvini o`chirish' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentGroupService.remove(+id);
  }
}
