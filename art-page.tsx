'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/lib/store';

export default function ArtPage() {
  const [prompt, setPrompt] = useState(
    'A magical forest at twilight, fantasy style',
  );
  const [covers, setCovers] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { token } = useAuthStore();

  // For simplicity, we'll use a hardcoded projectId.
  const projectId = 'your-first-project-id';

  const fetchCovers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/cover`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCovers(response.data);
    } catch (error) {
      console.error('Failed to fetch covers', error);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/cover/generate`,
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Poll for new covers
      setTimeout(fetchCovers, 5000);
    } catch (error) {
      console.error('Failed to generate cover', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = async (coverId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/cover/${coverId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert('Cover applied to project!');
    } catch (error) {
      console.error('Failed to apply cover', error);
    }
  };

  useEffect(() => {
    fetchCovers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Cover Art Studio</h1>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700">Prompt</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isGenerating ? 'Generating...' : 'Generate Cover'}
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Generated Covers</h2>
        <div className="grid grid-cols-3 gap-4">
          {covers.map((cover) => (
            <div key={cover.id} className="border rounded-lg p-2">
              {cover.s3Url ? (
                <img
                  src={cover.s3Url}
                  alt="Generated cover"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Processing...</span>
                </div>
              )}
              <button
                onClick={() => handleApply(cover.id)}
                className="mt-2 w-full px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}