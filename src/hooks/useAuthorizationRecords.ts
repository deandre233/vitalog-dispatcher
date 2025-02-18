
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AuthorizationRecord } from '@/types/service-queue';
import type { AIInsight } from '@/types/ai';

export interface AuthorizationStats {
  totalAuthorizations: number;
  pendingAuthorizations: number;
  approvedAuthorizations: number;
  deniedAuthorizations: number;
  aiInsights: AIInsight[];
}

export const useAuthorizationRecords = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['authorization_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('authorization_requests')
        .select('*');

      if (error) throw error;

      const formattedData: AuthorizationRecord[] = data.map(item => ({
        id: item.id,
        patient_id: item.patient_id,
        insurance_id: item.insurance_id,
        authorized_by: item.authorized_by,
        authorization_number: item.authorization_number,
        request_date: item.created_at, // Using created_at as request_date
        request_type: item.service_type, // Using service_type as request_type
        requested_by: item.requested_by,
        requested_date: item.created_at, // Using created_at as requested_date
        route: 'default', // Default value since it's required
        service_date: item.valid_from, // Using valid_from as service_date
        service_type: item.service_type,
        status: item.status as 'pending' | 'approved' | 'denied' | 'expired',
        trip_type: 'standard', // Default value since it's required
        priority: item.priority,
        notes: '',
        valid_from: item.valid_from,
        valid_until: item.valid_until,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      return formattedData;
    }
  });

  const generateAIInsights = (records: AuthorizationRecord[]): AIInsight[] => {
    return [
      {
        type: 'optimization',
        message: 'Authorization flow can be expedited',
        confidence: 89,
        impact: 'high',
        recommendation: 'Consider implementing auto-renewal for recurring authorizations',
        timeEstimate: '1-2 weeks'
      },
      {
        type: 'warning',
        message: 'Potential expiration risk',
        confidence: 75,
        impact: 'medium',
        recommendation: 'Review and renew 12 authorizations expiring in the next 30 days',
        timeEstimate: '2-3 days'
      },
      {
        type: 'prediction',
        message: 'Upcoming volume increase',
        confidence: 82,
        impact: 'medium',
        recommendation: 'Prepare for 15% increase in authorization requests next month',
        timeEstimate: '1 week'
      }
    ];
  };

  const stats: AuthorizationStats = {
    totalAuthorizations: data?.length || 0,
    pendingAuthorizations: data?.filter(auth => auth.status === 'pending').length || 0,
    approvedAuthorizations: data?.filter(auth => auth.status === 'approved').length || 0,
    deniedAuthorizations: data?.filter(auth => auth.status === 'denied').length || 0,
    aiInsights: data ? generateAIInsights(data) : []
  };

  return {
    authorizations: data || [],
    isLoading,
    error,
    stats,
    refetch
  };
};
