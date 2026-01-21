'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTasks, toggleTaskCompletion, deleteTask } from '@/services/tasks';
import { getUserIdFromToken, logoutUser } from '@/lib/auth';
import TaskList from '@/components/task-list'; // Assuming TaskList component exists

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  owner_id: number;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      logoutUser();
      router.push('/login');
      return;
    }
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await getTasks(userId as number);
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
      if (err.message.includes('Unauthorized')) {
        logoutUser();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompletion = async (taskId: number) => {
    try {
      await toggleTaskCompletion(userId as number, taskId);
      fetchTasks(); // Refresh tasks after update
    } catch (err: any) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(userId as number, taskId);
      fetchTasks(); // Refresh tasks after deletion
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading tasks...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      <div className="flex justify-end mb-4">
        <Link href="/tasks/create" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Create New Task
        </Link>
      </div>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-600">You have no tasks. Start by creating one!</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleCompletion={handleToggleCompletion}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}
