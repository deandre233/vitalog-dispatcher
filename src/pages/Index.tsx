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
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
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

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-medical-accent to-white overflow-auto">
        <main className="p-6 md:p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-medical-primary mb-2">
            Welcome to Dispatch Control
          </h1>
          <p className="text-medical-primary/60 mb-8">
            Select a module to get started
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.slice(0, -2).map((item) => (
              <Link 
                key={item.title} 
                to={item.path}
                className="block transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <Card className={`
                  h-full relative overflow-hidden
                  bg-gradient-to-br ${item.gradient}
                  border-0 shadow-lg hover:shadow-xl
                  group transition-all duration-300
                  before:absolute before:inset-0
                  before:bg-white before:z-10 before:opacity-95
                  before:transition-opacity before:duration-300
                  hover:before:opacity-90
                  after:absolute after:inset-0 after:-z-10
                  after:bg-gradient-to-br ${item.gradient}
                  after:opacity-0 hover:after:opacity-100
                  after:transition-opacity after:duration-300
                  backdrop-blur-sm
                `}>
                  <div className="relative z-20 p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`
                        p-3 rounded-xl ${item.color}
                        bg-white/80 shadow-lg
                        group-hover:scale-110 group-hover:shadow-xl
                        transform transition-all duration-300
                        backdrop-blur-sm
                      `}>
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h2 className="text-xl font-semibold text-medical-primary">
                        {item.title}
                      </h2>
                      <p className="text-sm text-medical-primary/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
            
            {/* Support and Performance panels */}
            {menuItems.slice(-2).map((item) => (
              <Link 
                key={item.title} 
                to={item.path}
                className="block transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 xl:col-span-2"
              >
                <Card className={`
                  h-full relative overflow-hidden
                  bg-gradient-to-br ${item.gradient}
                  border-0 shadow-lg hover:shadow-xl
                  group transition-all duration-300
                  before:absolute before:inset-0
                  before:bg-white before:z-10 before:opacity-95
                  before:transition-opacity before:duration-300
                  hover:before:opacity-90
                  after:absolute after:inset-0 after:-z-10
                  after:bg-gradient-to-br ${item.gradient}
                  after:opacity-0 hover:after:opacity-100
                  after:transition-opacity after:duration-300
                  backdrop-blur-sm
                `}>
                  <div className="relative z-20 p-6">
                    <div className="flex items-center space-x-6">
                      <div className={`
                        p-3 rounded-xl ${item.color}
                        bg-white/80 shadow-lg
                        group-hover:scale-110 group-hover:shadow-xl
                        transform transition-all duration-300
                        backdrop-blur-sm
                      `}>
                        <item.icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-medical-primary">
                          {item.title}
                        </h2>
                        <p className="text-sm text-medical-primary/70">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
