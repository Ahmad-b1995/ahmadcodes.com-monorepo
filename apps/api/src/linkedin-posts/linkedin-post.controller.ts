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
import { LinkedInPostService } from './linkedin-post.service';
import {
  CreateLinkedInPostDto,
  MarkLinkedInPostPostedDto,
  UpdateLinkedInPostDto,
} from './linkedin-post.dto';

@Controller('linkedin-posts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class LinkedInPostController {
  constructor(private readonly linkedInPostService: LinkedInPostService) {}

  @Post()
  create(@Body() dto: CreateLinkedInPostDto) {
    return this.linkedInPostService.create(dto);
  }

  @Get('queue')
  queue() {
    return this.linkedInPostService.findQueue();
  }

  @Get()
  findAll() {
    return this.linkedInPostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.linkedInPostService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLinkedInPostDto,
  ) {
    return this.linkedInPostService.update(id, dto);
  }

  @Post(':id/mark-posted')
  markPosted(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MarkLinkedInPostPostedDto,
  ) {
    return this.linkedInPostService.markPosted(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.linkedInPostService.remove(id);
  }
}
