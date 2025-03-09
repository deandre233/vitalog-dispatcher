
import { EmployeeRole } from "@/types/employee";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { UseMutationResult } from "@tanstack/react-query";

interface RolesTabProps {
  roles: EmployeeRole | undefined;
  updateRole: UseMutationResult<void, Error, Partial<EmployeeRole>, unknown>;
}

export function RolesTab({ roles, updateRole }: RolesTabProps) {
  return (
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
                    onValueChange={(value: "Captain" | "Lieutenant" | "Full privileges" | "Call-taker / Self-dispatch") => 
                      updateRole.mutate({supervisor_role: value})
                    }
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
  );
}
