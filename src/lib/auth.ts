import { decodeJwt } from 'jose'; 

const ACCESS_TOKEN_KEY = 'accessToken';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

export function removeAccessToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function getUserIdFromToken(): number | null {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  try {
    const decodedToken: any = decodeJwt(token);
    return decodedToken.sub ? parseInt(decodedToken.sub) : null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

export function logoutUser(): void {
  removeAccessToken();
  // Optionally, redirect to login page here if needed, but it's often handled in component logic
}
