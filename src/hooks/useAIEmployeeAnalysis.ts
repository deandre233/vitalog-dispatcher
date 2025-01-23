import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      try {
        const { data, error } = await supabase
          .from('employee_profiles')
          .select('ai_performance_metrics, ai_recommendations')
          .eq('employee_id', employeeId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching employee analysis:', error);
          toast({
            title: "Error fetching analysis",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }

        if (!data) {
          return {
            efficiency_score: 0,
            communication_score: 0,
            teamwork_score: 0,
            technical_skills: 0,
            training_needs: [],
            growth_opportunities: [],
            performance_insights: 'No analysis available'
          } as AIEmployeeAnalysis;
        }

        return {
          ...data.ai_performance_metrics,
          ...data.ai_recommendations
        } as AIEmployeeAnalysis;
      } catch (error) {
        console.error('Error in useAIEmployeeAnalysis:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2
  });
};