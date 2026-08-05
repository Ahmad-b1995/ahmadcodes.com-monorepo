import Anthropic from '@anthropic-ai/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DAILY_PLAN_JSON_SCHEMA_DESCRIPTION,
  parseDailyPlanLlmOutput,
  type IGenerateDailyPlanInput,
  type IGenerateDailyPlanResult,
} from './daily-plan-llm.types';

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly anthropic: Anthropic | null;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('ANTHROPIC_API_KEY');
    this.anthropic = key ? new Anthropic({ apiKey: key }) : null;
    this.model =
      this.configService.get<string>('ANTHROPIC_MODEL') ?? DEFAULT_MODEL;
  }

  async generateDailyPlan(
    input: IGenerateDailyPlanInput,
  ): Promise<IGenerateDailyPlanResult> {
    if (!this.anthropic) {
      throw new Error(
        'ANTHROPIC_API_KEY is not configured; cannot generate a daily plan',
      );
    }

    const system = [
      'You are a pragmatic productivity coach. You output only valid JSON.',
      'Every task must include a rich "actionable" object: literal copy/paste text, URLs, and step-by-step checklist so the user can execute without improvisation.',
      "Respect the user's available minutes budget strictly: estimatedTotalMinutes must be less than or equal to availableMinutes in the input.",
      'Prefer sequencing work that unblocks deadlines and overdue items.',
      DAILY_PLAN_JSON_SCHEMA_DESCRIPTION,
    ].join('\n\n');

    const userContent = JSON.stringify(input, null, 2);

    const response = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: 8192,
      temperature: 0.3,
      system,
      messages: [{ role: 'user', content: userContent }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('LLM returned no text content');
    }

    const plan = parseDailyPlanLlmOutput(textBlock.text);
    if (plan.estimatedTotalMinutes > input.availableMinutes) {
      throw new Error(
        `Plan estimates ${plan.estimatedTotalMinutes} minutes but only ${input.availableMinutes} are available`,
      );
    }

    const inputTokens = response.usage?.input_tokens ?? 0;
    const outputTokens = response.usage?.output_tokens ?? 0;
    this.logger.log(
      `Daily plan LLM call model=${this.model} in=${inputTokens} out=${outputTokens}`,
    );

    return {
      plan,
      model: this.model,
      inputTokens,
      outputTokens,
    };
  }
}
