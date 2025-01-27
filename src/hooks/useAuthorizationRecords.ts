import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AIInsight } from "@/types/ai";
import { toast } from "sonner";

interface UseAuthorizationRecordsParams {
  showExpired: boolean;
  showUpcoming: boolean;
  showOneShot: boolean;
  showDeleted: boolean;
  date: Date;
  facility?: string;
}

interface AuthorizationRecord {
  id: string;
  patient_id: string;
  service_type: string;
  status: string;
  insurance_id: string;
  requested_by: string;
  authorized_by: string;
  authorization_number: string;
  valid_from: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
  priority: string;
  patients?: {
    first_name: string;
    last_name: string;
  };
  insurance_records?: {
    carrier_name: string;
    policy_number: string;
  };
}

interface AuthorizationResponse {
  records: AuthorizationRecord[];
  aiInsights: AIInsight[];
}

export const useAuthorizationRecords = ({
  showExpired,
  showUpcoming,
  showOneShot,
  showDeleted,
  date,
  facility
}: UseAuthorizationRecordsParams) => {
  return useQuery<AuthorizationResponse, Error>({
    queryKey: ['authorization_records', { showExpired, showUpcoming, showOneShot, showDeleted, date, facility }],
    queryFn: async () => {
      let query = supabase
        .from('authorization_requests')
        .select(`
          *,
          patients (
            first_name,
            last_name
          ),
          insurance_records (
            carrier_name,
            policy_number
          )
        `)
        .order('created_at', { ascending: false });

      if (!showExpired) {
        query = query.gt('valid_until', new Date().toISOString());
      }
      
      if (!showUpcoming) {
        query = query.lte('valid_from', new Date().toISOString());
      }

      if (facility) {
        query = query.ilike('destination_type', `%${facility}%`);
      }

      const { data: records, error } = await query;

      if (error) {
        toast.error("Failed to fetch authorization records");
        throw error;
      }

      // Simulate AI insights based on the data
      const aiInsights: AIInsight[] = [
        {
          type: 'optimization',
          message: 'Consider renewing authorizations for 3 patients expiring next week',
          confidence: 0.95,
          impact: 'high'
        },
        {
          type: 'warning',
          message: '2 patients have missing insurance information',
          confidence: 0.88,
          impact: 'medium'
        },
        {
          type: 'prediction',
          message: 'Based on historical data, expect 5 new authorization requests next week',
          confidence: 0.82,
          impact: 'medium'
        }
      ];

      return {
        records: records || [],
        aiInsights
      };
    }
  });
};