import { Database } from "@/integrations/supabase/types";

export type AuthorizationStatus = "pending" | "approved" | "rejected" | "expired";
export type PriorityLevel = "critical" | "high" | "medium" | "low";

export interface AuthorizationRequest {
  id: string;
  patientId: string;
  serviceType: string;
  status: AuthorizationStatus;
  priority: PriorityLevel;
  requestedBy: string;
  requestedAt: string;
  expiresAt?: string;
  notes?: string;
  patient?: {
    firstName: string;
    lastName: string;
  };
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
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