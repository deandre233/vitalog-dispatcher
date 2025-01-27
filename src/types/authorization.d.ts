import { Database } from "@/integrations/supabase/types";

export type AuthorizationStatus = "pending" | "approved" | "rejected" | "expired";
export type PriorityLevel = "critical" | "high" | "medium" | "low";

export interface AuthorizationRequest {
  id: string;
  patient_id: string;
  service_type: string;
  status: AuthorizationStatus;
  priority: PriorityLevel;
  requested_by: string;
  created_at: string;
  valid_from?: string;
  valid_until?: string;
  authorization_number?: string;
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
  impact: "high" | "medium" | "low";
  reasoning: string;
}