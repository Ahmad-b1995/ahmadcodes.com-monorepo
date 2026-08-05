import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GoalService } from './goal.service';
import { CreateGoalDto, UpdateGoalDto } from './goal.dto';

@Controller('goals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  create(@Body() dto: CreateGoalDto) {
    return this.goalService.create(dto);
  }

  @Get()
  findAll() {
    return this.goalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.goalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGoalDto) {
    return this.goalService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.goalService.remove(id);
  }
}
