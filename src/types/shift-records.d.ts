import type { Json } from "@/integrations/supabase/types";

export interface ShiftRecord {
  id: string;
  employee_id: string | null;
  shift_date: string;
  shift_type: string;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  uuid: string;
  ai_analysis: Json | null;
  performance_metrics: Json | null;
  safety_score: number | null;
  fatigue_indicators: string[] | null;
  shift_pattern_analysis: string | null;
  compliance_status: string;
  vehicle_id: string | null;
  starting_odometer: number | null;
  ending_odometer: number | null;
  distance: number | null;
  primary_checklist_completed: boolean;
  secondary_checklist_completed: boolean;
  employees?: {
    first_name: string;
    last_name: string;
  };
}

export interface ShiftFilter {
  startDate?: Date;
  endDate?: Date;
  vehicle?: string;
  station?: string;
}