export interface TransportRecord {
  id: string;
  patient_id?: string;
  dispatch_id: string;
  pickup_location: string;
  dropoff_location: string;
  transport_date: string;
  status: string;
  crew_assigned?: string;
  notes?: string;
  created_at: string;
  recurrence_type?: string;
  recurrence_day?: string;
  recurrence_frequency?: string;
  warnings?: string[];
  pickup_type?: string;
  dropoff_type?: string;
  return_trip_id?: string;
  origin_address?: string;
  destination_address?: string;
  scheduled_time?: string;
  dispatch_status?: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
  estimated_arrival?: string;
  actual_arrival?: string;
  vehicle_number?: string;
  transport_type?: string;
  caller_name?: string;
  caller_phone?: string;
  origin_floor_room?: string;
  origin_type?: string;
  destination_floor_room?: string;
  destination_type?: string;
  reason_for_destination?: string;
  service_type?: 'MICU' | 'ALS' | 'BLS';
  priority_level?: 'Critical' | 'Emergency' | 'Lower acuity' | 'Scheduled';
  trip_type?: 'One way' | 'Round trip' | 'Wait-and-return';
  billing_notes?: string;
  dispatcher_notes?: string;
  recurrence_end_date?: string;
  recurrence_times?: number;
  requires_bcs?: boolean;
  requires_o2?: boolean;
  requires_ventilator?: boolean;
  requires_isolation?: boolean;
  requires_bariatric?: boolean;
  breathing_problem?: boolean;
  confined_to_bed?: boolean;
  behavioral_illness?: boolean;
  unstable_impaired?: boolean;
  physically_impaired?: boolean;
  hearing_impaired?: boolean;
  sight_impaired?: boolean;
  speech_impaired?: boolean;
  requires_isolation_type?: string;
  dnr_order?: boolean;
  language_barrier?: boolean;
  fresh_prepared?: boolean;
  prior_auth_number?: string;
  ai_recommendations?: any;
  return_activation_time?: string;
  return_pickup_time?: string;
  return_precise_pickup?: boolean;
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
  activation_type?: string;
  activation_datetime?: string;
  pickup_time?: string;
  dropoff_time?: string;
  precise_pickup?: boolean;
  service_complaint?: string;
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
  requires_ekg?: boolean;
  incidents?: Array<{
    timestamp: string;
    description: string;
    analysis?: {
      recommendation: string;
    };
  }>;
}

export interface DispatchFormData extends TransportRecord {
  patient_first_name?: string;
  patient_last_name?: string;
  patient_dob?: string;
}