import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { Building2, ChevronLeft, Menu, Circle, Home, Megaphone, Users, Clock, Calculator, History, AlertTriangle, Calendar, UserX, Award, List, Link as LinkIcon, Settings, HelpCircle } from "lucide-react";
import { HR_NAVIGATION_ITEMS } from "@/config/hr-navigation";

const iconMap = {
  home: Home,
  megaphone: Megaphone,
  users: Users,
  clock: Clock,
  calculator: Calculator,
  history: History,
  "alert-triangle": AlertTriangle,
  calendar: Calendar,
  "user-x": UserX,
  award: Award,
  list: List,
  link: LinkIcon,
  settings: Settings,
  "help-circle": HelpCircle
};

export function HRSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const isMobile = useMobile();

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Circle;
  };

  return (
    <div className={cn(
      "relative border-r bg-[#2B4B8C] text-white",
      "transition-all duration-300 ease-in-out h-[calc(100vh-4rem)]",
      isCollapsed ? "w-16" : "w-64",
      isMobile && !isCollapsed && "absolute left-0 top-0 z-50 h-screen shadow-lg"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              HR Portal
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? 
              <Menu className="h-4 w-4" /> : 
              <ChevronLeft className="h-4 w-4" />
            }
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {HR_NAVIGATION_ITEMS.map((item) => {
              const IconComponent = getIcon(item.icon);
              return (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start relative overflow-hidden group",
                      "hover:bg-white/10",
                      "transition-all duration-200 ease-in-out",
                      pathname === item.href && "bg-white/20",
                      isCollapsed ? "px-2" : "px-4"
                    )}
                    asChild
                  >
                    <Link to={item.href} className="flex items-center">
                      <IconComponent className={cn(
                        "h-4 w-4 text-white",
                        !isCollapsed && "mr-2"
                      )} />
                      {!isCollapsed && (
                        <span className="font-medium text-white">{item.label}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="ml-auto bg-white/20 text-xs rounded px-2 py-1">
                          {item.badge.text}
                        </span>
                      )}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}