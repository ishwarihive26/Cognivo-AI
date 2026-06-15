'use client';

import { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import InputBar from './InputBar';
import ProviderSelector from './ProviderSelector';
import { Message, AIProvider } from '@/lib/types';
import { chatAPI } from '@/lib/api';

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      provider,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await chatAPI.sendMessage(
        [...messages, userMessage],
        provider
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'ai',
        provider,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || 'Failed to get response. Please try again.';
      setError(errorMessage);
      console.error('Chat Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear all messages? This cannot be undone.')) {
      setMessages([]);
      setError(null);
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-800 border-b md:border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Select AI Model
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Choose which AI to chat with
          </p>
        </div>

        <div className="flex-1">
          <ProviderSelector value={provider} onChange={setProvider} disabled={loading} />
        </div>

        <button
          onClick={handleClearChat}
          className="w-full mt-4 px-3 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} error={error} />
          {loading && (
            <div className="px-4 py-4 text-center text-sm text-slate-500">
              <div className="inline-block">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
              <p className="mt-2">{provider} is thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <InputBar onSend={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
}