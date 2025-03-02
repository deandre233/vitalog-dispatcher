
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Filter, Brain, Bell, AlertTriangle, Check, X, Clock, Award, Thermometer } from "lucide-react";
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
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HRLayout } from "@/components/layout/HRLayout";
import type { Employee, CapabilityAlert, AICrewRecommendation } from "@/types/employee";
import { handleError } from "@/utils/errorHandling";
import { logger } from "@/utils/logger";
import { crewRecommendationService } from "@/services/crewRecommendationService";
import { DataTable } from "@/components/ui/data-table";

export function EmployeeDirectory() {
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

  const getRandomCapabilities = () => {
    const allCapabilities = ['CPR', 'ACLS', 'PALS', 'BLS', 'EMT-B', 'EMT-P', 'PHTLS'];
    const count = Math.floor(Math.random() * 5) + 1;
    const selectedCapabilities = [];
    for (let i = 0; i < count; i++) {
      const random = Math.floor(Math.random() * allCapabilities.length);
      selectedCapabilities.push(allCapabilities[random]);
    }
    return selectedCapabilities;
  };

  const getRandomStatus = (): Employee['crew_status'] => {
    const statuses: Employee['crew_status'][] = ['available', 'on-duty', 'off-duty', 'on-break'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

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

  const getStatusIcon = (status?: Employee['crew_status']) => {
    switch (status) {
      case 'available':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'on-duty':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'on-break':
        return <Thermometer className="h-4 w-4 text-orange-500" />;
      case 'off-duty':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
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

  const getAlertCountForEmployee = (employeeId: string) => {
    return alerts.filter(alert => alert.employeeId === employeeId).length;
  };

  const getCapabilityDisplay = (capability: string) => {
    switch (capability) {
      case 'CPR':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">CPR</Badge>;
      case 'ACLS':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">ACLS</Badge>;
      case 'PALS':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">PALS</Badge>;
      case 'BLS':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">BLS</Badge>;
      case 'EMT-B':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">EMT-B</Badge>;
      case 'EMT-P':
        return <Badge className="bg-red-100 text-red-800">EMT-P</Badge>;
      case 'PHTLS':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">PHTLS</Badge>;
      default:
        return <Badge variant="outline">{capability}</Badge>;
    }
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCardView(!showCardView)}
                  >
                    {showCardView ? "Table View" : "Card View"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Toggle between table and card view
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            
            <Button onClick={handleAddEmployee}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">
                  <Brain className="mr-2 h-4 w-4" />
                  AI Crew Recommendations
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>AI Crew Recommendations</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Assignment Requirements</h3>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm text-muted-foreground">Service Type</label>
                          <select 
                            className="w-full p-2 border rounded-md"
                            value={assignmentRequirements.serviceType}
                            onChange={(e) => setAssignmentRequirements({
                              ...assignmentRequirements,
                              serviceType: e.target.value
                            })}
                          >
                            <option value="Basic">Basic</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Critical">Critical</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Location</label>
                          <Input 
                            placeholder="Station or location"
                            value={assignmentRequirements.location}
                            onChange={(e) => setAssignmentRequirements({
                              ...assignmentRequirements,
                              location: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <Button onClick={handleGetRecommendations}>Get Recommendations</Button>
                    </div>
                  </div>

                  {aiRecommendations.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Top Recommendations</h3>
                      <div className="space-y-3">
                        {aiRecommendations.slice(0, 5).map((rec) => {
                          const employee = employees.find(e => e.id === rec.employeeId);
                          return (
                            <Card key={rec.employeeId} className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">
                                    {employee?.first_name} {employee?.last_name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {employee?.certification_level} • {employee?.station}
                                  </p>
                                  <div className="mt-2">
                                    <Badge className="bg-green-100 text-green-800">
                                      {Math.round(rec.matchScore)}% Match
                                    </Badge>
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEmployeeClick(rec.employeeId)}
                                >
                                  View
                                </Button>
                              </div>
                              <div className="mt-3 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <span className="text-muted-foreground">Skill Match:</span>
                                    <span className="ml-1 font-medium">{Math.round(rec.skillMatchScore)}%</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Availability:</span>
                                    <span className="ml-1 font-medium">{Math.round(rec.availabilityScore)}%</span>
                                  </div>
                                </div>
                              </div>
                              {rec.warnings && rec.warnings.length > 0 && (
                                <div className="mt-2 text-sm text-amber-600 flex items-center">
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  {rec.warnings[0]}
                                </div>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <SheetFooter className="mt-4">
                  <Button variant="outline" onClick={() => setAiRecommendations([])}>
                    Clear Recommendations
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            {alerts.length > 0 && (
              <Button variant="outline" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {alerts.length}
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <Badge variant="outline" className="text-sm">
            {filteredEmployees.length} Employees
          </Badge>
        </div>
        
        {showCardView ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <Card 
                key={employee.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-102 bg-gradient-to-br from-background to-secondary/10"
                onClick={() => handleEmployeeClick(employee.id)}
                role="button"
                tabIndex={0}
                aria-label={`View ${employee.first_name} ${employee.last_name}'s profile`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} 
                        alt={`${employee.first_name} ${employee.last_name}`}
                      />
                      <AvatarFallback>
                        {employee.first_name?.[0]}{employee.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {getAlertCountForEmployee(employee.id) > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getAlertCountForEmployee(employee.id)}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {employee.station || 'Unassigned'}
                    </p>
                    <Badge 
                      variant={employee.certification_level === 'Advanced' ? 'default' : 'outline'} 
                      className="mt-2"
                    >
                      {employee.certification_level || 'Uncertified'}
                    </Badge>
                    <div className="mt-2 flex items-center justify-center gap-1">
                      {getStatusIcon(employee.crew_status)}
                      <span className="text-xs">{employee.crew_status || 'Unknown'}</span>
                    </div>
                    
                    {employee.capabilities && employee.capabilities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1 justify-center">
                        {employee.capabilities.slice(0, 3).map(cap => (
                          <span key={cap} className="inline-block">
                            {getCapabilityDisplay(cap)}
                          </span>
                        ))}
                        {employee.capabilities.length > 3 && (
                          <Badge variant="outline" className="bg-gray-50">
                            +{employee.capabilities.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[180px] cursor-pointer"
                    onClick={() => handleSort('last_name')}
                  >
                    Last Name
                    {sortField === 'last_name' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('first_name')}
                  >
                    First + Middle
                    {sortField === 'first_name' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('station')}
                  >
                    Station
                    {sortField === 'station' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead>Capabilities</TableHead>
                  <TableHead>Crew Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow 
                    key={employee.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleEmployeeClick(employee.id)}
                  >
                    <TableCell className="font-medium">{employee.last_name}</TableCell>
                    <TableCell>{employee.first_name} {employee.middle_name || ''}</TableCell>
                    <TableCell>{employee.mobile || 'N/A'}</TableCell>
                    <TableCell>{employee.station || 'Unassigned'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee.capabilities?.slice(0, 3).map(cap => (
                          <span key={cap} className="inline-block">
                            {getCapabilityDisplay(cap)}
                          </span>
                        ))}
                        {employee.capabilities && employee.capabilities.length > 3 && (
                          <Badge variant="outline" className="bg-gray-50">
                            +{employee.capabilities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(employee.crew_status)}
                        <span className="text-sm capitalize">
                          {employee.crew_status || 'Unknown'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        {getAlertCountForEmployee(employee.id) > 0 && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {getAlertCountForEmployee(employee.id)}
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {filteredEmployees.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No employees found matching your search</p>
          </div>
        )}
      </div>
    </HRLayout>
  );
}

export default EmployeeDirectory;
