import { z } from 'zod';

export const actionableActionTypeSchema = z.enum([
  'email',
  'post',
  'study',
  'code',
  'phone',
  'form',
  'research',
  'other',
]);

export const actionablePayloadSchema = z.object({
  type: actionableActionTypeSchema,
  checklist: z.array(z.string()),
  copyText: z.string().optional(),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string().min(1),
    }),
  ),
  deliverables: z.array(z.string()),
  blocker: z.union([z.string(), z.null()]),
  estimateMinutes: z.number().int().positive().optional(),
});

export const planTaskTypeSchema = z.enum([
  'linkedin_post',
  'outreach',
  'article',
  'reminder',
  'learning',
  'admin',
  'application',
  'freelance',
  'other',
]);

export const planTaskStatusSchema = z.enum([
  'todo',
  'in_progress',
  'done',
  'blocked',
  'cancelled',
  'deferred',
]);

export const planTaskPrioritySchema = z.enum([
  'critical',
  'high',
  'medium',
  'low',
]);

/** One row the model proposes: existing DB task (id) or new task (omit id). */
export const dailyPlanGeneratedTaskSchema = z.object({
  id: z.number().int().positive().optional(),
  goalId: z.number().int().positive().nullable().optional(),
  title: z.string().min(1),
  description: z.string(),
  type: planTaskTypeSchema,
  status: planTaskStatusSchema.optional(),
  priority: planTaskPrioritySchema,
  estimatedMinutes: z.number().int().nonnegative().nullable().optional(),
  scheduledFor: z.string().nullable().optional(),
  dueAt: z.string().nullable().optional(),
  actionable: actionablePayloadSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const suggestedMemoryNoteSchema = z.object({
  content: z.string().min(1),
  tags: z.array(z.string()),
});

export const dailyPlanLlmOutputSchema = z.object({
  tasks: z.array(dailyPlanGeneratedTaskSchema).min(1),
  rationale: z.string().min(80),
  estimatedTotalMinutes: z.number().int().nonnegative(),
  suggestedMemoryNotes: z.array(suggestedMemoryNoteSchema).optional(),
});

export type IActionablePayload = z.infer<typeof actionablePayloadSchema>;
export type IDailyPlanGeneratedTask = z.infer<
  typeof dailyPlanGeneratedTaskSchema
>;
export type IDailyPlanLlmOutput = z.infer<typeof dailyPlanLlmOutputSchema>;
