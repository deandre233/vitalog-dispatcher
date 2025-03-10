
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FilePlus, UserPlus, Clock, Calendar, FileCheck2, 
  AlertTriangle, Award, FileText, MessageSquare, Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary" | "gradient";
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  icon, 
  label, 
  onClick, 
  variant = "outline",
  badge
}) => {
  return (
    <div className="flex flex-col items-center">
      <Button 
        variant={variant} 
        size="icon" 
        className="h-12 w-12 rounded-xl mb-1 relative" 
        onClick={onClick}
      >
        {icon}
        {badge && (
          <Badge 
            variant={badge.variant} 
            className="absolute -top-1 -right-1 text-xs w-5 h-5 flex items-center justify-center p-0"
          >
            {badge.text}
          </Badge>
        )}
      </Button>
      <span className="text-xs text-center font-medium">{label}</span>
    </div>
  );
};

export function HRQuickActionPanel() {
  const { toast } = useToast();
  
  const actions: QuickActionProps[] = [
    {
      icon: <UserPlus className="h-5 w-5" />,
      label: "New Employee",
      onClick: () => toast({
        title: "Add Employee",
        description: "Opening new employee form...",
      }),
      variant: "default"
    },
    {
      icon: <FilePlus className="h-5 w-5" />,
      label: "New Document",
      onClick: () => toast({
        title: "Add Document",
        description: "Opening document upload...",
      })
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Clock-in",
      onClick: () => toast({
        title: "Manual Clock-in",
        description: "Opening manual clock-in form...",
      }),
      badge: {
        text: "3",
        variant: "destructive"
      }
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule",
      onClick: () => toast({
        title: "Schedule Management",
        description: "Opening schedule management...",
      })
    },
    {
      icon: <FileCheck2 className="h-5 w-5" />,
      label: "Approve",
      onClick: () => toast({
        title: "Approvals",
        description: "Opening pending approvals...",
      }),
      badge: {
        text: "5",
        variant: "secondary"
      }
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      label: "Incident",
      onClick: () => toast({
        title: "Report Incident",
        description: "Opening incident form...",
      })
    },
    {
      icon: <Award className="h-5 w-5" />,
      label: "Award",
      onClick: () => toast({
        title: "Issue Award",
        description: "Opening achievement selection...",
      }),
      variant: "secondary"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Report",
      onClick: () => toast({
        title: "Generate Report",
        description: "Opening report generator...",
      })
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Message",
      onClick: () => toast({
        title: "Team Message",
        description: "Opening messaging interface...",
      })
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Notify All",
      onClick: () => toast({
        title: "Send Notification",
        description: "Opening notification composer...",
      })
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center font-semibold text-blue-700">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-5 gap-4">
          {actions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
