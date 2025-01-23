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
  Menu
} from "lucide-react";

const routes = [
  {
    label: "Employee Directory",
    icon: Users,
    href: "/employees",
  },
  {
    label: "Operations Map",
    icon: Map,
    href: "/operations-map", // Updated from /live-map
  },
  {
    label: "Shift Records & Checklists",
    icon: CheckSquare,
    href: "/shift-records", // Updated from /shifts
  },
  {
    label: "Smart Route Optimization",
    icon: Zap,
    href: "/smart-route-optimization", // Updated from /route-planner
  },
  {
    label: "Verification Queue (11)",
    icon: Calendar,
    href: "/verification-queue", // Updated from /confirmation-queue
  },
  {
    label: "Schedule Overview",
    icon: Calendar,
    href: "/schedule-overview", // Updated from /calendar
  },
  {
    label: "Dispatch Page",
    icon: FileText,
    href: "/dispatch",
  },
  {
    label: "Service Queue",
    icon: Phone,
    href: "/service-queue", // Updated from /request-queue
  },
  {
    label: "Authorization Queue (10)",
    icon: FileCheck,
    href: "/authorization-queue", // Updated from /prior-auth-queue
  },
  {
    label: "Authorizations on Record",
    icon: FileText,
    href: "/authorizations-on-record", // Updated from /prior-auths
  },
  {
    label: "Center List",
    icon: Building2,
    href: "/center-list", // Updated from /facilities
  },
  {
    label: "Partner List",
    icon: Bookmark,
    href: "/partner-list", // Updated from /affiliates
  },
  {
    label: "Patient Directory",
    icon: User,
    href: "/patient-directory", // Updated from /patients
  },
  {
    label: "Document Upload",
    icon: Upload,
    href: "/document-upload",
  },
  {
    label: "Resource Library",
    icon: BookOpen,
    href: "/resource-library", // Updated from /librarian
  },
  {
    label: "Categories",
    icon: Tag,
    href: "/categories", // Updated from /tags
  },
  {
    label: "Historical Entry",
    icon: Clock,
    href: "/historical-entry", // Updated from /backdated-dispatch
  },
  {
    label: "External Link",
    icon: Link2,
    href: "/external-link", // Updated from /custom-link-1
  },
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
      "relative border-r bg-white/80 backdrop-blur-sm",
      "transition-all duration-300 ease-in-out h-[calc(100vh-4rem)]",
      isCollapsed ? "w-16" : "w-64",
      isMobile && !isCollapsed && "absolute left-0 top-0 z-50 h-screen shadow-lg"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-medical-primary flex items-center gap-2">
              <CircuitBoard className="h-5 w-5" />
              Dispatch Control
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-medical-primary hover:bg-medical-accent/10"
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
            {routes.map((route) => (
              <div key={route.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start relative overflow-hidden group",
                    "hover:bg-medical-accent/10",
                    "transition-all duration-200 ease-in-out",
                    pathname === route.href && "bg-medical-accent/20",
                    isCollapsed ? "px-2" : "px-4"
                  )}
                  asChild
                >
                  <Link to={route.href} className="flex items-center">
                    <route.icon className={cn(
                      "h-4 w-4 text-medical-primary",
                      !isCollapsed && "mr-2"
                    )} />
                    {!isCollapsed && (
                      <span className="font-medium text-medical-primary">{route.label}</span>
                    )}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
