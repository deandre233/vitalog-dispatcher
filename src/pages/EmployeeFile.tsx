import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HRLayout } from "@/components/layout/HRLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Edit, Save, ArrowLeft, User, FileText, BadgeAlert } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { useAIEmployeeAnalysis } from "@/hooks/useAIEmployeeAnalysis";
import { EmployeeIdentityTab } from "@/components/employeeFile/EmployeeIdentityTab";
import { EmployeeRolesTab } from "@/components/employeeFile/EmployeeRolesTab";
import { EmployeePrivilegesTab } from "@/components/employeeFile/EmployeePrivilegesTab";
import { EmployeeCertificatesTab } from "@/components/employeeFile/EmployeeCertificatesTab";
import { EmployeePerformanceTab } from "@/components/employeeFile/EmployeePerformanceTab";
import { EmployeePayrollTab } from "@/components/employeeFile/EmployeePayrollTab";
import { EmployeeAIInsightsPanel } from "@/components/employeeFile/EmployeeAIInsightsPanel";

export default function EmployeeFile() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const { employee, isLoading: isLoadingEmployee, updateEmployee } = useEmployeeData(id);
  const { roles, isLoading: isLoadingRoles } = useEmployeeRoles(id);
  const { privileges, isLoading: isLoadingPrivileges } = useEmployeePrivileges(id);
  const { analysis, isLoading: isLoadingAnalysis } = useAIEmployeeAnalysis(id || '');
  
  const isLoading = isLoadingEmployee || isLoadingRoles || isLoadingPrivileges || isLoadingAnalysis;

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      // In a real implementation, we would gather all the changes and save them
      toast({
        title: "Changes saved",
        description: "Employee information has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <HRLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-gray-500">Loading employee data...</div>
        </div>
      </HRLayout>
    );
  }

  if (!employee) {
    return (
      <HRLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold">Employee Not Found</h1>
          <p className="text-gray-500">The employee you're looking for does not exist or you don't have access.</p>
          <Button asChild>
            <Link to="/employee-directory">Return to Directory</Link>
          </Button>
        </div>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/employee-directory">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button onClick={handleSaveChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={handleToggleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Employee
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Employee Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} />
                  <AvatarFallback>
                    {employee.first_name?.[0]}{employee.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{employee.first_name} {employee.last_name}</h2>
                  <p className="text-gray-500">{employee.readable_id}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant={employee.status === 'Active' ? 'default' : 'outline'}>
                    {employee.status}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {employee.certification_level || 'Uncertified'}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {employee.station || 'Unassigned'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">First Hired:</span>
                  <span>{employee.first_hired_date ? new Date(employee.first_hired_date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mobile:</span>
                  <span>{employee.mobile || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Employee Type:</span>
                  <span>{employee.employee_type || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pay Type:</span>
                  <span>{employee.pay_type || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pay Rate:</span>
                  <span>${employee.pay_rate?.toFixed(2) || 'N/A'}</span>
                </div>
              </div>

              <Separator />

              {/* AI Performance Metrics Summary */}
              <div className="space-y-3">
                <h3 className="font-semibold">AI Performance Analysis</h3>
                {analysis ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Efficiency:</span>
                      <Badge variant={analysis.efficiency_score > 70 ? 'default' : 'outline'} className="ml-auto">
                        {Math.round(analysis.efficiency_score)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Communication:</span>
                      <Badge variant={analysis.communication_score > 70 ? 'default' : 'outline'} className="ml-auto">
                        {Math.round(analysis.communication_score)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Teamwork:</span>
                      <Badge variant={analysis.teamwork_score > 70 ? 'default' : 'outline'} className="ml-auto">
                        {Math.round(analysis.teamwork_score)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Technical Skills:</span>
                      <Badge variant={analysis.technical_skills > 70 ? 'default' : 'outline'} className="ml-auto">
                        {Math.round(analysis.technical_skills)}%
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 text-gray-500">
                    No analysis data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Employee Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="identity" className="w-full">
              <TabsList className="w-full grid grid-cols-3 lg:grid-cols-6 mb-4">
                <TabsTrigger value="identity">Identity</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="privileges">Privileges</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
              </TabsList>

              <TabsContent value="identity">
                <EmployeeIdentityTab 
                  employeeData={employee} 
                  isEditing={isEditing}
                  updateEmployeeData={updateEmployee}
                />
              </TabsContent>

              <TabsContent value="roles">
                <EmployeeRolesTab roles={roles} isEditing={isEditing} />
              </TabsContent>

              <TabsContent value="privileges">
                <EmployeePrivilegesTab privileges={privileges} isEditing={isEditing} />
              </TabsContent>

              <TabsContent value="certificates">
                <EmployeeCertificatesTab employee={employee} isEditing={isEditing} />
              </TabsContent>

              <TabsContent value="performance">
                <EmployeePerformanceTab employeeId={employee.id} />
              </TabsContent>

              <TabsContent value="payroll">
                <EmployeePayrollTab employee={employee} isEditing={isEditing} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* AI Insights Panel */}
        {id && <EmployeeAIInsightsPanel employeeId={id} analysis={analysis} />}
      </div>
    </HRLayout>
  );
}
