
import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { EmployeePrivileges } from "@/types/employee";

interface PrivilegesTabProps {
  privileges?: EmployeePrivileges;
  handlePrivilegeToggle: (privilege: keyof EmployeePrivileges) => void;
}

export const PrivilegesTab: React.FC<PrivilegesTabProps> = ({ privileges, handlePrivilegeToggle }) => {
  if (!privileges) return null;
  
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Patient Information</h3>
          <div className="ml-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">View</label>
              <Switch
                checked={privileges?.can_view_patient_info}
                onCheckedChange={() => handlePrivilegeToggle('can_view_patient_info')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Edit</label>
              <Switch
                checked={privileges?.can_edit_patient_info}
                onCheckedChange={() => handlePrivilegeToggle('can_edit_patient_info')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Delete</label>
              <Switch
                checked={privileges?.can_delete_patient_info}
                onCheckedChange={() => handlePrivilegeToggle('can_delete_patient_info')}
              />
            </div>
          </div>

          <h3 className="font-medium text-gray-700">Billing Information</h3>
          <div className="ml-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">View</label>
              <Switch
                checked={privileges?.can_view_billing_info}
                onCheckedChange={() => handlePrivilegeToggle('can_view_billing_info')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Edit</label>
              <Switch
                checked={privileges?.can_edit_billing_info}
                onCheckedChange={() => handlePrivilegeToggle('can_edit_billing_info')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Delete</label>
              <Switch
                checked={privileges?.can_delete_billing_info}
                onCheckedChange={() => handlePrivilegeToggle('can_delete_billing_info')}
              />
            </div>
          </div>

          <h3 className="font-medium text-gray-700">Dispatch Information</h3>
          <div className="ml-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">View</label>
              <Switch
                checked={privileges?.can_view_dispatch_info}
                onCheckedChange={() => handlePrivilegeToggle('can_view_dispatch_info')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Edit</label>
              <Switch
                checked={privileges?.can_edit_dispatch_info}
                onCheckedChange={() => handlePrivilegeToggle('can_edit_dispatch_info')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Delete</label>
              <Switch
                checked={privileges?.can_delete_dispatch_info}
                onCheckedChange={() => handlePrivilegeToggle('can_delete_dispatch_info')}
              />
            </div>
          </div>

          <h3 className="font-medium text-gray-700">Reports</h3>
          <div className="ml-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">View</label>
              <Switch
                checked={privileges?.can_view_reports}
                onCheckedChange={() => handlePrivilegeToggle('can_view_reports')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Create</label>
              <Switch
                checked={privileges?.can_create_reports}
                onCheckedChange={() => handlePrivilegeToggle('can_create_reports')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Edit</label>
              <Switch
                checked={privileges?.can_edit_reports}
                onCheckedChange={() => handlePrivilegeToggle('can_edit_reports')}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Delete</label>
              <Switch
                checked={privileges?.can_delete_reports}
                onCheckedChange={() => handlePrivilegeToggle('can_delete_reports')}
              />
            </div>
          </div>

          <h3 className="font-medium text-gray-700">AI Features</h3>
          <div className="ml-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm">Use AI Assistance</label>
              <Switch
                checked={privileges?.can_use_ai_assistance}
                onCheckedChange={() => handlePrivilegeToggle('can_use_ai_assistance')}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
