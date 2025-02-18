
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

        const formattedRequests = data.map(item => ({
          id: item.id,
          patient_id: item.patient_id,
          patient_name: item.patient_name,
          status: item.status as 'pending' | 'in-progress' | 'completed',
          priority: item.priority as 'high' | 'medium' | 'low',
          request_type: item.request_type,
          requested_by: item.requested_by,
          requested_date: item.requested_date,
          route: item.route,
          service_date: item.service_date,
          service_type: item.service_type,
          trip_type: item.trip_type,
          notes: item.notes,
          created_at: item.created_at,
          updated_at: item.updated_at
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
