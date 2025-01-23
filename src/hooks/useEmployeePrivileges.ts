import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { EmployeePrivilege } from '@/types/employee';

export const useEmployeePrivileges = (employeeId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: privileges,
    isLoading,
    error
  } = useQuery({
    queryKey: ['employee-privileges', employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error('Employee ID is required');
      
      const { data, error } = await supabase
        .from('employee_privileges')
        .select('*')
        .eq('employee_id', employeeId)
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

      if (!data) {
        return {
          canViewPatientInfo: false,
          canEditPatientInfo: false,
          canDeletePatientInfo: false,
          canViewBillingInfo: false,
          canEditBillingInfo: false,
          canDeleteBillingInfo: false,
          canViewDispatchInfo: false,
          canEditDispatchInfo: false,
          canDeleteDispatchInfo: false,
          canViewReports: false,
          canCreateReports: false,
          canEditReports: false,
          canDeleteReports: false,
          canUseAIAssistance: false
        } as EmployeePrivilege;
      }

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
    enabled: !!employeeId,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const updatePrivileges = useMutation({
    mutationFn: async (updates: Partial<EmployeePrivilege>) => {
      if (!employeeId) throw new Error('Employee ID is required');

      const { error } = await supabase
        .from('employee_privileges')
        .update({
          can_view_patient_info: updates.canViewPatientInfo,
          can_edit_patient_info: updates.canEditPatientInfo,
          can_delete_patient_info: updates.canDeletePatientInfo,
          can_view_billing_info: updates.canViewBillingInfo,
          can_edit_billing_info: updates.canEditBillingInfo,
          can_delete_billing_info: updates.canDeleteBillingInfo,
          can_view_dispatch_info: updates.canViewDispatchInfo,
          can_edit_dispatch_info: updates.canEditDispatchInfo,
          can_delete_dispatch_info: updates.canDeleteDispatchInfo,
          can_view_reports: updates.canViewReports,
          can_create_reports: updates.canCreateReports,
          can_edit_reports: updates.canEditReports,
          can_delete_reports: updates.canDeleteReports,
          can_use_ai_assistance: updates.canUseAIAssistance
        })
        .eq('employee_id', employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-privileges', employeeId] });
      toast({
        title: "Success",
        description: "Employee privileges updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating employee privileges:', error);
      toast({
        title: "Error",
        description: "Failed to update employee privileges",
        variant: "destructive",
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