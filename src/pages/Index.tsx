
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Plus,
  Activity,
  Zap,
  Bell
} from "lucide-react";
import { toast } from "sonner";

export default function Index() {
  const handleNewDispatch = () => {
    toast.success("Creating new dispatch...", {
      description: "Initializing dispatch form",
    });
  };

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
              {/* Hero Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
                <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                  <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                        Command Center
                      </h1>
                      <p className="text-lg text-gray-400 max-w-2xl">
                        Advanced dispatch management system with real-time monitoring and AI-powered insights
                      </p>
                      <Button onClick={handleNewDispatch} 
                        className="relative group bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition" />
                        <div className="relative flex items-center">
                          <Plus className="w-4 h-4 mr-2" />
                          New Dispatch
                        </div>
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                      {primaryStats.map((stat, index) => (
                        <div key={index} className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                              <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{stat.value}</p>
                              <p className="text-xs text-gray-400">{stat.label}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((module, index) => (
                  <Card 
                    key={index}
                    className={`group relative bg-black/40 backdrop-blur-xl border-0 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-20`} />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50" />
                    <CardContent className="p-6 relative">
                      <div className="flex flex-col space-y-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.gradient} border ${module.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <module.icon className={`w-6 h-6 ${module.iconClass}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Secondary Modules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secondaryModules.map((module, index) => (
                  <Card 
                    key={index}
                    className={`group relative bg-black/40 backdrop-blur-xl border-0 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-20`} />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50" />
                    <CardContent className="p-6 relative">
                      <div className="flex flex-col space-y-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.gradient} border ${module.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <module.icon className={`w-6 h-6 ${module.iconClass}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Wide Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wideModules.map((module, index) => (
                  <Card 
                    key={index}
                    className={`group relative bg-black/40 backdrop-blur-xl border-0 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-20`} />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50" />
                    <CardContent className="p-6 relative">
                      <div className="flex items-center space-x-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.gradient} border ${module.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <module.icon className={`w-6 h-6 ${module.iconClass}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{module.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
