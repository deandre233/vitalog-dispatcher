import type { Database } from "@/integrations/supabase/types";

type TransportRecord = Database["public"]["Tables"]["transport_records"]["Insert"];

export type ServiceType = 'WC' | 'BLS' | 'ALS' | 'MICU';
export type PriorityLevel = 'Critical' | 'Emergency' | 'Lower acuity' | 'Scheduled';
export type TripType = 'One way' | 'Wait-and-return' | 'Round trip';
export type RecurrenceType = 'Disabled' | 'Daily' | 'Weekly' | 'Monthly';

// Update DispatchFormData to include location fields
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
  // Add new location fields
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
};