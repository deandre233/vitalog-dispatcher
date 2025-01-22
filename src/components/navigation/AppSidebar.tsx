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
  Archive,
  Map,
  CheckSquare,
  Calendar,
  PhoneCall,
  Building2,
  BookOpen,
  Tags,
  Clock,
  ExternalLink,
  Upload,
  Library
} from "lucide-react";

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
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
    label: "Ended Shifts & Checklists",
    icon: CheckSquare,
    href: "/shifts",
  },
  {
    label: "Vertex AI Route Planner",
    icon: MapPin,
    href: "/route-planner",
  },
  {
    label: "Confirmation Queue",
    icon: ClipboardList,
    href: "/confirmation-queue",
  },
  {
    label: "Calendar of Upcoming",
    icon: Calendar,
    href: "/calendar",
  },
  {
    label: "Closed Dispatches",
    icon: Archive,
    href: "/closed-dispatches",
  },
  {
    label: "Request Queue",
    icon: PhoneCall,
    href: "/request-queue",
  },
  {
    label: "Prior Authorization Queue",
    icon: Clock,
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
    icon: Users,
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
    icon: Library,
    href: "/librarian",
  },
  {
    label: "Tags List",
    icon: Tags,
    href: "/tags",
  },
  {
    label: "Book a Back-Dated Dispatch",
    icon: History,
    href: "/backdated-dispatch",
  },
  {
    label: "Custom Link 1",
    icon: ExternalLink,
    href: "/custom-link-1",
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