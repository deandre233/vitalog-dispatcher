
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

interface EmployeeProfileBadgesProps {
  completionPercentage: number;
  certificationLevel?: string;
  insights: number;
  certificationExpiry?: string;
  formatDate: (date: string | undefined) => string;
}

export function EmployeeProfileBadges({ 
  completionPercentage, 
  certificationLevel, 
  insights, 
  certificationExpiry,
  formatDate
}: EmployeeProfileBadgesProps) {
  return (
    <div className="flex justify-between flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Badge 
          variant={completionPercentage < 70 ? "destructive" : 
                 completionPercentage < 90 ? "warning" : "success"}
          className="text-xs py-1 px-2 rounded-md"
        >
          {completionPercentage}% Complete
        </Badge>
        
        {certificationLevel && (
          <Badge variant="outline" className="text-xs py-1 px-2 rounded-md">
            {certificationLevel}
          </Badge>
        )}
        
        {insights > 0 && (
          <Badge variant="secondary" className="text-xs py-1 px-2 rounded-md flex items-center gap-1">
            <Brain className="h-3 w-3" />
            <span>{insights} Insights</span>
          </Badge>
        )}
      </div>
      
      {certificationExpiry && (
        <Badge 
          variant={
            new Date(certificationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
              ? "destructive" 
              : new Date(certificationExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
              ? "warning"
              : "outline"
          }
          className="text-xs py-1 px-2 rounded-md"
        >
          {new Date(certificationExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            ? "Certification expiring soon"
            : `Expires: ${formatDate(certificationExpiry)}`
          }
        </Badge>
      )}
    </div>
  );
}
