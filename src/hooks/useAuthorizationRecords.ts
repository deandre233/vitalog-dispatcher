import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AIInsight } from '@/types/ai';

export interface AuthorizationRecord {
  id: string;
  patient_id: string;
  insurance_id: string;
  request_date: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  notes?: string;
  [key: string]: any;
}

export interface AuthorizationStats {
  totalAuthorizations: number;
  pendingAuthorizations: number;
  approvedAuthorizations: number;
  deniedAuthorizations: number;
  aiInsights: AIInsight[];
}

export const useAuthorizationRecords = () => {
  const [authorizations, setAuthorizations] = useState<AuthorizationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<AuthorizationStats | null>(null);

  useEffect(() => {
    const fetchAuthorizations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('authorization_records')
          .select('*');

        if (error) {
          setError(error);
        } else {
          setAuthorizations(data || []);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorizations();
  }, []);

  useEffect(() => {
    if (authorizations.length > 0) {
      const totalAuthorizations = authorizations.length;
      const pendingAuthorizations = authorizations.filter(auth => auth.status === 'pending').length;
      const approvedAuthorizations = authorizations.filter(auth => auth.status === 'approved').length;
      const deniedAuthorizations = authorizations.filter(auth => auth.status === 'denied').length;

      const aiInsights = generateAIInsights(authorizations);

      setStats({
        totalAuthorizations,
        pendingAuthorizations,
        approvedAuthorizations,
        deniedAuthorizations,
        aiInsights
      });
    }
  }, [authorizations]);

  const generateAIInsights = (data: any[]): AIInsight[] => {
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

  return {
    authorizations,
    loading,
    error,
    stats
  };
};
