'use client';

import { useState } from 'react';

export default function ServicePage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [thread, setThread] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setThread([]);
    try {
      const response = await fetch('/api/generate-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setThread(data.thread || []);
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    const text = thread.join('\n\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Generate a Thread</h1>
        <p className="text-gray-600 mb-8">Paste a YouTube URL and get a ready-to-post Twitter thread.</p>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8">
          <label className="block text-sm font-medium mb-2">YouTube URL</label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="https://youtube.com/watch?v=..."
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating Thread...' : 'Generate Thread'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {thread.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Thread</h2>
              <button
                onClick={copyToClipboard}
                className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Copy All
              </button>
            </div>
            <div className="space-y-4">
              {thread.map((tweet, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                  <span className="text-xs text-gray-500 mb-1 block">Tweet {i + 1}</span>
                  <p className="text-gray-800 whitespace-pre-wrap">{tweet}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
