
export interface DispatchViewState {
  activeTab: 'active' | 'schedule' | 'calendar';
  activeView: 'list' | 'map' | 'calendar';
  selectedDate?: Date | null;
  filterStatus?: string[];
}

export interface TransportRequest {
  id: string;
  priority_level: 'emergency' | 'non_emergency' | 'scheduled';
  patient_id?: string;
  pickup_location: string;
  dropoff_location: string;
  requested_time: string;
  scheduled_time?: string;
  ai_recommendations: {
    efficiency_score?: number;
    compliance_score?: number;
    risk_factors?: string[];
    recommendations?: string[];
  };
  status: 'pending' | 'en_route' | 'on_scene' | 'transporting' | 'completed' | 'cancelled';
  crew_assignments: Array<{
    crew_id: string;
    assigned_at: string;
    role: string;
  }>;
}

export interface PCRRecord {
  id: string;
  transport_id: string;
  patient_id?: string;
  crew_id?: string;
  chief_complaint?: string;
  vital_signs: Array<{
    type: string;
    value: string;
    timestamp: string;
  }>;
  medications_given: Array<{
    medication: string;
    dosage: string;
    timestamp: string;
  }>;
  procedures_performed: Array<{
    procedure: string;
    timestamp: string;
    notes?: string;
  }>;
  narrative?: string;
  qa_status: 'draft' | 'pending_qa' | 'qa_flagged' | 'approved' | 'submitted';
  qa_notes: Array<{
    note: string;
    timestamp: string;
    author: string;
  }>;
}

export interface BillingRecord {
  id: string;
  pcr_id: string;
  patient_id?: string;
  transport_id: string;
  billing_codes: Array<{
    code: string;
    description: string;
    amount: number;
  }>;
  insurance_verification: {
    status: string;
    verified_at?: string;
    coverage_details?: any;
  };
  claim_status: 'pending' | 'submitted' | 'approved' | 'denied' | 'resubmitted' | 'paid';
  amount_billed: number;
  amount_paid: number;
}

export interface AIAnalysisResult {
  id: string;
  transport_id: string;
  pcr_id?: string;
  analysis_type: string;
  analysis_data: Record<string, any>;
  recommendations: Record<string, any>;
  confidence_score: number;
  created_at: string;
}

// Common interfaces
export interface SearchableItem {
  id: string;
  [key: string]: any;
}
