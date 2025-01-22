import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAIBillingAnalysis(metrics: any) {
  return useQuery({
    queryKey: ['billing-analysis', metrics],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('analyze-billing', {
        body: { metrics }
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!metrics,
  });
}