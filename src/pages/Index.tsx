
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Truck, 
  DollarSign, 
  ClipboardList, 
  Users, 
  Settings, 
  Database, 
  Shield, 
  Headphones, 
  BarChart,
  Activity,
  Zap,
  Bell
} from "lucide-react";
import { HeroStats } from "@/components/dashboard/HeroStats";
import { ModuleGrid } from "@/components/dashboard/ModuleGrid";

export default function Index() {
  const primaryStats = [
    { label: "Active Units", value: "24", icon: Truck, color: "blue" },
    { label: "Response Time", value: "3.2m", icon: Zap, color: "yellow" },
    { label: "Alerts", value: "7", icon: Bell, color: "red" },
    { label: "System Load", value: "82%", icon: Activity, color: "green" }
  ];

  const modules = [
    {
      title: "Dispatch",
      description: "Manage active dispatches and transport requests",
      icon: Truck,
      gradient: "from-blue-500/20 to-blue-400/10",
      border: "border-blue-400/20",
      iconClass: "text-blue-400",
      link: "/dispatch"
    },
    {
      title: "Billing",
      description: "Handle invoices and payment processing",
      icon: DollarSign,
      gradient: "from-green-500/20 to-green-400/10",
      border: "border-green-400/20",
      iconClass: "text-green-400",
      link: "/billing"
    },
    {
      title: "Supervision",
      description: "Monitor operations and staff performance",
      icon: ClipboardList,
      gradient: "from-purple-500/20 to-purple-400/10",
      border: "border-purple-400/20",
      iconClass: "text-purple-400",
      link: "/supervision"
    },
    {
      title: "HR",
      description: "Manage staff and crew assignments",
      icon: Users,
      gradient: "from-orange-500/20 to-orange-400/10",
      border: "border-orange-400/20",
      iconClass: "text-orange-400",
      link: "/hr"
    }
  ];

  const secondaryModules = [
    {
      title: "Settings",
      description: "Configure system preferences and alerts",
      icon: Settings,
      gradient: "from-gray-500/20 to-gray-400/10",
      border: "border-gray-400/20",
      iconClass: "text-gray-400",
      link: "/settings"
    },
    {
      title: "Data Hub",
      description: "Access and analyze transport data",
      icon: Database,
      gradient: "from-cyan-500/20 to-cyan-400/10",
      border: "border-cyan-400/20",
      iconClass: "text-cyan-400",
      link: "/data-hub"
    },
    {
      title: "Authorization",
      description: "Manage access and permissions",
      icon: Shield,
      gradient: "from-red-500/20 to-red-400/10",
      border: "border-red-400/20",
      iconClass: "text-red-400",
      link: "/authorization"
    }
  ];

  const wideModules = [
    {
      title: "Support",
      description: "Get help and access resources",
      icon: Headphones,
      gradient: "from-indigo-500/20 to-indigo-400/10",
      border: "border-indigo-400/20",
      iconClass: "text-indigo-400",
      link: "/support"
    },
    {
      title: "Performance",
      description: "Monitor key business metrics and analytics",
      icon: BarChart,
      gradient: "from-pink-500/20 to-pink-400/10",
      border: "border-pink-400/20",
      iconClass: "text-pink-400",
      link: "/performance"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D1117] bg-grid-white/[0.02] text-white">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[#0D1117]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-pulse" />
      </div>
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <main className="max-w-[1800px] mx-auto p-4 md:p-8 space-y-8 relative">
              <HeroStats stats={primaryStats} />
              <ModuleGrid modules={modules} columns={4} />
              <ModuleGrid modules={secondaryModules} columns={3} />
              <ModuleGrid modules={wideModules} columns={2} isWide />
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
