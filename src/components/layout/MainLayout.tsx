
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface MainLayoutProps {
  children: React.ReactNode;
  showDashboardHeader?: boolean;
  showSidebar?: boolean;
}

export const MainLayout = ({ 
  children, 
  showDashboardHeader = true,
  showSidebar = true 
}: MainLayoutProps) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex-1 flex">
          <SidebarProvider>
            {showSidebar && <AppSidebar />}
            <div className="flex-1 bg-[#f4f7fc] overflow-auto rounded-tl-2xl shadow-inner">
              {showDashboardHeader && <DashboardHeader />}
              <main className="p-6">
                <div className="max-w-[1400px] mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};
