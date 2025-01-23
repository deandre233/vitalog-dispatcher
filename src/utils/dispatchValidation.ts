import type { DispatchFormData } from "@/types/dispatch";

export const validateDispatchForm = (data: Partial<DispatchFormData>): string[] => {
  const errors: string[] = [];

  // Required fields validation
  const requiredFields: (keyof DispatchFormData)[] = [
    "caller_name",
    "caller_phone",
    "pickup_location",
    "dropoff_location",
    "service_type",
    "priority_level"
  ];

  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${field.replace(/_/g, " ")} is required`);
    }
  });

  // Phone number validation
  const phoneFields: (keyof DispatchFormData)[] = [
    "caller_phone",
    "origin_phone",
    "destination_phone"
  ];

  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  phoneFields.forEach(field => {
    if (data[field] && !phoneRegex.test(data[field] as string)) {
      errors.push(`Invalid ${field.replace(/_/g, " ")} format`);
    }
  });

  // Date/time validation
  if (data.activation_type === "later" && !data.activation_datetime) {
    errors.push("Activation datetime is required when scheduling for later");
  }

  if (data.pickup_type === "scheduled" && !data.pickup_time) {
    errors.push("Pickup time is required when scheduling pickup");
  }

  if (data.dropoff_type === "scheduled" && !data.dropoff_time) {
    errors.push("Dropoff time is required when scheduling dropoff");
  }

  // Billing validation
  if (data.is_billable) {
    if (
      !data.bill_to_insurance &&
      !data.bill_to_facility &&
      !data.bill_to_affiliate &&
      !data.bill_to_patient
    ) {
      errors.push("At least one billing option must be selected");
    }

    if (data.bill_to_facility && !data.billing_facility) {
      errors.push("Billing facility must be specified");
    }

    if (data.bill_to_affiliate && !data.billing_affiliate) {
      errors.push("Billing affiliate must be specified");
    }
  }

  return errors;
};

export const validateDispatchAssignment = (
  crewId: string,
  transportRecord: Record<string, unknown>
): string[] => {
  const errors: string[] = [];

  if (!crewId) {
    errors.push("Crew member must be selected");
  }

  if (!transportRecord.dispatch_id) {
    errors.push("Invalid transport record");
  }

  return errors;
};