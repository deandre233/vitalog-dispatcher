import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";

const CreateDispatch = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Create New Dispatch</h2>
                <p className="text-gray-500">Dispatch creation form will be implemented here.</p>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default CreateDispatch;