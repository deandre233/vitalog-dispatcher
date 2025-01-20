export type ServiceType = 'WC' | 'BLS' | 'ALS' | 'MICU';
export type PriorityLevel = 'Critical' | 'Emergency' | 'Lower acuity' | 'Scheduled';
export type TripType = 'One way' | 'Wait-and-return' | 'Round trip';
export type RecurrenceType = 'Disabled' | 'Daily' | 'Weekly' | 'Monthly';

export interface DispatchFormData {
  // Caller Information
  caller_name: string;
  caller_phone: string;

  // Patient Information
  patient_id?: string;
  patient_name?: string;

  // Pickup Location
  pickup_location: string;
  origin_floor_room?: string;
  origin_type?: string;
  origin_address?: string;

  // Dropoff Location
  dropoff_location: string;
  destination_floor_room?: string;
  destination_type?: string;
  destination_address?: string;
  reason_for_destination?: string;

  // Service Details
  service_type: ServiceType;
  priority_level: PriorityLevel;
  trip_type: TripType;

  // Scheduling
  transport_date: string;
  scheduled_time?: string;
  recurrence_type: RecurrenceType;
  recurrence_end_date?: string;
  recurrence_times?: number;

  // Special Requirements
  requires_bcs: boolean;
  requires_o2: boolean;
  requires_ventilator: boolean;
  requires_isolation: boolean;
  requires_bariatric: boolean;
  requires_isolation_type?: string;

  // Patient Conditions
  breathing_problem: boolean;
  confined_to_bed: boolean;
  behavioral_illness: boolean;
  unstable_impaired: boolean;
  physically_impaired: boolean;
  hearing_impaired: boolean;
  sight_impaired: boolean;
  speech_impaired: boolean;
  dnr_order: boolean;
  language_barrier: boolean;
  fresh_prepared: boolean;

  // Notes
  billing_notes?: string;
  dispatcher_notes?: string;
  prior_auth_number?: string;
}