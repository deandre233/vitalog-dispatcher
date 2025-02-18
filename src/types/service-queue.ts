
import type { AIInsight } from './ai';

export interface ServiceRequest {
  id: string;
  patientName: string;
  serviceDate?: string;
  requestTime: string;
  estimatedCompletion: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  tripType?: string;
  route?: string;
  serviceType?: string;
  notes?: string;
}

export interface QueueMetrics {
  totalRequests: number;
  activeRequests: number;
  avgResponseTime: string;
  completionRate: number;
  efficiency: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface ServiceQueueStats {
  totalRequests: number;
  completedToday: number;
  averageWaitTime: string;
  insights: AIInsight[];
}

export interface AuthorizationRequest {
  id: string;
  patient_id: string;
  insurance_id: string;
  authorized_by: string;
  authorization_number: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  valid_from: string;
  valid_until: string;
  priority: string;
  service_type: string;
  requested_by: string;
  created_at: string;
  updated_at: string;
}

export { type AIInsight };
