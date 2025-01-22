import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  CircuitBoard, Network, Signal, Terminal, Cpu, 
  ClipboardCheck, FileSearch, FilePlus2, Send, AlertTriangle, Scale,
  Car, Clock, FileText, Building2, Users, User, Upload, FileUp,
  DollarSign, List, CircleDollarSign, ChevronLeft, ChevronRight,
  LayoutDashboard, Rocket, UserCog, MapPin, BarChart3, Bell,
  PlusCircle, Map
} from "lucide-react";

const routes = [
  {
    label: "Command Center",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Personnel Directory",
    icon: Users,
    href: "/employees",
  },
  {
    label: "Operations Map",
    icon: Map,
    href: "/live-map",
  },
  {
    label: "Completed Tasks",
    icon: ClipboardCheck,
    href: "/shifts",
  },
  {
    label: "Smart Route Planner",
    icon: MapPin,
    href: "/route-planner",
  },
  {
    label: "Verification Queue",
    icon: ClipboardCheck,
    href: "/confirmation-queue",
  },
  {
    label: "Schedule Overview",
    icon: Clock,
    href: "/calendar",
  },
  {
    label: "Archive",
    icon: FileText,
    href: "/closed-dispatches",
  },
  {
    label: "Service Queue",
    icon: Send,
    href: "/request-queue",
  },
  {
    label: "Authorization Queue",
    icon: AlertTriangle,
    href: "/prior-auth-queue",
  },
  {
    label: "Prior Auths On File",
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
    icon: Users,
    href: "/affiliates",
  },
  {
    label: "Patient List",
    icon: User,
    href: "/patients",
  },
  {
    label: "Patient Document Upload",
    icon: Upload,
    href: "/document-upload",
  },
  {
    label: "Resource Library",
    icon: FileUp,
    href: "/librarian",
  },
  {
    label: "Categories",
    icon: List,
    href: "/tags",
  },
  {
    label: "Historical Entry",
    icon: Clock,
    href: "/backdated-dispatch",
  },
  {
    label: "External Link",
    icon: Terminal,
    href: "/custom-link-1",
  },
  {
    label: "Active Operations",
    icon: Signal,
    href: "/dispatch",
  },
  {
    label: "New Operation",
    icon: PlusCircle,
    href: "/dispatch/new",
  },
  {
    label: "Personnel Assignment",
    icon: UserCog,
    href: "/crew",
  },
  {
    label: "Route Management",
    icon: MapPin,
    href: "/routes",
  },
  {
    label: "Billing",
    icon: DollarSign,
    href: "/billing",
  },
  {
    label: "Analytics Hub",
    icon: BarChart3,
    href: "/performance",
  },
  {
    label: "Alert Settings",
    icon: Bell,
    href: "/alerts",
  },
];

export function AppSidebar() {
  const pathname = useLocation().pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative border-r bg-gradient-to-b from-medical-card-start to-medical-card-end backdrop-blur-sm",
      "transition-all duration-300 ease-in-out h-[calc(100vh-4rem)]",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-medical-gradient-start to-medical-gradient-end">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CircuitBoard className="h-5 w-5" />
              Navigation
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start relative overflow-hidden group",
                  "hover:bg-medical-gradient-start/10 hover:shadow-md hover:scale-[1.02]",
                  "transition-all duration-200 ease-in-out",
                  pathname === route.href && "bg-medical-gradient-start/20 shadow-glow",
                  isCollapsed ? "px-2" : "px-4"
                )}
                asChild
              >
                <Link to={route.href} className="flex items-center">
                  <route.icon className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    !isCollapsed && "mr-2"
                  )} />
                  {!isCollapsed && (
                    <span className="font-medium">{route.label}</span>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="absolute inset-0 pointer-events-none border-r border-medical-secondary/20 bg-gradient-to-b from-transparent to-medical-gradient-end/5" />
    </div>
  );
}