/**
 * Environment Configuration
 * All environment variables are loaded here
 */

import dotenv from 'dotenv';
import { AppConfig } from '../types';

// Load .env file
dotenv.config();

/**
 * Validate required environment variables
 */
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'OPENAI_API_KEY',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`);
}

/**
 * Application configuration
 */
export const config: AppConfig = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'testing') || 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
};

/**
 * Verify MongoDB connection
 */
if (!config.MONGODB_URI) {
  throw new Error('MONGODB_URI is required');
}

/**
 * Verify JWT secret
 */
if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET is required and must be at least 32 characters');
}

export default config;
