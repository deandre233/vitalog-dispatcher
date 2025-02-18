
import type { AIInsight } from './ai';

export interface ServiceRequest {
  id: string;
  patient_id: string;
  patient_name?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  request_type: string;
  requested_by: string;
  requested_date: string;
  route: string;
  service_date: string;
  service_type: string;
  trip_type: string;
  notes?: string;
  created_at: string;
  updated_at: string;
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

export interface AuthorizationRecord {
  id: string;
  patient_id: string;
  insurance_id: string;
  authorized_by: string;
  authorization_number: string;
  request_date: string;
  request_type: string;
  requested_by: string;
  requested_date: string;
  route: string;
  service_date: string;
  service_type: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  trip_type: string;
  priority: string;
  notes?: string;
  valid_from: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
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
