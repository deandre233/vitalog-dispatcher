export interface TransportRecord {
  id: string;
  patient_id?: string;
  dispatch_id: string;
  pickup_location: string;
  dropoff_location: string;
  transport_date?: string;
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
  dispatch_status?: string;
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
  service_type?: string;
  priority_level?: string;
  trip_type?: string;
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
  ai_recommendations?: Record<string, any>;
  return_activation_time?: string;
  return_pickup_time?: string;
  return_precise_pickup?: boolean;
  completion_time?: string;
  delay_reason?: string;
  mileage?: number;
  route_data?: Record<string, any>;
  weather_conditions?: string;
  traffic_conditions?: Record<string, any>;
}