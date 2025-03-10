
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface QuickActionProps {
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

export const QuickAction: React.FC<QuickActionProps> = ({ 
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
