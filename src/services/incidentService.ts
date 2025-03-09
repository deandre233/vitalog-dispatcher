
import { supabase } from "@/integrations/supabase/client";
import { Incident, IncidentFormData, IncidentAnalysisData } from "@/types/incidents";

export const incidentService = {
  async getEmployeeIncidents(employeeId: string): Promise<Incident[]> {
    const { data, error } = await supabase
      .from('employee_incidents')
      .select('*')
      .eq('employee_id', employeeId)
      .order('incident_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching employee incidents:", error);
      throw error;
    }
    
    return data || [];
  },

  async createIncident(employeeId: string, formData: IncidentFormData): Promise<Incident> {
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
    
    const { data, error } = await supabase
      .from('employee_incidents')
      .insert([incidentData])
      .select('*')
      .single();
    
    if (error) {
      console.error("Error creating incident:", error);
      throw error;
    }
    
    return data;
  },

  async updateIncident(id: string, updates: Partial<Incident>): Promise<void> {
    const { error } = await supabase
      .from('employee_incidents')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error("Error updating incident:", error);
      throw error;
    }
  },

  async deleteIncident(id: string): Promise<void> {
    const { error } = await supabase
      .from('employee_incidents')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting incident:", error);
      throw error;
    }
  }
};
