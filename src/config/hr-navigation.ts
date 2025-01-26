import { NavItem } from "@/types/hr-navigation";

export const HR_NAVIGATION_ITEMS: NavItem[] = [
  {
    label: "HR Home",
    href: "/hr",
    icon: "home"
  },
  {
    label: "Announcements Control",
    href: "/hr/announcements",
    icon: "megaphone"
  },
  {
    label: "Employee Directory",
    href: "/hr/employees",
    icon: "users"
  },
  {
    label: "Manual Clock-in",
    href: "/hr/clock-in",
    icon: "clock"
  },
  {
    label: "Payroll Calculator",
    href: "/hr/payroll",
    icon: "calculator"
  },
  {
    label: "Employee Logon History",
    href: "/hr/logon-history",
    icon: "history"
  },
  {
    label: "Incident System",
    href: "/hr/incidents",
    icon: "alert-triangle"
  },
  {
    label: "Schedule Requests",
    href: "/hr/schedule",
    icon: "calendar"
  },
  {
    label: "Employees Missing HR Data",
    href: "/hr/missing-data",
    icon: "user-x"
  },
  {
    label: "Crew Certificates Overview",
    href: "/hr/certificates",
    icon: "award"
  },
  {
    label: "Certificate Types List",
    href: "/hr/certificate-types",
    icon: "list"
  },
  {
    label: "Custom Link 1",
    href: "/hr/custom-link",
    icon: "link"
  },
  {
    label: "AngelTrack Settings",
    href: "/hr/settings",
    icon: "settings"
  },
  {
    label: "15 Days Remaining",
    href: "/hr/subscription",
    icon: "calendar",
    badge: {
      text: "15 Days"
    }
  },
  {
    label: "Support",
    href: "/hr/support",
    icon: "help-circle"
  }
];