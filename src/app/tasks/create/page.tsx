'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm from '@/components/task-form';
import { createTask } from '@/services/tasks';
import { getUserIdFromToken, logoutUser } from '@/lib/auth';

export default function CreateTaskPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const user = getUserIdFromToken();
    if (!user) {
      logoutUser();
      router.push('/login');
    } else {
      setCurrentUserId(user);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!currentUserId) {
    return null; // Should redirect by useEffect
  }

  const handleSubmit = async (title: string, description?: string) => {
    setError(null);
    try {
      if (!currentUserId) {
        // This case should ideally not be reached due to the above checks
        setError('User not authenticated.');
        logoutUser();
        router.push('/login');
        return;
      }
      await createTask(currentUserId, title, description);
      router.push('/tasks'); // Redirect to task list after creation
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      if (err.message.includes('Unauthorized')) {
        logoutUser();
        router.push('/login');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <TaskForm onSubmit={handleSubmit} />
    </div>
  );
}
