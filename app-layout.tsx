import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">ChronoMuse</h1>
        </div>
        <nav className="mt-6">
          <Link
            href="/dashboard"
            className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/journal"
            className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            Journal
          </Link>
          <Link
            href="/compose"
            className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            Compose
          </Link>
          <Link
            href="/art"
            className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            Art Studio
          </Link>
          <Link
            href="/settings"
            className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <p className="text-sm text-gray-600">{user?.name}</p>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}