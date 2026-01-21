import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Task Management App!</h1>
      <p className="text-lg mb-8">Your solution for efficient task tracking and productivity.</p>
      <div className="space-x-4">
        <Link href="/login" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Login
        </Link>
        <Link href="/signup" className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
