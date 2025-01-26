import { Home, Megaphone, Users, Clock, Calculator, History, AlertTriangle, Calendar, UserX, Award, List, Link as LinkIcon, Settings, HelpCircle } from "lucide-react";
import { HRNavigationItem } from "@/types/hr-navigation";

export const HR_NAVIGATION_ITEMS: HRNavigationItem[] = [
  {
    label: "HR Home",
    icon: Home,
    href: "/hr",
  },
  {
    label: "Announcements Control",
    icon: Megaphone,
    href: "/hr/announcements",
  },
  {
    label: "Employee Directory",
    icon: Users,
    href: "/hr/employees",
  },
  {
    label: "Manual Clock-in",
    icon: Clock,
    href: "/hr/clock-in",
  },
  {
    label: "Payroll Calculator",
    icon: Calculator,
    href: "/hr/payroll",
  },
  {
    label: "Employee Logon History",
    icon: History,
    href: "/hr/logon-history",
  },
  {
    label: "Incident System",
    icon: AlertTriangle,
    href: "/hr/incidents",
  },
  {
    label: "Schedule Requests",
    icon: Calendar,
    href: "/hr/schedule-requests",
  },
  {
    label: "Employees Missing HR Data",
    icon: UserX,
    href: "/hr/missing-data",
  },
  {
    label: "Crew Certificates Overview",
    icon: Award,
    href: "/hr/certificates",
  },
  {
    label: "Certificate Types List",
    icon: List,
    href: "/hr/certificate-types",
  },
  {
    label: "Custom Link 1",
    icon: LinkIcon,
    href: "/hr/custom-link",
  },
  {
    label: "AngelTrack Settings",
    icon: Settings,
    href: "/hr/settings",
  },
  {
    label: "15 Days Remaining",
    icon: Calendar,
    href: "/hr/remaining-days",
    badge: {
      text: "15 Days",
    },
  },
  {
    label: "Support",
    icon: HelpCircle,
    href: "/hr/support",
  },
];