import { Json } from '@/integrations/supabase/types';

export interface DispatchFormData {
  pickup_location: string;
  dropoff_location: string;
  scheduled_time?: string;
  patient_id?: string;
  transport_type?: string;
  priority_level?: string;
  notes?: string;
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