
import { HRNavigationItem } from "@/types/hr-navigation";

export const HR_NAVIGATION_ITEMS: HRNavigationItem[] = [
  {
    label: "Operations Hub",
    href: "/hr",
    icon: "home"
  },
  {
    label: "Broadcast Center",
    href: "/hr/announcements",
    icon: "megaphone"
  },
  {
    label: "Personnel Hub",
    href: "/hr/employees",
    icon: "users"
  },
  {
    label: "Time Tracking Portal",
    href: "/hr/clock-in",
    icon: "clock"
  },
  {
    label: "Compensation Hub",
    href: "/hr/payroll",
    icon: "calculator"
  },
  {
    label: "Access Analytics",
    href: "/hr/logon-history",
    icon: "history"
  },
  {
    label: "Safety Reports",
    href: "/hr/incidents",
    icon: "alert-triangle"
  },
  {
    label: "Shift Management",
    href: "/hr/schedule",
    icon: "calendar"
  },
  {
    label: "Data Completion Status",
    href: "/hr/missing-data",
    icon: "user-x"
  },
  {
    label: "Qualification Dashboard",
    href: "/hr/certificates",
    icon: "award"
  },
  {
    label: "Certification Registry",
    href: "/hr/certificate-types",
    icon: "list"
  },
  {
    label: "Quick Access Portal",
    href: "/hr/custom-link",
    icon: "link"
  },
  {
    label: "System Configuration",
    href: "/hr/settings",
    icon: "settings"
  },
  {
    label: "License Status",
    href: "/hr/subscription",
    icon: "calendar",
    badge: {
      text: "15 Days"
    }
  },
  {
    label: "Help Center",
    href: "/hr/support",
    icon: "help-circle"
  }
];
