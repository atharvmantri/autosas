'use client';

import { useState } from 'react';

export default function ServicePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      setOutput(data.output || 'Service output will appear here.');
    } catch {
      setOutput('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Use the Service</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
          <label className="block text-sm font-medium mb-2">Input</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="Enter your input..."
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        {output && (
          <div className="bg-white p-6 rounded-xl shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4">Output</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{output}</p>
          </div>
        )}
      </div>
    </div>
  );
}
