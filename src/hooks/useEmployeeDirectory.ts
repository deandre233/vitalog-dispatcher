
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { crewRecommendationService } from "@/services/crewRecommendationService";
import { logger } from "@/utils/logger";
import { handleError } from "@/utils/errorHandling";
import { getRandomCapabilities, getRandomStatus } from "@/utils/capabilityUtils";
import type { Employee, CapabilityAlert, AICrewRecommendation } from "@/types/employee";

export const useEmployeeDirectory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<CapabilityAlert[]>([]);
  const [showCardView, setShowCardView] = useState(false);
  const [sortField, setSortField] = useState<keyof Employee>("last_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [aiRecommendations, setAiRecommendations] = useState<AICrewRecommendation[]>([]);
  const [assignmentRequirements, setAssignmentRequirements] = useState({
    serviceType: "Advanced",
    requiredCertifications: ["CPR", "ACLS"],
    startTime: new Date().toISOString(),
    location: ""
  });

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

        // Enhance employee data with mock capabilities for demo
        const enhancedData = data?.map(emp => ({
          ...emp,
          capabilities: getRandomCapabilities(),
          crew_status: getRandomStatus(),
          last_status_change: new Date(Date.now() - Math.random() * 8600000).toISOString()
        })) || [];

        setEmployees(enhancedData as Employee[]);
        setFilteredEmployees(enhancedData as Employee[]);
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

    const fetchAlerts = async () => {
      try {
        const alerts = await crewRecommendationService.getCapabilityAlerts();
        setAlerts(alerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchEmployees();
    fetchAlerts();
  }, [toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = employees.filter(employee => 
      employee.first_name?.toLowerCase().includes(query.toLowerCase()) ||
      employee.last_name?.toLowerCase().includes(query.toLowerCase()) ||
      employee.middle_name?.toLowerCase().includes(query.toLowerCase()) ||
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

  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    
    const sorted = [...filteredEmployees].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setFilteredEmployees(sorted);
  };

  const handleGetRecommendations = async () => {
    try {
      const recommendations = await crewRecommendationService.getRecommendedCrew(assignmentRequirements);
      setAiRecommendations(recommendations);
      
      toast({
        title: "AI Recommendations Ready",
        description: `Found ${recommendations.length} potential crew members for this assignment`,
      });
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get AI recommendations",
        variant: "destructive",
      });
    }
  };

  return {
    employees,
    filteredEmployees,
    searchQuery,
    isLoading,
    alerts,
    showCardView,
    sortField,
    sortDirection,
    aiRecommendations,
    assignmentRequirements,
    handleSearch,
    handleEmployeeClick,
    handleAddEmployee,
    handleSort,
    handleGetRecommendations,
    setShowCardView,
    setAiRecommendations,
    setAssignmentRequirements,
  };
};
