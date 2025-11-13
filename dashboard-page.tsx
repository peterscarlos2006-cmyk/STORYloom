'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  genre: string;
  startDate: string;
  endDate: string;
  _count: { journalEntries: number };
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({ totalWords: 0, streak: 0 });
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/projects`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setProjects(response.data);
        // Calculate simple stats
        const totalWords = response.data.reduce(
          (acc: number, p: any) => acc + (p._count?.journalEntries || 0) * 250,
          0,
        ); // Avg 250 words/entry
        setStats({ totalWords, streak: 5 }); // Placeholder streak
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active Projects</h3>
          <p className="text-3xl font-bold text-indigo-600">{projects.length}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Words Written</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalWords.toLocaleString()}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Current Streak</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.streak} days</p>
        </div>
      </div>

      {/* Project List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
        {projects.length > 0 ? (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-gray-600">
                    {project.genre} • {project._count.journalEntries} entries
                  </p>
                </div>
                <Link href={`/journal?projectId=${project.id}`}>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Open Journal
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No projects yet.{' '}
            <Link href="/onboarding" className="text-indigo-600 hover:underline">
              Create your first one!
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}