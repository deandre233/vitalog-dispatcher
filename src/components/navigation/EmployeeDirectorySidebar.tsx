import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Clock,
  Calculator,
  History,
  AlertTriangle,
  Calendar,
  Award,
  FileText,
  Link,
  Settings,
  HelpCircle
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "HR Home", path: "/hr" },
  { icon: Users, label: "Employees List", path: "/employees" },
  { icon: Clock, label: "Manual Clock-in", path: "/clock-in" },
  { icon: Calculator, label: "Payroll Calculator", path: "/payroll" },
  { icon: History, label: "Employee Logon History", path: "/logon-history" },
  { icon: AlertTriangle, label: "Incident System", path: "/incidents" },
  { icon: Calendar, label: "Schedule Requests", path: "/schedule-requests" },
  { icon: FileText, label: "Missing HR Data", path: "/missing-data" },
  { icon: Award, label: "Crew Certificates", path: "/certificates" },
  { icon: FileText, label: "Certificate Types", path: "/certificate-types" },
  { icon: Link, label: "Custom Link", path: "/custom" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Support", path: "/support" },
];

export function EmployeeDirectorySidebar() {
  return (
    <div className="w-64 bg-[#2B4B8C] min-h-screen flex flex-col text-white">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">HR Management</h2>
      </div>
      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <RouterLink
            key={index}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm",
              "hover:bg-white/10 transition-colors duration-200",
              "border-l-4 border-transparent",
              item.path === "/employees" && "border-l-4 border-white bg-white/5"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </RouterLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 text-sm">
        <div className="flex items-center justify-between text-white/60">
          <span>19 Days Remaining</span>
        </div>
      </div>
    </div>
  );
}