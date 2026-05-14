import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './goal.entity';
import { PlanTask } from './plan-task.entity';
import { MemoryNote } from './memory-note.entity';
import { DailyPlan } from './daily-plan.entity';
import { GoalService } from './goal.service';
import { PlanTaskService } from './plan-task.service';
import { GoalController } from './goal.controller';
import { PlanTaskController } from './plan-task.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal, PlanTask, MemoryNote, DailyPlan]),
  ],
  controllers: [GoalController, PlanTaskController],
  providers: [GoalService, PlanTaskService],
  exports: [GoalService, PlanTaskService, TypeOrmModule],
})
export class DailyPlanModule {}
