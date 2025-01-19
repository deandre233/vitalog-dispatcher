import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  BarChart3,
  ClipboardList,
  CreditCard,
  MapPin,
  Users,
  PlusCircle,
  Home,
  FileText,
  History,
  User,
} from "lucide-react";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Patient Profile",
    icon: User,
    href: "/patient-profile",
  },
  {
    label: "Medical Records",
    icon: FileText,
    href: "/medical-records",
  },
  {
    label: "Transport History",
    icon: History,
    href: "/transport-history",
  },
  {
    label: "Active Dispatches",
    icon: ClipboardList,
    href: "/dispatch",
  },
  {
    label: "Create Dispatch",
    icon: PlusCircle,
    href: "/dispatch/new",
  },
  {
    label: "Crew Assignment",
    icon: Users,
    href: "/crew",
  },
  {
    label: "Manage Routes",
    icon: MapPin,
    href: "/routes",
  },
  {
    label: "Billing",
    icon: CreditCard,
    href: "/billing",
  },
  {
    label: "Performance",
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

  return (
    <div className="w-64 border-r border-gray-200 bg-white">
      <div className="space-y-2 py-2">
        <h2 className="px-4 text-lg font-semibold text-gray-900">Navigation</h2>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="space-y-1 px-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", {
                  "bg-gray-100": pathname === route.href,
                })}
                asChild
              >
                <Link to={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}