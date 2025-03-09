
import { useState } from "react";
import { useParams } from "react-router-dom";
import { HRLayout } from "@/components/layout/HRLayout";
import { EmployeeProfileTabs } from "@/components/hr/EmployeeProfileTabs";
import { EmployeeHeader } from "@/components/hr/EmployeeHeader";
import { IdentityTab } from "@/components/hr/tabs/IdentityTab";
import { RolesTab } from "@/components/hr/tabs/RolesTab";
import { PrivilegesTab } from "@/components/hr/tabs/PrivilegesTab";
import { PayrollTab } from "@/components/hr/tabs/PayrollTab";
import { ShiftsTab } from "@/components/hr/tabs/ShiftsTab";
import { DemographicsTab } from "@/components/hr/tabs/DemographicsTab";
import { PerformanceTab } from "@/components/hr/tabs/PerformanceTab";
import { PlaceholderTab } from "@/components/hr/tabs/PlaceholderTab";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [activeTab, setActiveTab] = useState("roles"); // Set to roles tab by default
  
  const { roles, isLoading: loadingRoles, updateRole } = useEmployeeRoles(employeeId);
  const { privileges, isLoading: loadingPrivileges, updatePrivileges } = useEmployeePrivileges(employeeId);
  const { employee, isLoading: loadingEmployee, updateEmployee } = useEmployeeDetails(employeeId);

  const isLoading = loadingRoles || loadingPrivileges || loadingEmployee;

  const handleEmployeeUpdate = (data: Partial<typeof employee>) => {
    updateEmployee.mutate(data);
  };

  // Check for roles that require attention
  const needsAttention = () => {
    if (!roles) return false;
    // If they're an onlooker but missing facility or city
    if (roles.is_onlooker && (!roles.onlooker_facility || !roles.onlooker_city)) return true;
    // If they have high-risk roles
    if (roles.is_administrator || roles.is_principal) return true;
    return false;
  };

  return (
    <HRLayout>
      <EmployeeHeader employee={employee} />

      {needsAttention() && (
        <div className="mx-auto container bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          <p className="text-sm text-amber-700">
            This employee has roles that need attention or have high security privileges.
          </p>
        </div>
      )}

      <div className="container mx-auto">
        <EmployeeProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          <IdentityTab 
            employee={employee} 
            isLoading={isLoading} 
            onSave={handleEmployeeUpdate} 
          />
          
          <RolesTab 
            roles={roles} 
            updateRole={updateRole} 
          />

          <PrivilegesTab 
            privileges={privileges} 
            updatePrivileges={updatePrivileges} 
          />

          <DemographicsTab
            employee={employee}
            isLoading={isLoading}
            onSave={handleEmployeeUpdate}
          />

          <PayrollTab
            employee={employee}
            isLoading={isLoading}
            onSave={handleEmployeeUpdate}
          />

          <ShiftsTab
            employeeId={employeeId}
          />
          
          <PerformanceTab />

          <PlaceholderTab 
            value="certifications" 
            title="Certifications" 
          />

          <PlaceholderTab 
            value="documents" 
            title="Documents" 
          />

          <PlaceholderTab 
            value="incidents" 
            title="Incidents" 
          />

          <PlaceholderTab 
            value="stats" 
            title="Performance Statistics" 
          />

          <PlaceholderTab 
            value="achievements" 
            title="Achievements" 
          />

          <PlaceholderTab 
            value="notifications" 
            title="Notification Preferences" 
          />
        </EmployeeProfileTabs>
      </div>
    </HRLayout>
  );
};

export default EmployeeProfile;
