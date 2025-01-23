import { Json } from '@/integrations/supabase/types';

export interface DispatchFormData {
  pickup_location: string;
  dropoff_location: string;
  scheduled_time?: string;
  patient_id?: string;
  transport_type?: string;
  priority_level?: "Critical" | "Emergency" | "Lower acuity" | "Scheduled";
  notes?: string;
  service_type: "WC" | "BLS" | "ALS" | "MICU";
  caller_name?: string;
  caller_phone?: string;
  trip_type: "One way" | "Wait-and-return" | "Round trip";
  origin_floor_room?: string;
  origin_type?: string;
  origin_address?: string;
  origin_city?: string;
  origin_state?: string;
  origin_zip?: string;
  origin_county?: string;
  origin_phone?: string;
  destination_floor_room?: string;
  destination_type?: string;
  destination_address?: string;
  destination_city?: string;
  destination_state?: string;
  destination_zip?: string;
  destination_county?: string;
  destination_phone?: string;
  activation_type: "now" | "later";
  activation_datetime?: string;
  pickup_type: "asap" | "scheduled";
  pickup_time?: string;
  dropoff_type: "asap" | "scheduled";
  dropoff_time?: string;
  requires_ekg: boolean;
  requires_o2: boolean;
  requires_ventilator: boolean;
  requires_isolation: boolean;
  requires_bariatric: boolean;
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
  precise_pickup: boolean;
  is_billable: boolean;
  requires_pcs: boolean;
  bill_to_insurance: boolean;
  bill_to_facility: boolean;
  billing_facility?: string;
  bill_to_affiliate: boolean;
  billing_affiliate?: string;
  bill_to_patient: boolean;
  cash_upfront: boolean;
  price_quote?: string;
  service_complaint?: string;
  dispatcher_notes?: string;
  billing_notes?: string;
}

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
  route_data?: Json;
  traffic_conditions?: Json;
  [key: string]: any; // Allow additional properties from database
}

export interface DispatchAssignment {
  id: string;
  transport_id: string;
  crew_member_id: string;
  assignment_time: string;
  unassignment_time?: string;
  assignment_reason?: string;
}

export interface SearchableItem {
  id: string;
  [key: string]: any;
}