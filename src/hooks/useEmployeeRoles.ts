import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SupervisorRole = "Captain" | "Lieutenant" | "Full privileges" | "Call-taker / Self-dispatch";

interface EmployeeRole {
  id: string;
  employee_id: string;
  supervisor_role: SupervisorRole;
  is_crew_member: boolean;
  is_supervisor: boolean;
  is_dispatcher: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useEmployeeRoles = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const { data: roles, isLoading, error } = useQuery({
    queryKey: ["employee_roles", employeeId],
    queryFn: async (): Promise<EmployeeRole[]> => {
      if (!employeeId) return [];

      const { data, error } = await supabase
        .from("employee_roles")
        .select("*")
        .eq("employee_id", employeeId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!employeeId
  });

  const updateRole = useMutation({
    mutationFn: async (updates: Partial<EmployeeRole>) => {
      if (!employeeId) throw new Error("No employee ID provided");

      const { data, error } = await supabase
        .from("employee_roles")
        .update(updates)
        .eq("employee_id", employeeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_roles", employeeId] });
    }
  });

  return {
    roles,
    isLoading,
    error,
    updateRole
  };
};