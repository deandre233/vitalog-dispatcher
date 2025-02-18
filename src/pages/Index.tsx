
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Ambulance, 
  DollarSign, 
  ClipboardList, 
  Users, 
  Settings, 
  Database, 
  ShieldCheck, 
  Headphones,
  Search,
  Clock,
  MapPin,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  { title: "Create Dispatch", path: "/create", icon: Ambulance },
  { title: "View Schedule", path: "/schedule-overview", icon: Calendar },
  { title: "View Map", path: "/operations-map", icon: MapPin },
  { title: "Timesheets", path: "/shift-records", icon: Clock }
];

const mainMenuItems = [
  {
    title: "Dispatch Operations",
    icon: Ambulance,
    description: "Manage active dispatches and transport requests",
    path: "/dispatch",
    color: "text-medical-secondary",
    gradient: "from-medical-gradient-start to-medical-gradient-middle"
  },
  {
    title: "Financial Management",
    icon: DollarSign,
    description: "Handle billing and payment processing",
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
    title: "HR Management",
    icon: Users,
    description: "Manage staff and crew assignments",
    path: "/crew",
    color: "text-amber-500",
    gradient: "from-amber-400 to-orange-500"
  }
];

const secondaryMenuItems = [
  {
    title: "Settings",
    icon: Settings,
    path: "/alerts",
    description: "Configure system preferences"
  },
  {
    title: "Database",
    icon: Database,
    path: "/routes",
    description: "Access transport records"
  },
  {
    title: "Security",
    icon: ShieldCheck,
    path: "/authorization-queue",
    description: "Manage access control"
  },
  {
    title: "Support",
    icon: Headphones,
    path: "/resource-library",
    description: "Get help and resources"
  }
];

const Index = () => {
  console.log("Index component rendering");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-medical-accent to-white">
        <main className="container mx-auto p-6 space-y-8">
          {/* Search and Quick Actions */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-2/3 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search dispatches, patients, or crew members..." 
                  className="w-full pl-10 h-12 bg-white shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link 
                    key={action.title} 
                    to={action.path}
                    className="block"
                  >
                    <Card className="p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center space-y-2">
                      <action.icon className="w-6 h-6 text-medical-secondary" />
                      <span className="text-sm font-medium">{action.title}</span>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
            <Card className="w-full md:w-1/3 p-6 bg-medical-primary text-white">
              <h2 className="text-lg font-semibold mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Active Dispatches</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Available Units</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Authorizations</span>
                  <span className="font-bold">3</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainMenuItems.map((item) => (
              <Link 
                key={item.title} 
                to={item.path}
                className="block transform transition-all duration-300 hover:scale-105"
              >
                <Card className={`
                  h-full relative overflow-hidden
                  bg-gradient-to-br ${item.gradient}
                  border-0 shadow-lg hover:shadow-xl
                  group transition-all duration-500
                `}>
                  <div className="absolute inset-0 bg-white opacity-95 group-hover:opacity-90 transition-opacity" />
                  <div className="relative z-10 p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`
                        p-3 rounded-xl ${item.color}
                        bg-white/80 shadow-lg
                        group-hover:scale-110
                        transform transition-all duration-500
                      `}>
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h2 className="text-xl font-semibold text-medical-primary group-hover:text-medical-secondary transition-colors">
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
          </div>

          {/* Secondary Menu */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {secondaryMenuItems.map((item) => (
              <Link 
                key={item.title} 
                to={item.path}
                className="block"
              >
                <Card className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-medical-accent">
                      <item.icon className="w-5 h-5 text-medical-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.description}</p>
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
