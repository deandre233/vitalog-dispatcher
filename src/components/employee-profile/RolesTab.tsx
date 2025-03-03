
import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EmployeeRole } from "@/types/employee";

interface RolesTabProps {
  roles?: EmployeeRole;
  handleRoleToggle: (role: keyof EmployeeRole) => void;
  handleSupervisorRoleChange: (value: EmployeeRole['supervisor_role']) => void;
  updateRole: {
    mutate: (updates: Partial<EmployeeRole>) => void;
  };
}

export const RolesTab: React.FC<RolesTabProps> = ({ 
  roles, 
  handleRoleToggle, 
  handleSupervisorRoleChange,
  updateRole 
}) => {
  if (!roles) return null;
  
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
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
            <div className="ml-6 bg-gray-50 p-4 rounded-lg">
              <label className="font-medium block mb-2">Supervisor Role</label>
              <Select
                value={roles.supervisor_role}
                onValueChange={handleSupervisorRoleChange}
              >
                <SelectTrigger className="w-full">
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
    </Card>
  );
};
