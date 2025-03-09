
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { useTheme } from "@/components/theme/ThemeProvider";

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const AppLayout = ({ children, sidebar }: AppLayoutProps) => {
  const { theme } = useTheme();
  
  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'} transition-colors duration-300`}>
        <Header />
        <div className="flex-1 flex">
          <SidebarProvider>
            {sidebar || <AppSidebar />}
            <div className={`flex-1 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f4f7fc]'} overflow-auto transition-colors duration-300`}>
              <main className="p-6 fade-in">
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
