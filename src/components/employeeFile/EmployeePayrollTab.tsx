
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Employee } from "@/types/employee";

interface EmployeePayrollTabProps {
  employee: Employee;
  isEditing: boolean;
}

// Mock data for payroll history - in a real app, this would come from an API
const payrollHistory = [
  { id: '1', date: '01/15/2023', amount: 1856.25, type: 'Regular', status: 'Completed' },
  { id: '2', date: '01/31/2023', amount: 1956.75, type: 'Regular', status: 'Completed' },
  { id: '3', date: '02/15/2023', amount: 1856.25, type: 'Regular', status: 'Completed' },
  { id: '4', date: '02/28/2023', amount: 1786.50, type: 'Regular', status: 'Completed' },
  { id: '5', date: '03/15/2023', amount: 1986.25, type: 'Regular', status: 'Completed' },
];

export const EmployeePayrollTab: React.FC<EmployeePayrollTabProps> = ({
  employee,
  isEditing
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Pay Type</Label>
              <Select 
                value={employee.pay_type || 'hourly'} 
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pay type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="per-trip">Per Trip</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pay Rate ($)</Label>
              <Input 
                type="number" 
                value={employee.pay_rate?.toString() || ''} 
                disabled={!isEditing} 
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Employee Type</Label>
              <Select 
                value={employee.employee_type || ''} 
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contractor">Contractor</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Uses Timeclock</Label>
              <Select 
                value={employee.uses_timeclock ? 'yes' : 'no'} 
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Payment History</h3>
            <div className="border rounded-md">
              <div className="grid grid-cols-4 gap-4 p-3 font-medium bg-gray-50 rounded-t-md">
                <div>Date</div>
                <div>Type</div>
                <div>Amount</div>
                <div>Status</div>
              </div>
              <div className="divide-y">
                {payrollHistory.map((payment) => (
                  <div key={payment.id} className="grid grid-cols-4 gap-4 p-3">
                    <div>{payment.date}</div>
                    <div>{payment.type}</div>
                    <div>${payment.amount.toFixed(2)}</div>
                    <div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Tax Information</h3>
            <div className="text-gray-500 italic text-center">
              Tax information is managed through the payroll system and is not displayed here for security reasons.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
