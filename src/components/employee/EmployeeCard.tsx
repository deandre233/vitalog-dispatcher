
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Employee } from "@/types/employee";

interface EmployeeCardProps {
  employee: Employee;
  onClick: (id: string) => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  return (
    <Card 
      className="group relative bg-black/40 backdrop-blur-xl border-white/10 hover:bg-black/50 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onClick(employee.id)}
      role="button"
      tabIndex={0}
      aria-label={`View ${employee.first_name} ${employee.last_name}'s profile`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="p-6 relative space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all duration-300">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} 
              alt={`${employee.first_name} ${employee.last_name}`}
            />
            <AvatarFallback className="bg-indigo-500/20 text-white">
              {employee.first_name?.[0]}{employee.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white group-hover:text-indigo-200 transition-colors duration-300">
              {employee.first_name} {employee.last_name}
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              {employee.station || 'Unassigned'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge 
            variant={employee.certification_level === 'Advanced' ? 'default' : 'outline'} 
            className="bg-indigo-500/20 text-indigo-200 border-indigo-400/20"
          >
            {employee.certification_level || 'Uncertified'}
          </Badge>
          {employee.status === 'Active' && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">On Duty</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
