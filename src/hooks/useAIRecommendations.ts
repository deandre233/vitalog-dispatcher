import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AIRecommendation {
  id: string;
  type: string;
  suggestion: string;
  confidence: number;
  metadata: Record<string, any>;
  created_at: string;
}

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