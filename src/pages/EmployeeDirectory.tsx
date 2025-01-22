import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { EmployeeDirectorySidebar } from "@/components/navigation/EmployeeDirectorySidebar";
import { 
  User,
  Phone,
  MapPin,
  Shield,
  Clock,
  Plus,
  CircuitBoard,
  Search,
  Filter
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
  const [searchTerm, setSearchTerm] = useState("");
  const [hideInactive, setHideInactive] = useState(false);

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
        return 'bg-gradient-to-r from-green-400 to-green-500';
      case 'inactive':
        return 'bg-gradient-to-r from-red-400 to-red-500';
      case 'on leave':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (employee.first_name + " " + employee.last_name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = hideInactive ? employee.status?.toLowerCase() === 'active' : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <EmployeeDirectorySidebar />
        <div className="flex-1 bg-[#f4f7fc] overflow-auto">
          <div className="p-6 space-y-6">
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-medical-secondary/10">
                    <CircuitBoard className="h-6 w-6 text-medical-secondary" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
                    Employee Directory
                  </h1>
                </div>
                <Button 
                  onClick={() => navigate('/employee/new')}
                  className="bg-gradient-to-r from-medical-gradient-start to-medical-gradient-end hover:shadow-lg transition-all duration-300 group"
                >
                  <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  Add Employee
                </Button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medical-secondary/50" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-medical-secondary/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-medical-secondary/30 transition-all duration-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hideInactive"
                    checked={hideInactive}
                    onChange={(e) => setHideInactive(e.target.checked)}
                    className="rounded border-medical-secondary/20"
                  />
                  <label htmlFor="hideInactive" className="text-sm text-medical-primary">
                    Hide inactive employees
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                    <Card 
                      key={employee.id}
                      className="futuristic-card p-4 group hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden"
                      onClick={() => handleEmployeeClick(employee.id)}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-medical-gradient-start/10 to-medical-gradient-end/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex items-start gap-4 relative z-10">
                          <Avatar className="h-12 w-12 ring-2 ring-medical-secondary/20 ring-offset-2">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.first_name} ${employee.last_name}`} />
                            <AvatarFallback className="bg-gradient-to-br from-medical-gradient-start to-medical-gradient-end text-white">
                              {employee.first_name[0]}{employee.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-medical-primary">
                                  {employee.first_name} {employee.last_name}
                                </h3>
                                <p className="text-sm text-medical-secondary">
                                  {employee.employee_type || 'Employee'}
                                </p>
                              </div>
                              <Badge 
                                variant="secondary"
                                className={`${getStatusColor(employee.status)} text-white shadow-sm`}
                              >
                                {employee.status || 'Unknown'}
                              </Badge>
                            </div>
                            <div className="mt-3 space-y-2">
                              {employee.certification_level && (
                                <div className="flex items-center text-sm text-medical-primary/80 hover:text-medical-primary transition-colors">
                                  <Shield className="h-4 w-4 mr-2 text-medical-secondary" />
                                  {employee.certification_level}
                                </div>
                              )}
                              {employee.mobile && (
                                <div className="flex items-center text-sm text-medical-primary/80 hover:text-medical-primary transition-colors">
                                  <Phone className="h-4 w-4 mr-2 text-medical-secondary" />
                                  {employee.mobile}
                                </div>
                              )}
                              {employee.station && (
                                <div className="flex items-center text-sm text-medical-primary/80 hover:text-medical-primary transition-colors">
                                  <MapPin className="h-4 w-4 mr-2 text-medical-secondary" />
                                  {employee.station}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDirectory;
