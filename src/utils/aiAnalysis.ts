import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AIAnalysisResult {
  confidence: number;
  suggestions: string[];
  warnings: string[];
  prediction: string;
}

export async function analyzePatientData(patientId: string): Promise<AIAnalysisResult | null> {
  try {
    const { data: result, error } = await supabase
      .from('ai_analysis_results')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return {
      confidence: result.confidence_score,
      suggestions: result.suggestions || [],
      warnings: result.warnings || [],
      prediction: result.prediction || ''
    };
  } catch (error) {
    console.error('Error analyzing patient data:', error);
    toast.error('Failed to analyze patient data');
    return null;
  }
}