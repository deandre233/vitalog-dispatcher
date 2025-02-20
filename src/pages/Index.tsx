
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
  Brain, 
  Rocket, 
  ArrowUpRight, 
  Activity, 
  Clock, 
  Users, 
  LineChart, 
  AlertCircle,
  Bell,
  Plus 
} from "lucide-react";
import { toast } from "sonner";

export default function Index() {
  const handleAIInsights = () => {
    toast.success("AI Analysis Complete", {
      description: "System performance improved by 28% this week",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2C1A2F] text-white">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <main className="max-w-[1800px] mx-auto p-4 md:p-8 space-y-6">
              {/* Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/20 backdrop-blur-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          Real-time Monitoring
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                          Command Center
                        </h1>
                        <p className="text-gray-400 max-w-lg">
                          Advanced dispatch management system with AI-powered insights and real-time monitoring capabilities.
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <Button onClick={handleAIInsights} className="bg-indigo-600 hover:bg-indigo-700">
                            <Brain className="w-4 h-4 mr-2" />
                            AI Analysis
                          </Button>
                          <Button variant="outline" className="border-indigo-500/30 hover:bg-indigo-500/20">
                            <Plus className="w-4 h-4 mr-2" />
                            New Dispatch
                          </Button>
                        </div>
                      </div>
                      <ArrowUpRight className="w-16 h-16 text-indigo-500/20 hidden md:block" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border-purple-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-white/90">Performance Metrics</CardTitle>
                    <CardDescription className="text-white/60">Last 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Activity className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-medium text-white/80">Active Units</span>
                        </div>
                        <span className="text-2xl font-bold text-green-400">24</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <LineChart className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-medium text-white/80">Response Rate</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-400">98%</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-purple-400" />
                          <span className="text-sm font-medium text-white/80">Active Crews</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-400">12</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Dispatch Queue", value: "8", trend: "+2", icon: Rocket, color: "blue" },
                  { title: "Active Alerts", value: "3", trend: "-1", icon: Bell, color: "red" },
                  { title: "System Health", value: "97%", trend: "+0.5%", icon: Activity, color: "green" },
                  { title: "AI Predictions", value: "12", trend: "New", icon: Brain, color: "purple" },
                ].map((item, index) => (
                  <Card key={index} className={`bg-gradient-to-br from-${item.color}-600/10 to-${item.color}-600/5 border-${item.color}-500/20 backdrop-blur-xl hover:shadow-lg transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white/60">{item.title}</p>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-2xl font-bold text-white">{item.value}</span>
                            <span className={`text-xs text-${item.color}-400`}>{item.trend}</span>
                          </div>
                        </div>
                        <item.icon className={`w-8 h-8 text-${item.color}-500/40`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* System Status */}
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-white/90">System Status</CardTitle>
                      <CardDescription className="text-white/60">All systems operational</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Dispatch System", status: "Operational", latency: "23ms" },
                    { name: "Communication Network", status: "Operational", latency: "45ms" },
                    { name: "AI Analysis Engine", status: "Active", latency: "120ms" },
                  ].map((system, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div>
                          <p className="text-sm font-medium text-white/90">{system.name}</p>
                          <p className="text-xs text-white/60">{system.latency}</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-400">{system.status}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
