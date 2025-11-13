'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function OnboardingPage() {
  const [title, setTitle] = useState('My First Novel');
  const [genre, setGenre] = useState('Fantasy');
  const [styleInspiration, setStyleInspiration] = useState('The Lord of the Rings');
  const [journalingPeriod, setJournalingPeriod] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { token } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/projects`,
        {
          title,
          genre,
          styleInspiration,
          journalingPeriod,
          startDate: new Date().toISOString().split('T')[0], // Today's date
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      router.push('/dashboard'); // Redirect to dashboard after creation
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Let's Start Your Story
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Title"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre (e.g., Fantasy, Sci-Fi)"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              value={styleInspiration}
              onChange={(e) => setStyleInspiration(e.target.value)}
              placeholder="Style Inspiration (e.g., J.R.R. Tolkien)"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              value={journalingPeriod}
              onChange={(e) => setJournalingPeriod(Number(e.target.value))}
              placeholder="Journaling Period (days)"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
}