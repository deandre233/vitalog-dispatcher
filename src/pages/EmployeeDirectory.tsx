import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User,
  Phone,
  MapPin,
  Shield,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  const handleEmployeeClick = (id: string) => {
    navigate(`/employee/${id}`);
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-red-500';
      case 'on leave':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarRail />
            <div className="flex-1 bg-[#f4f7fc] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Employee Directory</h1>
                  <Button onClick={() => navigate('/employee/new')}>
                    Add Employee
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map((employee) => (
                    <Card 
                      key={employee.id}
                      className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleEmployeeClick(employee.id)}
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.first_name} ${employee.last_name}`} />
                          <AvatarFallback>{employee.first_name[0]}{employee.last_name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{employee.first_name} {employee.last_name}</h3>
                              <p className="text-sm text-gray-500">{employee.employee_type || 'Employee'}</p>
                            </div>
                            <Badge 
                              variant="secondary"
                              className={`${getStatusColor(employee.status)} text-white`}
                            >
                              {employee.status || 'Unknown'}
                            </Badge>
                          </div>
                          <div className="mt-2 space-y-1">
                            {employee.certification_level && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Shield className="h-4 w-4 mr-2" />
                                {employee.certification_level}
                              </div>
                            )}
                            {employee.mobile && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {employee.mobile}
                              </div>
                            )}
                            {employee.station && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                {employee.station}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default EmployeeDirectory;