'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/lib/store';

export default function JournalPage() {
  const [title, setTitle] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      // Autosave logic could go here
    },
  });

  // For simplicity, we'll use a hardcoded projectId.
  // In a real app, you'd get this from the URL or a global context.
  const projectId = 'your-first-project-id';

  const fetchEntries = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/entries`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch entries', error);
    }
  };

  const handleSave = async () => {
    if (!editor) return;
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/entries`,
        {
          title,
          body: editor.getHTML(),
          moodTag: 'reflective', // Add a mood picker later
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTitle('');
      editor.commands.clearContent();
      fetchEntries(); // Refresh the list
    } catch (error) {
      console.error('Failed to save entry', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="flex gap-8 h-full">
      {/* Entry List */}
      <div className="w-1/3 bg-white p-4 rounded-lg shadow overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">My Entries</h2>
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-3 border-b hover:bg-gray-50 cursor-pointer"
          >
            <h3 className="font-semibold">{entry.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry Title"
          className="w-full text-2xl font-bold mb-4 p-2 border-b-2 border-gray-200 focus:border-indigo-500 outline-none"
        />
        <EditorContent
          editor={editor}
          className="prose max-w-none min-h-[400px]"
        />
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </div>
  );
}