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
      
      // Map the database fields to match our AIRecommendation interface
      return data.map(item => ({
        id: item.id,
        type: item.analysis_type,
        prediction: item.prediction,
        confidence_score: item.confidence_score,
        metadata: item.metadata,
        created_at: item.created_at,
        recommendation: item.recommendation,
        suggestions: item.suggestions
      })) as AIRecommendation[];
    }
  });
}