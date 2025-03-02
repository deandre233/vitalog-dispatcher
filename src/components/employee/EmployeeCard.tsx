
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, X, Clock, Thermometer } from "lucide-react";
import type { Employee, CapabilityAlert } from "@/types/employee";

interface EmployeeCardProps {
  employee: Employee;
  alerts: CapabilityAlert[];
  onEmployeeClick: (employeeId: string) => void;
  getCapabilityDisplay: (capability: string) => React.ReactNode;
}

export const EmployeeCard = ({ 
  employee, 
  alerts, 
  onEmployeeClick, 
  getCapabilityDisplay 
}: EmployeeCardProps) => {
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
    <Card 
      key={employee.id}
      className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-102 bg-gradient-to-br from-background to-secondary/10"
      onClick={() => onEmployeeClick(employee.id)}
      role="button"
      tabIndex={0}
      aria-label={`View ${employee.first_name} ${employee.last_name}'s profile`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-20 w-20 ring-2 ring-primary/20">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} 
              alt={`${employee.first_name} ${employee.last_name}`}
            />
            <AvatarFallback>
              {employee.first_name?.[0]}{employee.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          {getAlertCountForEmployee(employee.id) > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getAlertCountForEmployee(employee.id)}
            </span>
          )}
        </div>
        <div className="text-center">
          <h3 className="font-semibold">
            {employee.first_name} {employee.last_name}
          </h3>
          <p className="text-sm text-gray-500">
            {employee.station || 'Unassigned'}
          </p>
          <Badge 
            variant={employee.certification_level === 'Advanced' ? 'default' : 'outline'} 
            className="mt-2"
          >
            {employee.certification_level || 'Uncertified'}
          </Badge>
          <div className="mt-2 flex items-center justify-center gap-1">
            {getStatusIcon(employee.crew_status)}
            <span className="text-xs">{employee.crew_status || 'Unknown'}</span>
          </div>
          
          {employee.capabilities && employee.capabilities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              {employee.capabilities.slice(0, 3).map(cap => (
                <span key={cap} className="inline-block">
                  {getCapabilityDisplay(cap)}
                </span>
              ))}
              {employee.capabilities.length > 3 && (
                <Badge variant="outline" className="bg-gray-50">
                  +{employee.capabilities.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
