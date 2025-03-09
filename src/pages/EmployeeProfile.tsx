
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
import { CertificationsTab } from "@/components/hr/tabs/CertificationsTab";
import { DocumentsTab } from "@/components/hr/tabs/DocumentsTab";
import { IncidentsTab } from "@/components/hr/tabs/IncidentsTab";
import { PlaceholderTab } from "@/components/hr/tabs/PlaceholderTab";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { useEmployeePayroll } from "@/hooks/useEmployeePayroll";

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [activeTab, setActiveTab] = useState("identity");
  
  const { roles, isLoading: loadingRoles, updateRole } = useEmployeeRoles(employeeId);
  const { privileges, isLoading: loadingPrivileges, updatePrivileges, getAIRecommendations } = useEmployeePrivileges(employeeId);
  const { employee, isLoading: loadingEmployee, updateEmployee } = useEmployeeDetails(employeeId);

  const isLoading = loadingRoles || loadingPrivileges || loadingEmployee;

  const handleEmployeeUpdate = (data: Partial<typeof employee>) => {
    updateEmployee.mutate(data);
  };

  // Render the active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "identity":
        return (
          <IdentityTab 
            employee={employee} 
            isLoading={isLoading} 
            onSave={handleEmployeeUpdate} 
          />
        );
      case "roles":
        return (
          <RolesTab 
            roles={roles} 
            updateRole={updateRole} 
          />
        );
      case "privileges":
        return (
          <PrivilegesTab 
            privileges={privileges} 
            updatePrivileges={updatePrivileges}
            getAIRecommendations={getAIRecommendations}
          />
        );
      case "demographics":
        return (
          <DemographicsTab
            employee={employee}
            isLoading={isLoading}
            onSave={handleEmployeeUpdate}
          />
        );
      case "payroll":
        return (
          <PayrollTab
            employee={employee}
            isLoading={isLoading}
            onSave={handleEmployeeUpdate}
          />
        );
      case "shifts":
        return (
          <ShiftsTab
            employeeId={employeeId}
          />
        );
      case "performance":
        return <PerformanceTab />;
      case "certifications":
        return <CertificationsTab />;
      case "documents":
        return <DocumentsTab employeeId={employeeId} />;
      case "incidents":
        return <IncidentsTab employeeId={employeeId} />;
      case "stats":
        return <PlaceholderTab value="stats" title="Performance Statistics" />;
      case "achievements":
        return <PlaceholderTab value="achievements" title="Achievements" />;
      case "notifications":
        return <PlaceholderTab value="notifications" title="Notification Preferences" />;
      default:
        return null;
    }
  };

  return (
    <HRLayout>
      <EmployeeHeader employee={employee} />

      <div className="container mx-auto">
        <EmployeeProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {renderActiveTabContent()}
        </EmployeeProfileTabs>
      </div>
    </HRLayout>
  );
};

export default EmployeeProfile;
