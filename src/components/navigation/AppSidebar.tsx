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
      "relative h-[calc(100vh-4rem)]",
      "bg-gradient-to-b from-medical-gradient-start via-medical-gradient-middle to-medical-gradient-end",
      "border-r border-medical-secondary/20",
      "backdrop-blur-sm shadow-lg",
      "transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 animate-fade-in">
              <CircuitBoard className="h-5 w-5" />
              Dispatch Control
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {routes.map((route) => (
              <div key={route.href} className="group">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start relative overflow-hidden",
                    "hover:bg-medical-secondary/20 hover:shadow-glow",
                    "transition-all duration-200 ease-in-out",
                    "group-hover:translate-x-1",
                    pathname === route.href && "bg-medical-secondary/30 shadow-glow",
                    isCollapsed ? "px-2" : "px-4"
                  )}
                  asChild
                >
                  <Link to={route.href} className="flex items-center">
                    <route.icon className={cn(
                      "h-4 w-4 text-white transition-transform group-hover:scale-110",
                      !isCollapsed && "mr-2"
                    )} />
                    {!isCollapsed && (
                      <span className="font-medium text-white">{route.label}</span>
                    )}
                    {!isCollapsed && pathname === route.href && (
                      <div className="absolute inset-0 bg-medical-secondary/10 animate-pulse pointer-events-none" />
                    )}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </nav>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-medical-gradient-end/20 to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
        </div>
      </div>
    </div>
  );
}