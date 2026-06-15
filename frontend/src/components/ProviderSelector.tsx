'use client';

import type { AIProvider, ProviderConfig } from '../lib/types';

interface Props {
  value: string;
  onChange: (provider: AIProvider) => void;
  disabled?: boolean;
}

const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  openai: {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: 'Most capable model for complex tasks',
    icon: '🤖',
    speed: 'medium',
    cost: 'medium',
    maxTokens: 8192,
  },

  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Fast and efficient responses',
    icon: '🔍',
    speed: 'fast',
    cost: 'free',
    maxTokens: 30000,
  },

  claude: {
    id: 'claude',
    name: 'Anthropic Claude 3',
    description: 'Detailed and thoughtful responses',
    icon: '🧠',
    speed: 'slow',
    cost: 'high',
    maxTokens: 200000,
  },
};

export default function ProviderSelector({
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <div className="space-y-3">
      {Object.entries(PROVIDERS).map(([key, provider]) => (
        <button
          key={key}
          onClick={() => onChange(key as AIProvider)}
          disabled={disabled}
          className={`w-full p-4 rounded-lg text-left transition transform ${
            value === key
              ? 'bg-blue-500 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {provider.icon}
            </span>

            <div className="flex-1 text-left">
              <p className="font-bold text-sm">
                {provider.name}
              </p>

              <p className="text-xs opacity-75">
                {provider.description}
              </p>

              <div className="flex gap-4 mt-2 text-xs">
                <span>⚡ {provider.speed}</span>
                <span>💰 {provider.cost}</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}