import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AIEmployeeAnalysis {
  efficiency_score: number;
  communication_score: number;
  teamwork_score: number;
  technical_skills: number;
  training_needs: string[];
  growth_opportunities: string[];
  performance_insights: string;
}

export const useAIEmployeeAnalysis = (employeeId: string) => {
  return useQuery({
    queryKey: ['employee-analysis', employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_profiles')
        .select('ai_performance_metrics, ai_recommendations')
        .eq('employee_id', employeeId)
        .single();

      if (error) throw error;

      return {
        ...data.ai_performance_metrics,
        ...data.ai_recommendations
      } as AIEmployeeAnalysis;
    }
  });
};