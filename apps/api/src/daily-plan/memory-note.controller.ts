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
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { MemoryNoteService } from './memory-note.service';
import {
  CreateMemoryNoteDto,
  ListMemoryNotesQueryDto,
  UpdateMemoryNoteDto,
} from './memory-note.dto';

@Controller('memory-notes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class MemoryNoteController {
  constructor(private readonly memoryNoteService: MemoryNoteService) {}

  @Get()
  list(@Query() query: ListMemoryNotesQueryDto) {
    const options: IPaginationOptions = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    };
    return this.memoryNoteService.findAllPaginated(options, {
      tag: query.tag,
      pinned: query.pinned,
    });
  }

  @Post()
  create(@Body() dto: CreateMemoryNoteDto) {
    return this.memoryNoteService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMemoryNoteDto,
  ) {
    return this.memoryNoteService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.memoryNoteService.remove(id);
  }
}
