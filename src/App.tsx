import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Index from "@/pages/Index";
import CreateDispatch from "@/pages/CreateDispatch";
import { DispatchDetailView } from "@/components/dashboard/DispatchDetailView";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex">
          <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 bg-[#f4f7fc] overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create-dispatch" element={<CreateDispatch />} />
                <Route path="/dispatch/:id" element={<DispatchDetailView />} />
              </Routes>
            </div>
          </SidebarProvider>
        </div>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;