'use client';

import type { Message } from '../lib/types';

interface Props {
  messages: Message[];
  error?: string | null;
}

export default function MessageList({ messages, error }: Props) {
  return (
    <div className="flex flex-col space-y-4 p-4 min-h-full">
      {messages.length === 0 && !error && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-lg font-semibold mb-2">
              No messages yet
            </p>
            <p className="text-sm">
              Start a conversation to begin chatting
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg">
          <p className="font-semibold text-sm">Error</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.sender === 'user'
              ? 'justify-end'
              : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
            }`}
          >
            <p className="break-words">{msg.text}</p>

            {msg.provider && msg.sender === 'ai' && (
              <p className="text-xs mt-1 opacity-60">
                via {msg.provider}
              </p>
            )}

            <p className="text-xs mt-1 opacity-50">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}