import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TransportRecord } from '@/types/dispatch';

export function useTransportRecords() {
  return useQuery({
    queryKey: ['transports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TransportRecord[];
    }
  });
}