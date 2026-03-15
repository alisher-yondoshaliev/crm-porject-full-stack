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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@ApiTags('Students')
@Controller('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN, Role.ADMIN)
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @ApiOperation({ summary: 'Yangi student yaratish' })
    @ApiResponse({ status: 201, description: 'Student yaratildi' })
    @Post()
    create(@Body() createStudentDto: CreateStudentDto) {
        return this.studentService.create(createStudentDto);
    }

    @ApiOperation({ summary: 'Barcha studentlarni olish' })
    @Get()
    findAll() {
        return this.studentService.findAll();
    }

    @ApiOperation({ summary: 'Bitta studentni olish' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.studentService.findOne(+id);
    }

    @ApiOperation({ summary: 'Student ma`lumotini yangilash' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
        return this.studentService.update(+id, updateStudentDto);
    }

    @ApiOperation({ summary: 'Studentni o`chirish' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.studentService.remove(+id);
    }
}
