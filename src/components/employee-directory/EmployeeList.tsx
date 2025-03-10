
import { Employee } from "@/types/employee";
import { EmployeeListItem } from "./EmployeeListItem";

interface EmployeeListProps {
  employees: (Employee & {
    years_experience?: number;
    phone?: string;
  })[];
  getStatusBadgeColor: (role?: string) => string;
}

export function EmployeeList({ employees, getStatusBadgeColor }: EmployeeListProps) {
  return (
    <div className="space-y-3">
      {employees.map((employee) => (
        <EmployeeListItem 
          key={employee.id}
          employee={employee}
          getStatusBadgeColor={getStatusBadgeColor}
        />
      ))}
    </div>
  );
}
