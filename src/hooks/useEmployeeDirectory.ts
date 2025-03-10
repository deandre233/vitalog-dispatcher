
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";
import { Employee } from "@/types/employee";

interface ExtendedEmployee extends Employee {
  years_experience?: number;
  phone?: string;
}

export function useEmployeeDirectory() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<ExtendedEmployee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<ExtendedEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("table"); // Default to table view for better visibility
  const [certFilter, setCertFilter] = useState<string>("all");
  const [stationFilter, setStationFilter] = useState<string>("all");

  const stations = useMemo(() => {
    const stationSet = new Set(employees.map(emp => emp.station || 'Unassigned'));
    return Array.from(stationSet);
  }, [employees]);

  const certificationLevels = useMemo(() => {
    const certSet = new Set(employees.map(emp => emp.certification_level || 'Uncertified'));
    return Array.from(certSet);
  }, [employees]);

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

        const employeesWithExperience = data?.map(emp => ({
          ...emp,
          years_experience: emp.first_hired_date 
            ? Math.floor((new Date().getTime() - new Date(emp.first_hired_date).getTime()) / (1000 * 60 * 60 * 24 * 365))
            : undefined,
          phone: emp.mobile
        })) || [];

        setEmployees(employeesWithExperience);
        setFilteredEmployees(employeesWithExperience);
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

  useEffect(() => {
    let result = [...employees];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        employee => 
          employee.first_name?.toLowerCase().includes(query) || 
          employee.last_name?.toLowerCase().includes(query) ||
          `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(query)
      );
    }
    
    if (certFilter !== "all") {
      result = result.filter(
        employee => employee.certification_level === certFilter
      );
    }
    
    if (stationFilter !== "all") {
      result = result.filter(
        employee => employee.station === stationFilter
      );
    }
    
    setFilteredEmployees(result);
  }, [searchQuery, certFilter, stationFilter, employees]);

  const resetFilters = () => {
    setSearchQuery("");
    setCertFilter("all");
    setStationFilter("all");
  };

  const getStatusBadgeColor = (role?: string) => {
    if (!role) return "bg-gray-100 text-gray-800";
    
    switch(role.toLowerCase()) {
      case 'paramedic':
        return "bg-green-100 text-green-800 border-green-300";
      case 'emt':
        return "bg-blue-100 text-blue-800 border-blue-300";
      case 'driver':
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 'dispatcher':
        return "bg-purple-100 text-purple-800 border-purple-300";
      case 'admin':
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return {
    employees,
    filteredEmployees,
    isLoading,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    certFilter,
    setCertFilter,
    stationFilter,
    setStationFilter,
    stations,
    certificationLevels,
    resetFilters,
    getStatusBadgeColor
  };
}
