import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Index from "@/pages/Index";
import CreateDispatch from "@/pages/CreateDispatch";
import { DispatchDetailView } from "@/components/dashboard/DispatchDetailView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex">
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <div className="flex-1 bg-[#f4f7fc]">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/create-dispatch" element={<CreateDispatch />} />
                    <Route path="/dispatch/:id" element={<DispatchDetailView />} />
                  </Routes>
                </div>
              </div>
            </SidebarProvider>
          </div>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;