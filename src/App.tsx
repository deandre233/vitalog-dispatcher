import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initGoogleMaps } from "./utils/googleMapsService";
import { toast } from "sonner";
import Index from "./pages/Index";
import ActiveDispatches from "./pages/ActiveDispatches";
import CreateDispatch from "./pages/CreateDispatch";
import CrewAssignment from "./pages/CrewAssignment";
import ManageRoutes from "./pages/ManageRoutes";
import Billing from "./pages/Billing";
import Performance from "./pages/Performance";
import { DispatchDetailView } from "./components/dashboard/DispatchDetailView";
import { UnitDetailView } from "./components/dashboard/UnitDetailView";
import PatientRecord from "./pages/PatientRecord";
import AlertsConfig from "./pages/AlertsConfig";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initGoogleMaps().catch((error) => {
      console.error('Failed to initialize Google Maps:', error);
      toast.error('Failed to initialize mapping services');
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dispatch" element={<ActiveDispatches />} />
            <Route path="/dispatch/:id" element={<DispatchDetailView />} />
            <Route path="/unit/:unitId" element={<UnitDetailView />} />
            <Route path="/dispatch/new" element={<CreateDispatch />} />
            <Route path="/crew" element={<CrewAssignment />} />
            <Route path="/routes" element={<ManageRoutes />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/patient/:patientName" element={<PatientRecord />} />
            <Route path="/alerts" element={<AlertsConfig />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;