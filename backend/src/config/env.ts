```ts id="s4n66"
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.CLAUDE_API_KEY) {
  throw new Error('CLAUDE_API_KEY is missing');
}

export const config = {
  PORT: process.env.PORT || 5000,

  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  MONGODB_URI: process.env.MONGODB_URI || '',

  JWT_SECRET: process.env.JWT_SECRET || '',
};
```
