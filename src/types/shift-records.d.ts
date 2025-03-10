export interface ShiftFilter {
  startDate?: Date;
  endDate?: Date;
  vehicle?: string;
  station?: string;
}

export interface ShiftRecord {
  id: string;
  employee_id?: string;
  shift_date: string;
  shift_type: string;
  start_time?: string;
  end_time?: string;
  checklist_completed?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  ai_analysis?: Record<string, any>;
  performance_metrics?: Record<string, any>;
  safety_score?: number;
  fatigue_indicators?: string[];
  shift_pattern_analysis?: string;
  compliance_status?: string;
  vehicle_id?: string;
  starting_odometer?: number;
  ending_odometer?: number;
  distance?: number;
  primary_checklist_completed?: boolean;
  secondary_checklist_completed?: boolean;
  employees?: {
    first_name: string;
    last_name: string;
  };
}