import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface AIRecommendation {
  id: string;
  analysis_type: string;
  patient_id: string | null;
  transport_id: string | null;
  suggestions: string[] | null;
  confidence_score: number | null;
  created_at: string | null;
  metadata: Json | null;
  prediction: string | null;
  recommendation: string | null;
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