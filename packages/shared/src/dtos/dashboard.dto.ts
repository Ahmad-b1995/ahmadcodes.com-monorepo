import type { ITask } from './task.dto';
import type { ILinkedInPost } from './linkedin-post.dto';
import type { IOutreachContact } from './outreach.dto';

export interface ICareerSummary {
  today: {
    tasksDue: ITask[];
    linkedInScheduled: ILinkedInPost[];
    outreachOverdue: IOutreachContact[];
    remindersDue: ITask[];
  };
  thisWeek: {
    tasksDue: ITask[];
    linkedInScheduled: ILinkedInPost[];
    outreachOverdue: IOutreachContact[];
    remindersDue: ITask[];
  };
  last7Days: {
    linkedInPostedCount: number;
    tasksCompletedCount: number;
    mailSentCount: number;
    mailReceivedCount: number;
  };
}
