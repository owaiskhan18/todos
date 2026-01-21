'use client';

import { useState, useEffect } from 'react';

interface TaskFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialCompleted?: boolean; // New prop
  onSubmit: (title: string, description?: string, completed?: boolean) => Promise<void>; // Updated onSubmit signature
  isEditMode?: boolean;
}

export default function TaskForm({
  initialTitle = '',
  initialDescription = '',
  initialCompleted = false, // Default value for new prop
  onSubmit,
  isEditMode = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [completed, setCompleted] = useState(initialCompleted); // New state for completed status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setCompleted(initialCompleted); // Update completed state on initialCompleted change
  }, [initialTitle, initialDescription, initialCompleted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!title.trim()) {
      setError('Task title cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(title, description, isEditMode ? completed : undefined); // Pass completed only in edit mode
      if (!isEditMode) {
        setTitle('');
        setDescription('');
        setCompleted(false); // Reset completed status for new tasks
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
          Task Title:
        </label>
        <input
          type="text"
          id="title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
          Description (Optional):
        </label>
        <textarea
          id="description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      {isEditMode && ( // Show completed checkbox only in edit mode
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
            Completed
          </label>
        </div>
      )}
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Task' : 'Create Task')}
        </button>
      </div>
    </form>
  );
}
