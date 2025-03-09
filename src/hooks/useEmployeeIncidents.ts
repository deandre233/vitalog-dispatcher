
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { incidentService } from "@/services/incidentService";
import { incidentAnalysisService } from "@/services/incidentAnalysisService";
import type { Incident, IncidentFormData, IncidentAnalysisData } from "@/types/incidents";

export type { Incident, IncidentFormData } from "@/types/incidents";

export const useEmployeeIncidents = (employeeId?: string) => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch incidents
  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ['employee-incidents', employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      return await incidentService.getEmployeeIncidents(employeeId);
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
        // Create the incident
        const data = await incidentService.createIncident(employeeId, formData);
        
        // Analyze with AI
        if (data) {
          await getAIAnalysis(data.id, {
            incidentType: data.incident_type,
            description: data.description,
            severity: data.severity,
            vehicleInvolved: data.vehicle_involved,
            shift_id: data.shift_id
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
      
      await incidentService.updateIncident(id, updates);
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
      
      await incidentService.deleteIncident(id);
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
  const getAIAnalysis = async (incidentId: string, data: IncidentAnalysisData) => {
    return await incidentAnalysisService.analyzeIncident(incidentId, data);
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
