import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { InsuranceAnalysis } from '@/types/insurance';

export function useInsuranceAnalysis(patientId: string) {
  const [analysis, setAnalysis] = useState<InsuranceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true);
        const { data, error: apiError } = await supabase.functions.invoke('analyze-insurance', {
          body: { patientId }
        });

        if (apiError) throw apiError;

        if (data) {
          const analysisData: InsuranceAnalysis = {
            validation: data.validation || { status: 'incomplete', issues: [] },
            suggestions: data.suggestions || [],
            coverage_gaps: data.coverage_gaps || [],
            optimization: {
              recommendations: data.optimization?.recommendations || [],
              potential_savings: data.optimization?.potential_savings
            },
            compliance: {
              flags: data.compliance?.flags || [],
              required_actions: data.compliance?.required_actions || []
            }
          };
          setAnalysis(analysisData);
        }
      } catch (err) {
        console.error('Error fetching insurance analysis:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch insurance analysis');
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchAnalysis();
    }
  }, [patientId]);

  return { analysis, isLoading, error };
}