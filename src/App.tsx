import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ActiveDispatches from "./pages/ActiveDispatches";
import CreateDispatch from "./pages/CreateDispatch";
import CrewAssignment from "./pages/CrewAssignment";
import ManageRoutes from "./pages/ManageRoutes";
import Billing from "./pages/Billing";
import Performance from "./pages/Performance";
import { DispatchDetailView } from "./components/dashboard/DispatchDetailView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dispatch" element={<ActiveDispatches />} />
          <Route path="/dispatch/:id" element={<DispatchDetailView />} />
          <Route path="/dispatch/new" element={<CreateDispatch />} />
          <Route path="/crew" element={<CrewAssignment />} />
          <Route path="/routes" element={<ManageRoutes />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/performance" element={<Performance />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;