import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,

  MONGODB_URI: process.env.MONGODB_URI || '',

  JWT_SECRET: process.env.JWT_SECRET || '',

  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  FRONTEND_URL:
    process.env.FRONTEND_URL || 'http://localhost:3000',

  NODE_ENV:
    process.env.NODE_ENV || 'development',
};