import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HRSidebar } from "@/components/hr/HRSidebar";

interface HRLayoutProps {
  children: React.ReactNode;
}

export const HRLayout = ({ children }: HRLayoutProps) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex">
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <HRSidebar />
              <div className="flex-1 bg-[#f4f7fc] overflow-auto">
                <main className="p-6">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};