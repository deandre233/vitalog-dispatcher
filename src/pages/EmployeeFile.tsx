
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { EmployeeIdentityTab } from "@/components/employeeFile/EmployeeIdentityTab";
import { EmployeeRolesTab } from "@/components/employeeFile/EmployeeRolesTab";
import { EmployeePrivilegesTab } from "@/components/employeeFile/EmployeePrivilegesTab";
import { EmployeeCertificatesTab } from "@/components/employeeFile/EmployeeCertificatesTab";
import { EmployeePayrollTab } from "@/components/employeeFile/EmployeePayrollTab"; 
import { EmployeePerformanceTab } from "@/components/employeeFile/EmployeePerformanceTab";
import { EmployeeTrackingTab } from "@/components/employeeFile/EmployeeTrackingTab";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmployeeAIInsightsPanel } from "@/components/employeeFile/EmployeeAIInsightsPanel";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";

export default function EmployeeFile() {
  const { id } = useParams<{ id: string }>();
  const { employee, loading: employeeLoading, error: employeeError } = useEmployeeData(id || "");
  const { roles, loading: rolesLoading } = useEmployeeRoles(id || "");
  const { privileges, loading: privilegesLoading } = useEmployeePrivileges(id || "");
  const [activeTab, setActiveTab] = useState("identity");

  const loading = employeeLoading || rolesLoading || privilegesLoading;

  if (loading) {
    return <LoadingSpinner message="Loading employee file..." />;
  }

  if (employeeError || !employee) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Employee Not Found</h2>
              <p className="text-gray-600">The requested employee file could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScrollArea className="h-[calc(100vh-100px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-wrap">
                <TabsTrigger value="identity">Identity</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="privileges">Privileges</TabsTrigger>
                <TabsTrigger value="certificates">Certifications</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="tracking">Location Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="identity">
                <EmployeeIdentityTab employee={employee} />
              </TabsContent>

              <TabsContent value="roles">
                <EmployeeRolesTab roles={roles} employee={employee} />
              </TabsContent>

              <TabsContent value="privileges">
                <EmployeePrivilegesTab privileges={privileges} employee={employee} />
              </TabsContent>

              <TabsContent value="certificates">
                <EmployeeCertificatesTab employee={employee} />
              </TabsContent>

              <TabsContent value="payroll">
                <EmployeePayrollTab employee={employee} />
              </TabsContent>

              <TabsContent value="performance">
                <EmployeePerformanceTab employee={employee} />
              </TabsContent>

              <TabsContent value="tracking">
                <EmployeeTrackingTab employee={employee} />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>

        <div>
          <EmployeeAIInsightsPanel employee={employee} />
        </div>
      </div>
    </div>
  );
}
