import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/user.types';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async create(@Body() createCourseDto: CreateCourseDto) {
    const result = await this.courseService.create(createCourseDto);
    return {
      message: 'Course created successfully!',
      data: result,
    };
  }

  @Get()
  async findAll() {
    const result = await this.courseService.findAll();
    return {
      message: 'All courses fetched successfully!',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.courseService.findOne(id);
    return {
      message: 'Single course fetched successfully!',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    const result = await this.courseService.update(id, updateCourseDto);
    return {
      message: 'Course updated successfully!',
      data: result,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    const result = await this.courseService.remove(id);
    return {
      message: 'Course deleted successfully!',
      data: result,
    };
  }
}
