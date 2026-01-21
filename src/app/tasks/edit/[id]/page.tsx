'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TaskForm from '@/components/task-form';
import { getTask, updateTask } from '@/services/tasks';
import { getAccessToken, logoutUser, getUserIdFromToken } from '@/lib/auth';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id ? parseInt(params.id as string) : null;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = getUserIdFromToken();


  useEffect(() => {
    // Check for token on initial load
    if (!getAccessToken() || !userId) {
      logoutUser();
      router.push('/login');
      return;
    }

    if (taskId) {
      fetchTask();
    } else {
      setError('Task ID is missing.');
      setLoading(false);
    }
  }, [taskId, userId]);

  const fetchTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTask(userId as number, taskId as number);
      setTask(data);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('Unauthorized')) {
        logoutUser();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (title: string, description?: string, completed?: boolean) => {
    setError(null);
    try {
      await updateTask(userId as number, taskId as number, { title, description, completed });
      router.push('/tasks'); // Redirect to task list after update
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('Unauthorized')) {
        logoutUser();
        router.push('/login');
      }
    }
  };

  if (loading) return <div className="text-center mt-8">Loading task...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  if (!task) return <div className="text-center mt-8">Task not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <TaskForm
        initialTitle={task.title}
        initialDescription={task.description}
        initialCompleted={task.completed}
        onSubmit={handleSubmit}
        isEditMode={true}
      />
    </div>
  );
}
