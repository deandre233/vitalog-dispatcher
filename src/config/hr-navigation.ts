import { HRNavigationItem } from "@/types/hr-navigation";
import {
  Users,
  FileText,
  Calendar,
  ClipboardList,
  Settings,
  BarChart,
  BookOpen,
  Building2,
  UserPlus,
  GraduationCap,
  AlertTriangle,
  Bell,
} from "lucide-react";

export const HR_NAVIGATION_ITEMS: HRNavigationItem[] = [
  {
    label: "HR Home",
    href: "/hr",
    icon: Building2,
  },
  {
    label: "Employee Directory",
    href: "/employees",
    icon: Users,
  },
  {
    label: "Documents",
    href: "/hr/documents",
    icon: FileText,
  },
  {
    label: "Schedule",
    href: "/hr/schedule",
    icon: Calendar,
    badge: {
      text: "15 Days Remaining"
    }
  },
  {
    label: "Performance",
    href: "/hr/performance",
    icon: BarChart,
  },
  {
    label: "Training",
    href: "/hr/training",
    icon: GraduationCap,
  },
  {
    label: "Recruitment",
    href: "/hr/recruitment",
    icon: UserPlus,
  },
  {
    label: "Resource Library",
    href: "/hr/resources",
    icon: BookOpen,
  },
  {
    label: "Tasks",
    href: "/hr/tasks",
    icon: ClipboardList,
  },
  {
    label: "Incidents",
    href: "/hr/incidents",
    icon: AlertTriangle,
  },
  {
    label: "Announcements",
    href: "/hr/announcements",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/hr/settings",
    icon: Settings,
  },
];