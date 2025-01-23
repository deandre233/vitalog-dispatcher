import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/types/employee";

interface PayrollHistory {
  id: string;
  employee_id: string;
  pay_rate: number;
  pay_type: string;
  effective_date: string;
  end_date: string | null;
  is_active: boolean;
}

export function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();

  const { data: employee } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Employee;
    },
  });

  const { data: payrollHistory } = useQuery({
    queryKey: ['payroll_history', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_payroll_history')
        .select('*')
        .eq('employee_id', id)
        .order('effective_date', { ascending: false });

      if (error) throw error;
      return data as PayrollHistory[];
    },
  });

  const updatePayrollHistory = async (values: Partial<PayrollHistory>) => {
    const { error } = await supabase
      .from('employee_payroll_history')
      .insert({
        employee_id: id,
        pay_rate: values.pay_rate,
        pay_type: values.pay_type,
        effective_date: values.effective_date,
        is_active: true
      });

    if (error) throw error;
  };

  return (
    <div>
      {employee && (
        <div>
          <h1>{employee.first_name} {employee.last_name}</h1>
          <div>
            <h2>Current Pay Information</h2>
            <p>Pay Rate: {payrollHistory?.[0]?.pay_rate}</p>
            <p>Pay Type: {payrollHistory?.[0]?.pay_type}</p>
          </div>
        </div>
      )}
    </div>
  );
}
