
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { EmployeePrivileges } from "@/types/employee";

const defaultPrivileges: EmployeePrivileges = {
  id: '',
  employee_id: '',
  can_view_patient_info: false,
  can_edit_patient_info: false,
  can_delete_patient_info: false,
  can_view_billing_info: false,
  can_edit_billing_info: false,
  can_delete_billing_info: false,
  can_view_dispatch_info: false,
  can_edit_dispatch_info: false,
  can_delete_dispatch_info: false,
  can_view_reports: false,
  can_create_reports: false,
  can_edit_reports: false,
  can_delete_reports: false,
  can_use_ai_assistance: false,
  
  // Extended PCR privileges with defaults
  pcr_auto_duplication: false,
  pcr_submit_incomplete: false,
  pcr_narrative_composer: false,
  pcr_narrative_cut_paste: false,
  pcr_auto_launch: false,
  
  // Timeclock privileges with defaults
  timeclock_flagging: false,
  remote_timeclock: false,
  
  // System access privileges with defaults
  system_admin_access: false,
  audit_log_access: false,
  quality_assurance_access: false,
  
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const useEmployeePrivileges = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const { data: privileges = defaultPrivileges, isLoading, error } = useQuery({
    queryKey: ["employee_privileges", employeeId],
    queryFn: async () => {
      if (!employeeId) return defaultPrivileges;

      const { data, error } = await supabase
        .from("employee_privileges")
        .select("*")
        .eq("employee_id", employeeId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching employee privileges:', error);
        toast({
          title: "Error fetching privileges",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (!data) return defaultPrivileges;

      // Ensure backward compatibility by providing defaults for new fields
      return {
        ...defaultPrivileges,
        ...data,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      } as EmployeePrivileges;
    },
    enabled: !!employeeId
  });

  const updatePrivileges = useMutation({
    mutationFn: async (updates: Partial<EmployeePrivileges>) => {
      if (!employeeId) throw new Error("Employee ID is required");

      const { error } = await supabase
        .from("employee_privileges")
        .upsert({ 
          employee_id: employeeId,
          ...updates
        });

      if (error) {
        console.error('Error updating employee privileges:', error);
        toast({
          title: "Error",
          description: "Failed to update employee privileges",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_privileges", employeeId] });
      toast({
        title: "Success",
        description: "Employee privileges updated successfully",
      });
    }
  });

  // Generate AI recommendations based on employee role and experience
  const getAIRecommendations = async (roleType: string) => {
    // Get employee roles
    const { data: roles } = await supabase
      .from("employee_roles")
      .select("*")
      .eq("employee_id", employeeId)
      .maybeSingle();

    let recommendations: Record<string, boolean> = {};

    // Base recommendations on role type
    switch(roleType) {
      case "pcr":
        recommendations = {
          pcr_auto_duplication: roles?.is_crew_member || false,
          pcr_narrative_composer: true,
          pcr_narrative_cut_paste: true,
          pcr_submit_incomplete: roles?.is_supervisor || false,
          pcr_auto_launch: roles?.is_crew_member || false
        };
        break;
      case "timeclock":
        recommendations = {
          timeclock_flagging: roles?.is_supervisor || roles?.is_hr || false,
          remote_timeclock: roles?.is_supervisor || false
        };
        break;
      case "system":
        recommendations = {
          system_admin_access: roles?.is_administrator || false,
          audit_log_access: roles?.is_qa_reviewer || roles?.is_administrator || false,
          quality_assurance_access: roles?.is_qa_reviewer || false
        };
        break;
      default:
        // Core privileges
        recommendations = {
          can_view_patient_info: true,
          can_edit_patient_info: roles?.is_crew_member || false,
          can_delete_patient_info: roles?.is_supervisor || false,
          can_view_dispatch_info: true,
          can_edit_dispatch_info: roles?.is_dispatcher || roles?.is_supervisor || false,
          can_view_billing_info: roles?.is_biller || roles?.is_supervisor || false,
          can_edit_billing_info: roles?.is_biller || false,
          can_use_ai_assistance: true
        };
    }

    return recommendations;
  };

  return {
    privileges,
    isLoading,
    error,
    updatePrivileges,
    getAIRecommendations
  };
};
