import { toast } from "sonner";
import { ERROR_MESSAGES } from "@/config/constants";

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  console.error('Error:', error);
  
  if (error instanceof AppError) {
    toast.error(error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message || ERROR_MESSAGES.GENERIC);
    return;
  }

  toast.error(ERROR_MESSAGES.GENERIC);
};

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};