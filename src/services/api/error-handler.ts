
import { handleError } from "@/utils/errorHandling";
import { logger } from './cache-utils';

/**
 * Handles and logs API errors with a consistent pattern
 */
export function handleApiError(error: any, context: string): never {
  logger.error(`Error in ${context}:`, error);
  handleError(error);
  throw error;
}

/**
 * Wraps an API function with consistent error handling
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  context: string
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, context);
    }
  };
}
