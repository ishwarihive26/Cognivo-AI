'use client';

import { useState } from 'react';
import { imageAPI } from '@/lib/api';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await imageAPI.generate(prompt);
      setImageUrl(response.data.imageUrl);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Image Generator</h2>

      <form onSubmit={handleGenerate} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          rows={4}
        />

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt="Generated" className="w-full rounded-lg" />
          <a
            href={imageUrl}
            download
            className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}