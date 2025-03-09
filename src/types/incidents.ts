
export interface Incident {
  id: string;
  employee_id: string;
  incident_type: string;
  incident_date: string;
  location?: string;
  description: string;
  severity: string;
  witnesses?: string[];
  vehicle_involved: boolean;
  vehicle_id?: string;
  partner_id?: string;
  reported_to?: string;
  followup_required: boolean;
  followup_date?: string;
  status: string;
  resolution?: string;
  ai_analysis?: any;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  shift_id?: string;
  subject?: string;
}

export interface IncidentFormData {
  incident_type: string;
  incident_date: Date;
  location?: string;
  description: string;
  severity: string;
  witnesses?: string[];
  vehicle_involved: boolean;
  vehicle_id?: string;
  partner_id?: string;
  reported_to?: string;
  followup_required: boolean;
  followup_date?: Date;
  shift_id?: string;
  subject?: string;
}

export interface IncidentAnalysisData {
  incidentType: string;
  description: string;
  severity: string;
  vehicleInvolved: boolean;
  shiftData?: any;
  shift_id?: string;
  subject?: string;
}

export interface IncidentAnalysisResult {
  summary: string;
  riskLevel: string;
  recommendedActions: string[];
  similarIncidents: string;
  preventionTips: string[];
}

export type PerformanceWriteUpSubject = 
  | "missed_punch" 
  | "tardiness" 
  | "pcr_quality" 
  | "pcr_completion" 
  | "inservice_attendance" 
  | "protocol_adherence" 
  | "patient_feedback"
  | "teamwork"
  | "overall_performance";

export interface PerformanceWriteUpData {
  employeeId: string;
  employeeName: string;
  subject: PerformanceWriteUpSubject;
  score: number;
  trend: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  departmentAvg: number;
}

export interface PerformanceWriteUpResult {
  content: string;
  severity: "recognition" | "advisory" | "warning" | "critical";
  title: string;
}
