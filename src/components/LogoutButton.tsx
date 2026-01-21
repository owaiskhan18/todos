"use client";

import { useRouter } from 'next/navigation';
import { logoutUser } from '../services/auth';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  );
}
