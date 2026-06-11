/**
 * Cognivo AI Type Definitions
 * All TypeScript interfaces and types used throughout the application
 */

// ========================
// USER TYPES
// ========================

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  settings?: {
    theme: 'light' | 'dark';
    language: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ========================
// MESSAGE & CHAT TYPES
// ========================

export type AIProvider = 'openai' | 'gemini' | 'claude';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  provider?: AIProvider;
  timestamp: Date;
  tokens?: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// ========================
// PROVIDER TYPES
// ========================

export interface ProviderConfig {
  id: AIProvider;
  name: string;
  description: string;
  icon: string;
  speed: 'fast' | 'medium' | 'slow';
  cost: 'free' | 'low' | 'medium' | 'high';
  maxTokens: number;
}

// ========================
// API RESPONSE TYPES
// ========================

export interface ChatResponse {
  response: string;
  provider: AIProvider;
  tokensUsed: number;
  cost: number;
  timestamp: Date;
}

export interface APIError {
  error: string;
  code: string;
  statusCode: number;
}

// ========================
// IMAGE TYPES
// ========================

export interface ImageGenerationRequest {
  prompt: string;
  size: '256x256' | '512x512' | '1024x1024';
  quality: 'standard' | 'hd';
}

export interface ImageGenerationResponse {
  imageUrl: string;
  revisedPrompt: string;
  generatedAt: Date;
}

// ========================
// USAGE & ANALYTICS TYPES
// ========================

export interface UsageStats {
  totalMessages: number;
  totalCost: number;
  providers: {
    [key: string]: {
      count: number;
      cost: number;
      avgResponseTime: number;
    };
  };
}

// ========================
// VOICE TYPES
// ========================

export interface VoiceConfig {
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed: number;
  format: 'mp3' | 'opus' | 'aac' | 'flac';
}

export interface TranscriptionResponse {
  text: string;
  language: string;
  duration: number;
  confidence: number;
}