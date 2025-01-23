import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Employee } from '@/types/employee';

export const useEmployeeData = (employeeId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: employee,
    isLoading,
    error
  } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      if (!employeeId) throw new Error('Employee ID is required');
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching employee:', error);
        toast({
          title: "Error fetching employee data",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        toast({
          title: "Employee not found",
          description: "The requested employee could not be found.",
          variant: "destructive",
        });
        throw new Error('Employee not found');
      }

      return data as Employee;
    },
    enabled: !!employeeId,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const updateEmployee = useMutation({
    mutationFn: async (updates: Partial<Employee>) => {
      if (!employeeId) throw new Error('Employee ID is required');

      const { error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
      toast({
        title: "Success",
        description: "Employee information updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating employee:', error);
      toast({
        title: "Error",
        description: "Failed to update employee information",
        variant: "destructive",
      });
    }
  });

  return {
    employee,
    isLoading,
    error,
    updateEmployee
  };
};