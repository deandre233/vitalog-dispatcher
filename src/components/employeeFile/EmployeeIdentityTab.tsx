
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import PhoneInput from "@/components/common/PhoneInput";
import { formatPhoneNumber } from "@/utils/stringUtils";

interface EmployeeIdentityProps {
  employeeId: string;
  isEditable?: boolean;
}

export function EmployeeIdentityTab({ employeeId, isEditable = true }: EmployeeIdentityProps) {
  const { employee, isLoading, updateEmployee } = useEmployeeData(employeeId);
  const [isEditing, setIsEditing] = React.useState(false);

  if (isLoading) {
    return <Card className="p-6 animate-pulse">Loading...</Card>;
  }

  if (!employee) {
    return <Card className="p-6">Employee not found</Card>;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateEmployee({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        employee_id: employee.employee_id,
        position: employee.position,
      });
      setIsEditing(false);
      toast.success("Employee information updated successfully");
    } catch (error) {
      toast.error("Failed to update employee information");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = async (field: string, value: string) => {
    if (employee) {
      await updateEmployee({
        ...employee,
        [field]: value,
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {isEditable && (
          <div className="space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            ) : (
              <Button onClick={handleEdit}>Edit</Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={employee.first_name || ""}
            onChange={(e) => handleChange("first_name", e.target.value)}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={employee.last_name || ""}
            onChange={(e) => handleChange("last_name", e.target.value)}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={employee.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          {/* Removing the disabled prop as it's not supported in PhoneInput */}
          {isEditing ? (
            <PhoneInput
              value={employee.phone || ""}
              onChange={(value) => handleChange("phone", value)}
            />
          ) : (
            <Input 
              id="phone"
              value={formatPhoneNumber(employee.phone || "")}
              readOnly
              className="mt-1"
            />
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <h3 className="text-lg font-medium mb-4">Employment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            value={employee.employee_id || ""}
            onChange={(e) => handleChange("employee_id", e.target.value)}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={employee.position || ""}
            onChange={(e) => handleChange("position", e.target.value)}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={employee.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
}
