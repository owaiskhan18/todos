'use client';

import Link from 'next/link';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  owner_id: number;
}

interface TaskListProps {
  tasks: Task[];
  onToggleCompletion: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export default function TaskList({ tasks, onToggleCompletion, onDeleteTask }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleCompletion(task.id)}
              className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <div>
              <Link href={`/tasks/edit/${task.id}`} className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </Link>
              {task.description && (
                <p className={`text-sm text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={`/tasks/edit/${task.id}`}
              className="text-indigo-600 hover:text-indigo-900 text-sm"
            >
              Edit
            </Link>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-red-600 hover:text-red-900 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
