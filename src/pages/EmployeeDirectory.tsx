import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { EmployeeDirectorySidebar } from "@/components/navigation/EmployeeDirectorySidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HRLayout } from "@/components/layout/HRLayout";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  mobile: string | null;
  station: string | null;
  status: string | null;
  employee_type: string | null;
  certification_level: string | null;
}

export function EmployeeDirectory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .order('last_name', { ascending: true });

        if (error) throw error;

        setEmployees(data || []);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Error",
          description: "Failed to load employees",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [toast]);

  return (
    <HRLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((employee) => (
            <Card 
              key={employee.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/employee/${employee.id}`)}
            >
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} />
                  <AvatarFallback>{employee.first_name?.[0]}{employee.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">{employee.first_name} {employee.last_name}</h3>
                  <p className="text-sm text-gray-500">{employee.station || 'Unassigned'}</p>
                  <Badge variant="outline" className="mt-2">
                    {employee.certification_level || 'Uncertified'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </HRLayout>
  );
}

export default EmployeeDirectory;