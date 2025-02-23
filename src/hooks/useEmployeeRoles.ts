import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { EmployeeRole } from "@/types/employee";

const defaultRole: EmployeeRole = {
  id: '',
  employee_id: '',
  is_crew_member: false,
  is_supervisor: false,
  supervisor_role: "Call-taker / Self-dispatch",
  is_biller: false,
  is_dispatcher: false,
  is_qa_reviewer: false,
  is_hr: false,
  is_mechanic: false,
  is_salesperson: false,
  is_medical_director: false,
  is_onlooker: false,
  onlooker_facility: "",
  onlooker_city: "",
  onlooker_county: "",
  can_see_non_emergent: false,
  is_administrator: false,
  is_principal: false,
  is_provisional: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const useEmployeeRoles = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const { data: roles = defaultRole, isLoading, error } = useQuery({
    queryKey: ["employee_roles", employeeId],
    queryFn: async () => {
      if (!employeeId) return defaultRole;

      const { data, error } = await supabase
        .from("employee_roles")
        .select("*")
        .eq("employee_id", employeeId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching employee roles:', error);
        toast({
          title: "Error fetching roles",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (!data) return defaultRole;

      return {
        ...data,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      } as EmployeeRole;
    },
    enabled: !!employeeId
  });

  const updateRole = useMutation({
    mutationFn: async (updates: Partial<EmployeeRole>) => {
      if (!employeeId) throw new Error("Employee ID is required");

      const { error } = await supabase
        .from("employee_roles")
        .upsert({ 
          employee_id: employeeId,
          ...updates
        });

      if (error) {
        console.error('Error updating employee roles:', error);
        toast({
          title: "Error",
          description: "Failed to update employee roles",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_roles", employeeId] });
      toast({
        title: "Success",
        description: "Employee roles updated successfully",
      });
    }
  });

  return {
    roles,
    isLoading,
    error,
    updateRole
  };
};