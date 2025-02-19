
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HRLayout } from "@/components/layout/HRLayout";
import { EmployeeSearch } from "@/components/employee/EmployeeSearch";
import { EmployeeActions } from "@/components/employee/EmployeeActions";
import { EmployeeGrid } from "@/components/employee/EmployeeGrid";
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
    return [
      `${filteredEmployees.length} active employees`,
      `${filteredEmployees.filter(e => e.certification_level === 'Advanced').length} advanced certified`,
      `${filteredEmployees.filter(e => e.status === 'Active').length} currently on duty`
    ];
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
              <EmployeeSearch
                searchQuery={searchQuery}
                onSearch={handleSearch}
              />
              <EmployeeActions
                onAddEmployee={handleAddEmployee}
                insights={getAIInsights()}
              />
            </div>
          </div>
        </div>

        <EmployeeGrid
          employees={filteredEmployees}
          onEmployeeClick={handleEmployeeClick}
        />
      </div>
    </HRLayout>
  );
}

export default EmployeeDirectory;
