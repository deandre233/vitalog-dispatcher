
import { 
  Ambulance, 
  DollarSign, 
  ClipboardList, 
  Users, 
  Settings, 
  Database, 
  ShieldCheck, 
  Headphones,
  BarChart,
  TrendingUp,
  Truck,
  UserCheck
} from "lucide-react";

export const menuItems = [
  {
    title: "Dispatch",
    icon: Ambulance,
    description: "Manage active dispatches and transport requests",
    path: "/dispatch",
    color: "text-medical-secondary",
    gradient: "from-medical-gradient-start to-medical-gradient-middle"
  },
  {
    title: "Billing",
    icon: DollarSign,
    description: "Handle invoices and payment processing",
    path: "/billing",
    color: "text-emerald-500",
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    title: "Supervision",
    icon: ClipboardList,
    description: "Monitor operations and staff performance",
    path: "/performance",
    color: "text-indigo-500",
    gradient: "from-indigo-400 to-purple-500"
  },
  {
    title: "HR",
    icon: Users,
    description: "Manage staff and crew assignments",
    path: "/crew",
    color: "text-amber-500",
    gradient: "from-amber-400 to-orange-500"
  },
  {
    title: "Settings",
    icon: Settings,
    description: "Configure system preferences and alerts",
    path: "/alerts",
    color: "text-slate-600",
    gradient: "from-slate-400 to-slate-500"
  },
  {
    title: "Data Hub",
    icon: Database,
    description: "Access and analyze transport data",
    path: "/routes",
    color: "text-cyan-500",
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    title: "Authorization",
    icon: ShieldCheck,
    description: "Manage access and permissions",
    path: "/settings",
    color: "text-rose-500",
    gradient: "from-rose-400 to-pink-500"
  },
  {
    title: "Support",
    icon: Headphones,
    description: "Get help and access resources",
    path: "/support",
    color: "text-violet-500",
    gradient: "from-violet-400 to-purple-500"
  },
  {
    title: "Performance",
    icon: BarChart,
    description: "Monitor key business metrics and analytics",
    path: "/analytics",
    color: "text-blue-500",
    gradient: "from-blue-400 to-indigo-500",
    metrics: [
      {
        icon: UserCheck,
        label: "Crew Performance",
        value: "94%",
        change: "+2.3%"
      },
      {
        icon: Truck,
        label: "Fleet Utilization",
        value: "87%",
        change: "+1.5%"
      },
      {
        icon: TrendingUp,
        label: "Profit Margin",
        value: "$142K",
        change: "+12.5%"
      }
    ]
  }
];
