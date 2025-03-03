
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Employee } from "@/types/employee";

interface PayrollTabProps {
  employee: Employee;
}

export const PayrollTab: React.FC<PayrollTabProps> = ({ employee }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Payroll Information</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Pay Type</Label>
            <Select value={employee.pay_type || 'hourly'} onValueChange={() => {}}>
              <SelectTrigger>
                <SelectValue placeholder="Select pay type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Pay Rate</Label>
            <div className="flex items-center">
              <span className="mr-2">$</span>
              <Input type="number" value={employee.pay_rate?.toString() || ''} placeholder="0.00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Uses Timeclock</Label>
            <Switch checked={employee.uses_timeclock || false} />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-semibold">Payment Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Direct Deposit</Label>
              <Switch checked={true} />
            </div>
            <div className="space-y-2">
              <Label>Routing Number</Label>
              <Input type="text" value="******1234" />
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input type="text" value="******5678" />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-semibold">Tax Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>W-4 Status</Label>
              <Badge variant="outline" className="ml-2">Up to date</Badge>
            </div>
            <div className="space-y-2">
              <Label>Tax Withholdings</Label>
              <div className="flex items-center">
                <Select defaultValue="single">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tax filing status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="head">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
