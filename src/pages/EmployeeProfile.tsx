
import { useParams } from "react-router-dom";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { EmployeeAIInsights } from "@/components/employee/EmployeeAIInsights";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import the component tabs
import { ProfileHeader } from "@/components/employee-profile/ProfileHeader";
import { TabsList } from "@/components/employee-profile/TabsList";
import { IdentityTab } from "@/components/employee-profile/IdentityTab";
import { PayrollTab } from "@/components/employee-profile/PayrollTab";
import { RolesTab } from "@/components/employee-profile/RolesTab";
import { PrivilegesTab } from "@/components/employee-profile/PrivilegesTab";
import { DemographicsTab } from "@/components/employee-profile/DemographicsTab";
import { IncidentsTab } from "@/components/employee-profile/IncidentsTab";
import { DocumentsTab } from "@/components/employee-profile/DocumentsTab";
import { StatsTab } from "@/components/employee-profile/StatsTab";
import { CertificatesTab } from "@/components/employee-profile/CertificatesTab";
import { AchievementsTab } from "@/components/employee-profile/AchievementsTab";
import { DamageTab } from "@/components/employee-profile/DamageTab";
import { AnnouncementsTab } from "@/components/employee-profile/AnnouncementsTab";
import { ImmunizationsTab } from "@/components/employee-profile/ImmunizationsTab";
import { TrackingTab } from "@/components/employee-profile/TrackingTab";

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { employee, isLoading: loadingEmployee } = useEmployeeData(id);
  const { roles, isLoading: loadingRoles, updateRole } = useEmployeeRoles(id);
  const { privileges, isLoading: loadingPrivileges, updatePrivileges } = useEmployeePrivileges(id);

  if (loadingEmployee || loadingRoles || loadingPrivileges) {
    return (
      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="p-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Employee not found</h2>
        <p className="mt-2 text-gray-600">The requested employee could not be found.</p>
      </div>
    );
  }

  const handleRoleToggle = (role: keyof typeof roles) => {
    if (!roles) return;
    updateRole.mutate({
      [role]: !roles[role]
    });
  };

  const handleSupervisorRoleChange = (value: typeof roles.supervisor_role) => {
    updateRole.mutate({
      supervisor_role: value
    });
  };

  const handlePrivilegeToggle = (privilege: keyof typeof privileges) => {
    if (!privileges) return;
    updatePrivileges.mutate({
      [privilege]: !privileges[privilege]
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ProfileHeader employee={employee} />

      <ScrollArea className="h-[calc(100vh-160px)]">
        <Tabs defaultValue="identity" className="space-y-6">
          <TabsList />

          <TabsContent value="identity">
            <IdentityTab employee={employee} />
          </TabsContent>

          <TabsContent value="payroll">
            <PayrollTab employee={employee} />
          </TabsContent>

          <TabsContent value="roles">
            <RolesTab 
              roles={roles} 
              handleRoleToggle={handleRoleToggle} 
              handleSupervisorRoleChange={handleSupervisorRoleChange}
              updateRole={updateRole}
            />
          </TabsContent>

          <TabsContent value="privileges">
            <PrivilegesTab 
              privileges={privileges} 
              handlePrivilegeToggle={handlePrivilegeToggle} 
            />
          </TabsContent>

          <TabsContent value="demographics">
            <DemographicsTab />
          </TabsContent>

          <TabsContent value="incidents">
            <IncidentsTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>

          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificatesTab />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab />
          </TabsContent>

          <TabsContent value="damage">
            <DamageTab />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsTab />
          </TabsContent>

          <TabsContent value="immunizations">
            <ImmunizationsTab />
          </TabsContent>
          
          <TabsContent value="tracking">
            <TrackingTab />
          </TabsContent>
        </Tabs>
      </ScrollArea>

      {id && <EmployeeAIInsights employeeId={id} />}
    </div>
  );
};

export default EmployeeProfile;
