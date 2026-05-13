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
import { OutreachService } from './outreach.service';
import { CreateOutreachContactDto, UpdateOutreachContactDto } from './outreach.dto';

@Controller('outreach')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class OutreachController {
  constructor(private readonly outreachService: OutreachService) {}

  @Post()
  create(@Body() dto: CreateOutreachContactDto) {
    return this.outreachService.create(dto);
  }

  @Get('overdue')
  overdue() {
    return this.outreachService.findOverdue();
  }

  @Get()
  findAll() {
    return this.outreachService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.outreachService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOutreachContactDto,
  ) {
    return this.outreachService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.outreachService.remove(id);
  }
}
