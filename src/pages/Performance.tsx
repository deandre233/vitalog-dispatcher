import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Brain, Clock, LineChart, TrendingUp } from "lucide-react";

const Performance = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6 space-y-6">
              {/* AI Efficiency Card */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold">AI Efficiency Insights</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">AI Efficiency Score</p>
                      <p className="text-xl font-semibold text-green-600">92%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Response Time</p>
                      <p className="text-xl font-semibold">8.5 minutes</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recommendations</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Consider adding more crew during morning peak hours
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Optimize route planning to reduce delays
                    </li>
                  </ul>
                </div>
              </Card>

              {/* Additional Performance Metrics Card */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Performance Metrics</h2>
                <div className="flex items-center gap-2">
                  <LineChart className="w-6 h-6 text-gray-500" />
                  <p className="text-gray-500">Additional performance tracking coming in next iteration</p>
                </div>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default Performance;