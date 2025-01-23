import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AIAnalysisResult } from '@/types/dispatch';

export const useAIEmployeeAnalysis = (employeeId: string) => {
  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['employee-analysis', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('ai_performance_metrics, ai_recommendations')
        .eq('employee_id', employeeId)
        .single();

      if (error) throw error;

      const metrics = data?.ai_performance_metrics as Record<string, number>;
      const recommendations = data?.ai_recommendations as Record<string, any>;

      return {
        efficiency_score: metrics?.efficiency_score || 0,
        communication_score: metrics?.communication_score || 0,
        teamwork_score: metrics?.teamwork_score || 0,
        technical_skills: metrics?.technical_skills || 0,
        training_needs: recommendations?.training_needs || [],
        growth_opportunities: recommendations?.growth_opportunities || [],
        performance_insights: recommendations?.performance_insights || ''
      } as AIAnalysisResult;
    }
  });

  return { analysis, isLoading, error: error?.message };
};