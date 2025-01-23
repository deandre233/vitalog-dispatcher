import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { EmployeePrivilege } from '@/types/employee';

export const useEmployeePrivileges = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ['employee-privileges', employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error('Employee ID is required');
      
      const { data, error } = await supabase
        .from('employee_privileges')
        .select('*')
        .eq('employee_id', employeeId)
        .single();

      if (error) throw error;

      return {
        canViewPatientInfo: data.can_view_patient_info,
        canEditPatientInfo: data.can_edit_patient_info,
        canDeletePatientInfo: data.can_delete_patient_info,
        canViewBillingInfo: data.can_view_billing_info,
        canEditBillingInfo: data.can_edit_billing_info,
        canDeleteBillingInfo: data.can_delete_billing_info,
        canViewDispatchInfo: data.can_view_dispatch_info,
        canEditDispatchInfo: data.can_edit_dispatch_info,
        canDeleteDispatchInfo: data.can_delete_dispatch_info,
        canViewReports: data.can_view_reports,
        canCreateReports: data.can_create_reports,
        canEditReports: data.can_edit_reports,
        canDeleteReports: data.can_delete_reports,
        canUseAIAssistance: data.can_use_ai_assistance
      } as EmployeePrivilege;
    },
    enabled: !!employeeId
  });
};