
import { Badge } from "@/components/ui/badge";
import { EmployeeCard } from "./EmployeeCard";
import type { Employee } from "@/types/employee";

interface EmployeeGridProps {
  employees: Employee[];
  onEmployeeClick: (id: string) => void;
}

export function EmployeeGrid({ employees, onEmployeeClick }: EmployeeGridProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Employee Directory</h1>
        <Badge variant="outline" className="text-sm bg-white/5 text-white border-white/10">
          {employees.length} Employees
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {employees.map((employee) => (
          <EmployeeCard 
            key={employee.id}
            employee={employee}
            onClick={onEmployeeClick}
          />
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-400">No employees found matching your search</p>
        </div>
      )}
    </>
  );
}
