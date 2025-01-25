import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HRLayout } from "@/components/layout/HRLayout";
import type { Employee } from "@/types/employee";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";

/**
 * EmployeeDirectory Component
 * 
 * Displays a grid of employee cards with basic information and navigation
 * to individual employee profiles.
 */
export function EmployeeDirectory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        logger.info('Fetching employees from database');
        
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .order('last_name', { ascending: true });

        if (error) {
          handleError(error);
          throw error;
        }

        setEmployees(data || []);
        logger.info(`Successfully fetched ${data?.length || 0} employees`);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Error",
          description: "Failed to load employees. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [toast]);

  const handleEmployeeClick = (employeeId: string) => {
    logger.info(`Navigating to employee profile: ${employeeId}`);
    navigate(`/employee/${employeeId}`);
  };

  if (isLoading) {
    return (
      <HRLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-500">Loading employees...</div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <Badge variant="outline" className="text-sm">
            {employees.length} Employees
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((employee) => (
            <Card 
              key={employee.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleEmployeeClick(employee.id)}
              role="button"
              tabIndex={0}
              aria-label={`View ${employee.first_name} ${employee.last_name}'s profile`}
            >
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} 
                    alt={`${employee.first_name} ${employee.last_name}`}
                  />
                  <AvatarFallback>
                    {employee.first_name?.[0]}{employee.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {employee.station || 'Unassigned'}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {employee.certification_level || 'Uncertified'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {employees.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No employees found</p>
          </div>
        )}
      </div>
    </HRLayout>
  );
}

export default EmployeeDirectory;