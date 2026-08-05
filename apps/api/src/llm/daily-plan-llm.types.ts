import type { IDailyPlanLlmOutput } from './daily-plan-output.schema';
import { dailyPlanLlmOutputSchema } from './daily-plan-output.schema';

export interface IGenerateDailyPlanUserProfile {
  name: string;
  currentLocation: string;
  careerStage: string;
}

export interface IGenerateDailyPlanGoal {
  id: number;
  title: string;
  description: string;
  priority: string;
  targetDate: string | null;
  active: boolean;
}

export interface IGenerateDailyPlanTask {
  id: number;
  goalId: number | null;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  scheduledFor: string | null;
  dueAt: string | null;
  estimatedMinutes: number | null;
  completedAt: string | null;
  actionable: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface IGenerateDailyPlanMemoryNote {
  id: number;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
}

export interface IGenerateDailyPlanInput {
  userProfile: IGenerateDailyPlanUserProfile;
  goals: IGenerateDailyPlanGoal[];
  tasks: IGenerateDailyPlanTask[];
  memoryNotes: IGenerateDailyPlanMemoryNote[];
  completedTasks: IGenerateDailyPlanTask[];
  todayDate: string;
  availableMinutes: number;
}

export interface IGenerateDailyPlanResult {
  plan: IDailyPlanLlmOutput;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export const DAILY_PLAN_JSON_SCHEMA_DESCRIPTION = `
Return a single JSON object (no markdown fences) with this exact shape:
{
  "tasks": [
    {
      "id": <optional positive integer if this maps to an existing task from input>,
      "goalId": <optional number or null>,
      "title": string,
      "description": string,
      "type": "linkedin_post" | "outreach" | "article" | "reminder" | "learning" | "admin" | "application" | "freelance" | "other",
      "status": optional "todo" | "in_progress" | "done" | "blocked" | "cancelled" | "deferred",
      "priority": "critical" | "high" | "medium" | "low",
      "estimatedMinutes": number or null,
      "scheduledFor": "YYYY-MM-DD" or null,
      "dueAt": ISO-8601 string or null,
      "actionable": {
        "type": "email" | "post" | "study" | "code" | "phone" | "form" | "research" | "other",
        "checklist": string[],
        "copyText": string (optional — email/post body, form text, etc.),
        "links": [{ "label": string, "url": string }],
        "deliverables": string[],
        "blocker": string | null,
        "estimateMinutes": positive integer (optional)
      },
      "metadata": object (optional)
    }
  ],
  "rationale": string (two paragraphs, >= 80 chars total),
  "estimatedTotalMinutes": non-negative integer (must be <= availableMinutes),
  "suggestedMemoryNotes": optional [{ "content": string, "tags": string[] }]
}
`;

export function extractJsonFromLlmText(raw: string): string {
  const trimmed = raw.trim();
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/m.exec(trimmed);
  if (fence) {
    return fence[1].trim();
  }
  return trimmed;
}

export function parseDailyPlanLlmOutput(rawText: string): IDailyPlanLlmOutput {
  const jsonText = extractJsonFromLlmText(rawText);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText) as unknown;
  } catch {
    throw new Error('LLM response is not valid JSON');
  }
  const result = dailyPlanLlmOutputSchema.safeParse(parsed);
  if (!result.success) {
    const detail = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`LLM JSON failed validation: ${detail}`);
  }
  return result.data;
}
