
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, X, Clock, Thermometer } from "lucide-react";
import type { Employee, CapabilityAlert } from "@/types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  alerts: CapabilityAlert[];
  onEmployeeClick: (employeeId: string) => void;
  getCapabilityDisplay: (capability: string) => React.ReactNode;
  sortField: keyof Employee;
  sortDirection: "asc" | "desc";
  handleSort: (field: keyof Employee) => void;
}

export const EmployeeTable = ({
  employees,
  alerts,
  onEmployeeClick,
  getCapabilityDisplay,
  sortField,
  sortDirection,
  handleSort
}: EmployeeTableProps) => {
  const getStatusIcon = (status?: Employee['crew_status']) => {
    switch (status) {
      case 'available':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'on-duty':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'on-break':
        return <Thermometer className="h-4 w-4 text-orange-500" />;
      case 'off-duty':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAlertCountForEmployee = (employeeId: string) => {
    return alerts.filter(alert => alert.employeeId === employeeId).length;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[180px] cursor-pointer"
              onClick={() => handleSort('last_name')}
            >
              Last Name
              {sortField === 'last_name' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('first_name')}
            >
              First + Middle
              {sortField === 'first_name' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('station')}
            >
              Station
              {sortField === 'station' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Capabilities</TableHead>
            <TableHead>Crew Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow 
              key={employee.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onEmployeeClick(employee.id)}
            >
              <TableCell className="font-medium">{employee.last_name}</TableCell>
              <TableCell>{employee.first_name} {employee.middle_name || ''}</TableCell>
              <TableCell>{employee.mobile || 'N/A'}</TableCell>
              <TableCell>{employee.station || 'Unassigned'}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {employee.capabilities?.slice(0, 3).map(cap => (
                    <span key={cap} className="inline-block">
                      {getCapabilityDisplay(cap)}
                    </span>
                  ))}
                  {employee.capabilities && employee.capabilities.length > 3 && (
                    <Badge variant="outline" className="bg-gray-50">
                      +{employee.capabilities.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(employee.crew_status)}
                  <span className="text-sm capitalize">
                    {employee.crew_status || 'Unknown'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  {getAlertCountForEmployee(employee.id) > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {getAlertCountForEmployee(employee.id)}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
