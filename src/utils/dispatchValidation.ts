import type { DispatchFormData } from '@/types/dispatch';

export function validateDispatchForm(formData: DispatchFormData): string[] {
  const errors: string[] = [];

  // Required fields
  if (!formData.pickup_location) {
    errors.push('Pickup location is required');
  }

  if (!formData.dropoff_location) {
    errors.push('Dropoff location is required');
  }

  // Validate pickup location format (if needed)
  if (formData.pickup_location && typeof formData.pickup_location === 'string') {
    const cleanPickup = formData.pickup_location.replace(/[^a-zA-Z0-9\s]/g, '');
    if (cleanPickup !== formData.pickup_location) {
      errors.push('Pickup location contains invalid characters');
    }
  }

  // Validate dropoff location format (if needed)
  if (formData.dropoff_location && typeof formData.dropoff_location === 'string') {
    const cleanDropoff = formData.dropoff_location.replace(/[^a-zA-Z0-9\s]/g, '');
    if (cleanDropoff !== formData.dropoff_location) {
      errors.push('Dropoff location contains invalid characters');
    }
  }

  return errors;
}