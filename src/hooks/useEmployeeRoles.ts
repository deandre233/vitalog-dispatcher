import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { EmployeeRole } from '@/types/employee';

export const useEmployeeRoles = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ['employee-roles', employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error('Employee ID is required');
      
      const { data, error } = await supabase
        .from('employee_roles')
        .select('*')
        .eq('employee_id', employeeId)
        .single();

      if (error) throw error;

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
    enabled: !!employeeId
  });
};