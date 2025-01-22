import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AIAnalysisResponse } from '@/types/billing';

export function useAIBillingAnalysis(metrics: any) {
  return useQuery<AIAnalysisResponse>({
    queryKey: ['billing-analysis', metrics],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke<AIAnalysisResponse>('analyze-billing', {
          body: { metrics }
        });
        
        if (error) {
          console.error('Supabase function error:', error);
          toast({
            title: "Error analyzing billing data",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error in useAIBillingAnalysis:', error);
        toast({
          title: "Error analyzing billing data",
          description: "Failed to analyze billing data. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!metrics,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}