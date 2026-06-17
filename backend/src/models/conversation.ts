/**
 * Conversation Model
 * Stores chat conversations with messages
 */

import mongoose, { Schema, Document, Types } from 'mongoose';
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
      unique: false,
    },
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    provider: {
      type: String,
      enum: ['openai', 'gemini', 'claude'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    tokens: Number,
  },
  { _id: false }
);

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
conversationSchema.index({ userId: 1, createdAt: -1 });

export const Conversation = mongoose.model<IConversation>(
  'Conversation',
  conversationSchema
);