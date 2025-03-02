
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { EmployeePrivileges } from "@/types/employee";

interface EmployeePrivilegesTabProps {
  privileges: EmployeePrivileges;
  isEditing: boolean;
}

export const EmployeePrivilegesTab: React.FC<EmployeePrivilegesTabProps> = ({
  privileges,
  isEditing
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Patient Information</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">View</label>
                <Switch
                  checked={privileges?.can_view_patient_info}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Edit</label>
                <Switch
                  checked={privileges?.can_edit_patient_info}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Delete</label>
                <Switch
                  checked={privileges?.can_delete_patient_info}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <h3 className="font-medium text-gray-700">Billing Information</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">View</label>
                <Switch
                  checked={privileges?.can_view_billing_info}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Edit</label>
                <Switch
                  checked={privileges?.can_edit_billing_info}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Delete</label>
                <Switch
                  checked={privileges?.can_delete_billing_info}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <h3 className="font-medium text-gray-700">Dispatch Information</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">View</label>
                <Switch
                  checked={privileges?.can_view_dispatch_info}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Edit</label>
                <Switch
                  checked={privileges?.can_edit_dispatch_info}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Delete</label>
                <Switch
                  checked={privileges?.can_delete_dispatch_info}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <h3 className="font-medium text-gray-700">Reports</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">View</label>
                <Switch
                  checked={privileges?.can_view_reports}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Create</label>
                <Switch
                  checked={privileges?.can_create_reports}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Edit</label>
                <Switch
                  checked={privileges?.can_edit_reports}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Delete</label>
                <Switch
                  checked={privileges?.can_delete_reports}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <h3 className="font-medium text-gray-700">AI Features</h3>
            <div className="ml-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">Use AI Assistance</label>
                <Switch
                  checked={privileges?.can_use_ai_assistance}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
