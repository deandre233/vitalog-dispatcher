
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FilePlus, UserPlus, Clock, Calendar, FileCheck2, 
  AlertTriangle, Award, FileText, MessageSquare, Mail, 
  Zap, PlusCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary" | "gradient";
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
  };
  className?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  icon, 
  label, 
  onClick, 
  variant = "outline",
  badge,
  className
}) => {
  return (
    <div className="flex flex-col items-center group">
      <Button 
        variant={variant} 
        size="icon" 
        className={`h-14 w-14 rounded-xl mb-1.5 relative shadow-sm group-hover:shadow-md transition-all duration-300 ${className}`} 
        onClick={onClick}
      >
        {icon}
        {badge && (
          <Badge 
            variant={badge.variant} 
            className="absolute -top-1.5 -right-1.5 text-xs w-5 h-5 flex items-center justify-center p-0 animate-pulse shadow-sm"
          >
            {badge.text}
          </Badge>
        )}
      </Button>
      <span className="text-xs text-center font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{label}</span>
    </div>
  );
};

export function HRQuickActionPanel() {
  const { toast } = useToast();
  
  const actions: QuickActionProps[] = [
    {
      icon: <UserPlus className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />,
      label: "New Employee",
      onClick: () => toast({
        title: "Add Employee",
        description: "Opening new employee form...",
      }),
      variant: "default",
      className: "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"
    },
    {
      icon: <FilePlus className="h-6 w-6 text-green-600 group-hover:text-green-700 transition-colors duration-200" />,
      label: "New Document",
      onClick: () => toast({
        title: "Add Document",
        description: "Opening document upload...",
      }),
      className: "bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-200" />,
      label: "Clock-in",
      onClick: () => toast({
        title: "Manual Clock-in",
        description: "Opening manual clock-in form...",
      }),
      badge: {
        text: "3",
        variant: "destructive"
      },
      className: "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
    },
    {
      icon: <Calendar className="h-6 w-6 text-amber-600 group-hover:text-amber-700 transition-colors duration-200" />,
      label: "Schedule",
      onClick: () => toast({
        title: "Schedule Management",
        description: "Opening schedule management...",
      }),
      className: "bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-amber-200"
    },
    {
      icon: <FileCheck2 className="h-6 w-6 text-teal-600 group-hover:text-teal-700 transition-colors duration-200" />,
      label: "Approve",
      onClick: () => toast({
        title: "Approvals",
        description: "Opening pending approvals...",
      }),
      badge: {
        text: "5",
        variant: "secondary"
      },
      className: "bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 border-teal-200"
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-red-600 group-hover:text-red-700 transition-colors duration-200" />,
      label: "Incident",
      onClick: () => toast({
        title: "Report Incident",
        description: "Opening incident form...",
      }),
      className: "bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-200"
    },
    {
      icon: <Award className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200" />,
      label: "Award",
      onClick: () => toast({
        title: "Issue Award",
        description: "Opening achievement selection...",
      }),
      variant: "outline",
      className: "bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border-indigo-200"
    },
    {
      icon: <FileText className="h-6 w-6 text-cyan-600 group-hover:text-cyan-700 transition-colors duration-200" />,
      label: "Report",
      onClick: () => toast({
        title: "Generate Report",
        description: "Opening report generator...",
      }),
      className: "bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 border-cyan-200"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-fuchsia-600 group-hover:text-fuchsia-700 transition-colors duration-200" />,
      label: "Message",
      onClick: () => toast({
        title: "Team Message",
        description: "Opening messaging interface...",
      }),
      badge: {
        text: "2",
        variant: "info"
      },
      className: "bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 hover:from-fuchsia-100 hover:to-fuchsia-200 border-fuchsia-200"
    },
    {
      icon: <Mail className="h-6 w-6 text-orange-600 group-hover:text-orange-700 transition-colors duration-200" />,
      label: "Notify All",
      onClick: () => toast({
        title: "Send Notification",
        description: "Opening notification composer...",
      }),
      className: "bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200"
    },
    {
      icon: <Zap className="h-6 w-6 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-200" />,
      label: "Quick Tasks",
      onClick: () => toast({
        title: "Quick Tasks",
        description: "Opening quick task creation...",
      }),
      className: "bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border-emerald-200"
    },
    {
      icon: <PlusCircle className="h-6 w-6 text-gray-600 group-hover:text-gray-700 transition-colors duration-200" />,
      label: "Custom",
      onClick: () => toast({
        title: "Custom Action",
        description: "Configure a custom action...",
      }),
      className: "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center font-semibold text-blue-700">
          <Zap className="mr-2 h-5 w-5 text-blue-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-4 p-2">
          {actions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
