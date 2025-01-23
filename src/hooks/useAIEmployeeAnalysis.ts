import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AIAnalysisResult {
  efficiency_score: number;
  communication_score: number;
  teamwork_score: number;
  technical_skills: number;
  recommendations: string[];
  insights: string[];
}

export const useAIEmployeeAnalysis = (employeeId: string) => {
  return useQuery({
    queryKey: ["employee-analysis", employeeId],
    queryFn: async (): Promise<AIAnalysisResult> => {
      const { data, error } = await supabase
        .from("employee_profiles")
        .select("ai_performance_metrics, ai_recommendations")
        .eq("employee_id", employeeId)
        .single();

      if (error) throw error;

      const metrics = data?.ai_performance_metrics || {};
      const recommendations = data?.ai_recommendations || {};

      return {
        efficiency_score: metrics.efficiency_score || 0,
        communication_score: metrics.communication_score || 0,
        teamwork_score: metrics.teamwork_score || 0,
        technical_skills: metrics.technical_skills || 0,
        recommendations: Array.isArray(recommendations.training_needs) 
          ? recommendations.training_needs 
          : [],
        insights: Array.isArray(recommendations.growth_opportunities) 
          ? recommendations.growth_opportunities 
          : []
      };
    },
    enabled: !!employeeId
  });
};