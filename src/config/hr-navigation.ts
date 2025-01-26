import { HRNavigationItem } from "@/types/hr-navigation";

export const HR_NAVIGATION_ITEMS: HRNavigationItem[] = [
  {
    label: "HR Home",
    icon: "home",
    href: "/hr",
  },
  {
    label: "Announcements Control",
    icon: "megaphone",
    href: "/hr/announcements",
  },
  {
    label: "Employees List",
    icon: "users",
    href: "/hr/employees",
  },
  {
    label: "Manual Clock-in",
    icon: "clock",
    href: "/hr/clock-in",
  },
  {
    label: "Payroll Calculator",
    icon: "calculator",
    href: "/hr/payroll",
  },
  {
    label: "Employee Logon History",
    icon: "history",
    href: "/hr/logon-history",
  },
  {
    label: "Incident System",
    icon: "alert-triangle",
    href: "/hr/incidents",
  },
  {
    label: "Schedule Requests",
    icon: "calendar",
    href: "/hr/schedule-requests",
  },
  {
    label: "Employees Missing HR Data",
    icon: "user-x",
    href: "/hr/missing-data",
  },
  {
    label: "Crew Certificates Overview",
    icon: "award",
    href: "/hr/certificates",
  },
  {
    label: "Certificate Types List",
    icon: "list",
    href: "/hr/certificate-types",
  },
  {
    label: "Custom Link 1",
    icon: "link",
    href: "/hr/custom-link",
  },
  {
    label: "AngelTrack Settings",
    icon: "settings",
    href: "/hr/settings",
  },
  {
    label: "15 Days Remaining",
    icon: "calendar",
    href: "/hr/remaining-days",
    badge: {
      text: "15 Days",
    },
  },
  {
    label: "Support",
    icon: "help-circle",
    href: "/hr/support",
  },
];