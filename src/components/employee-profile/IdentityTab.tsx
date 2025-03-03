
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PhoneInput } from "@/components/common/PhoneInput";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/types/employee";

interface IdentityTabProps {
  employee: Employee;
}

export const IdentityTab: React.FC<IdentityTabProps> = ({ employee }) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <div className="flex gap-4">
              <Input value={employee.last_name} readOnly placeholder="Last name" />
              <Input value={employee.first_name} readOnly placeholder="First name" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mobile number</Label>
            <PhoneInput value={employee.mobile || ''} onChange={() => {}} disabled />
          </div>

          <div className="space-y-2">
            <Label>Station</Label>
            <Select value={employee.station} onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="float">Float</SelectItem>
                <SelectItem value="station1">Station 1</SelectItem>
                <SelectItem value="station2">Station 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Employee ID</Label>
            <Input value={employee.readable_id || ''} readOnly />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold">Login Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={employee.readable_id?.toLowerCase() || ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex gap-2">
                <Input type="password" value="********" readOnly />
                <Button variant="outline">Generate New Password</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold">Messaging Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Dispatch notifications</Label>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Schedule notifications</Label>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Incident notifications</Label>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Clock in/out notifications</Label>
              <Switch checked={true} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
