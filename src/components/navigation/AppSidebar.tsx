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
} from "lucide-react";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
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
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-white">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-black">
          Navigation
        </h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "default" : "ghost"}
              className={cn("w-full justify-start", {
                "bg-accent text-accent-foreground":
                  pathname === route.href,
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
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 p-2"></div>
      </ScrollArea>
    </div>
  );
}