import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { LlmService } from './llm.service';
import type { IGenerateDailyPlanInput } from './daily-plan-llm.types';

jest.mock('@anthropic-ai/sdk');

const longRationale =
  'First paragraph explains prioritization and context for the day ahead. ' +
  'Second paragraph covers sequencing, energy management, and how tasks tie to goals.';

function minimalValidPlanJson(availableMinutes: number) {
  return {
    tasks: [
      {
        title: 'Review embassy checklist',
        description: 'Work through the printed list.',
        type: 'admin',
        priority: 'high',
        estimatedMinutes: 25,
        actionable: {
          type: 'research',
          checklist: ['Open the checklist PDF', 'Tick items you already have'],
          copyText: 'Subject: Document status inquiry\n\nHello,\n',
          links: [{ label: 'Example', url: 'https://example.com' }],
          deliverables: ['Updated checklist'],
          blocker: null,
        },
      },
    ],
    rationale: longRationale,
    estimatedTotalMinutes: Math.min(25, availableMinutes),
    suggestedMemoryNotes: [{ content: 'Remember to pack originals', tags: ['travel'] }],
  };
}

describe('LlmService', () => {
  const baseInput: IGenerateDailyPlanInput = {
    userProfile: {
      name: 'Test',
      currentLocation: 'Test City',
      careerStage: 'Mid-career',
    },
    goals: [],
    tasks: [],
    memoryNotes: [],
    completedTasks: [],
    todayDate: '2026-05-14',
    availableMinutes: 480,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('parses and returns a validated plan from the model response', async () => {
    const planPayload = minimalValidPlanJson(480);
    const createMock = jest.fn().mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify(planPayload) }],
      usage: { input_tokens: 100, output_tokens: 200 },
    });
    (Anthropic as unknown as jest.Mock).mockImplementation(() => ({
      messages: { create: createMock },
    }));

    const config = new ConfigService({ ANTHROPIC_API_KEY: 'test-key' });
    const service = new LlmService(config);
    const result = await service.generateDailyPlan(baseInput);

    expect(result.plan.tasks).toHaveLength(1);
    expect(result.plan.tasks[0].title).toBe('Review embassy checklist');
    expect(result.inputTokens).toBe(100);
    expect(result.outputTokens).toBe(200);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ temperature: 0.3 }),
    );
  });

  it('throws when the model JSON fails schema validation', async () => {
    const createMock = jest.fn().mockResolvedValue({
      content: [
        {
          type: 'text',
          text: JSON.stringify({ tasks: [], rationale: 'short', estimatedTotalMinutes: 0 }),
        },
      ],
      usage: { input_tokens: 1, output_tokens: 2 },
    });
    (Anthropic as unknown as jest.Mock).mockImplementation(() => ({
      messages: { create: createMock },
    }));

    const config = new ConfigService({ ANTHROPIC_API_KEY: 'test-key' });
    const service = new LlmService(config);

    await expect(service.generateDailyPlan(baseInput)).rejects.toThrow(
      /LLM JSON failed validation|LLM response is not valid JSON/,
    );
  });
});
