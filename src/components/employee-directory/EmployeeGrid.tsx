
import { Employee } from "@/types/employee";
import { EmployeeCard } from "./EmployeeCard";

interface EmployeeGridProps {
  employees: (Employee & {
    years_experience?: number;
    phone?: string;
  })[];
  getStatusBadgeColor: (role?: string) => string;
}

export function EmployeeGrid({ employees, getStatusBadgeColor }: EmployeeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee) => (
        <EmployeeCard 
          key={employee.id}
          employee={employee}
          getStatusBadgeColor={getStatusBadgeColor}
        />
      ))}
    </div>
  );
}
