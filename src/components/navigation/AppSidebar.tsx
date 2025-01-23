import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
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
  Link2
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
    href: "/live-map",
  },
  {
    label: "Shift Records & Checklists",
    icon: CheckSquare,
    href: "/shifts",
  },
  {
    label: "Smart Route Optimization",
    icon: Zap,
    href: "/route-planner",
  },
  {
    label: "Verification Queue (11)",
    icon: Calendar,
    href: "/confirmation-queue",
  },
  {
    label: "Schedule Overview",
    icon: Calendar,
    href: "/calendar",
  },
  {
    label: "Dispatch Page",
    icon: FileText,
    href: "/dispatch",
  },
  {
    label: "Service Queue",
    icon: Phone,
    href: "/request-queue",
  },
  {
    label: "Authorization Queue (10)",
    icon: FileCheck,
    href: "/prior-auth-queue",
  },
  {
    label: "Authorizations on Record",
    icon: FileText,
    href: "/prior-auths",
  },
  {
    label: "Center List",
    icon: Building2,
    href: "/facilities",
  },
  {
    label: "Partner List",
    icon: Bookmark,
    href: "/affiliates",
  },
  {
    label: "Patient Directory",
    icon: User,
    href: "/patients",
  },
  {
    label: "Document Upload",
    icon: Upload,
    href: "/document-upload",
  },
  {
    label: "Resource Library",
    icon: BookOpen,
    href: "/librarian",
  },
  {
    label: "Categories",
    icon: Tag,
    href: "/tags",
  },
  {
    label: "Historical Entry",
    icon: Clock,
    href: "/backdated-dispatch",
  },
  {
    label: "External Link",
    icon: Link2,
    href: "/custom-link-1",
  },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className={cn(
      "relative border-r bg-white backdrop-blur-sm",
      "transition-all duration-300 ease-in-out h-[calc(100vh-4rem)]",
      isCollapsed ? "w-16" : "w-64"
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
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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