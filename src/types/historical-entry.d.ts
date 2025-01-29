export interface BackdatedDispatchFormData {
  // Origin Information
  origin_name: string;
  origin_floor_room: string;
  origin_type: string;
  origin_address: string;
  origin_city: string;
  origin_state: string;
  origin_zip: string;
  origin_county: string;
  origin_phone: string;

  // Destination Information
  destination_name: string;
  destination_floor_room: string;
  destination_type: string;
  destination_address: string;
  destination_city: string;
  destination_state: string;
  destination_zip: string;
  destination_county: string;
  destination_phone: string;

  // Patient Information
  patient_last_name: string;
  patient_dob: string;
  patient_id: string;

  // Service Information
  service_type: "WC" | "BLS" | "ALS" | "MICU";
  complaint_type: string;
  priority: "Critical" | "Emergency" | "Lower acuity" | "Scheduled";
  
  // Schedule Information
  activation_time: string;
  pickup_time: string;
  dropoff_time: string;
  trip_type: "One way" | "Wait-and-return";
  
  // Additional Information
  requires_o2: boolean;
  requires_isolation: boolean;
  requires_bariatric: boolean;
  requires_ventilator: boolean;
  
  // Notes
  dispatcher_notes: string;
  billing_notes: string;
}