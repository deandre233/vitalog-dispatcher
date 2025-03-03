
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { EmployeeIdentityTab } from '@/components/employeeFile/EmployeeIdentityTab';
import { EmployeeRolesTab } from '@/components/employeeFile/EmployeeRolesTab';
import { EmployeePrivilegesTab } from '@/components/employeeFile/EmployeePrivilegesTab';
import { EmployeeCertificatesTab } from '@/components/employeeFile/EmployeeCertificatesTab';
import { EmployeePayrollTab } from '@/components/employeeFile/EmployeePayrollTab';
import { EmployeePerformanceTab } from '@/components/employeeFile/EmployeePerformanceTab';
import { EmployeeAIInsightsPanel } from '@/components/employeeFile/EmployeeAIInsightsPanel';
import { EmployeeTrackingTab } from '@/components/employeeFile/EmployeeTrackingTab';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeRoles } from '@/hooks/useEmployeeRoles';
import { useEmployeePrivileges } from '@/hooks/useEmployeePrivileges';

export default function EmployeeFile() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('identity');
  const { employee, isLoading: employeeLoading, error: employeeError } = useEmployeeData(id as string);
  const { roles, isLoading: rolesLoading, error: rolesError } = useEmployeeRoles(id as string);
  const { privileges, isLoading: privilegesLoading, error: privilegesError } = useEmployeePrivileges(id as string);

  const isLoading = employeeLoading || rolesLoading || privilegesLoading;
  const error = employeeError || rolesError || privilegesError;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading employee data: {error.message}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-4">
        <p>Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="w-full justify-start mb-6 overflow-x-auto p-1 rounded-md">
                <TabsTrigger value="identity">Identity</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="privileges">Privileges</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
            </ScrollArea>

            <TabsContent value="identity">
              <EmployeeIdentityTab employee={employee} />
            </TabsContent>
            
            <TabsContent value="roles">
              <EmployeeRolesTab roles={roles} />
            </TabsContent>
            
            <TabsContent value="privileges">
              <EmployeePrivilegesTab privileges={privileges} />
            </TabsContent>
            
            <TabsContent value="tracking">
              <EmployeeTrackingTab employee={employee} />
            </TabsContent>
            
            <TabsContent value="certificates">
              <EmployeeCertificatesTab isEditing={false} />
            </TabsContent>
            
            <TabsContent value="payroll">
              <EmployeePayrollTab isEditing={false} />
            </TabsContent>
            
            <TabsContent value="performance">
              <EmployeePerformanceTab employeeId={employee.id} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <EmployeeAIInsightsPanel employeeId={employee.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
