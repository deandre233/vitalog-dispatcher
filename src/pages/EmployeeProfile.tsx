import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  User,
  Phone,
  MapPin,
  Shield,
  Clock,
  ArrowLeft,
  Calendar,
  Mail,
  Building2
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
  created_at: string | null;
}

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast({
          title: "Error",
          description: "Failed to load employee details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id, toast]);

  if (!employee) {
    return null;
  }

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
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/employees')}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Directory
                </Button>
                
                <Card className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.first_name} ${employee.last_name}`} />
                      <AvatarFallback>{employee.first_name[0]}{employee.last_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h1 className="text-2xl font-bold">
                            {employee.first_name} {employee.last_name}
                          </h1>
                          <p className="text-gray-500">{employee.employee_type || 'Employee'}</p>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={`${
                            employee.status?.toLowerCase() === 'active' 
                              ? 'bg-green-500' 
                              : 'bg-gray-500'
                          } text-white`}
                        >
                          {employee.status || 'Unknown'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold">Contact Information</h3>
                          <div className="space-y-2">
                            {employee.mobile && (
                              <div className="flex items-center text-gray-600">
                                <Phone className="h-4 w-4 mr-2" />
                                {employee.mobile}
                              </div>
                            )}
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {employee.station || 'No station assigned'}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold">Employee Details</h3>
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <Shield className="h-4 w-4 mr-2" />
                              Certification: {employee.certification_level || 'Not specified'}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              Joined: {new Date(employee.created_at || '').toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Building2 className="h-4 w-4 mr-2" />
                              ID: {employee.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default EmployeeProfile;