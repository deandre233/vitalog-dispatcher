
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Employee } from "@/types/employee";

interface ProfileHeaderProps {
  employee: Employee;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ employee }) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{employee.first_name} {employee.last_name}</h1>
          <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
            {employee.status}
          </Badge>
        </div>
        <p className="text-gray-600 mt-1">{employee.readable_id}</p>
      </div>
      <Button variant="outline">Add Portrait</Button>
    </div>
  );
};
