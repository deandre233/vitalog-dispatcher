export interface ServiceRequest {
  id: string;
  requestType: string;
  patientId: string;
  patientName: string;
  requestedBy: string;
  requestedDate: string;
  serviceDate: string;
  scheduledTime: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'inProgress' | 'completed';
  tripType: string;
  service: string;
  route: string;
  notes?: string;
}

export interface QueueMetrics {
  activeRequests: number;
  avgResponseTime: string;
  completionRate: number;
  predictedLoad: number;
  efficiency: number;
}

export interface AIInsight {
  type: 'optimization' | 'warning' | 'prediction';
  message: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
}