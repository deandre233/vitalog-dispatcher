import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TransportRecord {
  id: string;
  patient_id?: string;
  dispatch_id: string;
  pickup_location: string;
  dropoff_location: string;
  transport_date?: string;
  status: string;
  crew_assigned?: string;
  notes?: string;
  created_at?: string;
  recurrence_type?: string;
  recurrence_day?: string;
  recurrence_frequency?: string;
  warnings?: string[];
  incidents?: Array<{
    id: string;
    timestamp: string;
    description: string;
    analysis?: {
      severity: string;
      recommendation: string;
      actionItems: string[];
    };
  }>;
}

export function useTransportRecord(id: string | undefined) {
  return useQuery({
    queryKey: ['transport', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as TransportRecord;
    },
    enabled: !!id
  });
}