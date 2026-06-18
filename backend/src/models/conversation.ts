/**
 * Conversation Model
 * Stores chat conversations with messages
 */

import mongoose from 'mongoose';
import { Schema, Document, Types } from 'mongoose';
import { Message } from '../types';

export interface IConversation extends Document {
  userId: Types.ObjectId;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<Message>(
  {
    id: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },

    provider: {
      type: String,
      enum: ['openai', 'gemini', 'claude'],
      default: 'openai',
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    tokens: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
    },

    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
conversationSchema.index({ userId: 1, createdAt: -1 });

export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>(
    'Conversation',
    conversationSchema
  );