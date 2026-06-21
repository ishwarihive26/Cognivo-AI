
/**
 * OpenAI Service
 * Handles all OpenAI API calls and responses
 */

import OpenAI from 'openai';
import { config } from '../config/env';
import { AIProviderResponse } from '../types';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

/**
 * Chat Message Interface
 */
interface OpenAIMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Send message to OpenAI
 */
export async function sendMessageToOpenAI(
  messages: OpenAIMessage[]
): Promise<AIProviderResponse> {
  try {
    const response =
      await openai.chat.completions.create({
        model: 'gpt-4o-mini',

        messages,

        temperature: 0.7,

        max_tokens: 2048,

        top_p: 1,

        frequency_penalty: 0,

        presence_penalty: 0,
      });

    const content =
      response.choices?.[0]?.message?.content ||
      '';

    const tokens =
      response.usage?.total_tokens || 0;

    // Cost estimation
    const inputTokens =
      response.usage?.prompt_tokens || 0;

    const outputTokens =
      response.usage?.completion_tokens || 0;

    const cost =
      (inputTokens * 0.00015 +
        outputTokens * 0.0006) /
      1000;

    return {
      response: content,
      tokens,
      cost,
    };

  } catch (error: unknown) {
    console.error(
      'OpenAI Error:',
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to get response from OpenAI'
    );
  }
}

/**
 * Generate image with DALL·E
 */
export async function generateImageWithDALLE(
  prompt: string
): Promise<string> {
  try {
    const response =
      await openai.images.generate({
        model: 'dall-e-3',

        prompt,

        n: 1,

        size: '1024x1024',

        quality: 'standard',
      });

    return response.data?.[0]?.url || '';

  } catch (error: unknown) {
    console.error(
      'DALL·E Error:',
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to generate image'
    );
  }
}

/**
 * Transcribe audio with Whisper
 */
export async function transcribeAudio(
  filePath: string
): Promise<string> {
  try {
    const audioStream =
      fs.createReadStream(
        path.resolve(filePath)
      );

    const response =
      await openai.audio.transcriptions.create({
        file: audioStream,

        model: 'whisper-1',

        language: 'en',
      });

    return response.text;

  } catch (error: unknown) {
    console.error(
      'Whisper Error:',
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to transcribe audio'
    );
  }
}

/**
 * Text to Speech
 */
export async function textToSpeech(
  text: string,

  voice:
    | 'alloy'
    | 'echo'
    | 'fable'
    | 'onyx'
    | 'nova'
    | 'shimmer' = 'alloy'
): Promise<Buffer> {
  try {
    const response =
      await openai.audio.speech.create({
        model: 'tts-1',

        voice,

        input: text,

        speed: 1,
      });

    const arrayBuffer =
      await response.arrayBuffer();

    return Buffer.from(arrayBuffer);

  } catch (error: unknown) {
    console.error(
      'TTS Error:',
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to generate speech'
    );
  }
}

export default {
  sendMessageToOpenAI,
  generateImageWithDALLE,
  transcribeAudio,
  textToSpeech,
};
```
