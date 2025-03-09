
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HRLayout } from "@/components/layout/HRLayout";
import type { Employee } from "@/types/employee";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";
import { 
  Search, 
  UserPlus, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  MapPin,
  BadgeCheck,
  Clock,
  Phone
} from "lucide-react";

/**
 * Enhanced EmployeeDirectory Component
 * 
 * Features:
 * - Advanced filtering and search
 * - Multiple view options (grid/list)
 * - Visual categorization
 * - Performance optimizations
 */
export function EmployeeDirectory() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [certFilter, setCertFilter] = useState<string>("all");
  const [stationFilter, setStationFilter] = useState<string>("all");

  // Get unique stations and certification levels for filters
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

  // Filter employees based on search and filters
  useEffect(() => {
    let result = [...employees];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        employee => 
          employee.first_name?.toLowerCase().includes(query) || 
          employee.last_name?.toLowerCase().includes(query) ||
          `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(query)
      );
    }
    
    // Apply certification filter
    if (certFilter !== "all") {
      result = result.filter(
        employee => employee.certification_level === certFilter
      );
    }
    
    // Apply station filter
    if (stationFilter !== "all") {
      result = result.filter(
        employee => employee.station === stationFilter
      );
    }
    
    setFilteredEmployees(result);
  }, [searchQuery, certFilter, stationFilter, employees]);

  const handleEmployeeClick = (employeeId: string) => {
    logger.info(`Navigating to employee profile: ${employeeId}`);
    navigate(`/employee/${employeeId}`);
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

  if (isLoading) {
    return (
      <HRLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-36" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="text-center w-full">
                    <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
                    <Skeleton className="h-6 w-1/3 mx-auto rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
              Personnel Directory
            </h1>
            <p className="text-gray-500">
              View and manage all emergency service personnel
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm bg-gradient-to-r from-[#F1F0FB] to-white border-[#E5DEFF]">
              {filteredEmployees.length} Personnel
            </Badge>
            <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Personnel
            </Button>
          </div>
        </div>
        
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-[#E5DEFF]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search personnel..."
                className="pl-9 border-[#E5DEFF] focus:border-[#8B5CF6]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={certFilter} onValueChange={setCertFilter}>
              <SelectTrigger className="border-[#E5DEFF]">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-[#8B5CF6]" />
                  <SelectValue placeholder="Certification Level" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Certifications</SelectItem>
                {certificationLevels.map(cert => (
                  <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={stationFilter} onValueChange={setStationFilter}>
              <SelectTrigger className="border-[#E5DEFF]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#8B5CF6]" />
                  <SelectValue placeholder="Station" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stations</SelectItem>
                {stations.map(station => (
                  <SelectItem key={station} value={station}>{station}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3.5 w-3.5 mr-1" />
                More Filters
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
                Sort
              </Button>
            </div>
            
            <div className="border rounded-md p-0.5 bg-gray-50">
              <Button 
                variant={viewMode === "grid" ? "default" : "ghost"} 
                size="sm" 
                className={`h-7 ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm" 
                className={`h-7 ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full max-w-md mb-6 bg-[#F1F0FB]">
            <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              Active Personnel
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex-1 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              On Leave
            </TabsTrigger>
            <TabsTrigger value="new" className="flex-1 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              Recently Added
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEmployees.map((employee) => (
                  <Card 
                    key={employee.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-all group border-0 shadow"
                    onClick={() => handleEmployeeClick(employee.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${employee.first_name} ${employee.last_name}'s profile`}
                  >
                    <div className="h-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]"></div>
                    <div className="p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20 ring-4 ring-[#F1F0FB] ring-offset-2 group-hover:ring-[#E5DEFF]">
                            <AvatarImage 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`}
                              alt={`${employee.first_name} ${employee.last_name}`}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white">
                              {employee.first_name?.[0]}{employee.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#8B5CF6] transition-colors">
                            {employee.first_name} {employee.last_name}
                          </h3>
                          <div className="flex items-center justify-center mt-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                            <p>{employee.station || 'Unassigned'}</p>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 justify-center">
                            <Badge 
                              variant="outline" 
                              className={`${getStatusBadgeColor(employee.certification_level)} border transition-all group-hover:border-[#8B5CF6]/40`}
                            >
                              {employee.certification_level || 'Uncertified'}
                            </Badge>
                            {employee.years_experience && (
                              <Badge variant="outline" className="bg-[#F1F0FB] text-gray-700 border-[#E5DEFF]">
                                <Clock className="h-3 w-3 mr-1" />
                                {employee.years_experience} yrs
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEmployees.map((employee) => (
                  <div 
                    key={employee.id}
                    className="flex items-center border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleEmployeeClick(employee.id)}
                  >
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`}
                        alt={`${employee.first_name} ${employee.last_name}`}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white">
                        {employee.first_name?.[0]}{employee.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusBadgeColor(employee.certification_level)} border`}
                        >
                          {employee.certification_level || 'Uncertified'}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mt-1 gap-4">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{employee.station || 'Unassigned'}</span>
                        </div>
                        {employee.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{employee.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <div className="max-w-md mx-auto">
                  <h3 className="font-medium text-gray-900 mb-1">No personnel found</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setCertFilter("all");
                      setStationFilter("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-0">
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <div className="max-w-md mx-auto">
                <h3 className="font-medium text-gray-900 mb-1">Personnel on Leave</h3>
                <p className="text-gray-500 text-sm">
                  This tab will display personnel currently on leave or inactive status
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="mt-0">
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <div className="max-w-md mx-auto">
                <h3 className="font-medium text-gray-900 mb-1">Recently Added Personnel</h3>
                <p className="text-gray-500 text-sm">
                  This tab will display personnel added in the last 30 days
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HRLayout>
  );
}

export default EmployeeDirectory;
