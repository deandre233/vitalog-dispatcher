import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { EmployeeRole } from "@/types/employee";

const defaultRole: EmployeeRole = {
  isCrew: false,
  isSupervisor: false,
  supervisorRole: "Call-taker / Self-dispatch",
  isBiller: false,
  isDispatcher: false,
  isQAReviewer: false,
  isHR: false,
  isMechanic: false,
  isSalesperson: false,
  isMedicalDirector: false,
  isOnlooker: false,
  onlookerFacility: "",
  onlookerCity: "",
  onlookerCounty: "",
  canSeeNonEmergent: false,
  isAdministrator: false,
  isPrincipal: false,
  isProvisional: false
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
        isCrew: data.is_crew_member,
        isSupervisor: data.is_supervisor,
        supervisorRole: data.supervisor_role,
        isBiller: data.is_biller,
        isDispatcher: data.is_dispatcher,
        isQAReviewer: data.is_qa_reviewer,
        isHR: data.is_hr,
        isMechanic: data.is_mechanic,
        isSalesperson: data.is_salesperson,
        isMedicalDirector: data.is_medical_director,
        isOnlooker: data.is_onlooker,
        onlookerFacility: data.onlooker_facility,
        onlookerCity: data.onlooker_city,
        onlookerCounty: data.onlooker_county,
        canSeeNonEmergent: data.can_see_non_emergent,
        isAdministrator: data.is_administrator,
        isPrincipal: data.is_principal,
        isProvisional: data.is_provisional
      };
    },
    enabled: !!employeeId
  });

  const updateRole = useMutation({
    mutationFn: async (updates: Partial<EmployeeRole>) => {
      if (!employeeId) throw new Error("Employee ID is required");

      // Convert from camelCase to snake_case for database
      const dbUpdates = {
        is_crew_member: updates.isCrew,
        is_supervisor: updates.isSupervisor,
        supervisor_role: updates.supervisorRole,
        is_biller: updates.isBiller,
        is_dispatcher: updates.isDispatcher,
        is_qa_reviewer: updates.isQAReviewer,
        is_hr: updates.isHR,
        is_mechanic: updates.isMechanic,
        is_salesperson: updates.isSalesperson,
        is_medical_director: updates.isMedicalDirector,
        is_onlooker: updates.isOnlooker,
        onlooker_facility: updates.onlookerFacility,
        onlooker_city: updates.onlookerCity,
        onlooker_county: updates.onlookerCounty,
        can_see_non_emergent: updates.canSeeNonEmergent,
        is_administrator: updates.isAdministrator,
        is_principal: updates.isPrincipal,
        is_provisional: updates.isProvisional
      };

      const { error } = await supabase
        .from("employee_roles")
        .upsert({ employee_id: employeeId, ...dbUpdates });

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