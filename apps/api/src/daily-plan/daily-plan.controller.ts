import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DailyPlanDateQueryDto, DailyPlanFeedbackDto } from './daily-plan.dto';
import { DailyPlanService, resolvePlanDate } from './daily-plan.service';

@Controller('daily-plan')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class DailyPlanController {
  constructor(private readonly dailyPlanService: DailyPlanService) {}

  @Post('generate')
  async generate(@Query() query: DailyPlanDateQueryDto) {
    const date = resolvePlanDate(query.date);
    const minutes = this.dailyPlanService.pickAvailableMinutes(
      query.availableMinutes,
    );
    return this.dailyPlanService.generateAndPersist(date, minutes);
  }

  @Get()
  async get(@Query() query: DailyPlanDateQueryDto) {
    const date = resolvePlanDate(query.date);
    const minutes = this.dailyPlanService.pickAvailableMinutes(
      query.availableMinutes,
    );
    return this.dailyPlanService.getPlanBundleByDate(date, minutes);
  }

  @Post('feedback')
  async feedback(@Body() dto: DailyPlanFeedbackDto) {
    return this.dailyPlanService.handleFeedback(dto);
  }
}
