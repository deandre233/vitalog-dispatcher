import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AIRecommendation } from "@/types/ai";

export function useAIRecommendations() {
  return useQuery({
    queryKey: ['ai_recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_analysis_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as AIRecommendation[];
    }
  });
}