import { toast } from "sonner";

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) {
    return maybeError;
  }

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

export function handleError(error: unknown, context: string): void {
  const message = getErrorMessage(error);
  console.error(`Error in ${context}:`, error);
  toast.error(`Error: ${message}`);
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  successMessage?: string
): Promise<T | undefined> {
  try {
    const result = await operation();
    if (successMessage) {
      toast.success(successMessage);
    }
    return result;
  } catch (error) {
    handleError(error, context);
    return undefined;
  }
}

export function createErrorBoundary(componentName: string): (error: Error) => void {
  return (error: Error): void => {
    console.error(`Error in ${componentName}:`, error);
    toast.error(`An error occurred in ${componentName}. Please try again.`);
  };
}