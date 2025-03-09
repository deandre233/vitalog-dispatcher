
import { EmployeePrivileges } from "@/types/employee";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { UseMutationResult } from "@tanstack/react-query";

interface PrivilegesTabProps {
  privileges: EmployeePrivileges | undefined;
  updatePrivileges: UseMutationResult<void, Error, Partial<EmployeePrivileges>, unknown>;
}

export function PrivilegesTab({ privileges, updatePrivileges }: PrivilegesTabProps) {
  return (
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
  );
}
