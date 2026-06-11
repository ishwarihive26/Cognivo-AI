import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cognivo AI
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Chat with the world's most advanced AI models in one beautiful platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-xl font-bold mb-2">OpenAI GPT-4</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              State-of-the-art language model for any task
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold mb-2">Google Gemini</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Fast and efficient responses
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="text-4xl mb-3">🧠</div>
            <h3 className="text-xl font-bold mb-2">Claude 3</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Detailed and thoughtful responses
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-12 text-sm text-slate-600 dark:text-slate-400">
          <p className="mb-3">✨ Plus: Image Generation • 🎤 Voice Processing • 📊 Analytics</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
          <p>Open source • MIT License • Built with Next.js + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}