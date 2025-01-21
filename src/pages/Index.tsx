import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
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
  HeadsetHelp 
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dispatch",
    icon: Ambulance,
    description: "Manage active dispatches and transport requests",
    path: "/dispatch",
    color: "text-blue-600"
  },
  {
    title: "Billing",
    icon: DollarSign,
    description: "Handle invoices and payment processing",
    path: "/billing",
    color: "text-green-600"
  },
  {
    title: "Supervision",
    icon: ClipboardList,
    description: "Monitor operations and staff performance",
    path: "/performance",
    color: "text-purple-600"
  },
  {
    title: "HR",
    icon: Users,
    description: "Manage staff and crew assignments",
    path: "/crew",
    color: "text-orange-600"
  },
  {
    title: "Settings",
    icon: Settings,
    description: "Configure system preferences and alerts",
    path: "/alerts",
    color: "text-gray-600"
  },
  {
    title: "Data Hub",
    icon: Database,
    description: "Access and analyze transport data",
    path: "/routes",
    color: "text-indigo-600"
  },
  {
    title: "Authorization",
    icon: ShieldCheck,
    description: "Manage access and permissions",
    path: "/settings",
    color: "text-red-600"
  },
  {
    title: "Support",
    icon: HeadsetHelp,
    description: "Get help and access resources",
    path: "/support",
    color: "text-teal-600"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 bg-medical-accent overflow-auto">
              <main className="p-6 md:p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-medical-primary mb-8">
                  Welcome to Dispatch Control
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {menuItems.map((item) => (
                    <Link 
                      key={item.title} 
                      to={item.path}
                      className="block transition-transform hover:scale-105"
                    >
                      <Card className="h-full futuristic-card p-6 cursor-pointer">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className={`p-3 rounded-full bg-medical-highlight ${item.color}`}>
                            <item.icon className="w-8 h-8" />
                          </div>
                          <h2 className="text-xl font-semibold text-medical-primary">
                            {item.title}
                          </h2>
                          <p className="text-sm text-medical-primary/70">
                            {item.description}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Index;