import { DispatchFormData } from "@/types/dispatch";

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates dispatch form data
 * @param data - The dispatch form data to validate
 * @returns Array of validation errors, empty if valid
 */
export function validateDispatchForm(data: DispatchFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.pickup_location) {
    errors.push({
      field: 'pickup_location',
      message: 'Pickup location is required'
    });
  }

  if (!data.dropoff_location) {
    errors.push({
      field: 'dropoff_location',
      message: 'Dropoff location is required'
    });
  }

  if (!data.service_type) {
    errors.push({
      field: 'service_type',
      message: 'Service type is required'
    });
  }

  return errors;
}