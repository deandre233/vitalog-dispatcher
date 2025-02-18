
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { DispatchBoard } from "@/components/dashboard/DispatchBoard";
import { 
  PhoneCall, 
  CalendarCheck, 
  UserCog,
  ClipboardList, 
  Timer,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

const metricCards = [
  {
    title: "Shifts Active",
    value: "2",
    icon: Users,
    link: "/shift-records",
    color: "text-blue-500"
  },
  {
    title: "Shifts Overdue",
    value: "0",
    icon: Timer,
    link: "/shift-records",
    color: "text-yellow-500"
  },
  {
    title: "Prior Auth Queue",
    value: "28",
    icon: CalendarCheck,
    link: "/authorization-queue",
    color: "text-red-500"
  },
  {
    title: "Request Queue",
    value: "3",
    icon: PhoneCall,
    link: "/service-queue",
    color: "text-indigo-500"
  },
  {
    title: "Confirmation Queue",
    value: "8",
    icon: ClipboardList,
    link: "/verification-queue",
    color: "text-green-500"
  }
];

const reportMenus = [
  {
    title: "General",
    items: [
      { name: "Dispatch Runtimes", path: "/reports/dispatch-runtimes" },
      { name: "Distance Efficiency", path: "/reports/distance-efficiency" },
      { name: "Dispatcher Efficiency", path: "/reports/dispatcher-efficiency" },
      { name: "Late Analysis", path: "/reports/late-analysis" },
      { name: "Top Complaints", path: "/reports/top-complaints" }
    ]
  },
  {
    title: "Calls",
    items: [
      { name: "Call Volume Summary", path: "/reports/call-volume" },
      { name: "Volume Visualizer", path: "/reports/volume-visualizer" },
      { name: "Volume Heatmap", path: "/reports/volume-heatmap" },
      { name: "Day/Night Split", path: "/reports/day-night-split" }
    ]
  },
  {
    title: "Facility",
    items: [
      { name: "On-Time Performance", path: "/reports/on-time" },
      { name: "Pickup Delays", path: "/reports/pickup-delays" },
      { name: "Dropoff Delays", path: "/reports/dropoff-delays" },
      { name: "Volume Monitor", path: "/reports/volume-monitor" }
    ]
  },
  {
    title: "Crew",
    items: [
      { name: "Utilization Calendar", path: "/reports/crew-calendar" },
      { name: "Utilization Visualizer", path: "/reports/crew-visualizer" },
      { name: "Shift Utilization", path: "/reports/shift-utilization" },
      { name: "Runtime Performance", path: "/reports/runtime-performance" }
    ]
  }
];

export default function ActiveDispatches() {
  useEffect(() => {
    // Notify about high-priority items
    if (parseInt(metricCards[2].value) > 20) {
      toast.warning(`${metricCards[2].value} prior authorizations need attention`);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-gray-50 overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {metricCards.map((card) => (
                  <Link key={card.title} to={card.link}>
                    <Card className="p-4 hover:shadow-lg transition-all duration-200">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`p-2 rounded-lg ${card.color} bg-white/10`}>
                          <card.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-medium text-sm">{card.title}</h3>
                        <p className="text-2xl font-bold">{card.value}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Main Dispatch Board */}
              <DispatchBoard />

              {/* Report Menus */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {reportMenus.map((menu) => (
                  <Card key={menu.title} className="p-4">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <UserCog className="w-5 h-5" />
                      {menu.title}
                    </h3>
                    <div className="space-y-2">
                      {menu.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block text-sm text-gray-600 hover:text-medical-secondary hover:bg-gray-50 rounded p-2 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
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
