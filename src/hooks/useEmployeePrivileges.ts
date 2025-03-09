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

      return {
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

  return {
    privileges,
    isLoading,
    error,
    updatePrivileges
  };
};