export interface ShiftRecord {
  id: string;
  station: string;
  start_time: string;
  end_time: string;
  hours: number;
  trips: number;
  callsign: string;
  service: string;
  crew_members: string[];
  starting_odometer?: number;
  ending_odometer?: number;
  distance?: number;
  primary_checklist_completed: boolean;
  secondary_checklist_completed: boolean;
  vehicle_id?: string;
  status: 'active' | 'completed' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface ShiftFilter {
  startDate?: Date;
  endDate?: Date;
  vehicle?: string;
  station?: string;
  crewMember?: string;
  status?: string;
}