
import { supabase } from "@/integrations/supabase/client";
import { IncidentAnalysisData, IncidentAnalysisResult } from "@/types/incidents";

export const incidentAnalysisService = {
  async analyzeIncident(incidentId: string, data: IncidentAnalysisData): Promise<IncidentAnalysisResult | null> {
    try {
      // Get shift data if available
      let shiftData = null;
      if (data.shift_id) {
        const { data: shiftRecord } = await supabase
          .from('shift_records')
          .select('*')
          .eq('id', data.shift_id)
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
          subject: data.subject || inferSubjectFromDescription(data.description, data.incidentType)
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
          .update({ ai_analysis: analysisResult.analysis })
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

// Helper function to infer the subject from the incident description
const inferSubjectFromDescription = (description: string, incidentType: string): string => {
  const descriptionLower = description.toLowerCase();
  
  // Common subject keywords
  const subjectKeywords = {
    "missed punch": ["missed punch", "clock in", "clock out", "time clock", "forgot to punch"],
    "tardiness": ["late", "tardy", "tardiness", "delayed arrival", "late arrival", "late for shift"],
    "inservice": ["inservice", "training", "class", "continuing education", "ce hours"],
    "pcr": ["pcr", "patient care report", "documentation", "chart", "paperwork", "reporting"],
    "vehicle": ["vehicle", "ambulance", "truck", "car", "transport unit", "fleet"],
    "protocol": ["protocol", "guideline", "procedure", "policy", "standard operating procedure", "sop"],
    "equipment": ["equipment", "supplies", "gear", "device", "tool", "kit"],
    "conduct": ["behavior", "conduct", "attitude", "unprofessional", "conflict", "argument"],
    "attendance": ["absent", "no show", "attendance", "sick call", "call out"],
    "patient care": ["patient care", "treatment", "assessment", "medical error", "medication", "clinical"],
    "safety": ["safety", "hazard", "unsafe", "injury", "accident", "risk"],
    "communication": ["communication", "dispatch", "radio", "notification", "report", "handoff"]
  };
  
  // Check for keywords in the description
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some(keyword => descriptionLower.includes(keyword))) {
      return subject;
    }
  }
  
  // If no subject is found, default to the incident type as the subject
  return incidentType;
};
