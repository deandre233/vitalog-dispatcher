
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Employee } from "@/types/employee";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Mail, Phone, Building, Briefcase, MapPin } from "lucide-react";
import { PhoneInput } from "@/components/common/PhoneInput";

export interface EmployeeIdentityProps {
  employeeData: Employee;
  isEditing: boolean;
  updateEmployeeData: UseMutateAsyncFunction<void, Error, Partial<Employee>, unknown>;
}

export const EmployeeIdentityTab = ({ 
  employeeData, 
  isEditing, 
  updateEmployeeData 
}: EmployeeIdentityProps) => {
  const [formData, setFormData] = useState({
    first_name: employeeData.first_name,
    last_name: employeeData.last_name,
    email: employeeData.contact_email,
    phone: employeeData.contact_phone || "",
    address: employeeData.contact_address || "",
    employee_id: employeeData.employee_number || "",
    position: employeeData.job_title || ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };
  
  const handleSave = async () => {
    try {
      await updateEmployeeData({
        first_name: formData.first_name,
        last_name: formData.last_name,
        contact_email: formData.email,
        contact_phone: formData.phone,
        contact_address: formData.address,
        employee_number: formData.employee_id,
        job_title: formData.position
      });
      
      toast.success("Employee information updated successfully");
    } catch (error) {
      toast.error("Failed to update employee information");
      console.error(error);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          {isEditing && (
            <Button onClick={handleSave} size="sm">
              Save Changes
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="pl-10"
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="pl-10"
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                className="pl-10"
                // The PhoneInput doesn't support the disabled prop directly
                // We'll handle it with the readOnly prop instead
                readOnly={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employee_id">Employee ID</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Building className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="pl-10"
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Briefcase className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="pl-10"
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="pl-10"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
