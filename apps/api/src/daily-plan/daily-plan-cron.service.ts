import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyPlan } from './daily-plan.entity';
import { DailyPlanService, utcTodayDateString } from './daily-plan.service';

@Injectable()
export class DailyPlanCronService {
  private readonly logger = new Logger(DailyPlanCronService.name);

  constructor(
    @InjectRepository(DailyPlan)
    private readonly dailyPlanRepository: Repository<DailyPlan>,
    private readonly dailyPlanService: DailyPlanService,
  ) {}

  /** 05:00 UTC (~08:00 GMT+3) — skip if a plan for today already exists. */
  @Cron('0 5 * * *', { timeZone: 'Etc/UTC' })
  async pregenerateToday(): Promise<void> {
    const today = utcTodayDateString();
    const exists = await this.dailyPlanRepository.exist({
      where: { planDate: today },
    });
    if (exists) {
      this.logger.debug(`Daily plan for ${today} already exists; cron skipped`);
      return;
    }
    try {
      await this.dailyPlanService.generateAndPersist(
        today,
        this.dailyPlanService.pickAvailableMinutes(undefined),
      );
      this.logger.log(`Cron pre-generated daily plan for ${today}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Cron could not pre-generate daily plan: ${message}`);
    }
  }
}
