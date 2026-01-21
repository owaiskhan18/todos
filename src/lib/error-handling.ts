// Placeholder for frontend error handling utility
// In a real application, this might integrate with a toast library (e.g., react-toastify)
// or a custom alert component.

export function displayFrontendError(message: string, type: 'error' | 'warning' | 'info' = 'error'): void {
  console.error(`Frontend ${type.toUpperCase()} - ${message}`);
  // For now, we'll use a simple alert, but this would be replaced by a more robust UI notification
  alert(`${type.toUpperCase()}: ${message}`);
}

export function handleApiError(error: any): string {
  if (error instanceof Error) {
    // Attempt to parse API error messages for better user feedback
    try {
      const errorDetail = JSON.parse(error.message);
      if (errorDetail.detail) {
        return errorDetail.detail;
      }
    } catch (e) {
      // Not a JSON error message, use raw message
    }
    return error.message;
  }
  return 'An unknown error occurred.';
}
