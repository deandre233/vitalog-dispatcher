
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { EmployeeRole } from "@/types/employee";

interface EmployeeRolesTabProps {
  roles: EmployeeRole;
  isEditing: boolean;
}

export const EmployeeRolesTab: React.FC<EmployeeRolesTabProps> = ({
  roles,
  isEditing
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">Crew Member</label>
              <Switch
                checked={roles?.is_crew_member}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Supervisor</label>
              <Switch
                checked={roles?.is_supervisor}
                disabled={!isEditing}
              />
            </div>

            {roles?.is_supervisor && (
              <div className="ml-6 bg-gray-50 p-4 rounded-lg">
                <label className="font-medium block mb-2">Supervisor Role</label>
                <Select
                  value={roles.supervisor_role}
                  disabled={!isEditing}
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
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Dispatcher</label>
              <Switch
                checked={roles?.is_dispatcher}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">QA Reviewer</label>
              <Switch
                checked={roles?.is_qa_reviewer}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">HR</label>
              <Switch
                checked={roles?.is_hr}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Mechanic</label>
              <Switch
                checked={roles?.is_mechanic}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Salesperson</label>
              <Switch
                checked={roles?.is_salesperson}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Medical Director</label>
              <Switch
                checked={roles?.is_medical_director}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Onlooker</label>
              <Switch
                checked={roles?.is_onlooker}
                disabled={!isEditing}
              />
            </div>

            {roles?.is_onlooker && (
              <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="font-medium block mb-2">Facility</label>
                  <Input
                    type="text"
                    value={roles.onlooker_facility || ''}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="font-medium block mb-2">City</label>
                  <Input
                    type="text"
                    value={roles.onlooker_city || ''}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="font-medium block mb-2">County</label>
                  <Input
                    type="text"
                    value={roles.onlooker_county || ''}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="font-medium">Can See Non-Emergent</label>
              <Switch
                checked={roles?.can_see_non_emergent}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Administrator</label>
              <Switch
                checked={roles?.is_administrator}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Principal</label>
              <Switch
                checked={roles?.is_principal}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Provisional</label>
              <Switch
                checked={roles?.is_provisional}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
