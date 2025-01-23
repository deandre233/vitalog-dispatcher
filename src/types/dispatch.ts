export type PriorityLevel = "Critical" | "Emergency" | "Lower acuity" | "Scheduled";
export type ServiceType = "WC" | "BLS" | "ALS" | "MICU";
export type TripType = "One way" | "Wait-and-return" | "Round trip";
export type RecurrenceType = "Disabled" | "Daily" | "Weekly" | "Monthly";
export type DispatchStatus = "Pending" | "In Progress" | "Completed" | "Canceled";

export interface DispatchAssignment {
  id: string;
  transport_id: string;
  crew_member_id: string;
  assignment_time: string;
  unassignment_time?: string;
  assignment_reason?: string;
  created_at: string;
  updated_at: string;
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
  created_at?: string;
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
  dispatch_status?: DispatchStatus;
  route_data?: Record<string, unknown>;
  traffic_conditions?: Record<string, unknown>;
}