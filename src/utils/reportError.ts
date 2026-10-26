/**
 * For errors the app recovers from by itself (storage, cloud sync, session).
 * The user is not interrupted, but the error is still visible in the development logs.
 */
export function reportError(context: string, error: unknown): void {
  if (__DEV__) console.warn(`[${context}]`, error);
}
