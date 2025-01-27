export type AuthorizationStatus = 'pending' | 'approved' | 'denied' | 'expired' | 'active';

export interface AuthorizationRequest {
  id: string;
  patient_id: string;
  service_type: string;
  status: AuthorizationStatus;
  insurance_id: string;
  requested_by: string;
  authorized_by: string | null;
  authorization_number: string | null;
  valid_from: string | null;
  valid_until: string | null;
  priority: string;
  created_at: string;
  updated_at: string;
  destination_type?: string;
  patients?: {
    first_name: string;
    last_name: string;
  };
  insurance_records?: {
    carrier_name: string;
    policy_number: string;
  };
}

export interface AuthMetrics {
  pendingCount: number;
  approvalRate: number;
  averageResponseTime: string;
  criticalRequests: number;
}

export interface AIRecommendation {
  confidence: number;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  reasoning: string;
}