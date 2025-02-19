
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Filter, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HRLayout } from "@/components/layout/HRLayout";
import type { Employee } from "@/types/employee";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";

export function EmployeeDirectory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
        setFilteredEmployees(data || []);
        logger.info(`Successfully fetched ${data?.length || 0} employees`);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: "Error",
          description: "Failed to load employee directory. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = employees.filter(employee => 
      employee.first_name?.toLowerCase().includes(query.toLowerCase()) ||
      employee.last_name?.toLowerCase().includes(query.toLowerCase()) ||
      employee.station?.toLowerCase().includes(query.toLowerCase()) ||
      employee.certification_level?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleEmployeeClick = (employeeId: string) => {
    logger.info(`Navigating to employee profile: ${employeeId}`);
    navigate(`/employee/${employeeId}`);
  };

  const handleAddEmployee = () => {
    navigate("/create");
  };

  const getAIInsights = () => {
    const insights = [
      `${filteredEmployees.length} active employees`,
      `${filteredEmployees.filter(e => e.certification_level === 'Advanced').length} advanced certified`,
      `${filteredEmployees.filter(e => e.status === 'Active').length} currently on duty`
    ];
    return insights;
  };

  if (isLoading) {
    return (
      <HRLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-500">Loading employee directory...</div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
          <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-12 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button onClick={handleAddEmployee} className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" className="bg-purple-500/20 hover:bg-purple-500/30 text-white border-purple-400/20">
                      <Brain className="mr-2 h-4 w-4" />
                      AI Insights
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>AI Workforce Insights</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {getAIInsights().map((insight, index) => (
                        <div key={index} className="p-4 bg-purple-500/10 rounded-lg text-white">
                          {insight}
                        </div>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Employee Directory</h1>
          <Badge variant="outline" className="text-sm bg-white/5 text-white border-white/10">
            {filteredEmployees.length} Employees
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((employee) => (
            <Card 
              key={employee.id}
              className="group relative bg-black/40 backdrop-blur-xl border-white/10 hover:bg-black/50 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handleEmployeeClick(employee.id)}
              role="button"
              tabIndex={0}
              aria-label={`View ${employee.first_name} ${employee.last_name}'s profile`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-6 relative space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all duration-300">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} 
                      alt={`${employee.first_name} ${employee.last_name}`}
                    />
                    <AvatarFallback className="bg-indigo-500/20 text-white">
                      {employee.first_name?.[0]}{employee.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-indigo-200 transition-colors duration-300">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {employee.station || 'Unassigned'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={employee.certification_level === 'Advanced' ? 'default' : 'outline'} 
                    className="bg-indigo-500/20 text-indigo-200 border-indigo-400/20"
                  >
                    {employee.certification_level || 'Uncertified'}
                  </Badge>
                  {employee.status === 'Active' && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">On Duty</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400">No employees found matching your search</p>
          </div>
        )}
      </div>
    </HRLayout>
  );
}

export default EmployeeDirectory;
