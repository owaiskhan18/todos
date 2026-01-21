const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export async function signupUser(email: string, password: string): Promise<void> {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Signup failed');
  }

  // Optionally, log in the user immediately after signup
  // const authResponse: AuthResponse = await response.json();
  // localStorage.setItem('accessToken', authResponse.access_token);
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const formBody = new URLSearchParams();
  formBody.append('username', email);
  formBody.append('password', password);

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  const authResponse: AuthResponse = await response.json();
  localStorage.setItem('accessToken', authResponse.access_token);
  return authResponse;
}

export function getAccessToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
}