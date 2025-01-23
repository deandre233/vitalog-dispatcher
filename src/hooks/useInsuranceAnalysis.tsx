import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InsuranceAnalysis {
  coverage_status: string;
  recommendations: string[];
  risk_factors: string[];
  next_steps: string[];
}

export const useInsuranceAnalysis = (patientId: string) => {
  return useQuery({
    queryKey: ["insurance-analysis", patientId],
    queryFn: async (): Promise<InsuranceAnalysis> => {
      try {
        const { data: analysisData, error } = await supabase
          .from("ai_analysis_results")
          .select("*")
          .eq("patient_id", patientId)
          .eq("analysis_type", "insurance")
          .single();

        if (error) throw error;

        return {
          coverage_status: analysisData?.prediction || "Unknown",
          recommendations: analysisData?.suggestions || [],
          risk_factors: analysisData?.metadata?.risk_factors || [],
          next_steps: analysisData?.metadata?.next_steps || []
        };
      } catch (error) {
        toast.error("Failed to fetch insurance analysis");
        throw error;
      }
    },
    enabled: !!patientId
  });
};