import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env';

const client = new Anthropic({
  apiKey: config.CLAUDE_API_KEY,
});

export interface AIProviderResponse {
  response: string;
  tokens: number;
  cost: number;
}

export async function sendMessageToClaude(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<AIProviderResponse> {
  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages,
    });

    let text = '';

    for (const block of response.content) {
      if (block.type === 'text') {
        text += block.text;
      }
    }

    const inputTokens = response.usage.input_tokens || 0;
    const outputTokens = response.usage.output_tokens || 0;

    const cost =
      (inputTokens * 0.003 + outputTokens * 0.015) / 1000;

    return {
      response: text,
      tokens: outputTokens,
      cost,
    };
  } catch (error) {
    console.error('Claude Error:', error);
    throw new Error('Failed to get Claude response');
  }
}

export default {
  sendMessageToClaude,
};