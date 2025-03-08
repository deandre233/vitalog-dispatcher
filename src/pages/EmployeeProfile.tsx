import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { EmployeeRole, EmployeePrivileges } from "@/types/employee";

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { roles, isLoading: loadingRoles, updateRole } = useEmployeeRoles(employeeId);
  const { privileges, isLoading: loadingPrivileges, updatePrivileges } = useEmployeePrivileges(employeeId);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadingRoles && !loadingPrivileges) {
      setLoading(false);
    }
  }, [loadingRoles, loadingPrivileges]);

  const handleRoleToggle = (role: keyof EmployeeRole) => {
    if (!roles) return;
    updateRole.mutate({
      [role]: !roles[role]
    });
  };

  const handleSupervisorRoleChange = (value: EmployeeRole['supervisor_role']) => {
    updateRole.mutate({
      supervisor_role: value
    });
  };

  const handlePrivilegeToggle = (privilege: keyof EmployeePrivileges) => {
    if (!privileges) return;
    updatePrivileges.mutate({
      [privilege]: !privileges[privilege]
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Employee Profile</h1>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Roles</h2>
        
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Crew Member</label>
            <Switch
              checked={roles?.is_crew_member}
              onCheckedChange={() => handleRoleToggle('is_crew_member')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Supervisor</label>
            <Switch
              checked={roles?.is_supervisor}
              onCheckedChange={() => handleRoleToggle('is_supervisor')}
            />
          </div>

          {roles?.is_supervisor && (
            <div className="ml-6">
              <label className="font-medium block mb-2">Supervisor Role</label>
              <Select
                value={roles.supervisor_role}
                onValueChange={handleSupervisorRoleChange}
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
              onCheckedChange={() => handleRoleToggle('is_biller')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Dispatcher</label>
            <Switch
              checked={roles?.is_dispatcher}
              onCheckedChange={() => handleRoleToggle('is_dispatcher')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">QA Reviewer</label>
            <Switch
              checked={roles?.is_qa_reviewer}
              onCheckedChange={() => handleRoleToggle('is_qa_reviewer')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">HR</label>
            <Switch
              checked={roles?.is_hr}
              onCheckedChange={() => handleRoleToggle('is_hr')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Mechanic</label>
            <Switch
              checked={roles?.is_mechanic}
              onCheckedChange={() => handleRoleToggle('is_mechanic')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Salesperson</label>
            <Switch
              checked={roles?.is_salesperson}
              onCheckedChange={() => handleRoleToggle('is_salesperson')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Medical Director</label>
            <Switch
              checked={roles?.is_medical_director}
              onCheckedChange={() => handleRoleToggle('is_medical_director')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Onlooker</label>
            <Switch
              checked={roles?.is_onlooker}
              onCheckedChange={() => handleRoleToggle('is_onlooker')}
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
              onCheckedChange={() => handleRoleToggle('can_see_non_emergent')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Administrator</label>
            <Switch
              checked={roles?.is_administrator}
              onCheckedChange={() => handleRoleToggle('is_administrator')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Principal</label>
            <Switch
              checked={roles?.is_principal}
              onCheckedChange={() => handleRoleToggle('is_principal')}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">Provisional</label>
            <Switch
              checked={roles?.is_provisional}
              onCheckedChange={() => handleRoleToggle('is_provisional')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Privileges</h2>
        
        <div className="grid gap-4">
          <div className="space-y-4">
            <h3 className="font-medium">Patient Information</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label>View</label>
                <Switch
                  checked={privileges?.can_view_patient_info}
                  onCheckedChange={() => handlePrivilegeToggle('can_view_patient_info')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Edit</label>
                <Switch
                  checked={privileges?.can_edit_patient_info}
                  onCheckedChange={() => handlePrivilegeToggle('can_edit_patient_info')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Delete</label>
                <Switch
                  checked={privileges?.can_delete_patient_info}
                  onCheckedChange={() => handlePrivilegeToggle('can_delete_patient_info')}
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
                  onCheckedChange={() => handlePrivilegeToggle('can_view_billing_info')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Edit</label>
                <Switch
                  checked={privileges?.can_edit_billing_info}
                  onCheckedChange={() => handlePrivilegeToggle('can_edit_billing_info')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Delete</label>
                <Switch
                  checked={privileges?.can_delete_billing_info}
                  onCheckedChange={() => handlePrivilegeToggle('can_delete_billing_info')}
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
                  onCheckedChange={() => handlePrivilegeToggle('can_view_dispatch_info')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Edit</label>
                <Switch
                  checked={privileges?.can_edit_dispatch_info}
                  onCheckedChange={() => handlePrivilegeToggle('can_edit_dispatch_info')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Delete</label>
                <Switch
                  checked={privileges?.can_delete_dispatch_info}
                  onCheckedChange={() => handlePrivilegeToggle('can_delete_dispatch_info')}
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
                  onCheckedChange={() => handlePrivilegeToggle('can_view_reports')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Create</label>
                <Switch
                  checked={privileges?.can_create_reports}
                  onCheckedChange={() => handlePrivilegeToggle('can_create_reports')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Edit</label>
                <Switch
                  checked={privileges?.can_edit_reports}
                  onCheckedChange={() => handlePrivilegeToggle('can_edit_reports')}
                />
              </div>
              <div className="flex items-center justify-between">
                <label>Delete</label>
                <Switch
                  checked={privileges?.can_delete_reports}
                  onCheckedChange={() => handlePrivilegeToggle('can_delete_reports')}
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
                  onCheckedChange={() => handlePrivilegeToggle('can_use_ai_assistance')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;