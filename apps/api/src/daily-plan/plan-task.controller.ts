import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PlanTaskService } from './plan-task.service';
import {
  CreatePlanTaskDto,
  ListPlanTasksQueryDto,
  UpdatePlanTaskDto,
} from './plan-task.dto';

@Controller('plan-tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class PlanTaskController {
  constructor(private readonly planTaskService: PlanTaskService) {}

  @Post()
  create(@Body() dto: CreatePlanTaskDto) {
    return this.planTaskService.create(dto);
  }

  @Get()
  findAll(@Query() query: ListPlanTasksQueryDto) {
    return this.planTaskService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planTaskService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlanTaskDto,
  ) {
    return this.planTaskService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.planTaskService.remove(id);
  }
}
