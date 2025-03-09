
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
import { PlaceholderTab } from "@/components/hr/tabs/PlaceholderTab";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [activeTab, setActiveTab] = useState("identity");
  
  const { roles, isLoading: loadingRoles, updateRole } = useEmployeeRoles(employeeId);
  const { privileges, isLoading: loadingPrivileges, updatePrivileges } = useEmployeePrivileges(employeeId);
  const { employee, isLoading: loadingEmployee, updateEmployee } = useEmployeeDetails(employeeId);

  const isLoading = loadingRoles || loadingPrivileges || loadingEmployee;

  const handleEmployeeUpdate = (data: Partial<typeof employee>) => {
    updateEmployee.mutate(data);
  };

  return (
    <HRLayout>
      <EmployeeHeader employee={employee} />

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

          <PayrollTab
            employee={employee}
            isLoading={isLoading}
            onSave={handleEmployeeUpdate}
          />

          <ShiftsTab
            employeeId={employeeId}
          />

          <PlaceholderTab 
            value="demographics" 
            title="Demographics" 
          />

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
