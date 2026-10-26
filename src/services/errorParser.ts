import axios from 'axios';

const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

/** Error whose message was written for the user (e.g. "Wrong email or password."). */
export class UserFacingError extends Error {}

/**
 * Turns any error into a friendly message for the user.
 * Technical messages (JSON, storage...) are never shown as they are.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof UserFacingError) return error.message;
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Oops! We couldn't reach the catalog. Check your internet connection.";
    }
    const status = error.response.status;
    if (status === 404) return 'This kitty wandered off. We could not find it.';
    if (status === 401 || status === 403) return 'Access denied (invalid API key).';
    if (status >= 500) return 'The cat server is having trouble. Please try again later.';
  }
  return GENERIC_MESSAGE;
}
