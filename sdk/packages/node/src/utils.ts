import { CodelaveError } from "./errors";

/**
 * Fetch wrapper that adds network retry logic.
 * Note: Only network failures are retried. HTTP error responses (e.g., 400, 500) are returned immediately.
 */
export async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error: unknown) {
      if (i === retries) {
        throw new CodelaveError(`Network error: ${error instanceof Error ? error.message : String(error)}`);
      }
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new CodelaveError("Unreachable");
}
