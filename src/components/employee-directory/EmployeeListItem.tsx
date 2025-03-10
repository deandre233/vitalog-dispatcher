
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { Employee } from "@/types/employee";

interface EmployeeListItemProps {
  employee: Employee & {
    years_experience?: number;
    phone?: string;
  };
  getStatusBadgeColor: (role?: string) => string;
}

export function EmployeeListItem({ employee, getStatusBadgeColor }: EmployeeListItemProps) {
  const navigate = useNavigate();
  
  const handleEmployeeClick = () => {
    navigate(`/employee/${employee.id}`);
  };
  
  return (
    <div 
      className="flex items-center border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleEmployeeClick}
    >
      <Avatar className="h-12 w-12 mr-4">
        <AvatarImage 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`}
          alt={`${employee.first_name} ${employee.last_name}`}
        />
        <AvatarFallback className="bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white">
          {employee.first_name?.[0]}{employee.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-gray-900">
            {employee.first_name} {employee.last_name}
          </h3>
          <Badge 
            variant="outline" 
            className={`${getStatusBadgeColor(employee.certification_level)} border`}
          >
            {employee.certification_level || 'Uncertified'}
          </Badge>
        </div>
        <div className="flex items-center text-gray-500 text-sm mt-1 gap-4">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{employee.station || 'Unassigned'}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              <span>{employee.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
