
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
  Users,
  ChevronDown,
  ChevronUp,
  Truck,
  Brain,
  Activity,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const metricCards = [
  {
    title: "Shifts Active",
    value: "2",
    icon: Users,
    link: "/shift-records",
    color: "text-blue-500"
  },
  {
    title: "Dispatches Active",
    value: "7",
    icon: Truck,
    link: "/dispatch",
    color: "text-indigo-500",
    badge: {
      text: "2 Critical",
      color: "bg-red-500" 
    }
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
    color: "text-purple-500"
  },
  {
    title: "Confirmation Queue",
    value: "8",
    icon: ClipboardList,
    link: "/verification-queue",
    color: "text-green-500"
  }
];

const aiInsights = [
  {
    title: "Dispatch Optimization",
    message: "AI suggests rerouting 2 dispatches to improve efficiency by 15%",
    icon: Brain,
    color: "bg-purple-100 border-purple-200 text-purple-800"
  },
  {
    title: "Staff Allocation",
    message: "Current staffing projected to be insufficient for peak hours (14:00-16:00)",
    icon: Users, 
    color: "bg-amber-100 border-amber-200 text-amber-800",
    badge: {
      text: "Action Needed",
      color: "bg-amber-500"
    }
  },
  {
    title: "Route Alert",
    message: "Traffic congestion detected on Route 101, affecting 3 active dispatches",
    icon: AlertTriangle,
    color: "bg-red-100 border-red-200 text-red-800"
  }
];

const reportMenus = [
  {
    title: "Operations",
    items: [
      { name: "Response Times", path: "/reports/dispatch-runtimes" },
      { name: "Route Optimization", path: "/reports/distance-efficiency" },
      { name: "Team Performance", path: "/reports/dispatcher-efficiency" },
      { name: "Delay Analysis", path: "/reports/late-analysis" },
      { name: "Service Feedback", path: "/reports/top-complaints" }
    ]
  },
  {
    title: "Communication",
    items: [
      { name: "Request Analytics", path: "/reports/call-volume" },
      { name: "Activity Patterns", path: "/reports/volume-visualizer" },
      { name: "Service Distribution", path: "/reports/volume-heatmap" },
      { name: "Time Distribution", path: "/reports/day-night-split" }
    ]
  },
  {
    title: "Location",
    items: [
      { name: "Service Timeliness", path: "/reports/on-time" },
      { name: "Collection Metrics", path: "/reports/pickup-delays" },
      { name: "Delivery Metrics", path: "/reports/dropoff-delays" },
      { name: "Location Analytics", path: "/reports/volume-monitor" }
    ]
  },
  {
    title: "Personnel",
    items: [
      { name: "Staff Schedule", path: "/reports/crew-calendar" },
      { name: "Team Activity", path: "/reports/crew-visualizer" },
      { name: "Resource Usage", path: "/reports/shift-utilization" },
      { name: "Service Duration", path: "/reports/runtime-performance" }
    ]
  }
];

export default function ActiveDispatches() {
  useEffect(() => {
    if (parseInt(metricCards[2].value) > 20) {
      toast.warning(`${metricCards[2].value} prior authorizations need attention`);
    }
  }, []);

  const [openStates, setOpenStates] = useState(reportMenus.map(() => true));
  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  const toggleCard = (index: number) => {
    setOpenStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {metricCards.map((card) => (
                  <Link key={card.title} to={card.link}>
                    <Card className="p-4 hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 transform group-hover:scale-105 transition-transform duration-300"></div>
                      <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                        <div className={`p-2 rounded-full ${card.color} bg-white shadow-sm`}>
                          <card.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-medium text-sm">{card.title}</h3>
                        <p className="text-2xl font-bold">{card.value}</p>
                        {card.badge && (
                          <Badge className={`${card.badge.color} text-white absolute -top-1 right-0`}>
                            {card.badge.text}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* AI Insights Panel */}
              <Collapsible 
                open={aiPanelOpen} 
                onOpenChange={setAiPanelOpen}
                className="mb-6 border rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-800">
                    <Brain className="w-5 h-5" />
                    AI Insights Dashboard
                  </h3>
                  {aiPanelOpen ? (
                    <ChevronUp className="h-5 w-5 text-purple-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-500" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {aiInsights.map((insight, index) => (
                      <Card key={index} className={`p-4 border ${insight.color}`}>
                        <div className="flex items-start">
                          <div className="rounded-full p-2 mr-3 bg-white">
                            <insight.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{insight.title}</h4>
                              {insight.badge && (
                                <Badge className={`${insight.badge.color} text-white`}>
                                  {insight.badge.text}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm mt-1">{insight.message}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Main Dispatch Board */}
              <DispatchBoard />

              {/* Report Menus */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {reportMenus.map((menu, index) => (
                  <Card key={menu.title} className="p-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 transform group-hover:scale-105 transition-transform duration-300 opacity-50"></div>
                    <Collapsible open={openStates[index]} onOpenChange={() => toggleCard(index)} className="relative z-10">
                      <CollapsibleTrigger className="flex w-full items-center justify-between">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-indigo-500" />
                          {menu.title}
                        </h3>
                        {openStates[index] ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-2 mt-2">
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
                      </CollapsibleContent>
                    </Collapsible>
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
