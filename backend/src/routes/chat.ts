import express, { Request, Response } from 'express';

import { sendMessageToOpenAI } from '../services/openaiService';
import { sendMessageToGemini } from '../services/geminiService';
import { sendMessageToClaude } from '../services/claudeService';

const router = express.Router();

/**
 * POST /
 * Send message and get AI response (Multi-provider)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages, provider = 'openai' } = req.body;
    const userId = (req as any).userId;

    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Messages array is required',
      });
    }

    if (!['openai', 'gemini', 'claude'].includes(provider)) {
      return res.status(400).json({
        error: 'Invalid provider',
      });
    }

    // Format messages for AI APIs
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));

    let aiResponse;

    // Route to correct provider
    switch (provider) {
      case 'openai':
        aiResponse = await sendMessageToOpenAI(formattedMessages);
        break;

      case 'gemini':
        aiResponse = await sendMessageToGemini(formattedMessages);
        break;

      case 'claude':
        aiResponse = await sendMessageToClaude(formattedMessages);
        break;

      default:
        return res.status(400).json({
          error: 'Invalid provider',
        });
    }

    return res.json({
      success: true,
      response: aiResponse.response,
      provider,
      tokensUsed: aiResponse.tokens,
      cost: aiResponse.cost,
      timestamp: new Date(),
    });

  } catch (error: any) {
    console.error('Chat Error:', error);

    return res.status(500).json({
      error: error.message || 'Failed to process chat message',
    });
  }
});

export default router;