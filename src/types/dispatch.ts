export type PriorityLevel = "Critical" | "Emergency" | "Lower acuity" | "Scheduled";
export type ServiceType = "WC" | "BLS" | "ALS" | "MICU";
export type TripType = "One way" | "Wait-and-return" | "Round trip";
export type RecurrenceType = "Disabled" | "Daily" | "Weekly" | "Monthly";

export interface DispatchFormData {
  caller_name: string;
  caller_phone: string;
  patient_name: string;
  pickup_location: string;
  dropoff_location: string;
  service_type: ServiceType;
  priority_level: PriorityLevel;
  trip_type: TripType;
  recurrence_type: RecurrenceType;
  
  patient_last_name: string;
  patient_first_name: string;
  patient_dob: string;
  patient_id?: string;

  origin_floor_room: string;
  origin_type: string;
  origin_address: string;
  origin_city: string;
  origin_state: string;
  origin_zip: string;
  origin_county: string;
  origin_phone: string;
  
  destination_floor_room: string;
  destination_type: string;
  destination_address: string;
  destination_city: string;
  destination_state: string;
  destination_zip: string;
  destination_county: string;
  destination_phone: string;

  activation_type: "now" | "later";
  activation_datetime?: string;
  pickup_type: "asap" | "scheduled";
  pickup_time?: string;
  precise_pickup: boolean;
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

  is_billable: boolean;
  requires_pcs: boolean;
  bill_to_insurance: boolean;
  bill_to_facility: boolean;
  billing_facility: string;
  bill_to_affiliate: boolean;
  billing_affiliate: string;
  bill_to_patient: boolean;
  cash_upfront: boolean;
  price_quote: string;
  service_complaint: string;
  
  dispatcher_notes: string;
  billing_notes: string;
}
