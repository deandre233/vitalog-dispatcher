
import type { AIInsight } from './ai';

export interface ServiceRequest {
  id: string;
  patientName: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  requestTime: string;
  estimatedCompletion: string;
}

export interface QueueMetrics {
  totalRequests: number;
  activeRequests: number;
  avgResponseTime: string;
  completionRate: number;
  efficiency: number;
}

export interface ServiceQueueItem {
  id: string;
  patientName: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  requestTime: string;
  estimatedCompletion: string;
}

export interface ServiceQueueStats {
  totalRequests: number;
  completedToday: number;
  averageWaitTime: string;
  insights: AIInsight[];
}

export { AIInsight };
