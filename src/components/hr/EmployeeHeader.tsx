import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Employee } from "@/types/employee";
import { useEmployeeAchievements } from "@/hooks/useEmployeeAchievements";
import { NotificationBadge } from "./tabs/notifications/NotificationBadge";

interface EmployeeHeaderProps {
  employee: Employee | undefined;
}

export function EmployeeHeader({ employee }: EmployeeHeaderProps) {
  const navigate = useNavigate();
  const { employeeLevel, isLevelLoading } = useEmployeeAchievements(employee?.id);
  
  const navigateToNotifications = () => {
    const tabsTrigger = document.querySelector('[value="notifications"]') as HTMLElement;
    if (tabsTrigger) tabsTrigger.click();
  };

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/employees")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {employee?.first_name} {employee?.last_name}
              </h1>
              <div className="flex items-center gap-1">
                <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">
                  <Trophy className="h-4 w-4 mr-1 text-amber-600" />
                  <span>Level {employeeLevel}</span>
                </div>
                <Badge variant="outline" className="bg-blue-50">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-blue-500" />
                    <span>Achievements: {!isLevelLoading ? (employeeLevel - 1) * 5 : "..."}</span>
                  </div>
                </Badge>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              {employee?.certification_level} • ID: {employee?.readable_id || employee?.id?.substring(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous Employee
          </Button>
          <div className="mr-2">
            <NotificationBadge employeeId={employee?.id || ''} onClick={navigateToNotifications} />
          </div>
          <Button variant="outline">
            Next Employee <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
