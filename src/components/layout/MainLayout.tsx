
import { ReactNode, useEffect } from "react";
import { AppSidebar } from "../navigation/AppSidebar";
import { Header } from "./Header";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useMobile();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <AppSidebar />}
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
