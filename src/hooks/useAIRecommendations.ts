
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AIRecommendation } from "@/types/ai";

// Adapter function to transform API data to AIRecommendation type
const adaptToAIRecommendation = (data: any): AIRecommendation => {
  return {
    recommendation: data.recommendation || data.prediction || "",
    confidence: data.confidence_score || 0.7,
    source: data.type || "ai",
    context: data.metadata ? JSON.stringify(data.metadata) : undefined,
    timestamp: data.created_at
  };
};

export const useAIRecommendations = (entityId: string, entityType: string) => {
  return useQuery({
    queryKey: ['ai_recommendations', entityId, entityType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_analysis_results')
        .select('*')
        .eq('entity_id', entityId)
        .eq('entity_type', entityType);

      if (error) {
        throw error;
      }

      // Transform the data to match AIRecommendation type
      return (data || []).map(adaptToAIRecommendation);
    },
    enabled: !!entityId && !!entityType
  });
};

// This is just a placeholder for when we don't have a real entity ID yet
export const useMockAIRecommendations = () => {
  return {
    data: [
      {
        recommendation: "Consider updating employee certifications",
        confidence: 0.95,
        source: "employee_analysis",
        timestamp: new Date().toISOString()
      },
      {
        recommendation: "Review shift patterns to optimize scheduling",
        confidence: 0.82,
        source: "scheduling_engine",
        timestamp: new Date().toISOString()
      }
    ],
    isLoading: false,
    error: null
  };
};
