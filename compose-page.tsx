'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/lib/store';

export default function ComposePage() {
  const [compilation, setCompilation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState('');
  const [outline, setOutline] = useState<any[]>([]);
  const { token } = useAuthStore();

  // For simplicity, we'll use a hardcoded projectId.
  const projectId = 'your-first-project-id';

  const handleGenerate = async () => {
    setIsLoading(true);
    setCompilation(null);
    setStory('');
    setOutline([]);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/compilations`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCompilation(response.data);
    } catch (error) {
      console.error('Failed to start compilation', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling effect to check job status
  useEffect(() => {
    if (!compilation || compilation.status === 'done' || compilation.status === 'failed') {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/compilations/${compilation.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setCompilation(response.data);

        if (response.data.outline) {
          setOutline(response.data.outline);
        }

        if (response.data.status === 'done' && response.data.resultUrl) {
          // Decode the base64 data URL
          const base64Content = response.data.resultUrl.split(',')[1];
          setStory(atob(base64Content));
        }
      } catch (error) {
        console.error('Failed to poll status', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId);
  }, [compilation, token, projectId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Story Composer</h1>

      <button
        onClick={handleGenerate}
        disabled={
          isLoading ||
          (compilation && compilation.status !== 'done' && compilation.status !== 'failed')
        }
        className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Starting...' : 'Generate Story'}
      </button>

      {compilation && (
        <div className="mb-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Compilation Status</h2>
          <p className="text-lg">
            Status:{' '}
            <span className="font-bold capitalize">{compilation.status}</span>
          </p>
          {compilation.status === 'processing' && <div className="spinner"></div>}
        </div>
      )}

      {outline.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Story Outline</h2>
          <ol className="list-decimal list-inside space-y-2">
            {outline.map((chapter, index) => (
              <li key={index}>
                <h3 className="font-semibold">{chapter.title}</h3>
                <p className="text-gray-600">{chapter.summary}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {story && (
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-4">Your Generated Story</h2>
          <div
            dangerouslySetInnerHTML={{ __html: story.replace(/\n/g, '<br />') }}
          />
        </div>
      )}
    </div>
  );
}