
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  CircuitBoard,
  Users,
  Map,
  CheckSquare,
  Zap,
  Calendar,
  FileText,
  Phone,
  FileCheck,
  Building2,
  Bookmark,
  User,
  Upload,
  BookOpen,
  Tag,
  Clock,
  Link2,
  Menu,
  Shield
} from "lucide-react";

// Define navigation categories
const navigationCategories = [
  {
    title: "Core Functions",
    items: [
      {
        label: "Dispatch Page",
        icon: FileText,
        href: "/dispatch",
        primary: true
      },
      {
        label: "Operations Map",
        icon: Map,
        href: "/operations-map",
      },
      {
        label: "Schedule Overview",
        icon: Calendar,
        href: "/schedule-overview",
      },
      {
        label: "Smart Route Optimization",
        icon: Zap,
        href: "/smart-route-optimization",
      },
    ]
  },
  {
    title: "Resources",
    items: [
      {
        label: "Employee Directory",
        icon: Users,
        href: "/employees",
      },
      {
        label: "Patient Directory",
        icon: User,
        href: "/patient-directory",
      },
      {
        label: "Center List",
        icon: Building2,
        href: "/center-list",
      },
      {
        label: "Partner List",
        icon: Bookmark,
        href: "/partner-list",
      },
    ]
  },
  {
    title: "Tasks & Records",
    items: [
      {
        label: "Verification Queue",
        icon: Calendar,
        href: "/verification-queue",
        badge: "11"
      },
      {
        label: "Authorization Queue",
        icon: FileCheck,
        href: "/authorization-queue",
        badge: "10"
      },
      {
        label: "Service Queue",
        icon: Phone,
        href: "/service-queue",
      },
      {
        label: "Shift Records & Checklists",
        icon: CheckSquare,
        href: "/shift-records",
      },
      {
        label: "Authorizations on Record",
        icon: FileText,
        href: "/authorizations-on-record",
      },
    ]
  },
  {
    title: "Tools",
    items: [
      {
        label: "Document Upload",
        icon: Upload,
        href: "/document-upload",
      },
      {
        label: "Resource Library",
        icon: BookOpen,
        href: "/resource-library",
      },
      {
        label: "Categories",
        icon: Tag,
        href: "/categories",
      },
      {
        label: "Historical Entry",
        icon: Clock,
        href: "/historical-entry",
      },
      {
        label: "External Link",
        icon: Link2,
        href: "/external-link",
      },
    ]
  }
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const isMobile = useMobile();

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  return (
    <div className={cn(
      "relative border-r bg-white/95 backdrop-blur-md shadow-sm",
      "transition-all duration-300 ease-in-out h-[calc(100vh-4rem)]",
      isCollapsed ? "w-16" : "w-72",
      isMobile && !isCollapsed && "absolute left-0 top-0 z-50 h-screen shadow-lg"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-sky-50 to-indigo-50">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              Dispatch Control
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-indigo-700 hover:bg-indigo-100"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? 
              <Menu className="h-4 w-4" /> : 
              <ChevronLeft className="h-4 w-4" />
            }
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          {navigationCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-3">
              {!isCollapsed && (
                <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-2">
                  {category.title}
                </h3>
              )}
              <div className="space-y-1 px-2">
                {category.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start relative group",
                        isCollapsed ? "h-10 px-2" : "h-9 px-3",
                        isActive 
                          ? "bg-indigo-50 text-indigo-900" 
                          : "text-slate-700 hover:bg-slate-100",
                        item.primary && !isActive && "text-indigo-700",
                        "transition-all duration-150"
                      )}
                      asChild
                    >
                      <Link to={item.href} className="flex items-center">
                        <item.icon className={cn(
                          "flex-shrink-0",
                          isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3",
                          isActive 
                            ? "text-indigo-700" 
                            : "text-slate-500 group-hover:text-slate-700",
                          item.primary && !isActive && "text-indigo-600"
                        )} />
                        
                        {!isCollapsed && (
                          <span className="text-sm font-medium truncate">
                            {item.label}
                          </span>
                        )}
                        
                        {!isCollapsed && item.badge && (
                          <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs rounded-full px-2 py-0.5 font-medium">
                            {item.badge}
                          </span>
                        )}
                        
                        {isCollapsed && item.badge && (
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className={cn(
          "border-t p-4 bg-gradient-to-r from-slate-50 to-indigo-50",
          isCollapsed ? "px-2" : "px-4"
        )}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-slate-600">System Online</span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-full flex justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
