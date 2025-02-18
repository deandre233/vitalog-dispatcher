
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ServiceRequest, QueueMetrics } from '@/types/service-queue';
import type { AIInsight } from '@/types/ai';

interface UseServiceQueueResult {
  requests: ServiceRequest[];
  isLoading: boolean;
  error: Error | null;
  metrics: QueueMetrics;
  aiInsights: AIInsight[];
}

// Define the shape of raw data from Supabase
interface RawServiceRequest {
  id: string;
  patient_id: string;
  patient_name: string | null;
  status: string;
  priority: string;
  request_type: string;
  requested_by: string;
  requested_date: string;
  service_date: string;
  service_type: string;
  trip_type: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  origin: string | null;
  destination: string | null;
  warnings: string[] | null;
}

export const useServiceQueue = (): UseServiceQueueResult => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const { data, error } = await supabase
          .from('service_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedRequests = (data as RawServiceRequest[]).map(item => ({
          id: item.id,
          patient_id: item.patient_id,
          patientName: item.patient_name || 'Unknown',
          status: item.status as 'pending' | 'in-progress' | 'completed',
          priority: item.priority as 'high' | 'medium' | 'low',
          request_type: item.request_type,
          requested_by: item.requested_by,
          requested_date: item.requested_date,
          requestTime: new Date(item.requested_date).toLocaleTimeString(),
          serviceDate: new Date(item.service_date).toLocaleDateString(),
          service_type: item.service_type,
          tripType: item.trip_type,
          notes: item.notes || undefined,
          created_at: item.created_at,
          updated_at: item.updated_at,
          origin: item.origin || undefined,
          destination: item.destination || undefined,
          warnings: item.warnings || undefined
        }));

        setRequests(formattedRequests);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueue();
  }, []);

  const metrics: QueueMetrics = {
    totalRequests: requests.length,
    activeRequests: requests.filter(r => r.status === 'in-progress').length,
    avgResponseTime: '15 minutes',
    completionRate: 85,
    efficiency: 92,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  const aiInsights: AIInsight[] = [
    {
      type: 'optimization',
      message: 'Queue optimization opportunity',
      confidence: 88,
      impact: 'high',
      recommendation: 'Reorder queue based on priority and wait time',
      timeEstimate: '1 hour'
    },
    {
      type: 'warning',
      message: 'High priority requests increasing',
      confidence: 76,
      impact: 'medium',
      recommendation: 'Add additional staff during peak hours',
      timeEstimate: '1 day'
    },
    {
      type: 'prediction',
      message: 'Service bottleneck predicted',
      confidence: 82,
      impact: 'high',
      recommendation: 'Implement express lane for routine requests',
      timeEstimate: '2-3 days'
    }
  ];

  return { requests, isLoading, error, metrics, aiInsights };
};
