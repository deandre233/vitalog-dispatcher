
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import { Employee } from "@/types/employee";

interface EmployeeCardProps {
  employee: Employee & {
    years_experience?: number;
    phone?: string;
  };
  getStatusBadgeColor: (role?: string) => string;
}

export function EmployeeCard({ employee, getStatusBadgeColor }: EmployeeCardProps) {
  const navigate = useNavigate();
  
  const handleEmployeeClick = () => {
    navigate(`/employee/${employee.id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all group border-0 shadow"
      onClick={handleEmployeeClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${employee.first_name} ${employee.last_name}'s profile`}
    >
      <div className="h-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]"></div>
      <div className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-4 ring-[#F1F0FB] ring-offset-2 group-hover:ring-[#E5DEFF]">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`}
                alt={`${employee.first_name} ${employee.last_name}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white">
                {employee.first_name?.[0]}{employee.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 group-hover:text-[#8B5CF6] transition-colors">
              {employee.first_name} {employee.last_name}
            </h3>
            <div className="flex items-center justify-center mt-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
              <p>{employee.station || 'Unassigned'}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <Badge 
                variant="outline" 
                className={`${getStatusBadgeColor(employee.certification_level)} border transition-all group-hover:border-[#8B5CF6]/40`}
              >
                {employee.certification_level || 'Uncertified'}
              </Badge>
              {employee.years_experience !== undefined && (
                <Badge variant="outline" className="bg-[#F1F0FB] text-gray-700 border-[#E5DEFF]">
                  <Clock className="h-3 w-3 mr-1" />
                  {employee.years_experience} yrs
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
