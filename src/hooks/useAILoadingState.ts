import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useAILoadingState(feature: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleOperation = useCallback(async <T,>(
    operation: () => Promise<T>,
    fallback: T
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      toast.error(`AI ${feature} temporarily unavailable`, {
        description: "Using fallback options"
      });
      return fallback;
    } finally {
      setIsLoading(false);
    }
  }, [feature]);

  return {
    isLoading,
    error,
    handleOperation
  };
}