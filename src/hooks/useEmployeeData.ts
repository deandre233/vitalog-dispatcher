import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Employee } from '@/types/employee';

export const useEmployeeData = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error('Employee ID is required');
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (error) throw error;
      return data as Employee;
    },
    enabled: !!employeeId
  });
};