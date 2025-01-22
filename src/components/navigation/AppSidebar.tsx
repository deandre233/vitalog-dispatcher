import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  CircuitBoard, Users, Map, CheckSquare, Zap,
  Calendar, FileText, Phone, FileCheck, Building2,
  Bookmark, User, Upload, BookOpen, Tag,
  Clock, Link2, ChevronLeft, ChevronRight
} from "lucide-react";

const routes = [
  {
    label: "Employees List",
    icon: Users,
    href: "/employees",
  },
  {
    label: "Live Map",
    icon: Map,
    href: "/live-map",
  },
  {
    label: "Ended Shifts and Checklists",
    icon: CheckSquare,
    href: "/shifts",
  },
  {
    label: "Vertex AI Route Planner",
    icon: Zap,
    href: "/route-planner",
  },
  {
    label: "Confirmation Queue (11)",
    icon: Calendar,
    href: "/confirmation-queue",
  },
  {
    label: "Calendar of Upcoming",
    icon: Calendar,
    href: "/calendar",
  },
  {
    label: "Closed Dispatches",
    icon: FileText,
    href: "/closed-dispatches",
  },
  {
    label: "Request Queue",
    icon: Phone,
    href: "/request-queue",
  },
  {
    label: "Prior Authorization Queue (10)",
    icon: FileCheck,
    href: "/prior-auth-queue",
  },
  {
    label: "Prior Auths On File",
    icon: FileText,
    href: "/prior-auths",
  },
  {
    label: "Facilities List",
    icon: Building2,
    href: "/facilities",
  },
  {
    label: "Affiliates List",
    icon: Bookmark,
    href: "/affiliates",
  },
  {
    label: "Patients List",
    icon: User,
    href: "/patients",
  },
  {
    label: "Patient Document Upload",
    icon: Upload,
    href: "/document-upload",
  },
  {
    label: "Librarian",
    icon: BookOpen,
    href: "/librarian",
  },
  {
    label: "Tags List",
    icon: Tag,
    href: "/tags",
  },
  {
    label: "Book a Back-Dated Dispatch",
    icon: Clock,
    href: "/backdated-dispatch",
  },
  {
    label: "Custom Link 1",
    icon: Link2,
    href: "/custom-link-1",
  },
];

export function AppSidebar() {
  const pathname = useLocation().pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative border-r bg-[#2B4B8C] backdrop-blur-sm",
      "transition-all duration-300 ease-in-out h-[calc(100vh-4rem)]",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
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
                  "hover:bg-white/10",
                  "transition-all duration-200 ease-in-out",
                  pathname === route.href && "bg-white/20",
                  isCollapsed ? "px-2" : "px-4"
                )}
                asChild
              >
                <Link to={route.href} className="flex items-center">
                  <route.icon className={cn(
                    "h-4 w-4 text-white",
                    !isCollapsed && "mr-2"
                  )} />
                  {!isCollapsed && (
                    <span className="font-medium text-white">{route.label}</span>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}