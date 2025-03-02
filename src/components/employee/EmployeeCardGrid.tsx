
import React from "react";
import { EmployeeCard } from "./EmployeeCard";
import type { Employee, CapabilityAlert } from "@/types/employee";

interface EmployeeCardGridProps {
  employees: Employee[];
  alerts: CapabilityAlert[];
  onEmployeeClick: (employeeId: string) => void;
  getCapabilityDisplay: (capability: string) => React.ReactNode;
}

export const EmployeeCardGrid = ({
  employees,
  alerts,
  onEmployeeClick,
  getCapabilityDisplay
}: EmployeeCardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          alerts={alerts}
          onEmployeeClick={onEmployeeClick}
          getCapabilityDisplay={getCapabilityDisplay}
        />
      ))}
    </div>
  );
};
