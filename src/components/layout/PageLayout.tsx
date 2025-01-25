import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex">
          <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 bg-[#f4f7fc] overflow-auto">
              <main className="p-6">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};