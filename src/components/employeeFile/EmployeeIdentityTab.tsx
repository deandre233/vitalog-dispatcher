
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/common/PhoneInput";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Employee } from "@/types/employee";

interface EmployeeIdentityTabProps {
  employee: Employee;
  isEditing: boolean;
  updateEmployee: (updates: Partial<Employee>) => Promise<void>;
}

export const EmployeeIdentityTab: React.FC<EmployeeIdentityTabProps> = ({
  employee,
  isEditing,
  updateEmployee
}) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="flex gap-4">
              <Input 
                value={employee.first_name} 
                onChange={(e) => updateEmployee({ first_name: e.target.value })}
                placeholder="First name" 
                disabled={!isEditing}
              />
              <Input 
                value={employee.last_name} 
                onChange={(e) => updateEmployee({ last_name: e.target.value })}
                placeholder="Last name" 
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mobile phone</Label>
            <PhoneInput 
              value={employee.mobile || ''} 
              onChange={(value) => updateEmployee({ mobile: value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>Station</Label>
            <Select 
              value={employee.station} 
              onValueChange={(value) => updateEmployee({ station: value })}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main">Main</SelectItem>
                <SelectItem value="North">North</SelectItem>
                <SelectItem value="South">South</SelectItem>
                <SelectItem value="East">East</SelectItem>
                <SelectItem value="West">West</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Employee ID</Label>
            <Input value={employee.readable_id || ''} disabled />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold">Login Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={employee.readable_id?.toLowerCase() || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex gap-2">
                <Input type="password" value="********" disabled />
                {isEditing && <Button variant="outline">Reset Password</Button>}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dispatch-notifications">Dispatch notifications</Label>
              <Switch id="dispatch-notifications" checked={true} disabled={!isEditing} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="schedule-notifications">Schedule notifications</Label>
              <Switch id="schedule-notifications" checked={true} disabled={!isEditing} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cert-notifications">Certification expiry alerts</Label>
              <Switch id="cert-notifications" checked={true} disabled={!isEditing} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-notifications">AI performance insights</Label>
              <Switch id="ai-notifications" checked={true} disabled={!isEditing} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
