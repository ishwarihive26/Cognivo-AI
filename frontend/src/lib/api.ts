/**
 * Cognivo AI API Client
 * Axios instance with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse, ChatResponse, User } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Create axios instance with default config
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - Handle errors and token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Log error
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * Register new user
   */
  register: (email: string, password: string, name: string) =>
    apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    }),

  /**
   * Login user
   */
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    }),

  /**
   * Get current user
   */
  getMe: () => apiClient.get<User>('/auth/me'),

  /**
   * Logout user
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Refresh token
   */
  refreshToken: () => apiClient.post<AuthResponse>('/auth/refresh'),
};

/**
 * Chat API endpoints
 */
export const chatAPI = {
  /**
   * Send message to AI
   */
  sendMessage: (
    messages: any[],
    provider: 'openai' | 'gemini' | 'claude' = 'openai'
  ) =>
    apiClient.post<ChatResponse>('/chat', {
      messages,
      provider,
    }),

  /**
   * Get chat history
   */
  getHistory: (limit = 50, offset = 0) =>
    apiClient.get('/chat/history', {
      params: { limit, offset },
    }),

  /**
   * Get single conversation
   */
  getConversation: (conversationId: string) =>
    apiClient.get(`/chat/conversations/${conversationId}`),

  /**
   * Create new conversation
   */
  createConversation: (title: string) =>
    apiClient.post('/chat/conversations', { title }),

  /**
   * Delete conversation
   */
  deleteConversation: (conversationId: string) =>
    apiClient.delete(`/chat/conversations/${conversationId}`),

  /**
   * Clear all history
   */
  clearHistory: () => apiClient.delete('/chat/history/all'),
};

/**
 * Image API endpoints
 */
export const imageAPI = {
  /**
   * Generate image with DALL-E
   */
  generate: (prompt: string, size: string = '1024x1024') =>
    apiClient.post('/images/generate', {
      prompt,
      size,
    }),

  /**
   * Edit image
   */
  edit: (imageFile: File, mask: File, prompt: string) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('mask', mask);
    formData.append('prompt', prompt);
    return apiClient.post('/images/edit', formData);
  },
};

/**
 * Voice API endpoints
 */
export const voiceAPI = {
  /**
   * Transcribe audio
   */
  transcribe: (audioFile: File, language?: string) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    if (language) formData.append('language', language);
    return apiClient.post('/voice/transcribe', formData);
  },

  /**
   * Synthesize text to speech
   */
  synthesize: (text: string, voice: string = 'alloy', speed: number = 1) =>
    apiClient.post(
      '/voice/synthesize',
      { text, voice, speed },
      { responseType: 'blob' }
    ),
};

/**
 * Analytics API endpoints
 */
export const analyticsAPI = {
  /**
   * Get usage statistics
   */
  getUsage: (period: 'day' | 'week' | 'month' = 'week') =>
    apiClient.get('/analytics/usage', { params: { period } }),

  /**
   * Get provider statistics
   */
  getProviderStats: () => apiClient.get('/analytics/providers'),

  /**
   * Get cost projection
   */
  getCostProjection: () => apiClient.get('/analytics/cost-projection'),
};

/**
 * Settings API endpoints
 */
export const settingsAPI = {
  /**
   * Get user settings
   */
  getSettings: () => apiClient.get('/settings'),

  /**
   * Update user settings
   */
  updateSettings: (settings: Record<string, any>) =>
    apiClient.put('/settings', settings),

  /**
   * Update theme
   */
  updateTheme: (theme: 'light' | 'dark') =>
    apiClient.put('/settings/theme', { theme }),
};

export default apiClient;