'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/lib/store';

export default function SettingsPage() {
  const [reminderTime, setReminderTime] = useState('09:00');
  const [isSaving, setIsSaving] = useState(false);
  const { token } = useAuthStore();

  // For simplicity, we'll use a hardcoded projectId.
  const projectId = 'your-first-project-id';

  const handleSaveReminder = async () => {
    setIsSaving(true);
    // Create a cron-like schedule for tomorrow at the specified time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hours, minutes] = reminderTime.split(':');
    tomorrow.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/reminders`,
        { projectId, schedule: tomorrow.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert('Reminder set!');
    } catch (error) {
      console.error('Failed to set reminder', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <p className="text-gray-600 mb-4">
            Set a daily reminder to write in your journal.
          </p>
          <div className="flex items-center gap-4">
            <label htmlFor="reminder-time" className="font-medium">
              Daily at:
            </label>
            <input
              id="reminder-time"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm p-2"
            />
            <button
              onClick={handleSaveReminder}
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isSaving ? 'Saving...' : 'Save Reminder'}
            </button>
          </div>
        </div>
        {/* Add other settings sections here, like Privacy, Account, etc. */}
      </div>
    </div>
  );
}