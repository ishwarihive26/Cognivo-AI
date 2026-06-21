/**
 * Chat Routes
 * Handles chat messages with AI providers
 */

import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import Conversation from '../models/Conversation';
import { sendMessageToOpenAI } from '../services/openaiService';

const router = Router();

/**
 * Custom Request Interface
 */
interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Message Interface
 */
interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

// Apply auth middleware
router.use(authMiddleware);

/**
 * POST /
 * Send message and get AI response
 */
router.post(
  '/',
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        messages,
        provider = 'openai',
      }: {
        messages: ChatMessage[];
        provider?: string;
      } = req.body;

      // Validation
      if (
        !messages ||
        !Array.isArray(messages) ||
        messages.length === 0
      ) {
        res.status(400).json({
          success: false,
          error: 'Messages array is required',
        });
        return;
      }

      // Provider validation
      if (
        !['openai', 'gemini', 'claude'].includes(provider)
      ) {
        res.status(400).json({
          success: false,
          error: 'Invalid provider',
        });
        return;
      }

      // Format messages
      const formattedMessages = messages.map(
        (msg: ChatMessage) => ({
          role:
            msg.sender === 'user'
              ? 'user'
              : 'assistant',
          content: msg.text,
        })
      );

      let aiResponse: {
        response: string;
        tokens: number;
        cost: number;
      };

      // OpenAI Provider
      if (provider === 'openai') {
        aiResponse =
          await sendMessageToOpenAI(
            formattedMessages
          );
      } else {
        res.status(501).json({
          success: false,
          error:
            `${provider} provider not implemented yet`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        response: aiResponse.response,
        provider,
        tokensUsed: aiResponse.tokens,
        cost: aiResponse.cost,
        timestamp: new Date(),
      });

    } catch (error: unknown) {
      console.error('Chat Error:', error);

      res.status(500).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process chat message',
      });
    }
  }
);

/**
 * GET /history
 * Get all user conversations
 */
router.get(
  '/history',
  async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId;

      const limit =
        Number(req.query.limit) || 50;

      const offset =
        Number(req.query.offset) || 0;

      const conversations =
        await Conversation.find({ userId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(offset);

      const total =
        await Conversation.countDocuments({
          userId,
        });

      res.status(200).json({
        success: true,
        conversations,
        total,
        limit,
        offset,
      });

    } catch (error) {
      console.error(
        'History Error:',
        error
      );

      res.status(500).json({
        success: false,
        error:
          'Failed to get chat history',
      });
    }
  }
);

/**
 * POST /conversations
 * Create new conversation
 */
router.post(
  '/conversations',
  async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId;

      const {
        title = 'New Conversation',
      }: {
        title?: string;
      } = req.body;

      const conversation =
        new Conversation({
          userId,
          title,
          messages: [],
        });

      await conversation.save();

      res.status(201).json({
        success: true,
        conversation,
      });

    } catch (error) {
      console.error(
        'Create Conversation Error:',
        error
      );

      res.status(500).json({
        success: false,
        error:
          'Failed to create conversation',
      });
    }
  }
);

/**
 * DELETE /history/all
 * Delete all conversations
 */
router.delete(
  '/history/all',
  async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId;

      const result =
        await Conversation.deleteMany({
          userId,
        });

      res.status(200).json({
        success: true,
        deletedCount:
          result.deletedCount,
        message:
          'All conversations deleted',
      });

    } catch (error) {
      console.error(
        'Delete All Error:',
        error
      );

      res.status(500).json({
        success: false,
        error:
          'Failed to delete conversations',
      });
    }
  }
);

export default router;