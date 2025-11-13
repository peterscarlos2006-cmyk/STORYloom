import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">ChronoMuse</h1>
      <p className="text-xl text-gray-700 mb-8">
        Transform your journal into a story.
      </p>
      <div className="space-x-4">
        <Link
          href="/signup"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
        >
          Login
        </Link>
      </div>
    </main>
  );
}