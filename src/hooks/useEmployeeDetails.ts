
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Employee } from "@/types/employee";

export interface EmployeeDetails extends Employee {
  emergency_contact?: string;
  login_name?: string;
  email?: string;
  access_history?: {
    last_login?: string;
    last_password_change?: string;
    account_lockouts?: number;
  };
  messaging_preferences?: {
    primary_type?: string;
    primary_contact?: string;
    secondary_type?: string;
    secondary_contact?: string;
    notification_events?: string[];
  };
}

const defaultEmployee: EmployeeDetails = {
  id: '',
  first_name: '',
  last_name: '',
  mobile: '',
  station: '',
  status: 'Active',
  employee_type: '',
  certification_level: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  readable_id: '',
  first_hired_date: '',
  pay_type: 'hourly',
  pay_rate: 0,
  uses_timeclock: true,
  access_codes: '',
  photo_url: '',
  emergency_contact: '',
  login_name: '',
  email: '',
  access_history: {
    last_login: new Date().toISOString(),
    last_password_change: new Date().toISOString(),
    account_lockouts: 0,
  },
  messaging_preferences: {
    primary_type: 'sms',
    primary_contact: '',
    secondary_type: 'email',
    secondary_contact: '',
    notification_events: [],
  }
};

export const useEmployeeDetails = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const { data: employee = defaultEmployee, isLoading, error } = useQuery({
    queryKey: ["employee_details", employeeId],
    queryFn: async () => {
      if (!employeeId) return defaultEmployee;

      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", employeeId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching employee details:', error);
        toast({
          title: "Error fetching employee details",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (!data) return defaultEmployee;

      return {
        ...data,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        emergency_contact: "",
        login_name: `${data.first_name?.toLowerCase() || ''}${data.last_name?.toLowerCase().charAt(0) || ''}`,
        email: `${data.first_name?.toLowerCase() || ''}${data.last_name?.toLowerCase().charAt(0) || ''}@ambulance.org`,
        access_history: {
          last_login: new Date().toISOString(),
          last_password_change: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          account_lockouts: 0,
        },
        messaging_preferences: {
          primary_type: 'sms',
          primary_contact: data.mobile || '',
          secondary_type: 'email',
          secondary_contact: `${data.first_name?.toLowerCase() || ''}${data.last_name?.toLowerCase().charAt(0) || ''}@ambulance.org`,
          notification_events: [],
        }
      } as EmployeeDetails;
    },
    enabled: !!employeeId
  });

  const updateEmployee = useMutation({
    mutationFn: async (updates: Partial<Employee>) => {
      if (!employeeId) throw new Error("Employee ID is required");

      const { error } = await supabase
        .from("employees")
        .update(updates)
        .eq("id", employeeId);

      if (error) {
        console.error('Error updating employee:', error);
        toast({
          title: "Error",
          description: "Failed to update employee information",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_details", employeeId] });
      toast({
        title: "Success",
        description: "Employee information updated successfully",
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
