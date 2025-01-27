import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { Button, Switch, Select } from "@/components/ui";
import { toast } from "@/components/ui/use-toast";
import { EmployeeRole, EmployeePrivileges } from "@/types/employee";

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
    updatePrivileges.mutate({
      [privilege]: !privileges[privilege]
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Employee Profile</h1>
      <div>
        <h2>Roles</h2>
        <Switch
          checked={roles.is_crew_member}
          onCheckedChange={() => handleRoleToggle('is_crew_member')}
        />
        <Switch
          checked={roles.is_supervisor}
          onCheckedChange={() => handleRoleToggle('is_supervisor')}
        />
        {roles.is_supervisor && (
          <Select
            value={roles.supervisor_role}
            onValueChange={(value: EmployeeRole['supervisor_role']) => 
              handleSupervisorRoleChange(value)
            }
          >
            <option value="Captain">Captain</option>
            <option value="Lieutenant">Lieutenant</option>
            <option value="Full privileges">Full privileges</option>
            <option value="Call-taker / Self-dispatch">Call-taker / Self-dispatch</option>
          </Select>
        )}
      </div>
      <div>
        <h2>Privileges</h2>
        <Switch
          checked={privileges.can_view_patient_info}
          onCheckedChange={() => handlePrivilegeToggle('can_view_patient_info')}
        />
        <Switch
          checked={privileges.can_edit_patient_info}
          onCheckedChange={() => handlePrivilegeToggle('can_edit_patient_info')}
        />
        <Switch
          checked={privileges.can_delete_patient_info}
          onCheckedChange={() => handlePrivilegeToggle('can_delete_patient_info')}
        />
        <Switch
          checked={privileges.can_view_billing_info}
          onCheckedChange={() => handlePrivilegeToggle('can_view_billing_info')}
        />
        <Switch
          checked={privileges.can_edit_billing_info}
          onCheckedChange={() => handlePrivilegeToggle('can_edit_billing_info')}
        />
        <Switch
          checked={privileges.can_delete_billing_info}
          onCheckedChange={() => handlePrivilegeToggle('can_delete_billing_info')}
        />
        <Switch
          checked={privileges.can_view_dispatch_info}
          onCheckedChange={() => handlePrivilegeToggle('can_view_dispatch_info')}
        />
        <Switch
          checked={privileges.can_edit_dispatch_info}
          onCheckedChange={() => handlePrivilegeToggle('can_edit_dispatch_info')}
        />
        <Switch
          checked={privileges.can_delete_dispatch_info}
          onCheckedChange={() => handlePrivilegeToggle('can_delete_dispatch_info')}
        />
        <Switch
          checked={privileges.can_view_reports}
          onCheckedChange={() => handlePrivilegeToggle('can_view_reports')}
        />
        <Switch
          checked={privileges.can_create_reports}
          onCheckedChange={() => handlePrivilegeToggle('can_create_reports')}
        />
        <Switch
          checked={privileges.can_edit_reports}
          onCheckedChange={() => handlePrivilegeToggle('can_edit_reports')}
        />
        <Switch
          checked={privileges.can_delete_reports}
          onCheckedChange={() => handlePrivilegeToggle('can_delete_reports')}
        />
        <Switch
          checked={privileges.can_use_ai_assistance}
          onCheckedChange={() => handlePrivilegeToggle('can_use_ai_assistance')}
        />
      </div>
    </div>
  );
};

export default EmployeeProfile;
