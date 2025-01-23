import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin } from "lucide-react";

export function OperationsMap() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Operations Map
                </h2>
                <p className="text-gray-500">View and manage operations in real-time</p>
              </div>
              {/* Add map implementation here */}
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}