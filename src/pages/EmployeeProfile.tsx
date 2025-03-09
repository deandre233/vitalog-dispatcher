import { useState } from "react";
import { useParams } from "react-router-dom";
import { HRLayout } from "@/components/layout/HRLayout";
import { EmployeeProfileTabs } from "@/components/hr/EmployeeProfileTabs";
import { IdentityTab } from "@/components/hr/tabs/IdentityTab";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
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
      <div className="bg-white border-b">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/employees")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {employee?.first_name} {employee?.last_name}
              </h1>
              <p className="text-gray-500 text-sm">
                {employee?.certification_level} • ID: {employee?.readable_id || employee?.id?.substring(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Employee
            </Button>
            <Button variant="outline">
              Next Employee <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </div>

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
          
          <TabsContent value="roles" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Employee Roles</h2>
                <div className="space-y-6">
        
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Crew Member</label>
            <Switch
              checked={roles?.is_crew_member}
              onCheckedChange={() => updateRole.mutate({is_crew_member: !roles?.is_crew_member})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Supervisor</label>
            <Switch
              checked={roles?.is_supervisor}
              onCheckedChange={() => updateRole.mutate({is_supervisor: !roles?.is_supervisor})}
            />
          </div>

          {roles?.is_supervisor && (
            <div className="ml-6">
              <label className="font-medium block mb-2">Supervisor Role</label>
              <Select
                value={roles.supervisor_role}
                onValueChange={(value) => updateRole.mutate({supervisor_role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Captain">Captain</SelectItem>
                  <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                  <SelectItem value="Full privileges">Full privileges</SelectItem>
                  <SelectItem value="Call-taker / Self-dispatch">Call-taker / Self-dispatch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="font-medium">Biller</label>
            <Switch
              checked={roles?.is_biller}
              onCheckedChange={() => updateRole.mutate({is_biller: !roles?.is_biller})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Dispatcher</label>
            <Switch
              checked={roles?.is_dispatcher}
              onCheckedChange={() => updateRole.mutate({is_dispatcher: !roles?.is_dispatcher})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">QA Reviewer</label>
            <Switch
              checked={roles?.is_qa_reviewer}
              onCheckedChange={() => updateRole.mutate({is_qa_reviewer: !roles?.is_qa_reviewer})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">HR</label>
            <Switch
              checked={roles?.is_hr}
              onCheckedChange={() => updateRole.mutate({is_hr: !roles?.is_hr})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Mechanic</label>
            <Switch
              checked={roles?.is_mechanic}
              onCheckedChange={() => updateRole.mutate({is_mechanic: !roles?.is_mechanic})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Salesperson</label>
            <Switch
              checked={roles?.is_salesperson}
              onCheckedChange={() => updateRole.mutate({is_salesperson: !roles?.is_salesperson})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Medical Director</label>
            <Switch
              checked={roles?.is_medical_director}
              onCheckedChange={() => updateRole.mutate({is_medical_director: !roles?.is_medical_director})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Onlooker</label>
            <Switch
              checked={roles?.is_onlooker}
              onCheckedChange={() => updateRole.mutate({is_onlooker: !roles?.is_onlooker})}
            />
          </div>

          {roles?.is_onlooker && (
            <div className="ml-6 space-y-4">
              <div>
                <label className="font-medium block mb-2">Facility</label>
                <input
                  type="text"
                  value={roles.onlooker_facility}
                  onChange={(e) => updateRole.mutate({ onlooker_facility: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-medium block mb-2">City</label>
                <input
                  type="text"
                  value={roles.onlooker_city}
                  onChange={(e) => updateRole.mutate({ onlooker_city: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-medium block mb-2">County</label>
                <input
                  type="text"
                  value={roles.onlooker_county}
                  onChange={(e) => updateRole.mutate({ onlooker_county: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="font-medium">Can See Non-Emergent</label>
            <Switch
              checked={roles?.can_see_non_emergent}
              onCheckedChange={() => updateRole.mutate({can_see_non_emergent: !roles?.can_see_non_emergent})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Administrator</label>
            <Switch
              checked={roles?.is_administrator}
              onCheckedChange={() => updateRole.mutate({is_administrator: !roles?.is_administrator})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Principal</label>
            <Switch
              checked={roles?.is_principal}
              onCheckedChange={() => updateRole.mutate({is_principal: !roles?.is_principal})}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Provisional</label>
            <Switch
              checked={roles?.is_provisional}
              onCheckedChange={() => updateRole.mutate({is_provisional: !roles?.is_provisional})}
            />
          </div>
        </div>
      </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privileges" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Employee Privileges</h2>
                <div className="grid gap-4">
          <div className="space-y-4">
            <h3 className="font-medium">Patient Information</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label>View</label>
                <Switch
                  checked={privileges?.can_view_patient_info}
                  onCheckedChange={() => updatePrivileges.mutate({can_view_patient_info: !privileges?.can_view_patient_info})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Edit</label>
                <Switch
                  checked={privileges?.can_edit_patient_info}
                  onCheckedChange={() => updatePrivileges.mutate({can_edit_patient_info: !privileges?.can_edit_patient_info})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Delete</label>
                <Switch
                  checked={privileges?.can_delete_patient_info}
                  onCheckedChange={() => updatePrivileges.mutate({can_delete_patient_info: !privileges?.can_delete_patient_info})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Billing Information</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label>View</label>
                <Switch
                  checked={privileges?.can_view_billing_info}
                  onCheckedChange={() => updatePrivileges.mutate({can_view_billing_info: !privileges?.can_view_billing_info})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Edit</label>
                <Switch
                  checked={privileges?.can_edit_billing_info}
                  onCheckedChange={() => updatePrivileges.mutate({can_edit_billing_info: !privileges?.can_edit_billing_info})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Delete</label>
                <Switch
                  checked={privileges?.can_delete_billing_info}
                  onCheckedChange={() => updatePrivileges.mutate({can_delete_billing_info: !privileges?.can_delete_billing_info})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Dispatch Information</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label>View</label>
                <Switch
                  checked={privileges?.can_view_dispatch_info}
                  onCheckedChange={() => updatePrivileges.mutate({can_view_dispatch_info: !privileges?.can_view_dispatch_info})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Edit</label>
                <Switch
                  checked={privileges?.can_edit_dispatch_info}
                  onCheckedChange={() => updatePrivileges.mutate({can_edit_dispatch_info: !privileges?.can_edit_dispatch_info})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Delete</label>
                <Switch
                  checked={privileges?.can_delete_dispatch_info}
                  onCheckedChange={() => updatePrivileges.mutate({can_delete_dispatch_info: !privileges?.can_delete_dispatch_info})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Reports</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label>View</label>
                <Switch
                  checked={privileges?.can_view_reports}
                  onCheckedChange={() => updatePrivileges.mutate({can_view_reports: !privileges?.can_view_reports})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Create</label>
                <Switch
                  checked={privileges?.can_create_reports}
                  onCheckedChange={() => updatePrivileges.mutate({can_create_reports: !privileges?.can_create_reports})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Edit</label>
                <Switch
                  checked={privileges?.can_edit_reports}
                  onCheckedChange={() => updatePrivileges.mutate({can_edit_reports: !privileges?.can_edit_reports})}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Delete</label>
                <Switch
                  checked={privileges?.can_delete_reports}
                  onCheckedChange={() => updatePrivileges.mutate({can_delete_reports: !privileges?.can_delete_reports})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">AI Features</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label>Use AI Assistance</label>
                <Switch
                  checked={privileges?.can_use_ai_assistance}
                  onCheckedChange={() => updatePrivileges.mutate({can_use_ai_assistance: !privileges?.can_use_ai_assistance})}
                />
              </div>
            </div>
          </div>
        </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Demographics</h2>
                <p className="text-gray-600">This section contains demographic information about the employee.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payroll" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Payroll Information</h2>
                <p className="text-gray-600">This section contains payroll and compensation information.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                <p className="text-gray-600">This section contains employee certifications and licenses.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Documents</h2>
                <p className="text-gray-600">This section contains employee documents and files.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Incidents</h2>
                <p className="text-gray-600">This section contains incident records related to this employee.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Performance Statistics</h2>
                <p className="text-gray-600">This section contains performance metrics and statistics.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                <p className="text-gray-600">This section contains employee achievements and recognition.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 animate-in fade-in-50">
            <div className="p-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <p className="text-gray-600">This section contains notification settings for this employee.</p>
              </div>
            </div>
          </TabsContent>
        </EmployeeProfileTabs>
      </div>
    </HRLayout>
  );
};

export default EmployeeProfile;
