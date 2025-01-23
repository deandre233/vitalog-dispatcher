import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { EmployeeRole } from '@/types/employee';

export const useEmployeeRoles = (employeeId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: roles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['employee-roles', employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error('Employee ID is required');
      
      const { data, error } = await supabase
        .from('employee_roles')
        .select('*')
        .eq('employee_id', employeeId)
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

      if (!data) {
        return {
          isCrew: false,
          isSupervisor: false,
          supervisorRole: '',
          isBiller: false,
          isDispatcher: false,
          isQAReviewer: false,
          isHR: false,
          isMechanic: false,
          isSalesperson: false,
          isMedicalDirector: false,
          isOnlooker: false,
          onlookerFacility: '',
          onlookerCity: '',
          onlookerCounty: '',
          canSeeNonEmergent: false,
          isAdministrator: false,
          isPrincipal: false,
          isProvisional: false
        } as EmployeeRole;
      }

      return {
        isCrew: data.is_crew_member,
        isSupervisor: data.is_supervisor,
        supervisorRole: data.supervisor_role || '',
        isBiller: data.is_biller,
        isDispatcher: data.is_dispatcher,
        isQAReviewer: data.is_qa_reviewer,
        isHR: data.is_hr,
        isMechanic: data.is_mechanic,
        isSalesperson: data.is_salesperson,
        isMedicalDirector: data.is_medical_director,
        isOnlooker: data.is_onlooker,
        onlookerFacility: data.onlooker_facility || '',
        onlookerCity: data.onlooker_city || '',
        onlookerCounty: data.onlooker_county || '',
        canSeeNonEmergent: data.can_see_non_emergent,
        isAdministrator: data.is_administrator,
        isPrincipal: data.is_principal,
        isProvisional: data.is_provisional
      } as EmployeeRole;
    },
    enabled: !!employeeId,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const updateRoles = useMutation({
    mutationFn: async (updates: Partial<EmployeeRole>) => {
      if (!employeeId) throw new Error('Employee ID is required');

      const { error } = await supabase
        .from('employee_roles')
        .update({
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
        })
        .eq('employee_id', employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-roles', employeeId] });
      toast({
        title: "Success",
        description: "Employee roles updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating employee roles:', error);
      toast({
        title: "Error",
        description: "Failed to update employee roles",
        variant: "destructive",
      });
    }
  });

  return {
    roles,
    isLoading,
    error,
    updateRoles
  };
};