import { Request } from "express";

/**
 * Cognivo AI Backend Type Definitions
 */

// ========================
// REQUEST TYPES
// ========================

export interface ChatRequest {
  messages: Message[];
  provider: "openai" | "gemini" | "claude";
}

export interface UserAuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  size?: string;
  quality?: string;
}

// ========================
// RESPONSE TYPES
// ========================

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: Date;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  statusCode: number;
  timestamp: Date;
}

// ========================
// DATABASE TYPES
// ========================

export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  provider?: string;
  timestamp: Date;
  tokens?: number;
}

export interface Conversation {
  _id?: string;
  userId: string;
  messages: Message[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========================
// AI PROVIDER TYPES
// ========================

export interface AIProviderResponse {
  response: string;
  tokens: number;
  cost: number;
}

// ========================
// MIDDLEWARE TYPES
// ========================

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

// ========================
// CONFIG TYPES
// ========================

export interface AppConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "testing";
  MONGODB_URI: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
  CLAUDE_API_KEY: string;
}