import type { Database } from "@/integrations/supabase/types";

type TransportRecord = Database["public"]["Tables"]["transport_records"]["Insert"];

export type ServiceType = 'WC' | 'BLS' | 'ALS' | 'MICU';
export type PriorityLevel = 'Critical' | 'Emergency' | 'Lower acuity' | 'Scheduled';
export type TripType = 'One way' | 'Wait-and-return' | 'Round trip';
export type RecurrenceType = 'Disabled' | 'Daily' | 'Weekly' | 'Monthly';

export type DispatchFormData = Omit<TransportRecord, 'id' | 'created_at' | 'dispatch_id' | 'status'> & {
  caller_name?: string;
  caller_phone?: string;
  patient_name?: string;
  patient_last_name?: string;
  patient_first_name?: string;
  patient_dob?: string;
  service_type: ServiceType;
  priority_level: PriorityLevel;
  trip_type: TripType;
  recurrence_type: RecurrenceType;
  // Location fields
  origin_city?: string;
  origin_state?: string;
  origin_zip?: string;
  origin_county?: string;
  origin_phone?: string;
  destination_city?: string;
  destination_state?: string;
  destination_zip?: string;
  destination_county?: string;
  destination_phone?: string;
  // Billing fields
  is_billable?: boolean;
  requires_pcs?: boolean;
  bill_to_insurance?: boolean;
  bill_to_facility?: boolean;
  billing_facility?: string;
  bill_to_affiliate?: boolean;
  billing_affiliate?: string;
  bill_to_patient?: boolean;
  cash_upfront?: boolean;
  price_quote?: string;
  service_complaint?: string;
  requires_ekg?: boolean;  // Added this field

  // New scheduling fields
  activation_type?: 'now' | 'later';
  activation_datetime?: string;
  pickup_type?: 'asap' | 'scheduled';
  pickup_time?: string;
  precise_pickup?: boolean;
  dropoff_type?: 'asap' | 'scheduled';
  dropoff_time?: string;
  return_activation_datetime?: string;
  return_pickup_time?: string;
  precise_return?: boolean;
};