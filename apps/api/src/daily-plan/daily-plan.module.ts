import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { PlanTask } from './plan-task.entity';
import { MemoryNote } from './memory-note.entity';
import { DailyPlan } from './daily-plan.entity';
import { GoalService } from './goal.service';
import { PlanTaskService } from './plan-task.service';
import { DailyPlanService } from './daily-plan.service';
import { MemoryNoteService } from './memory-note.service';
import { GoalController } from './goal.controller';
import { PlanTaskController } from './plan-task.controller';
import { DailyPlanController } from './daily-plan.controller';
import { MemoryNoteController } from './memory-note.controller';
import { DailyPlanCronService } from './daily-plan-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal, PlanTask, MemoryNote, DailyPlan]),
  ],
  controllers: [
    GoalController,
    PlanTaskController,
    DailyPlanController,
    MemoryNoteController,
  ],
  providers: [
    GoalService,
    PlanTaskService,
    DailyPlanService,
    MemoryNoteService,
    DailyPlanCronService,
  ],
  exports: [
    GoalService,
    PlanTaskService,
    DailyPlanService,
    MemoryNoteService,
    TypeOrmModule,
  ],
})
export class DailyPlanModule {}
