import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cognivo AI - Multi-Model Chat Platform',
  description:
    'Chat with OpenAI GPT-4, Google Gemini, and Anthropic Claude. AI-powered conversations, image generation, and voice processing all in one place.',
  keywords: [
    'AI Chat',
    'ChatGPT',
    'Gemini',
    'Claude',
    'Multi-Model AI',
    'Image Generation',
  ],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Cognivo AI',
    description: 'Multi-Model AI Chat Platform',
    url: 'https://cognivo-ai.com',
    siteName: 'Cognivo AI',
    images: [
      {
        url: 'https://cognivo-ai.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen`}
      >
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}