
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
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
  UserCheck,
  Zap,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";

const logStartup = () => {
  console.log("Index component starting to render...");
};

const menuItems = [
  {
    title: "Dispatch",
    icon: Ambulance,
    description: "Manage active dispatches and transport requests",
    path: "/dispatch",
    color: "text-purple-500",
    gradient: "from-purple-400 to-indigo-500"
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

const Index = () => {
  logStartup();
  console.log("Menu items loaded:", menuItems.length);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-[#0f172a] to-[#1e293b] overflow-auto">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Zap className="mr-2 h-8 w-8 text-purple-400" />
              Command Center
            </h1>
            <p className="text-gray-400 text-lg">
              Select a module to begin operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(() => {
              console.log("Starting to render menu items grid");
              return menuItems.slice(0, -2).map((item, index) => {
                console.log(`Rendering menu item ${index + 1}:`, item.title);
                return (
                <Link 
                  key={item.title} 
                  to={item.path}
                  className="block transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <Card className={`
                    h-full relative overflow-hidden
                    bg-[#1e293b]
                    border border-[#334155]/50 hover:border-[#64748b]/50
                    shadow-xl hover:shadow-2xl
                    group transition-all duration-500
                    backdrop-blur-lg rounded-xl
                  `}>
                    <div className="absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
                    
                    <div className="relative z-20 p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`
                          p-3 rounded-xl ${item.color}
                          bg-[#0f172a]/60 shadow-lg
                          group-hover:scale-110 group-hover:shadow-xl
                          transform transition-all duration-500
                          backdrop-blur-sm
                          group-hover:rotate-3
                        `}>
                          <item.icon className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                          {item.title}
                        </h2>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
                );
              });
            })()}
            
            {(() => {
              return menuItems.slice(-2).map((item, index) => {
                console.log(`Rendering special panel ${index + 1}:`, item.title);
                return (
                <Link 
                  key={item.title} 
                  to={item.path}
                  className="block transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 xl:col-span-2"
                >
                  <Card className={`
                    h-full relative overflow-hidden
                    bg-[#1e293b]
                    border border-[#334155]/50 hover:border-[#64748b]/50
                    shadow-xl hover:shadow-2xl
                    group transition-all duration-500
                    backdrop-blur-lg rounded-xl
                  `}>
                    <div className="absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
                    
                    <div className="relative z-20 p-6">
                      <div className="flex items-center space-x-6">
                        <div className={`
                          p-3 rounded-xl ${item.color}
                          bg-[#0f172a]/60 shadow-lg
                          group-hover:scale-110 group-hover:shadow-xl
                          transform transition-all duration-500
                          backdrop-blur-sm
                          group-hover:rotate-3
                        `}>
                          <item.icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                            {item.title}
                          </h2>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
                );
              });
            })()}
            
            {/* AI Assistant Floating Card */}
            <div className="fixed bottom-6 right-6 z-50">
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-none shadow-xl hover:shadow-2xl transition-all duration-300 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm relative">
                    <Brain className="w-6 h-6 text-white" />
                    <div className="absolute inset-0 bg-white/5 rounded-xl animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">AI Assistant</p>
                    <p className="text-white/70 text-xs">Ready to help</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

console.log("Index component definition completed");

export default Index;
