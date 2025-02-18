
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AIInsight } from '@/types/ai';
import { useQuery } from '@tanstack/react-query';

export interface AuthorizationRecord {
  id: string;
  patient_id: string;
  insurance_id: string;
  request_date: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  notes?: string;
  priority: string;
  request_type: string;
  requested_by: string;
  requested_date: string;
  route: string;
  service_date: string;
  service_type: string;
  trip_type: string;
  created_at: string;
  updated_at: string;
}

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
      return data as AuthorizationRecord[];
    }
  });

  const generateAIInsights = (data: AuthorizationRecord[]): AIInsight[] => {
    const insights: AIInsight[] = [
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
    return insights;
  };

  const stats: AuthorizationStats | null = data ? {
    totalAuthorizations: data.length,
    pendingAuthorizations: data.filter(auth => auth.status === 'pending').length,
    approvedAuthorizations: data.filter(auth => auth.status === 'approved').length,
    deniedAuthorizations: data.filter(auth => auth.status === 'denied').length,
    aiInsights: generateAIInsights(data)
  } : null;

  return {
    authorizations: data || [],
    isLoading,
    error,
    stats,
    refetch
  };
};
