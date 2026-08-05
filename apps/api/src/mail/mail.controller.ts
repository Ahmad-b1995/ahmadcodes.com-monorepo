import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MailService } from './mail.service';
import { ListMailQueryDto, SendMailDto } from './mail.dto';

@Controller('mail')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  send(@Body() dto: SendMailDto) {
    return this.mailService.send(dto);
  }

  @Post('verify')
  verify() {
    return this.mailService.verify();
  }

  @Get()
  list(
    @Query() query: ListMailQueryDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  ) {
    return this.mailService.list({ page, limit: Math.min(limit, 100) }, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mailService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mailService.remove(id);
  }
}
