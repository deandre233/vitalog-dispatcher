import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  CircuitBoard,
  BarChart3,
  ClipboardList,
  CreditCard,
  MapPin,
  Users,
  PlusCircle,
  Home,
  Archive,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const routes = [
  {
    label: "Command Center",
    icon: Home,
    href: "/",
  },
  {
    label: "Active Operations",
    icon: ClipboardList,
    href: "/dispatch",
  },
  {
    label: "New Operation",
    icon: PlusCircle,
    href: "/dispatch/new",
  },
  {
    label: "Personnel Assignment",
    icon: Users,
    href: "/crew",
  },
  {
    label: "Route Management",
    icon: MapPin,
    href: "/routes",
  },
  {
    label: "Revenue Center",
    icon: CreditCard,
    href: "/billing",
  },
  {
    label: "Analytics Hub",
    icon: BarChart3,
    href: "/performance",
  },
  {
    label: "Alert Configuration",
    icon: Bell,
    href: "/alerts",
  }
];

export function AppSidebar() {
  const pathname = useLocation().pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative border-r bg-gradient-to-b from-medical-card-start to-medical-card-end backdrop-blur-sm",
      "transition-all duration-300 ease-in-out h-screen",
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
          <div className="space-y-1 p-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-medical-primary relative overflow-hidden group",
                  "hover:bg-medical-gradient-start/10 hover:shadow-md hover:scale-[1.02]",
                  "transition-all duration-200 ease-in-out",
                  pathname === route.href && "bg-medical-gradient-start/20 shadow-glow",
                  isCollapsed && "px-2"
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