const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  owner_id: number;
}

interface TaskCreateData {
  title: string;
  description?: string;
}

interface TaskUpdateData {
  title?: string;
  description?: string;
  completed?: boolean;
}

async function fetchWithAuth(url: string, options?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('accessToken'); // Assuming token is stored in localStorage
  const headers = {
    ...options?.headers,
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'API request failed');
  }
  return response;
}

export async function createTask(userId: number, title: string, description?: string): Promise<Task> {
  const response = await fetchWithAuth(`${API_URL}/users/${userId}/tasks`, {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });
  return response.json();
}

export async function getTasks(userId: number): Promise<Task[]> {
  const response = await fetchWithAuth(`${API_URL}/users/${userId}/tasks`);
  return response.json();
}

export async function getTask(userId: number, taskId: number): Promise<Task> {
  const response = await fetchWithAuth(`${API_URL}/users/${userId}/tasks/${taskId}`);
  return response.json();
}

export async function updateTask(userId: number, taskId: number, data: TaskUpdateData): Promise<Task> {
  const response = await fetchWithAuth(`${API_URL}/users/${userId}/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function toggleTaskCompletion(userId: number, taskId: number): Promise<Task> {
  const response = await fetchWithAuth(`${API_URL}/users/${userId}/tasks/${taskId}/complete`, {
    method: 'PATCH',
  });
  return response.json();
}

export async function deleteTask(userId: number, taskId: number): Promise<void> {
  await fetchWithAuth(`${API_URL}/users/${userId}/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
