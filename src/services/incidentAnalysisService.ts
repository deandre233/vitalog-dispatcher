
import { supabase } from "@/integrations/supabase/client";
import { IncidentAnalysisData, IncidentAnalysisResult } from "@/types/incidents";

export const incidentAnalysisService = {
  async analyzeIncident(incidentId: string, data: IncidentAnalysisData): Promise<IncidentAnalysisResult | null> {
    try {
      // Get shift data if available
      let shiftData = null;
      if (data.shiftData?.shift_id) {
        const { data: shiftRecord } = await supabase
          .from('shift_records')
          .select('*')
          .eq('id', data.shiftData.shift_id)
          .single();
        
        shiftData = shiftRecord;
      }
      
      // Call the edge function to analyze the incident
      const { data: analysisResult, error } = await supabase.functions.invoke('analyze-incident', {
        body: { 
          incidentType: data.incidentType,
          description: data.description,
          severity: data.severity,
          vehicleInvolved: data.vehicleInvolved,
          shiftData,
          subject: data.subject // Pass the subject to the edge function
        }
      });
      
      if (error) {
        console.error("Error analyzing incident:", error);
        return null;
      }
      
      // Update the incident with the analysis
      if (analysisResult.analysis) {
        const { error: updateError } = await supabase
          .from('employee_incidents')
          .update({ 
            ai_analysis: analysisResult.analysis,
            subject: data.subject // Also store the subject in the database
          })
          .eq('id', incidentId);
        
        if (updateError) {
          console.error("Error updating incident with analysis:", updateError);
        }
      }
      
      return analysisResult.analysis;
    } catch (error) {
      console.error("Error in analyzeIncident:", error);
      return null;
    }
  }
};
