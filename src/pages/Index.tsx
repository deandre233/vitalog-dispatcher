
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
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
  Plus 
} from "lucide-react";
import { toast } from "sonner";

export default function Index() {
  const handleNewDispatch = () => {
    toast.success("Creating new dispatch...", {
      description: "Initializing dispatch form",
    });
  };

  const modules = [
    {
      title: "Dispatch",
      description: "Manage active dispatches and transport requests",
      icon: Truck,
      gradient: "from-blue-500/10 via-blue-400/5 to-blue-300/10",
      border: "border-blue-400/20",
      iconClass: "text-blue-400",
      link: "/dispatch"
    },
    {
      title: "Billing",
      description: "Handle invoices and payment processing",
      icon: DollarSign,
      gradient: "from-green-500/10 via-green-400/5 to-green-300/10",
      border: "border-green-400/20",
      iconClass: "text-green-400",
      link: "/billing"
    },
    {
      title: "Supervision",
      description: "Monitor operations and staff performance",
      icon: ClipboardList,
      gradient: "from-purple-500/10 via-purple-400/5 to-purple-300/10",
      border: "border-purple-400/20",
      iconClass: "text-purple-400",
      link: "/supervision"
    },
    {
      title: "HR",
      description: "Manage staff and crew assignments",
      icon: Users,
      gradient: "from-orange-500/10 via-orange-400/5 to-orange-300/10",
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
      gradient: "from-gray-500/10 via-gray-400/5 to-gray-300/10",
      border: "border-gray-400/20",
      iconClass: "text-gray-400",
      link: "/settings"
    },
    {
      title: "Data Hub",
      description: "Access and analyze transport data",
      icon: Database,
      gradient: "from-cyan-500/10 via-cyan-400/5 to-cyan-300/10",
      border: "border-cyan-400/20",
      iconClass: "text-cyan-400",
      link: "/data-hub"
    },
    {
      title: "Authorization",
      description: "Manage access and permissions",
      icon: Shield,
      gradient: "from-red-500/10 via-red-400/5 to-red-300/10",
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
      gradient: "from-indigo-500/10 via-indigo-400/5 to-indigo-300/10",
      border: "border-indigo-400/20",
      iconClass: "text-indigo-400",
      link: "/support"
    },
    {
      title: "Performance",
      description: "Monitor key business metrics and analytics",
      icon: BarChart,
      gradient: "from-pink-500/10 via-pink-400/5 to-pink-300/10",
      border: "border-pink-400/20",
      iconClass: "text-pink-400",
      link: "/performance"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] text-white">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <main className="max-w-[1800px] mx-auto p-4 md:p-8 space-y-8">
              {/* Hero Section */}
              <div className="relative space-y-4">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
                <div className="relative space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                    Welcome to Dispatch Control
                  </h1>
                  <p className="text-lg text-gray-400">
                    Select a module to get started
                  </p>
                  <Button onClick={handleNewDispatch} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Dispatch
                  </Button>
                </div>
              </div>

              {/* Primary Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((module, index) => (
                  <Card 
                    key={index}
                    className={`group bg-gradient-to-br ${module.gradient} backdrop-blur-xl border ${module.border} hover:shadow-lg hover:shadow-${module.iconClass}/5 transition-all duration-300 cursor-pointer`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.gradient} ${module.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
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

              {/* Secondary Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {secondaryModules.map((module, index) => (
                  <Card 
                    key={index}
                    className={`group bg-gradient-to-br ${module.gradient} backdrop-blur-xl border ${module.border} hover:shadow-lg transition-all duration-300 cursor-pointer`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.gradient} ${module.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
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
                    className={`group bg-gradient-to-br ${module.gradient} backdrop-blur-xl border ${module.border} hover:shadow-lg transition-all duration-300 cursor-pointer`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.gradient} ${module.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
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
