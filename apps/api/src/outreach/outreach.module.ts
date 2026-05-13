import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutreachContact } from './outreach.entity';
import { OutreachService } from './outreach.service';
import { OutreachController } from './outreach.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OutreachContact])],
  controllers: [OutreachController],
  providers: [OutreachService],
  exports: [OutreachService],
})
export class OutreachModule {}
