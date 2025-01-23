import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AIAnalysisResult } from '@/types/insurance';

export function useAIEmployeeAnalysis(employeeId: string) {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('employee_profiles')
          .select('ai_performance_metrics, ai_recommendations')
          .eq('employee_id', employeeId)
          .single();

        if (profileError) throw profileError;

        if (profileData) {
          const metrics = profileData.ai_performance_metrics;
          const recommendations = profileData.ai_recommendations;

          const analysisData: AIAnalysisResult = {
            efficiency_score: typeof metrics?.efficiency_score === 'number' ? metrics.efficiency_score : 0,
            communication_score: typeof metrics?.communication_score === 'number' ? metrics.communication_score : 0,
            teamwork_score: typeof metrics?.teamwork_score === 'number' ? metrics.teamwork_score : 0,
            technical_skills: typeof metrics?.technical_skills === 'number' ? metrics.technical_skills : 0,
            training_needs: Array.isArray(recommendations?.training_needs) ? recommendations.training_needs : [],
            growth_opportunities: Array.isArray(recommendations?.growth_opportunities) ? recommendations.growth_opportunities : [],
            performance_insights: typeof recommendations?.performance_insights === 'string' ? recommendations.performance_insights : ''
          };

          setAnalysis(analysisData);
        }
      } catch (err) {
        console.error('Error fetching AI analysis:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch AI analysis');
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchAnalysis();
    }
  }, [employeeId]);

  return { analysis, isLoading, error };
}