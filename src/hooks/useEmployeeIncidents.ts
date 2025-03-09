
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DatePicker } from "@/components/ui/date-picker";

export interface Incident {
  id: string;
  employee_id: string;
  incident_type: string;
  incident_date: string;
  location?: string;
  description: string;
  severity: string;
  witnesses?: string[];
  vehicle_involved: boolean;
  vehicle_id?: string;
  partner_id?: string;
  reported_to?: string;
  followup_required: boolean;
  followup_date?: string;
  status: string;
  resolution?: string;
  ai_analysis?: any;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  shift_id?: string;
}

export interface IncidentFormData {
  incident_type: string;
  incident_date: Date;
  location?: string;
  description: string;
  severity: string;
  witnesses?: string[];
  vehicle_involved: boolean;
  vehicle_id?: string;
  partner_id?: string;
  reported_to?: string;
  followup_required: boolean;
  followup_date?: Date;
  shift_id?: string;
}

export const useEmployeeIncidents = (employeeId?: string) => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch incidents
  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ['employee-incidents', employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      
      const { data, error } = await supabase
        .from('employee_incidents')
        .select('*')
        .eq('employee_id', employeeId)
        .order('incident_date', { ascending: false });
      
      if (error) {
        console.error("Error fetching employee incidents:", error);
        toast.error("Failed to load incident reports");
        throw error;
      }
      
      return data || [];
    },
    enabled: !!employeeId
  });

  // Create incident
  const createIncident = useMutation({
    mutationFn: async (formData: IncidentFormData) => {
      if (!employeeId) {
        throw new Error("Employee ID is required");
      }
      
      setIsProcessing(true);
      
      try {
        // Prepare the data
        const incidentData = {
          employee_id: employeeId,
          incident_type: formData.incident_type,
          incident_date: formData.incident_date.toISOString(),
          location: formData.location,
          description: formData.description,
          severity: formData.severity,
          witnesses: formData.witnesses || [],
          vehicle_involved: formData.vehicle_involved,
          vehicle_id: formData.vehicle_id,
          partner_id: formData.partner_id,
          reported_to: formData.reported_to,
          followup_required: formData.followup_required,
          followup_date: formData.followup_date ? formData.followup_date.toISOString() : null,
          status: "Open",
          shift_id: formData.shift_id
        };
        
        // Insert the incident
        const { data, error } = await supabase
          .from('employee_incidents')
          .insert([incidentData])
          .select('*')
          .single();
        
        if (error) {
          console.error("Error creating incident:", error);
          throw error;
        }
        
        // Get the incident data
        if (data) {
          // Analyze with AI
          await getAIAnalysis(data.id, {
            incidentType: data.incident_type,
            description: data.description,
            severity: data.severity,
            vehicleInvolved: data.vehicle_involved
          });
        }
        
        return data;
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-incidents', employeeId] });
      toast.success("Incident report created successfully");
    },
    onError: (error) => {
      console.error("Error in createIncident:", error);
      toast.error("Failed to create incident report");
    }
  });

  // Update incident
  const updateIncident = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Incident> }) => {
      if (!id) {
        throw new Error("Incident ID is required");
      }
      
      const { error } = await supabase
        .from('employee_incidents')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating incident:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-incidents', employeeId] });
      toast.success("Incident report updated successfully");
    },
    onError: (error) => {
      console.error("Error in updateIncident:", error);
      toast.error("Failed to update incident report");
    }
  });

  // Delete incident
  const deleteIncident = useMutation({
    mutationFn: async (id: string) => {
      if (!id) {
        throw new Error("Incident ID is required");
      }
      
      const { error } = await supabase
        .from('employee_incidents')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting incident:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-incidents', employeeId] });
      toast.success("Incident report deleted");
    },
    onError: (error) => {
      console.error("Error in deleteIncident:", error);
      toast.error("Failed to delete incident report");
    }
  });

  // Get AI analysis
  const getAIAnalysis = async (incidentId: string, data: any) => {
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
          shiftData
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
        
        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ['employee-incidents', employeeId] });
      }
      
      return analysisResult.analysis;
    } catch (error) {
      console.error("Error in getAIAnalysis:", error);
      return null;
    }
  };

  return {
    incidents,
    isLoading,
    isProcessing,
    createIncident,
    updateIncident,
    deleteIncident,
    getAIAnalysis
  };
};
