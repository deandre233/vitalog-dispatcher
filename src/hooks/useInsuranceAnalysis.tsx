import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

export interface InsuranceAnalysis {
  validation: {
    status: 'valid' | 'incomplete' | 'invalid';
    issues: string[];
  };
  suggestions: string[];
  coverage_gaps: string[];
  optimization: {
    recommendations: string[];
    potential_savings: string;
  };
  compliance: {
    flags: string[];
    required_actions: string[];
  };
}

export const useInsuranceAnalysis = (patientId: string) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<InsuranceAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeInsurance = async (insuranceData: any, patientInfo: any) => {
    setIsAnalyzing(true);
    try {
      const { data: analysisResponse, error } = await supabase.functions.invoke('analyze-insurance', {
        body: { insuranceData, patientInfo }
      });

      if (error) {
        throw error;
      }

      setAnalysis(analysisResponse);
      
      // Show relevant toasts based on analysis
      if (analysisResponse.validation.status === 'invalid') {
        toast({
          title: "Insurance Validation Issues",
          description: analysisResponse.validation.issues[0],
          variant: "destructive",
        });
      } else if (analysisResponse.coverage_gaps.length > 0) {
        toast({
          title: "Coverage Gaps Detected",
          description: (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>{analysisResponse.coverage_gaps[0]}</span>
            </div>
          ),
          variant: "default",
        });
      } else if (analysisResponse.optimization.recommendations.length > 0) {
        toast({
          title: "Optimization Available",
          description: analysisResponse.optimization.recommendations[0],
          variant: "default",
        });
      }

      return analysisResponse;
    } catch (error) {
      console.error('Error analyzing insurance:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze insurance information",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeInsurance,
    isAnalyzing,
    analysis
  };
};